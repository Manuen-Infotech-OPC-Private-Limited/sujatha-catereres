const express = require("express");
const MenuItem = require("../models/menuItem");
const Category = require("../models/category");

const authenticateToken = require("../service/authToken");
const isAdmin = require("../service/isAdmin");

const router = express.Router();

/* =========================================================
   PUBLIC MENU (CUSTOMER SIDE)
   GET /api/menu?mealType=Breakfast&date=2025-01-01
========================================================= */
router.get("/", async (req, res) => {
    try {
        const { mealType, date } = req.query;

        if (!mealType) {
            return res.status(400).json({ error: "mealType is required" });
        }

        const query = {
            mealType,
            isEnabled: true,
            isOutOfStock: false,
            hiddenCategory: false,
        };

        if (date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);

            query.$or = [
                { availableDates: { $exists: false } },
                { availableDates: { $size: 0 } },
                {
                    availableDates: {
                        $elemMatch: {
                            $gte: d,
                            $lt: new Date(d.getTime() + 86400000),
                        },
                    },
                },
            ];
        }

        // Populate category to get the name
        const items = await MenuItem.find(query)
            .populate("category")
            // .sort({ category: 1, name: 1 })
            .lean();

        // Group by category name
        const menu = {};
        for (const item of items) {
            const categoryName = item.category.name;
            if (!menu[categoryName]) menu[categoryName] = [];
            menu[categoryName].push(item);
        }

        res.json(menu);
    } catch (err) {
        console.error("Menu fetch error:", err);
        res.status(500).json({ error: "Failed to fetch menu" });
    }
});

/* =========================================================
   ADMIN MENU ROUTES (AUTH + ADMIN)
   Base: /api/admin/menu
========================================================= */

router.get(
    "/admin/menu",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const query = {};
            if (req.query.mealType) query.mealType = req.query.mealType;

            const items = await MenuItem.find(query)
                .populate("category", "name")
                // .sort({ "category.name": 1, name: 1 })
                .lean();

            res.json(items);
        } catch (err) {
            console.error("Admin menu fetch error:", err);
            res.status(500).json({ error: "Failed to fetch menu items" });
        }
    }
);

router.get(
    "/admin/menu/:id",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const item = await MenuItem.findById(req.params.id)
                .populate("category", "name")
                .lean();
            if (!item) {
                return res.status(404).json({ error: "Menu item not found" });
            }

            res.json(item);
        } catch (err) {
            console.error("Fetch menu item error:", err);
            res.status(500).json({ error: "Failed to fetch menu item" });
        }
    }
);

router.post(
    "/admin/menu",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const item = new MenuItem(req.body);
            await item.save();

            // Populate before sending
            const populatedItem = await MenuItem.findById(item._id)
                .populate("category", "name")
                .lean();

            res.status(201).json(populatedItem);
        } catch (err) {
            console.error("Create menu item error:", err);
            res.status(400).json({ error: "Failed to create menu item" });
        }
    }
);

router.put(
    "/admin/menu/:id",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const updated = await MenuItem.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate("category", "name").lean();

            if (!updated) {
                return res.status(404).json({ error: "Menu item not found" });
            }

            res.json(updated);
        } catch (err) {
            console.error("Update menu item error:", err);
            res.status(400).json({ error: "Failed to update menu item" });
        }
    }
);

router.delete(
    "/admin/menu/:id",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const deleted = await MenuItem.findByIdAndDelete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Menu item not found" });
            }

            res.json({ success: true });
        } catch (err) {
            console.error("Delete menu item error:", err);
            res.status(500).json({ error: "Failed to delete menu item" });
        }
    }
);

// CREATE CATEGORY
router.post(
    "/admin/categories",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Category name is required" });
            }

            const existing = await Category.findOne({ name });
            if (existing) {
                return res.status(400).json({ error: "Category already exists" });
            }

            const category = new Category({ name });
            await category.save();

            res.status(201).json(category);
        } catch (err) {
            console.error("Create category error:", err);
            res.status(500).json({ error: "Failed to create category" });
        }
    }
);
router.get(
    "/admin/categories",
    authenticateToken,
    isAdmin,
    async (req, res) => {
        try {
            const categories = await Category.find({}).sort({ name: 1 }).lean();
            res.json(categories);
        } catch (err) {
            console.error("Fetch categories error:", err);
            res.status(500).json({ error: "Failed to fetch categories" });
        }
    }
);
module.exports = router;

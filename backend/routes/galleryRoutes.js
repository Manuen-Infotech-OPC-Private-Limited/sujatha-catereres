const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const GalleryEvent = require("../models/GalleryEvent");
const authenticateToken = require("../service/authToken");
const isAdmin = require("../service/isAdmin");
const { bucket } = require("../service/firebaseAuth");

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Upload buffer to Firebase Storage
async function uploadBufferToFirebase(buffer, destinationPath, contentType = "image/jpeg") {
    const file = bucket.file(destinationPath);

    await file.save(buffer, {
        metadata: {
            contentType,
            metadata: { firebaseStorageDownloadTokens: uuidv4() },
        },
        resumable: false,
        public: false,
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(destinationPath)}`;
    const [meta] = await file.getMetadata();

    return {
        publicUrl,
        path: destinationPath,
        contentType: meta.contentType,
        size: Number(meta.size || buffer.length),
    };
}

/**
 * CREATE GALLERY EVENT
 */
router.post("/", authenticateToken, isAdmin, upload.array("images", 12), async (req, res) => {
    try {
        const { title, description, eventDate, featured } = req.body;
        const files = req.files || [];

        if (!title) return res.status(400).json({ error: "title required" });
        if (!files.length) return res.status(400).json({ error: "at least one image required" });

        const now = new Date();
        const year = now.getFullYear();

        // 🔥 Process ALL files in parallel
        const createdImages = await Promise.all(
            files.map(async (file) => {
                if (!file.mimetype.startsWith("image/")) return null;

                const ext = path.extname(file.originalname) || ".jpg";
                const baseName = `${Date.now()}_${uuidv4()}`;
                const originalPath = `gallery/${year}/${baseName}${ext}`;
                const thumbPath = `gallery/${year}/${baseName}_thumb.jpg`;

                // Generate thumbnail
                let thumbBuffer = null;
                try {
                    thumbBuffer = await sharp(file.buffer)
                        .resize({ width: 600, height: 600, fit: "inside" })
                        .jpeg({ quality: 80 })
                        .toBuffer();
                } catch (err) {
                    console.warn("Thumbnail generation failed:", err);
                }

                // 🔥 Upload both original + thumb in parallel
                const [originalUpload, thumbUpload] = await Promise.all([
                    uploadBufferToFirebase(file.buffer, originalPath, file.mimetype),
                    thumbBuffer
                        ? uploadBufferToFirebase(thumbBuffer, thumbPath, "image/jpeg")
                        : Promise.resolve(null),
                ]);

                return {
                    filename: file.originalname,
                    storagePath: originalUpload.path,
                    thumbStoragePath: thumbUpload ? thumbUpload.path : null,
                    url: originalUpload.publicUrl,
                    thumbUrl: thumbUpload ? thumbUpload.publicUrl : originalUpload.publicUrl,
                    contentType: originalUpload.contentType,
                    size: originalUpload.size,
                };
            })
        );

        // Filter out null items
        const cleanImages = createdImages.filter(Boolean);

        const event = new GalleryEvent({
            title,
            description,
            eventDate: eventDate ? new Date(eventDate) : undefined,
            images: cleanImages,
            featured: featured === "true" || featured === true,
        });

        await event.save();

        const io = req.app.get("io");
        if (io) io.to("admins").emit("gallery-event-created", event);

        res.json({ message: "Gallery event created", event });
    } catch (err) {
        console.error("Create gallery event error:", err);
        res.status(500).json({ error: "Failed to create gallery event", details: err.message });
    }
});

router.put("/:id", authenticateToken, isAdmin, upload.fields([
    { name: "newImages", maxCount: 20 }
]), async (req, res) => {
    try {
        const { title, description, eventDate, featured, deleteImages = [] } = req.body;

        const event = await GalleryEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Convert deleteImages to array
        const deleteList = Array.isArray(deleteImages) ? deleteImages : [deleteImages];

        // Delete images from Firebase Storage
        for (const filePath of deleteList) {
            await bucket.file(filePath).delete().catch(() => { });
            event.images = event.images.filter((img) => img.storagePath !== filePath);
        }

        // Upload new images
        const newImages = req.files?.newImages || [];
        const now = new Date();
        const year = now.getFullYear();

        for (const file of newImages) {
            const ext = path.extname(file.originalname) || ".jpg";
            const baseName = `${Date.now()}_${uuidv4()}`;
            const originalPath = `gallery/${year}/${baseName}${ext}`;
            const thumbPath = `gallery/${year}/${baseName}_thumb.jpg`;

            const thumbBuffer = await sharp(file.buffer)
                .resize({ width: 600, height: 600, fit: "inside" })
                .jpeg({ quality: 80 })
                .toBuffer();

            const originalUpload = await uploadBufferToFirebase(file.buffer, originalPath);
            const thumbUpload = await uploadBufferToFirebase(thumbBuffer, thumbPath);

            event.images.push({
                filename: file.originalname,
                storagePath: originalUpload.path,
                thumbStoragePath: thumbUpload.path,
                url: originalUpload.publicUrl,
                thumbUrl: thumbUpload.publicUrl,
                contentType: originalUpload.contentType,
                size: originalUpload.size,
            });
        }

        // Update metadata
        event.title = title;
        event.description = description;
        event.featured = featured === "true" || featured === true;
        event.eventDate = eventDate ? new Date(eventDate) : null;

        await event.save();

        res.json({ message: "Event updated", event });

    } catch (err) {
        console.error("Update event error:", err);
        res.status(500).json({ error: "Failed to update event" });
    }
});


/**
 * GET ALL EVENTS
 */
router.get("/", async (req, res) => {
    try {
        const events = await GalleryEvent.find().sort({ createdAt: -1 }).lean();
        res.json(events);
    } catch (err) {
        console.error("Fetch gallery events failed:", err);
        res.status(500).json({ error: "Failed to fetch gallery events" });
    }
});

/**
 * GET SINGLE EVENT
 */
router.get("/:id", async (req, res) => {
    try {
        const event = await GalleryEvent.findById(req.params.id).lean();
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (err) {
        console.error("Fetch event failed:", err);
        res.status(500).json({ error: "Failed to fetch event" });
    }
});

/**
 * DELETE EVENT + FILES
 */
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const event = await GalleryEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // const bucket = getFirebaseBucket();

        // Delete images from Firebase Storage
        for (const img of event.images) {
            if (img.storagePath) {
                const file = bucket.file(img.storagePath);
                await file.delete().catch(err => {
                    console.warn("Failed to delete file:", img.storagePath, err.message);
                });
            }
            // Delete thumbnail file
            if (img.thumbStoragePath) {
                await bucket.file(img.thumbStoragePath).delete().catch(err => {
                    console.warn("Failed to delete thumbnail:", img.thumbStoragePath, err.message);
                });
            }
        }

        // Delete event from MongoDB
        await GalleryEvent.findByIdAndDelete(event._id);

        res.json({ message: "Event and images deleted" });
    } catch (err) {
        console.error("Delete event failed:", err);
        res.status(500).json({ error: "Failed to delete event" });
    }
});

module.exports = router;

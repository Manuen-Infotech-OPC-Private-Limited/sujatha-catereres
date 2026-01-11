const express = require("express");
const authenticateToken = require("../service/authToken");
const ConsultationRequest = require("../models/ConsultationRequest");
const { notifyAdmins, notifyUser } = require("../sseManager");

const router = express.Router();

// Sujatha Caterers HQ coordinates
const HQ_LAT = 16.329514658172048;
const HQ_LNG = 80.41141516914828;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* -----------------------------------------------------------
   🟢 CHECK SERVICE AREA
----------------------------------------------------------- */
router.post("/check-service-area", authenticateToken, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) {
            return res.status(400).json({ error: "lat & lng required" });
        }

        const distance = calculateDistance(HQ_LAT, HQ_LNG, lat, lng);

        res.json({
            isServiceArea: distance <= 15,
            distanceKm: Number(distance.toFixed(2)),
        });
    } catch (err) {
        console.error("Service area check failed:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/* -----------------------------------------------------------
   🟢 SUBMIT CONSULTATION
----------------------------------------------------------- */
router.post("/submit", authenticateToken, async (req, res) => {
    try {
        const {
            type,
            name,
            email,
            phone,
            address,
            eventType,
            guests,
            notes,
            preferredDate,
            preferredTime,
            isServiceArea,
        } = req.body;

        if (!type || !eventType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const request = await ConsultationRequest.create({
            userId: req.user.id,
            type,
            name,
            email,
            phone,
            address,
            eventType,
            guests,
            notes,
            preferredDate,
            preferredTime,
            isServiceArea,
            status: "pending",
        });

        // 🔥 SSE: notify admins
        notifyAdmins("consultationCreated", request);

        res.json({
            message: "Consultation request submitted successfully",
            request,
        });
    } catch (err) {
        console.error("Consultation submit error:", err);
        res.status(500).json({ error: "Failed to submit consultation request" });
    }
});

/* -----------------------------------------------------------
   🟢 USER: My consultation history
----------------------------------------------------------- */
router.get("/my-requests", authenticateToken, async (req, res) => {
    try {
        const requests = await ConsultationRequest.find({
            userId: req.user.id,
        }).sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error("Fetch user consultations failed:", err);
        res.status(500).json({ error: "Failed to fetch consultations" });
    }
});

/* -----------------------------------------------------------
   🟢 ADMIN: Get all consultations (paginated)
----------------------------------------------------------- */
router.get("/all", async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const total = await ConsultationRequest.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const requests = await ConsultationRequest.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            data: requests,
            pagination: { total, page, limit, totalPages },
        });
    } catch (err) {
        console.error("Fetch all consultations failed:", err);
        res.status(500).json({ error: "Failed to fetch consultations" });
    }
});

/* -----------------------------------------------------------
   🟢 ADMIN: Update consultation status
----------------------------------------------------------- */
router.put("/update-status/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const request = await ConsultationRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ error: "Consultation not found" });
        }

        // 🔥 SSE: notify admins
        notifyAdmins("consultationUpdated", request);

        // 🔥 SSE: notify user (if connected)
        notifyUser(request.userId, "consultationUpdated", request);

        res.json({ message: "Status updated", request });
    } catch (err) {
        console.error("Status update failed:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

module.exports = router;

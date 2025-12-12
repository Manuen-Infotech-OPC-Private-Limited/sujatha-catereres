const express = require("express");
const authenticateToken = require("../service/authToken");
const ConsultationRequest = require("../models/ConsultationRequest");

const router = express.Router();
// Sujatha Caterers HQ coordinates
const HQ_LAT = 16.329514658172048;
const HQ_LNG = 80.41141516914828;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in KM
}
// -----------------------------------------------------------
// 🟢 CHECK IF USER IS IN SERVICE AREA (within 15 km radius)
// -----------------------------------------------------------
router.post("/check-service-area", authenticateToken, async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: "lat & lng required" });
        }

        const distance = calculateDistance(HQ_LAT, HQ_LNG, lat, lng);

        return res.json({
            isServiceArea: distance <= 15,
            distanceKm: Number(distance.toFixed(2)),
        });
    } catch (err) {
        console.error("Service area check failed:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ------------------------------------------------------------------
// 🟢 SUBMIT CONSULTATION FORM (Offline or Online)
// ------------------------------------------------------------------
router.post("/submit", authenticateToken, async (req, res) => {
    try {
        const {
            type, // offline / online
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

        const request = new ConsultationRequest({
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
        });

        await request.save();

        // socket.io notify admin instantly
        const io = req.app.get("io");
        io.to("admins").emit("new-consultation", request);

        return res.json({
            message: "Consultation request submitted successfully",
            request,
        });
    } catch (err) {
        console.error("Consultation submit error:", err);
        res.status(500).json({ error: "Failed to submit consultation request" });
    }
});

// ------------------------------------------------------------------
// 🟢 USER: Get my consultation history
// ------------------------------------------------------------------
router.get("/my-requests", authenticateToken, async (req, res) => {
    try {
        const requests = await ConsultationRequest.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error("Fetch user consultations failed:", err);
        res.status(500).json({ error: "Failed to fetch consultations" });
    }
});

// ------------------------------------------------------------------
// 🟢 ADMIN: Get all consultation requests
// ------------------------------------------------------------------
router.get("/all", async (req, res) => {
    try {
        // In future we add admin authentication
        const requests = await ConsultationRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error("Fetch all consultations failed:", err);
        res.status(500).json({ error: "Failed to fetch consultations" });
    }
});

// ------------------------------------------------------------------
// 🟢 ADMIN: Update status (accept/reject/complete)
// ------------------------------------------------------------------
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

        // socket notify the user
        const io = req.app.get("io");
        io.to(String(request.userId)).emit("consultation-status-changed", request);

        return res.json({ message: "Status updated", request });
    } catch (err) {
        console.error("Status update failed:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

module.exports = router;

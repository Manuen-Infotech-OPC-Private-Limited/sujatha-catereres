// sseManager.js
const users = new Map();   // userId -> { res, heartbeat }
const admins = new Set();  // { res, heartbeat }

const HEARTBEAT_INTERVAL = 25_000; // 25s (Render-safe)

/* ---------- HEARTBEAT ---------- */
function startHeartbeat(res) {
    const timer = setInterval(() => {
        try {
            res.write(': ping\n\n');
        } catch (_) { }
    }, HEARTBEAT_INTERVAL);

    return timer;
}

/* ---------- USERS ---------- */
function addUser(userId, res) {
    const heartbeat = startHeartbeat(res);
    users.set(String(userId), { res, heartbeat });
}

function removeUser(userId) {
    const entry = users.get(String(userId));
    if (!entry) return;
    clearInterval(entry.heartbeat);
    users.delete(String(userId));
}

function notifyUser(userId, event, payload) {
    const entry = users.get(String(userId));
    if (!entry) return false;

    entry.res.write(`event: ${event}\n`);
    entry.res.write(`data: ${JSON.stringify(payload)}\n\n`);
    return true;
}

/* ---------- ADMINS ---------- */
function addAdmin(res) {
    const heartbeat = startHeartbeat(res);
    admins.add({ res, heartbeat });
}

function removeAdmin(res) {
    for (const entry of admins) {
        if (entry.res === res) {
            clearInterval(entry.heartbeat);
            admins.delete(entry);
            break;
        }
    }
}

const crypto = require("crypto");

function notifyAdmins(event, payload) {
    const id = crypto.randomUUID();

    for (const { res } of admins) {
        res.write(`id: ${id}\n`);
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
}

/* ---------- REPLAY EVENTS (stub) ---------- */
function replayEvents(target, lastEventId, res) {
    // target = userId or 'admin'
    // lastEventId = last event client received
    // For now, just send a dummy message
    res.write(`event: replay\n`);
    res.write(`data: ${JSON.stringify({
        message: `Replaying events for ${target}`,
        lastEventId: lastEventId || null
    })}\n\n`);
}

module.exports = {
    addUser,
    removeUser,
    notifyUser,
    addAdmin,
    removeAdmin,
    notifyAdmins,
    replayEvents, // ✅ added
};

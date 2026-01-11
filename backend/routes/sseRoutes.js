const express = require('express');
const sseAuth = require('../service/sseAuth');
const {
  addUser,
  removeUser,
  addAdmin,
  removeAdmin,
  replayEvents
} = require('../sseManager');

const router = express.Router();

/* ---------- USER SSE ---------- */
router.get('/user', sseAuth, (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  const lastEventId = req.headers['last-event-id'];
  replayEvents(req.user.id, lastEventId, res);

  addUser(req.user.id, res);

  req.on('close', () => removeUser(req.user.id));
});

/* ---------- ADMIN SSE ---------- */
router.get('/admin', sseAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  const lastEventId = req.headers['last-event-id'];
  replayEvents('admin', lastEventId, res);

  addAdmin(res);

  req.on('close', () => removeAdmin(res));
});

module.exports = router;

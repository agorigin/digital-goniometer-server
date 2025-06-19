const express = require('express');
const router = express.Router();

let state = {
  active: true,
  holding: false,
  offsetX: 0,
  offsetY: 0,
  heldAngle: 0,
  currentX: 0,
  currentY: 0,
  finalAngle: 0,
  timestamp: new Date().toISOString()
};

// POST from ESP32
router.post('/update', (req, res) => {
  if (typeof req.body.x === 'number' && typeof req.body.y === 'number') {
    state.currentX = req.body.x;
    state.currentY = req.body.y;

    if (state.active) {
      const relX = state.currentX - state.offsetX;
      const relY = state.currentY - state.offsetY;
      const angle = Math.sqrt(relX * relX + relY * relY);

      state.finalAngle = angle;
      state.timestamp = new Date().toISOString();

      if (!state.holding) {
        state.heldAngle = angle;
      }
    }
    res.send('OK');
  } else {
    res.status(400).send('Missing x/y fields');
  }
});

// GET current angle (used by frontend)
router.get('/angles', (req, res) => {
  res.json({
    finalAngle: state.holding ? state.heldAngle : state.finalAngle,
    active: state.active,
    holding: state.holding,
    timestamp: state.timestamp
  });
});

// Control routes
router.get('/start', (req, res) => {
  state.active = true;
  state.holding = false;
  res.send('Measurement started');
});

router.get('/stop', (req, res) => {
  state.active = false;
  state.holding = false;
  res.send('Measurement stopped');
});

router.get('/zero', (req, res) => {
  state.offsetX = state.currentX;
  state.offsetY = state.currentY;
  state.active = true;
  state.holding = false;
  res.send('Angles zeroed');
});

router.get('/hold', (req, res) => {
  state.holding = true;
  res.send('Angle held');
});

router.get('/reset', (req, res) => {
  state.offsetX = 0;
  state.offsetY = 0;
  state.active = true;
  state.holding = false;
  res.send('Offsets reset');
});

module.exports = router;

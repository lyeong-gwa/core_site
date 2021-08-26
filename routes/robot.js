const express = require('express');

const router = express.Router();

// GET /user 라우터
router.get('/', (req, res) => {
    res.type("text/plain");
    res.send(
      "User-agent: *\nDisallow: /\nAllow: /$"
    );
});

module.exports = router;

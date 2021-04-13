const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1165571",
    key: "fd467d20d3b0858ce2a6",
    secret: "99e3e80d23017c44ddc4",
    cluster: "us2",
    useTLS: true
});

// url/poll
router.get('/', (request, response) => {
    console.log("Page has been callled");
    response.send('SUPER POLL');
});

router.post('/', (request, response) => {
    console.log("Page has")
    pusher.trigger("poll", "vote", {
        points: 1,
        ans: request.body.ans
    });
    return response.json({ success: true, message: 'Thanks for voting' });
});

module.exports = router;
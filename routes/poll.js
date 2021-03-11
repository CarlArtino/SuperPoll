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
    Vote.find().then(votes => response.json({success: true,
    votes: votes}));
});

router.post('/', (request, response) => {
    const newVote = {
        ans: request.body.ans,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger("poll", "vote", {
            points: parseInt(vote.points),
            ans: vote.ans
          });
          return response.json({success: true, message: 'Thanks for voting'});
    });
});

module.exports = router;
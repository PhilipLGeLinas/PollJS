const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
require('mongoose');

const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1274558",
    key: "cc8b92eec3afdf5e1089",
    secret: "fe0f8b62709ff1f0fb3b",
    cluster: "us2",
    useTLS: true
  });

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger("os-poll", "os-vote", {
            points: parseInt(vote.points),
            os: vote.os
        });

        return res.json({success: true, message: 'Thank you for voting'});
    });
});

module.exports = router;
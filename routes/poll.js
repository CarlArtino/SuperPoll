const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const Vote = require('../models/Vote');
const Poll = require('../models/Poll');

const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1165571",
    key: "fd467d20d3b0858ce2a6",
    secret: "99e3e80d23017c44ddc4",
    cluster: "us2",
    useTLS: true
});


// url/poll
// router.get('/', (request, response) => {
//     console.log(request.body);
//     const id = request.body._id;
//     Poll.findById(id, (err,results)=>{
//         if(err)
//             return console.log(err);
//         console.log(results);
//         return response.status(200).send(results);
//     });
// });


router.post('/', (request, response) => {

    Poll.updateOne({"_id": request.body.id, "questions.question": request.body.question}, {$push: {"questions.$.votes": request.body.ans}}, (err, res)=>{
        if(err)
            console.log(err);
    });

    pusher.trigger("poll", "vote", {
        points: 1,
        ans: request.body.ans
    });
    return response.json({ success: true, message: 'Thanks for voting' });
});


module.exports = router;
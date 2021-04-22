const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Poll = require('../models/Poll');

/*request.body expected form as defined in models/Poll.js:
    title:
    author:
    questions: [
        {question:, choices: []},
        {question:, choices: []}
        ...
    ]
*/
router.post('/', (request,response)=>{
    console.log("backend");
    const newPoll = {
        title: request.body.title,
        author: request.body.author,
        questions: request.body.questions
    }
    //save to db
    new Poll(newPoll).save().then(poll =>{
        console.log(poll);
        console.log(poll._id);
        return response.status(201).send(poll._id);
    })
    .catch(err=>{
        console.log(err);
    })
});

module.exports = router;

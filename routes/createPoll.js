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
 
    const newPoll = {
        title: request.body.title,
        author: request.body.author,
        questions: request.body.questions
    }
    //save to db
    new Poll(newPoll).save().then(poll =>{
        console.log(poll);
        return response.json({success: true});
    })
    .catch(err=>{
        console.log(err);
    })
});

module.exports = router;

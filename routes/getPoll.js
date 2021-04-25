const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Poll = require('../models/Poll');

//Backend function to get object by id
router.post('/', (request, response)=>{
    const id = request.body;
    //find id
    Poll.findById(id, (err,results)=>{
        if(err)
            return console.log(err);

        return response.status(200).send(results);
    });
});

module.exports = router;

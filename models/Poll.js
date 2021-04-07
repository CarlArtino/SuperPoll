const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Every poll has a title, author(optional), and an array of question objects
//each question object contains the question, an array of the choices, and an array of the votes
const PollSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    questions: [{
        question: String,
        choices: [String],
        votes: [String] //Will probably need changed to an array of Vote models later
    }]
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll; 

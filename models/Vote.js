const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    ans: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    }
});

// Create Collection and add schema
const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
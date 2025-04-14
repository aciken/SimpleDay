const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongodb://localhost:27017/ToDo'))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    isGoogle: {type: Boolean, default: false},
    todos: {type: Array, default: []},
    tasks: {type: Array, default: []},
    verification: String,
});

module.exports = mongoose.model('User', UserSchema);
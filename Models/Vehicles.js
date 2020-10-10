const mongoose = require('mongoose');

const vehicles = new mongoose.Schema({
    brandname: String,
    year: String,
    color: String,
    max_speed: Number,
    category: String,
});
const Vehicles = mongoose.model('Vehicles',vehicles);
module.exports = Vehicles;

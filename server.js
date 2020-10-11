// IMPORTS 
require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');
//Models
const Vehicles = require('./Models/Vehicles.js');

// CONSTANTS
const PORT = 9000;
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-app.o5cvu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// INITIALIZE 
const app = express();

// middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// ROUTES
app.get("/",(req,res) => {
    res.send("index.html");
})

app.post("/createItem", async (req,res) => {
    console.log("Items created: ");
    let vehicle_data = {
        brandname: req.body.brandname,
        year: req.body.year,
        color: req.body.color,
        max_speed: req.body.max_speed,
        category: req.body.category,
    };
    console.log("Vehicle data is: ",vehicle_data);
    let vehicle = new Vehicles(vehicle_data);
    let result = await vehicle.save();
    console.log("Vehicle saved successfully");
    res.send({"success":true});
});

app.post("/deleteItem", async (req, res) => {
    let objectIDS = req.body.delete_list;
    console.log(objectIDS);
    let result = await Vehicles.deleteMany({
        _id: {
            $in: objectIDS,
        },
    });
    console.log("Items deleted successfully !");
    res.send({success:true});
});

app.post("/updateItem",async (req,res) => {
    let id = req.body.id;
    let vehicle_data = {
        brandname: req.body.brandname,
        year: req.body.year,
        color: req.body.color,
        max_speed: req.body.max_speed,
        category: req.body.category,
    };
    console.log("Data from front end: ",vehicle_data);
    let result = await Vehicles.findByIdAndUpdate({_id:id},vehicle_data);
    console.log(result);
    res.send({success: true});
});

app.get("/getItems",async (req,res) => {
    const items = await Vehicles.find().lean().exec();
    if(items.length !== 0){
        console.log("Items found !");
        res.send(items);
    }
    else{
        console.log("Items not found");
    }
});

// Connections
mongoose.connect(
    DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) console.log(err);
      console.log("Connected to database successfully");
    }
);  

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}}`);
});


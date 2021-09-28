"use strict";
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

const port = process.env.PORT
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(`${mongoUrl}`);


const frutschema = new mongoose.Schema({
    name: { type: String },
    photos: { type: String },
    prices: { type: Number },

    email: { type: String }

});


const Fruts = mongoose.model("frust", frutschema)


app.get('/', (req, res) => {

    res.send("server is Running")

})




app.get("/frutis", getFrutis);

app.get("/frutis/:email", getUserFrutis);

app.post("/frutis", creatFrutis);

app.put("/frutis/:id", updateFrutis);

app.delete("/frutis/:id", deleteFrutis);




function getFrutis(req, res) {



    axios.get("https://fruit-api-301.herokuapp.com/getFruit").then((founderfruts) => {

        res.json(founderfruts.data.fruits)
    })

}




function creatFrutis(req, res) {

    const { name, photos, prices, email } = req.body;

    const newFruit = new Fruts({ name, photos, prices, email })

    newFruit.save()
    res.json(newFruit)

}



function getUserFrutis(req, res) {

    const email = req.params.email

    Fruts.find({ email: email }, (err, fruts) => {

        res.json(fruts)
    })



}


function updateFrutis(req, res) {

    const id = req.params.id


    const { name, photos, prices, email } = req.body;

    Fruts.findByIdAndUpdate(


        { _id: id },
        { name, photos, prices, email },
        { new: true },
        (err, updated) => {
            res.json(updated)
        }


    )


}



function deleteFrutis(req, res) {
    const id = req.params.id;
    Fruts.deleteOne({ _id: id }, (err, deletefruts) => {
        res.json(deletefruts)
    })

}





app.listen(port, () => {

    console.log(`server is listening on ${port}`);

});
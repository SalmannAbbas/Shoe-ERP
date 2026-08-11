const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Shoe Shop ERP Backend is Running!");
});

app.listen(3000, () => {
    console.log("Shoe ERP Backend Running on Port 3000");
});
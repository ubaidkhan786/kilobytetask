const express = require("express");
const mongoose = require("mongoose");
const app = express();

const dbURL = "mongodb+srv://ubaid:12345@cluster0.dtegd.mongodb.net/kb?retryWrites=true&w=majority"
app.use(express.json())

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

const routeLogin= require("./routes/auth");
const routeCatlogue=require("./routes/catalogue");
const routeCustOrders=require("./routes/CustOrders");
app.use("/", routeLogin)
app.use("/",routeCatlogue);
app.use("/",routeCustOrders);

db.on("error", (err) => { console.log(err) })
db.once("open", () => { console.log("DB started successfull") })

app.listen(3000, () => { console.log("Server started: 3000") })
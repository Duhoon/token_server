// App Configure
const express = require("express");
const app = express();
const log = require("morgan");
const {getAccounts,getBalanceOf,sendToken} = require("./controller.js");

require("dotenv").config();

const PORT = process.env.PROT || 4000;

app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(log("dev"));

app.get("/accounts", getAccounts);

app.get("/balance/:owner", getBalanceOf);

app.post("/sendToken", sendToken);

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`);
})
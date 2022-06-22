require('dotenv').config()
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const models = require("./models/index.js");
const { sequelize } = require("./models/index.js");
const router = require('./router/index.js');
const errorMiddleware = require('./middlewares/errorMiddleware');
const paginate = require('express-paginate');
const fileUpload = require('express-fileupload');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload({}));
//app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended:true}));
app.use('/',router);
app.use(errorMiddleware);

app.use(cors());

const start = async () => {
    try{
        app.listen(process.env.POSTMAN_PORT||5000, () => console.log(`app started, errors don't. great success! working on port ${process.env.POSTMAN_PORT||5000}`))
    } catch(e){
        console.log(e);
    }
}
start();

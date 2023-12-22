const express=require("express");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors=require("cors");

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));


const UserRouter=require("./routes/userRoutes")

app.use("/api/v1/users",UserRouter);

module.exports=app;
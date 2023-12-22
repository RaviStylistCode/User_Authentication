const app=require('./app');
const dotenv=require('dotenv');
const ConnectDatabase=require('./config/database');

dotenv.config({
    path:"./config/config.env"
});

ConnectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port : http://localhost:${process.env.PORT}`);
})
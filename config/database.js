const mongoose=require('mongoose');

 const ConnectDatabase= async()=>{
   try {
    const {connection}= await mongoose.connect(process.env.MONGO_URI);
    console.log(`Data base is connected with  : ${connection.host}`);
   } catch (error) {
    console.log(error)
   }
}

module.exports=ConnectDatabase;
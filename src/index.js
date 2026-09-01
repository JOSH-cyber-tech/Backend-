import mongoose from 'mongoose';
import {DB_NAME} from './constants.js';











// import dotenv from 'dotenv';
// import express from 'express';
// dotenv.config();
// const app = express();

// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error', (err) => {
//             console.log("ERROR: ", err);
//             throw err;
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         })
//     }
//     catch(err){
//         console.log("ERROR: ", err);
//         throw err;
//     }
// })()
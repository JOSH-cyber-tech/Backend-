import mongoose, { Schema } from 'mongoose';

// Import bcrypt.
// bcrypt is used to convert normal passwords into secure hashed passwords.
import bcrypt from 'bcrypt';

// Import jsonwebtoken.
// JWT is used to create login/authentication tokens.
import jwt from 'jsonwebtoken';

const subscriptionScehma=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})



export const Subscription=mongoose.model("Subscription",subscriptionScehma);
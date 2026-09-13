// Import mongoose.
// Mongoose helps us connect our JavaScript code with MongoDB
// and create schemas/models.
import mongoose, { Schema } from 'mongoose';

// Import bcrypt.
// bcrypt is used to convert normal passwords into secure hashed passwords.
import bcrypt from 'bcrypt';

// Import jsonwebtoken.
// JWT is used to create login/authentication tokens.
import jwt from 'jsonwebtoken';


// Create a schema for our User.
// A schema defines what information a User document will contain
// and what rules each piece of information should follow.
const userSchema = new Schema(

    {
        // ---------------- USERNAME ----------------

        username: {

            // The username must be a String.
            type: String,

            // User must provide a username.
            // It cannot be left empty.
            required: true,

            // Two users cannot have the same username.
            unique: true,

            // Removes extra spaces from beginning and end.
            // Example: "   hrishita   " -> "hrishita"
            trim: true,

            // Converts username to lowercase.
            // Example: "Hrishita" -> "hrishita"
            lowercase: true,

            // Creates an index for faster searching.
            index: true,
        },


        // ---------------- EMAIL ----------------

        email: {

            // Email will be stored as a String.
            type: String,

            // Email is compulsory.
            required: true,

            // Two users cannot use the same email.
            unique: true,

            // Converts email to lowercase.
            // Example: "ABC@GMAIL.COM" -> "abc@gmail.com"
            lowercase: true,

            // Removes unnecessary spaces.
            trim: true,
        },


        // ---------------- FULL NAME ----------------

        fullName: {

            // Full name will be a String.
            type: String,

            // User must provide their full name.
            required: true,

            // Removes extra spaces.
            trim: true,

            // Creates an index to make searching faster.
            index: true,
        },


        // ---------------- AVATAR ----------------

        avatar: {

            // Stores the URL of the user's profile picture.
            type: String,

            // Avatar is required.
            required: true,
        },


        // ---------------- COVER IMAGE ----------------

        coverImage: {

            // URL of the cover image.
            // It is optional because there is no "required: true".
            type: String,
        },


        // ---------------- WATCH HISTORY ----------------

        watchHistory: [

            {
                // Store the MongoDB ID of a video.
                //
                // ObjectId is MongoDB's unique ID.
                type: mongoose.Schema.Types.ObjectId,

                // "Video" tells Mongoose that this ID belongs
                // to a document from the Video model.
                ref: 'Video',
            }

        ],


        // ---------------- PASSWORD ----------------

        password: {

            // Password will be stored as a String.
            type: String,

            // Password is compulsory.
            //
            // The first value is true -> required.
            // The second value is the error message.
            required: [true, "Password is required"],
        },


        // ---------------- REFRESH TOKEN ----------------

        refreshToken: {

            // Stores the refresh token of the user.
            //
            // It is optional because "required" is not specified.
            type: String,
        },

    },

    // timestamps automatically adds:
    //
    // createdAt
    // updatedAt
    //
    // to every user document.
    { timestamps: true }
);


// ======================================================
// PASSWORD HASHING MIDDLEWARE
// ======================================================

// "pre('save')" means:
//
// Run this function BEFORE a User is saved to MongoDB.
userSchema.pre('save', async function(next) {

    // Check whether the password has been modified.
    //
    // If the password has NOT changed,
    // we don't need to hash it again.
    //
    // "return next()" means:
    // stop this function and continue with the save operation.
    if (!this.isModified('password')) return next();


    // Convert the normal password into a hashed password.
    //
    // Example:
    //
    // Original:
    // "hello123"
    //
    // After hashing:
    // "$2b$10$......."
    //
    // The number 10 is the salt rounds/cost factor.
    this.password = bcrypt.hashSync(this.password, 10);


    // Tell Mongoose that the middleware is finished
    // and it can continue saving the user.
    next();
});


// ======================================================
// GENERATE ACCESS TOKEN
// ======================================================

// Create a method called generateAccessToken.
//
// We can call it like:
//
// user.generateAccessToken()
//
userSchema.methods.generateAccessToken = function() {

    // jwt.sign() creates a JWT token.
    return jwt.sign(

        // ---------------- PAYLOAD ----------------
        //
        // Information that will be stored inside the token.
        {
            // User's unique MongoDB ID.
            userId: this._id,

            // User's email.
            email: this.email,

            // User's username.
            username: this.username,

            // User's full name.
            fullName: this.fullName,
        },


        // ---------------- SECRET KEY ----------------
        //
        // Secret key used to sign the JWT.
        //
        // It comes from the .env file.
        process.env.ACCESS_TOKEN_SECRET,


        // ---------------- TOKEN OPTIONS ----------------
        //
        // Defines how long the token remains valid.
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
        }
    );
};


// ======================================================
// GENERATE REFRESH TOKEN
// ======================================================

// Create another method called generateRefreshToken.
//
// We can call:
//
// user.generateRefreshToken()
//
userSchema.methods.generateRefreshToken = function() {

    // Create a JWT refresh token.
    return jwt.sign(

        // ---------------- PAYLOAD ----------------
        {
            // User's MongoDB ID.
            userId: this._id,

            // User's email.
            email: this.email,

            // User's username.
            username: this.username,

            // User's full name.
            fullName: this.fullName,
        },


        // Secret key used specifically for refresh tokens.
        process.env.REFRESH_TOKEN_SECRET,


        // Refresh token expiration time.
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
        }
    );
};


// ======================================================
// CREATE USER MODEL
// ======================================================

// Convert our userSchema into a Mongoose Model.
//
// "User" is the model name.
//
// This model will be connected to the "users" collection
// in MongoDB (Mongoose normally pluralizes the name).
const User = mongoose.model('User', userSchema);


// Export the User model.
//
// Now other files can import User and use it to:
// - create users
// - find users
// - update users
// - delete users
const User = mongoose.model('User', userSchema);
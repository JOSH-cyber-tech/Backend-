import mongoose ,{ Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true,
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String,//cloudinary url
            required:true,
        },
        coverImage:{
            type:String,

        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Video',
            }
        ],
        password:{
            type:String,
            required:[  true,"Password is required"],

        },
        refreshToken:{
            type:String,
        },

}
,{timestamps:true}
);
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=bycrypt.hashSync(this.password,10); 
    next();
    //This middleware function is executed before saving a user document to the database. It checks if the password field has been modified. If it has, it hashes the password using bcrypt and replaces the plain text password with the hashed version before saving it to the database.

})
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {   userId:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRATION}
    )
};
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        userId:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRATION}
    )
};
const User = mongoose.model('User', userSchema);
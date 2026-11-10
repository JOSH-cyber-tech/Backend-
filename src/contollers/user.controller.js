import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary as uploadToCloudinary } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
// Controller function for registering a new user

const genrateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user=await User.findByID(userId);
        const accessToken=user.genrateAccessToken();
        const refreshToken=user.genrateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    }
    catch(error){
        throw new ApiError(500,"Token generation failed");
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user data from the frontend
    const { fullName, email, username, password } = req.body;

    // 2. Validate required fields
    if (
        [fullName, email, username, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if the user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email or username already exists"
        );
    }

    // 4. Get avatar path
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImagesLocalPath = req.files?.coverImages?.[0]?.path;
    if(!avatarLocalPath || !coverImagesLocalPath){
        throw new ApiError(400, "Avatar and cover images are required");
    }

     const avatars = await uploadToCloudinary(avatarLocalPath);
     const coverImages = await uploadToCloudinary(coverImagesLocalPath);
     if(!avatars){
        throw new ApiError(400, "Avatar and cover images are required");
     }

    const user=await User.create({
        fullName,
        avatar:avatars.url,
        coverImage: coverImages?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "User creation failed");
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
    )


    
    // Continue with your Cloudinary upload,
    // user creation, and response here.
});

const loginUser = asyncHandler(async (req, res) => {
    
    const {username,email,password}=req.body;

    if(!username || !email){
        throw new ApiError(400,"Username or email is required");
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User not found");
    }
    
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password");
    }
    const {accessToken,refreshToken}=await genrateAccessTokenandRefreshTokens(user._id);

    const logedInUser=await User.findById(user._id).select("-password -refreshToken");
    const options={
        httpOnly:true,
        secure:true,
    }
    return res.
    status(200).
    cookie("refreshToken",refreshToken,options).
    cookie("accessToken",accessToken,options).
    json(
        newApiResponse(
            200,
            {
                user:logedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )
});
const logoutUser= asyncHandler(async(req,res)=>{
    await UserfindByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        },
        new:true,
    })
    const options={
        httpOnly:true,
        secure:true,
    }
    return res.
    status(200).
    cookie("refreshToken","",options).
    cookie("accessToken","",options).
    json(
        new ApiResponse(
            200,
            null,
            "User logged out successfully"
        )  )
})

const refreshAccessToken=asyncHandler(async(req,res,next)=>{
    const incomingRefreshToken=req.cookies.refreshToken ||  req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request");
    }
    const decodedToken= jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user=User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"Invalid refresh token")
    }
    if(incomingRefreshToken!==user?.refreshToken){
       throw new ApiError(401,"Refresh token is expired");
    }
    const options ={
        httpOnly:true,
        secure: true
    }
    const {accessToken,newrefreshToken}=await genrateAccessAndRefreshTokens(user._id)

    try {return res
    .status(200)
    .cookie("accessToken",accessToken)
    .cookie("refreshToken",newrefreshToken)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken:newrefreshToken
            },
             "Access Token Refreshed"
        )
    )}
    catch(error) {
        throw new ApiError(401,error?.message||"Invalid Refresh Token")
    }
})
export { registerUser, loginUser ,logoutUser ,refreshAccessToken};

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary as uploadToCloudinary } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
// Controller function for registering a new user
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

export { registerUser };

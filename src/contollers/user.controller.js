
// Import the asyncHandler utility
import { asyncHandler } from "./utils/asyncHandler.js";

// Controller function for registering a new user
const registerUser = asyncHandler(async (req, res) => {

    // Send a success response
    res.status(200).json({
        message: "ok"
    });
});

export {registerUser};
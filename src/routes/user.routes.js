
// Import the Router function from the express package
import { Router } from "express";
import { registerUser } from "../contollers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// Call Router() to create a new router instance.
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImages",
            maxCount: 1,
        }
    ]),
    registerUser
);

// Export this router instance as the default export
export default router;

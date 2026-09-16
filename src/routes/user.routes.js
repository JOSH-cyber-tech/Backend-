// Import the Router function from the express package
// (named import — express exports Router alongside other utilities like express() itself)
import { Router } from "express";
import { registerUser } from "../contollers/user.controller.js";

// Call Router() to create a new router instance.
// This acts like a mini, self-contained Express app — it can have its
// own routes (.get, .post, .put, .delete) and its own middleware (.use),
// which can later be "mounted" onto the main app at a specific base path.
const router = Router();

router.route("/register").post(registerUser)

// Export this router instance as the default export of this file,
// so it can be imported elsewhere (e.g. in app.js) without curly braces
// and mounted using app.use('/some/path', router)
export default router;
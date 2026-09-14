import multer from "multer";

// Configure where uploaded files will be stored
const storage = multer.diskStorage({

    // Set the destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },

    // Set the name of the uploaded file
    filename: function (req, file, cb) {

        // Generate a unique suffix for the file name
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);

        // Keep the original file name
        cb(null, file.originalname);
    }

});

// Create the multer upload middleware
export const upload = multer({ storage });
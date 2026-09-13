// Create a class called ApiError
// It extends the built-in JavaScript Error class
// This means ApiError gets all the features of a normal Error
class ApiError extends Error {

    // Constructor runs whenever we create a new ApiError object
    constructor(

        // HTTP status code
        // Example: 400, 404, 500
        statusCode,

        // Error message
        // If no message is provided, "Something went wrong" is used
        message = "Something went wrong",

        // Additional error details
        // By default, it is an empty array
        error = [],

        // Stack trace
        // By default, it is an empty string
        stack = ""

    ) {

        // Call the constructor of the parent Error class
        // "message" is passed to Error so JavaScript knows the error message
        // This MUST be called before using "this" in a derived class
        super(message);

        // Store the HTTP status code in the current ApiError object
        // Example: this.statusCode = 404
        this.statusCode = statusCode;

        // Store null as the data
        // Errors generally don't contain useful response data
        this.data = null;

        // Since this object represents an error,
        // we explicitly set success to false
        this.success = false;

        // Store additional error information
        // Example: validation errors could be stored here
        this.errors = error;

        // Check whether a stack trace was provided manually
        if (stack) {

            // If a stack trace was provided,
            // store it in the current object's stack property
            this.stack = stack;

        } else {

            // If no stack trace was provided,
            // automatically create one
            //
            // Error.captureStackTrace(this, this.constructor)
            // tells JavaScript to create a stack trace for this ApiError object
            // and skip the constructor itself from the stack trace
            Error.captureStackTrace(this, this.constructor);

        }

    }

}

// Export the ApiError class
// This allows us to import and use ApiError in other files
export default ApiError;
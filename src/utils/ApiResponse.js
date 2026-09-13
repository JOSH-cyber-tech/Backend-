// Create a class called ApiResponse
// This class is used to create a standard format for API responses
class ApiResponse {

    // Constructor runs automatically whenever we create a new ApiResponse object
    // It takes 3 values:
    // statusCode → HTTP status code (200, 404, 500, etc.)
    // message → message we want to send
    // data → actual data we want to send to the client
    constructor(statusCode, message = "Success", data) {

        // Store the statusCode inside the object
        // Example: statusCode = 200
        // Then we can access it using response.statusCode
        this.statusCode = statusCode;

        // Check whether the status code represents success
        // If statusCode is less than 400 → success = true
        // If statusCode is 400 or greater → success = false
        this.success = statusCode < 400;

        // Store the message inside the object
        // If no message is provided, it automatically uses "Success"
        this.message = message;

        // Store the actual data inside the object
        // This could be a user, list of products, notes, etc.
        this.data = data;

    }
}

// Export the ApiResponse class
// This allows us to import and use this class in another JavaScript file
export default ApiResponse;
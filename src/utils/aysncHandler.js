// Create a function called asyncHandler
// It takes another function (requestHandler) as an argument
const asyncHandler = (requestHandler) => {

    // Return a new function
    // Express will call this function with req, res and next
   return  (req, res, next) => {

        // Convert the result of requestHandler into a Promise
        // If requestHandler succeeds, the Promise resolves
        // If it fails, we want to send the error to Express using next()
        Promise.resolve(
            requestHandler(req, res, next)
                .catch((err) => next(err))
        );

    }

}

// Export asyncHandler so it can be used in other files
export { asyncHandler };

// const asyncHandler = (fn) => async(req , res, next ) =>{
//      try{
//         await fn(req,res,next)
//      }
//      catch (err){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message || "Internal Server Error"
//      })
//     }
// }
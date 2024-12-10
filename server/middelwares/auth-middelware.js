const ApiError = require("../exeptions/api-error")
const tokenService = require("../service/token-service")


module.exports = function(req,res,next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader) {
          
            return next(ApiError.UnautorizedError())
            
        }

        const accessToken = authorizationHeader.split(" ")[1]

        if(!accessToken) {
        
            return next(ApiError.UnautorizedError());
        }
        const userData = tokenService.validateAccesToken(accessToken);
        
        if(!userData) {
            
            return next(ApiError.UnautorizedError());
        }

        req.user = userData;
        next();
    } catch (error) {
        
        return next(ApiError.UnautorizedError())
    }


}
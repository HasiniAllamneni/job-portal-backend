export function allowedRoles(...Roles) {
    return function(req,res,next) {
        if(Roles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({success:false,message:"You are not authorised to access this feature"})
        }
    }
}
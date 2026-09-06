import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config()

export function verifyToken(req,res,next) {
    //get the token from the req
    let accessToken = req.cookies.accessToken
    //if token not available 
    if(accessToken===undefined) {
        res.status(401).json({success:false,message:"You must login to continue"})
    } else {
        //token validity(decoding)
        try {
            let decodedToken = jwt.verify(accessToken,process.env.SECRET_KEY)
            req.user=decodedToken
            next()
        } catch(err) {
            res.status(401).json({success:false,message:"Please relogin to continue"})
        }
    }

}
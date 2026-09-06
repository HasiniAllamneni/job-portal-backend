import exp from 'express'
import {connect} from 'mongoose'
import cookieParser from 'cookie-parser'
import { userRouter } from './APIs/userAPI.js'
import { jobRouter } from './APIs/jobAPI.js'
import { applicationRouter } from './APIs/applicationAPI.js'
import {config} from 'dotenv'
config()
const app = exp()

const port = process.env.PORT
async function connectDB() {
    try {
        await connect(process.env.DB_URL)
        console.log("Connected to DB")
        app.listen(port,()=>console.log(`server listening on port ${port}`))
    } catch(err) {
        console.log("Error in connection: ",err)
        res.json({success:false,error:err.message})
    }
}
connectDB()

//body parser
app.use(exp.json())
//cookie parser
app.use(cookieParser())

app.use('/user-api',userRouter)
app.use('/job-api',jobRouter)
app.use('/app-api',applicationRouter)

//error handler
app.use((err,req,res,next)=>{
    console.log("Error occurred: ",err)
    res.json({success:false,error:err.message})
})


import exp from 'express'
import { JobModel } from '../models/jobModel.js'
import { verifyToken } from '../middlewares/tokenVerificationMiddleware.js'
import { allowedRoles } from '../middlewares/allowedRolesMiddleware.js'
export const jobRouter = exp.Router()

//create new job 
jobRouter.post('/jobs',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    //get job object from req
    let newJob = req.body
    //save in db
    let jobDocument = await JobModel.create(newJob)
    res.status(201).json({success:true,message:"Job created",data:jobDocument})
})

//view all jobs
jobRouter.get('/jobs',verifyToken,allowedRoles("JOBSEEKER","ADMIN"),async(req,res)=>{
    let jobs = await JobModel.find()
    res.status(200).json({success:true,message:"All available jobs",data:jobs})
})

//view a job by id
jobRouter.get('/jobs/:jobId',verifyToken,allowedRoles("JOBSEEKER","ADMIN"),async(req,res)=>{
    //get id from url
    let jobId = req.params.jobId
    //get the job
    let job = await JobModel.findById(jobId)
    res.status(200).json({success:true,message:"Job found",data:job})
})

//view own jobs
jobRouter.get('/myjobs',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    //ID of logged in employer
    let currentEmpId = req.user.id
    //get own jobs
    let jobs = await JobModel.find({employer:currentEmpId})
    res.status(200).json({success:true,message:"Jobs",data:jobs})
})

//view specific job (own)
jobRouter.get('/myjobs/:jobId',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    //get job id from url
    let jobId = req.params.jobId
    //get ID of logged in employer
    let currentEmpId = req.user.id
    //get the job
    let job = await JobModel.findOne({_id:jobId,employer:currentEmpId})
    if(job===null){
        return res.status(403).json({success:false,message:"You cannot access this job"});
    }
    res.status(200).json({success:true,message:"Job found",data:job})
})

//update own job
jobRouter.put('/myjobs/:jobId',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    //get job id from url
    let jobId = req.params.jobId
    //get the ID of logged in employer
    let currentEmpId = req.user.id
    //get modified job from req
    let modifiedJob = req.body
    //update the job
    let updatedJob = await JobModel.findOneAndUpdate(
        //compare employer id in job with currentEmpId
        {_id:jobId,employer:currentEmpId}, 
        {$set:{...modifiedJob}},
        {new:true,runValidators:true}
    )
    if(updatedJob===null) {
        return res.status(403).json({success:false,message:"You cannot access this job"})
    }
    res.status(200).json({success:true,message:"Job Updated",data:updatedJob})
})

//delete own job
jobRouter.delete('/myjobs/:jobId',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    //get job id from url
    let jobId = req.params.jobId
    //get the ID of logged in employer
    let currentEmpId = req.user.id
    //delete the job 
    let deletedJob = await JobModel.findOneAndDelete(
        //compare employer id in job with currentEmpId
        {_id:jobId,employer:currentEmpId} 
    )
    if(deletedJob===null) {
        return res.status(403).json({success:false,message:"You cannot delete this job"})
    }
    res.status(200).json({success:true,message:"Job deleted",data:deletedJob})
})

//delete inappropriate job 
jobRouter.delete('/jobs/:jobId',verifyToken,allowedRoles("ADMIN"),async(req,res)=>{
    //get job id from url
    let jobId = req.params.jobId
    //delete the job 
    let deletedJob = await JobModel.findByIdAndDelete(jobId)
    if(deletedJob===null) {
        return res.status(403).json({success:false,message:"Job not found"})
    }
    res.status(200).json({success:true,message:"Job deleted",data:deletedJob})
})
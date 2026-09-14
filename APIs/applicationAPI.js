import exp from 'express'
import { ApplicationModel } from '../models/applicationModel.js'
import { JobModel } from '../models/jobModel.js'
import { verifyToken } from '../middlewares/tokenVerificationMiddleware.js'
import { allowedRoles } from '../middlewares/allowedRolesMiddleware.js'
export const applicationRouter = exp.Router()

//applying for a job
applicationRouter.post('/apps/:jobId',verifyToken,allowedRoles("JOBSEEKER"),async(req,res)=>{
    //get job id from req
    let jobId = req.params.jobId
    //get logged in jobseeker id
    let currentUserId = req.user.id
    let newApp = await ApplicationModel.create({
        job:jobId,jobSeeker:currentUserId,resume:req.body.resume
    })
    res.status(201).json({success:true,message:"Applied for job",data:newApp})
})

//view their submitted applications
applicationRouter.get('/apps',verifyToken,allowedRoles("JOBSEEKER"),async(req,res)=>{
    //ID of logged in jobseeker
    let currentUserId = req.user.id
    let apps = await ApplicationModel.find({jobSeeker:currentUserId})
    if(apps.length===0) {
        return res.status(404).json({success:false,message:"No applications found"})
    }
    res.status(200).json({success:true,message:"All application",data:apps})
})

//view status of their applications
applicationRouter.get('/apps/status',verifyToken,allowedRoles("JOBSEEKER"),async(req,res)=>{
    //ID of logged in jobseeker
    let currentUserId = req.user.id
    let apps = await ApplicationModel.find({jobSeeker:currentUserId},{job:1,status:1}).populate("job","jobTitle")
    if(apps.length===0) {
        return res.status(404).json({success:false,message:"Application not found"})
    }
    res.status(200).json({success:true,message:"Application found and status is",status:apps.status})
})

//view applications received for their job
applicationRouter.get('/apps/:jobId',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    //get job id from req
    let jobId = req.params.jobId
    let currentEmpId = req.user.id
    // Check whether the job belongs to the logged-in employer
    let job = await JobModel.findOne({id:jobId,employer:currentEmpId})
    if(job===null) {
        res.status(403).json({success:false,message:"You cannot access the applications of this job"})
    } else {
        let apps = await ApplicationModel.find({job:jobId})
        res.status(200).json({success:true,message:"Applications received for this job",data:apps})
    }
})

//update status of an application
applicationRouter.put('/apps/:appId/status',verifyToken,allowedRoles("EMPLOYER"),async(req,res)=>{
    let appId = req.params.appId;
    //get id of logged in employer
    let currentEmpId = req.user.id;
    let newStatus = req.body.status;
    //get the application
    let app = await ApplicationModel.findById(appId).populate("job","employer");
    if(app===null) {
        return res.status(404).json({success:false,message:"Application not found"});
    }
    //check if the job belongs to logged in employer
    if(app.job.employer.toString()!==currentEmpId) {
        return res.status(403).json({success:false,message:"You cannot update this application"});
    }
    app.status = newStatus;
    await app.save();
    res.status(200).json({success:true,message:"Application status updated",data:app});
})
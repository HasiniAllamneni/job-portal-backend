import {Schema,model,Types} from 'mongoose'

let jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:[true,"Job title is required"],
        minlength:[3,"Min length of Job title is 3"],
        maxlength:[50,"Max length of Job title is 50"],
    },
    companyName:{
        type:String,
        required:[true,"Company name is required"],
        minlength:[3,"Min length of Company name is 3"],
        maxlength:[30,"Max length of Company name is 30"]
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minlength:[5,"Min length of description is 5"]
    },
    location:{
        type:String,
        required:[true,"Location is required"],
        minlength:[3,"Min length of location is 3"]
    },
    employmentType:{
        type:String,
        required:[true,"Employment type is required"],
        minlength:[3,"Min length of Employment type is 3"]
    },
    salaryRange:{
        type:{
            min:Number,
            max:Number
        },
        required:[true,"Salary range is required"]
    },
    requiredSkill:{
        type:[String],
        required:[true,"Skills are required"]
    },
    experienceRequirement:{
        type:Number,
        min:[0,"Experience cannot be negative"],
        default:0
    },
    postedDate:{
        type:Date,
        required:[true,"Posted date is required"]
    },
    applicationDeadline:{
        type:Date,
        required:[true,"Application deadline is required"]
    },
    education:{
        type:{
            branch:String,
            college:String,
            year:Number
        }
    },
    jobStatus:{
        type:String,
        default:"open"
    },
    employer:{
        type:Types.ObjectId,
        required:[true,"Employer is required"],
        ref:'user'
    }
},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

export const JobModel = model("job",jobSchema) 
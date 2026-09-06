import {Schema,model,Types} from 'mongoose'

let applicationSchema = new Schema({
    job:{
        type:Types.ObjectId,
        required:[true,"Job is required"],
        ref:'job'
    },
    jobSeeker:{
        type:Types.ObjectId,
        required:[true,"Job seeker is required"],
        ref:'user'
    },
    resume:{
        type:String,
        required:[true,"Resume is required"],
    },
    status: {
        type:String,
        default:"applied"
    }
    
},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

export const ApplicationModel = model("application",applicationSchema) 
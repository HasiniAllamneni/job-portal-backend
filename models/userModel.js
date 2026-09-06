import {Schema,model} from 'mongoose'

let userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        minlength:[3,"Min length of name is 3"],
        maxlength:[50,"Max length of name is 50"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true,
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true,
        minlength:[4,"Min length of password is 4"]
    },
    role:{
        type:String,
        required:[true,"Role is required"],
        enum:{
            values:["JOBSEEKER","EMPLOYER","ADMIN"],
            message:"Invalid role"
        }
    },
    skills:{
        type:[String],
        required:[true,"Skills are required"]
    },
    experience:{
        type:Number,
        min:[0,"Experience cannot be negative"],
        default:0
    },
    education:{
        type:{
            branch:String,
            college:String,
            year:Number
        }
    },
    active:{
        type:Boolean,
        default:true
    }
},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

export const UserModel = model("user",userSchema) 
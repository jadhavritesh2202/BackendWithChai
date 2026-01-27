
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
          email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
          
        },
         fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,//cloudinary url
            required:true,
        },
        coverImage:{
             type:String,//cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'password is required']    
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)
//Password ko database me save hone se pehle hash karta hai automatically
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/*Login ke time user ke input password ko database me stored hash ke saath compare karna
Return true ya false
Secure tarike se password verify karna */
userSchema.methods.isPasswordCorrect=async function 
(password) {
    return await bcrypt.compare(password,this.password)
}
//generate token
userSchema.methods.generateAccessToken=function(){
     return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
//refresh token
userSchema.methods.generateAccessToken=function(){
      return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
       expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User=mongoose.model("User",userSchema);
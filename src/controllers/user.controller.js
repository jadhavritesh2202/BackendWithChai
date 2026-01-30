import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async(req,res)=>{
   //get user data from fronted
   //get user data from fronted
   //validation-non empty
   //check if user already exists:username,email
   //check for images,check for avatar
   //upload them to cloudinary,avatar
   //create user object-create entry in db
   //removed password and refresh token(Login bar-bar na karna pade) field from response
   //check for user creation
   //return res
   
   const {fullName,email,username,password}=req.body
   //console.log("email:",email);
//    if(fullName===""){
//     throw new ApiError(400,"full name is requires")
//    }
       
      if (
          [fullName, email, username, password].some(
          field => !field || field.trim() === ""
            )
          ) {
           throw new ApiError(400, "all fields required");
           }

         const existedUser=await User.findOne({
            $or:[{ username },{email}]
         })
         
         if(existedUser)
         {
            throw new ApiError(409,"user with email or username already exist")
         }
        
        //img or check avatar
     const avatarLocalPath= req.files?.avatar[0]?.path;
     //const coverImageLocalPath=req.files?.coverImage[0].path;

     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
     {
      coverImageLocalPath=req.files.coverImage[0].path
     }
       
       if(!avatarLocalPath)
       {
        throw new ApiError(400,"Avatar file is required")
       }
      //check on cloudinary
       const avatar=await uploadOnCloudinary(avatarLocalPath)
       const coverImage=await uploadOnCloudinary(coverImageLocalPath)
       
       if(!avatar)
       {
         throw new ApiError(400,"Avatar file is required")
       }

       //entry dbs
     const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
     })  
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
     if(!createdUser)
     {
        throw new ApiError(500,"Something went wrong while registering the user")
     }

     return res.status(201).json((
        new ApiResponse(200,createdUser,"User registered Successfully")
     ))
})

//function of access and generate token
const generateAccessAndRefreshTokens = async(userId)=>{
   try{
      const user=await User.findById(userId)
     const accessToken= user.generateAccessToken()
      const refreshToken= user.generateRefreshToken()
      //refresh token save in dbs
       user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

   }catch(err)
   {
      throw new ApiError(500,"Something went wrong while generating refresh and access token")
   }
}
//login user
  const loginUser=asyncHandler(async(req,res)=>{
          //req body--> data
          //username or email
          //find the user
          //password check
          //access and refresh token 
          //send cookies

          const {email,username,password}=req.body
          if(!username || !email)
          {
            throw new ApiError(400,"username or email is requires");
          }

        const user=await User.findOne({
            $or:[{username},{email}]
          })
          if(!user)
          {
            throw new ApiError(404,"user does not exist");
          }
          //check password
         const isPasswordValid=await user.isPasswordCorrect(password)
        if(!isPasswordValid)
          {
            throw new ApiError(401,"Invalid user credentails");
          }
       //generate access token (using function)
         const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)   
         
         //send cookies
          const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
          //modify only on server
           const options = {
                httpOnly: true,
                  secure: true
         }
         //cookies
          return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
       
  })

  //logout 
 /* verifyJWT → req.user
      ↓
DB se refreshToken delete
      ↓
Browser se accessToken cookie delete
      ↓
Browser se refreshToken cookie delete
      ↓
User fully logged out
*/
  const logoutUser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
     const options = {
        httpOnly: true,
        secure: true
    }

     return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

  })

export {registerUser,loginUser,logoutUser}
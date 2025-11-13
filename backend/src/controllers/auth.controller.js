import {asyncHandler} from "../utils/asynchandler.js";
import { ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessToken = async(userId) => {
    try {
        // console.log("🔍 Looking for user with ID:", userId);
        const user = await User.findById(userId)

        if (!user) {
            // console.log("❌ User not found");
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken()

        return {accessToken}


    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(500, "Something Went Wrong while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, role} = req.body

    if([name, email, password, role].some((field) => field?.trim() ===""))
    {
        throw new ApiError(400, "All fields are required")
    }
 
    const ExistedUser = await User.findOne({email});

    if(ExistedUser) {
        throw new ApiError(409, "Username or email already exists")
    }

    const user = await User.create({
        email,
        password,
        name,
        role
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )
    console.log(createdUser)

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong" )
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {
    const {email, password, role} = req.body

    if(!email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken} = await generateAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

     const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    )

})


const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})

const changeCurrentPassword = asyncHandler(async (req, res) =>{
    const{ oldPassword, newPassword } = req.body

     if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    const user = await User.findById(req.user?._id)
    if (!user) throw new ApiError(401, "User not authenticated");


    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password")
    }

    user.password = newPassword

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(200, req.user, "Current User fetched")
})

const updateAccountDetails = asyncHandler(async(req,res) => {
    const {name, email} = req.body

    if(!name || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: name,
                email: email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})


export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
}


import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";


//@desc Get all users in database
//@route GET /api/user
//@access public
export const getAllUsers = async(req,res,next)=>{
    let users;
    try{
        users = await User.find();
    }catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message: "No users found"});
    }
    return res.status(200).json({users});
};

//@desc Sign up new user
//@route POST /api/user/signup
//@access public
export const signUp = async(req,res,next)=>{
    const{name,email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
       return console.log(err);
    }

    if(existingUser){
       return res.status(400).json({message: "User already exists"});
    }
    const hashedPassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email, 
        password: hashedPassword,
        blogs: []
    });


    try{
        await user.save();
    }catch(err){
       return console.log(err);
    }
    return res.status(201).json({user});
};

//@desc login user
//@route POST /api/user/login
//@access public
export const login = async(req,res,next)=>{
    const{email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
       return console.log(err);
    }

    if(!existingUser){
       return res.status(404).json({message: "User with this email does not exist"});
    }

    const passwordCheck =bcrypt.compareSync(password, existingUser.password);
    if(!passwordCheck){
        return res.status(400).json({message:"Incorrect Password"});
    }
    return res.status(200).json({message: "Login successful"});

}


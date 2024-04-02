import Blog from "../models/blog.js";
import User from "../models/user.js";
import mongoose from "mongoose";


//@desc Get all blogs
//@route GET /api/blog
//@access public
export const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try{
        blogs = await Blog.find();
    }
    catch(err){
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No blogs found"});
    
    }
    return res.status(200).json({blogs});
}

//@desc Create new blog
//@route POST /api/blog/add
//@access public
export const addBlog = async(req,res,next)=>{
    const{title,description,image,user}=req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find user by provided id"})
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog); //push the blog to the users blogs array
        await existingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err});
    }
    return res.status(200).json({blog});
};

//@desc Update a blog
//@route PUT /api/blog/:id
//@access public
export const updateBlog = async(req,res,next)=>{
    const{title,description}=req.body;
    const blogId = req.params.id;
    let blog;
    try{
    blog = await Blog.findByIdAndUpdate(blogId,{
        title,
        description
    })
    } catch(err){
    return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message: "Unable to find/update blog"});
    }

    return res.status(200).json({blog});
}

//@desc Get one blog
//@route GET /api/blog/:id
//@access public
export const getById = async(req,res,next)=>{
    const blogId = req.params.id;
    let blogs;
    try{
        blogs = await Blog.findById(blogId);
    }
    catch(err){
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"Blog not found"});
    
    }
    return res.status(200).json({blogs});
}

//@desc delete a blog
//@route DELETE /api/blog/:id
//@access public
export const deleteBlog = async(req,res,next)=>{
    const blogId = req.params.id;
    let blog;
    let deletedBlog;
    try{
        blog = await Blog.findById(blogId).populate("user"); //delete the blog from the user blog array
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        deletedBlog = await Blog.deleteOne({_id: blogId});
     
    }
    catch(err){
        return console.log(err);
    }
    if(!deletedBlog || !blog){
        return res.status(404).json({message:"Could not find/delete blog"});
    }
    return res.status(200).json({message: "Successfully deleted"});
}

//@desc Get blogs by the user 
//@route GET /api/blog/user/:id
//@access public
export const getByUserId = async (req,res,next)=>{
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    } catch(err){
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message: "No blog found"});
    }
    return res.status(200).json({blogs:userBlogs});
}
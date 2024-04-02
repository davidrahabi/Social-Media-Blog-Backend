import express from 'express';
import mongoose from 'mongoose';
import blogRouter from './routes/blog-routes.js';
import router from './routes/user-routes.js';

const app = express();
app.use(express.json());

app.use("/api/user",router);
app.use("/api/blog", blogRouter);

mongoose.connect("mongodb+srv://davidrahabi:vuzKqMRdsmRUf7de@blogs.2qmfpp6.mongodb.net/?retryWrites=true&w=majority&appName=Blogs"
).then(()=>{
    app.listen(5006)
}).then(()=>{
    console.log("connected to database, listening to port 5006");
}
).catch((err)=>{
    console.log(err);
})

//middleware for default url
app.use("/",(req,res, next)=>{
    res.send("Hello World");
})


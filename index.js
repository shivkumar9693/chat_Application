const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const chat=require("./model/chat.js");
var methodOverride = require('method-override')
const ExpressError=require("./ExpressError.js");

app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))

main()
.then(()=>{console.log("db connected")})
.catch((er)=>{
    console.log(er);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsApp');
}



//Index route
app.get("/chats",async(req,res)=>{
    let chats=await chat.find();
    res.render("chats.ejs",{chats});
})

//New route
app.get("/chats/new",(req,res)=>{
    res.render("newchats.ejs");
})
app.post("/chats",(req,res)=>{
    let{from,msg,to}=req.body;
    let newchat=chat({
        from:from,
        msg:msg,
        to:to,
        created_at:new Date(),
    })
    newchat.save()
    .then(()=>{console.log("new chat saved")})
    .catch((er)=>{
        console.log(er);
    })
    res.redirect("/chats");
})
//update route
app.get("/chats/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let oldchat=await chat.findById(id);
    res.render("edit.ejs",{oldchat});
})
//asyncWrapped function
function asyncWrapped(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{next(err)});
    }
}

//trying using Error  middleware 
app.get("/chats/:id",asyncWrapped(async(req,res,next)=>{
    let{id}=req.params;
    let oldchat=await chat.findById(id);
    if(!oldchat){
        next(new ExpressError(404,"chats not found"));
    }
    res.render("edit.ejs",{oldchat});
}));
//put method
app.put("/chats/:id",async(req,res)=>{
    let{id}=req.params;
    let{msg:newMsg}=req.body;
    await chat.findByIdAndUpdate(id,{msg:newMsg},{runValidators:true,new:true});
    res.redirect("/chats");

})
//delete
app.delete("/chats/:id",async(req,res)=>{
 let{id}=req.params;
   await chat.findByIdAndDelete(id);
    res.redirect("/chats");
})

//error Handling Middleware
app.use((err,req,res,next)=>{
    let{status=500,message="chat not found"}=err;
    res.status(status).send(message);
});

app.listen(8000,()=>{
    console.log("server run at port 8000");
})
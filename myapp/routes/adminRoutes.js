const express=require("express");

const router=express.Router();

const multer=require("multer");

const path=require("path");

const fs=require("fs");

const {

getEvents,
createEvent,
updateEvent,
deleteEvent

}=require("../controllers/adminController");


const uploadDir = path.join(process.cwd(),"uploads");

//deleted old multer setup and replaced with new one that uses diskStorage to save files to uploads directory
if(!fs.existsSync(uploadDir)){

fs.mkdirSync(uploadDir,{recursive:true});

}

console.log("UPLOAD PATH:",uploadDir);

console.log("EXISTS:",fs.existsSync(uploadDir));

try{

fs.writeFileSync(
path.join(uploadDir,"test.txt"),
"working"
);

console.log("WRITE TEST SUCCESS");

}catch(err){

console.log(
"WRITE TEST FAILED:"
);

console.log(err);

}

const storage=
multer.diskStorage({

destination:(req,file,cb)=>{

cb(
null,
uploadDir
);

},

filename:(req,file,cb)=>{

cb(
null,
Date.now()+
path.extname(
file.originalname)
);

}

});

const upload=multer({storage});

router.get("/events",getEvents);

router.post("/events",upload.single("image"),createEvent);

router.put(
"/events/:id",

(req,res,next)=>{

upload.single("image")(req,res,function(err){

if(err){

console.log("MULTER ERROR:");
console.log(err);

return res.status(500).json({message:err.message});
}
next();
});
},
updateEvent
);

router.delete(
"/events/:id",
deleteEvent
);

module.exports=router;
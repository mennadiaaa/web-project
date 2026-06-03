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

const validateEvent =require("../middleware/validateEvent");

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

// const upload=multer({storage}); without security filtering

const upload=multer({

storage,

fileFilter:(req,file,cb)=>{

const allowed=[

"image/png",
"image/jpeg",
"image/jpg"

];

if(allowed.includes(file.mimetype))
    {

cb(null,true);

}
else{

cb(new Error("Only image files allowed"));

}

}

});

router.get("/events",getEvents);

router.post("/events",upload.single("image"),validateEvent,createEvent);

/*router.put(
"/events/:id",
upload.single("image"),  without debugging, this was the original code that directly called the updateEvent controller after multer middleware. I changed it to handle errors from multer and only call updateEvent if there are no errors from multer  
updateEvent
);
*/

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
validateEvent,
updateEvent
);

router.delete(
"/events/:id",
deleteEvent
);

module.exports=router;
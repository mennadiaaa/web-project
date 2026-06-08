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

const upload=multer({

storage,

fileFilter:(req,file,cb)=>{

const allowed=[

"image/png",
"image/jpeg",
"image/jpg"

];

if(allowed.includes(file.mimetype)){

cb(null,true);

}
else{

cb(new Error("Only image files allowed"));

}

}

});

// EVENT ROUTES
router.get("/events",getEvents);

router.post("/events",upload.single("image"),validateEvent,createEvent);

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

// USER MANAGEMENT ROUTES
const User = require("../models/User");

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports=router;
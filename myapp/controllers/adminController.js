const EventModel = require("../models/EventModel");

exports.getEvents = async (req,res)=>{

try{
    const page= Number(
req.query.page)||1;

const limit=5;

const events=
await EventModel.find()
.sort({date:1})
.skip((page-1)*limit)
.limit(limit);



res.json(events);

}

catch(err){

res.status(500).json({
message:err.message
});

}

};



exports.createEvent = async(req,res)=>{

try{
    if(
!req.body.title ||
!req.body.category ||
!req.body.location ||
!req.body.date
){

return res.status(400).json({
message:"Missing required fields"
});

}

    console.log("BODY:",req.body);

console.log("FILE:",req.file);

const newEvent=new EventModel({

title:req.body.title,

category:req.body.category,

location:req.body.location,

date:req.body.date,

time:req.body.time,

price:req.body.price,

description:req.body.description,

image:req.file
?
`/uploads/${req.file.filename}`
:
""

});

await newEvent.save();

res.status(201).json({
message:"event created",
event:newEvent
});

}

catch(err){

res.status(500).json({
message:err.message
});

}

};



exports.updateEvent =async(req,res)=>{

try{
    if(
!req.body.title ||
!req.body.category ||
!req.body.location ||
!req.body.date
){

return res.status(400).json({
message:"Missing required fields"
});

}

    console.log("PARAM ID:",req.params.id);
    console.log("BODY:",req.body);
    console.log("FILE:",req.file);

const updatedData={
    
title:req.body.title,

category:req.body.category,

location:req.body.location,

date:req.body.date,

time:req.body.time,

price:req.body.price,

description:req.body.description

};

if(req.file){

updatedData.image=
"/uploads/"+req.file.filename;
}

console.log("UPDATED DATA:",updatedData);

const updatedEvent = await EventModel.findByIdAndUpdate(

req.params.id,
updatedData,
{
    new:true,
    runValidators:true
}

);

console.log("UPDATED EVENT:",updatedEvent);

res.json(updatedEvent);

}

catch(err){
console.log("FULL ERROR:");
console.log(err);
res.status(500).json({
message:err.message
});

}

};



exports.deleteEvent=async(req,res)=>{

try{

await EventModel.findByIdAndDelete(req.params.id);

res.json({
message:"deleted"
});

}

catch(err){

res.status(500).json({
message:err.message
});

}

};
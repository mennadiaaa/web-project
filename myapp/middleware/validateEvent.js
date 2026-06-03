module.exports = (req,res,next)=>{

const {

title,
category,
location,
date,
time,
price,
description

} = req.body;

if(
!title ||
!category ||
!location ||
!date ||
!time ||
!price ||
!description
){

return res.status(400).json({
message:"All fields are required"
});

}

if(title.length < 3){

return res.status(400).json({
message:"Title must be at least 3 characters"
});

}

if(Number(price) < 0){

return res.status(400).json({
message:"Price cannot be negative"
});

}

if(description.length < 10){

return res.status(400).json({
message:"Description must be at least 10 characters"
});

}

next();

};
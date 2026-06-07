const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

title:{
type:String,
required:true,
minlength:3
},

category:{
type:String,
required:true
},

location:{
type:String,
required:true
},

date:{
type:String,
required:true
},

time:{
type:String,
required:true
},

price:{
type:Number,
required:true,
min:0
},

description:{
type:String,
required:true,
minlength:10
},

image:{
type:String,
default:""
},

organizer:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null
}

},
{
timestamps:true
});

module.exports =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
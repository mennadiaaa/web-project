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
}

},
{
timestamps:true
});
const EventModel = mongoose.model("Event", eventSchema);
module.exports = EventModel;
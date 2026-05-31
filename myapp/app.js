const express=require("express");

const dotenv=require("dotenv");

const connectDB=require("./config/db");

const path=require("path");

dotenv.config();


connectDB();

const app=express();

app.use(express.json());

app.use(express.urlencoded({
extended:true
}));

app.use(
"/uploads",
express.static(
path.join(__dirname,"uploads")
)
);

app.use(express.static(path.join(__dirname,"../")));

app.get("/admin",(req,res)=>{
res.sendFile(
path.join(
__dirname,
"../pages/admin.html"
)
);
});


app.use(
"/api/admin",
require("./routes/adminRoutes")
);

const PORT=
process.env.PORT||3000;

app.listen(PORT,()=>{

console.log(
`Server running ${PORT}`
);

});

app.use((err,req,res,next)=>{

console.log("GLOBAL ERROR:");

console.log(err);

res.status(500).json({

message:err.message,
stack:err.stack

});

});
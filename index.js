const express=require("express");
const app=express();
const cookieParser = require("cookie-parser");
const cors = require('cors'); 
const userAuthRouter=require('./Routes/authRouter')


const allowedOrigins =process.env.NODE_ENV === 'production'?['http://localhost:3000',"https://lms-app-njr7.vercel.app"] : ['http://localhost:3000', 'http://localhost:5174'];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `This origin is not allowed: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,//to allow cookies
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/v1/auth',userAuthRouter)

app.get('/',(req,res)=>{
    res.send("we are live");
})

module.exports=app
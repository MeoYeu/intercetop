
const express = require('express')
require('dotenv').config()
const cors =require('cors')
const mongoose=require('mongoose')
const fileUpload=require('express-fileupload')
const cookieParser=require('cookie-parser')
const userRouter=require('./Router/userRouter')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())
app.use(cors({origin: true, credentials: true }))
app.use(fileUpload({
    useTempFiles:true
}))

//routes
app.use('/api/user',userRouter)

const URIMONGO=process.env.MONGOSEDB_URL
 mongoose.connect(URIMONGO,{
     useCreateIndex:true,
     useFindAndModify:true,
     useNewUrlParser:true,
     useUnifiedTopology:true
 },err=>{
    if(err) throw err;
     console.log('đã kết nối tới mongoosedb');
 })
app.get('/',(req,res)=>{
    res.json('xin chào')
})
const port=process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server đang chạy:${port}`)
})

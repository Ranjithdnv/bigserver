const express = require('express')
const app = express()
const mongoose = require("mongoose");
const cors = require('cors')
const multer = require('multer')
const path =require("path")
const Achieve = require('./models/achieve')
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require('body-parser');
app.use(cors("https://big-4bxu.onrender.com/"))
app.use(express.json())
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "public/Images")));
dotenv.config({ path: "./config.env" });
db =process.env.DATABASE_URL;
mongoose.connect(db
  //"mongodb+srv://pavankumarmoka:3ccG3rpxQoWOGEJl@expresscluster.gfleory.mongodb.net/mydb?retryWrites=true&w=majority"
  ,
  { useNewUrlParser: true, useUnifiedTopology: true, },
  // () => {
  //   console.log("Connected to MongoDB");
  // }
) .then(() => console.log("success"));
app.use(helmet());
app.use(morgan("common"));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./public/Images")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage})

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
res.send(req.file.filename)
})
app.post('/', async (req, res) => {
    console.log(req.body)
    const newPost = new Achieve(req.body);
    try {
      console.log(req)
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  // res.send(req.body)
  })

  app.get('/', async (req, res) => {
    // console.log(req.body)
    const newPost =  await Achieve.find();
    try {
      // console.log(req.body)
      // const savedPost = await newPost.save();
      res.status(200).json(newPost);
    } catch (err) {
      res.status(500).json(err);
    }
  // res.send(req.body)
  })

app.listen(3001, () => {
  console.log("Server is running")
})
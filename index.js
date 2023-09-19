const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const Achieve = require("./models/achieve");
const Post = require("./models/post");
const User = require("./models/user");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser"); //  https://big-4bxu.onrender.com/ // https://future-together.onrender.com/
app.use(
  cors("https://big-4bxu.onrender.com/")
  // "https://future-together.onrender.com"
);
app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "500mb",
  })
);
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "public/Images")));
dotenv.config({ path: "./config.env" });
db = process.env.DATABASE_URL;
mongoose
  .connect(
    db,
    //"mongodb+srv://pavankumarmoka:3ccG3rpxQoWOGEJl@expresscluster.gfleory.mongodb.net/mydb?retryWrites=true&w=majority"
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("success"));
// app.use(helmet());
// app.use(morgan("common"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/Images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send(req.file.filename);
});

const protect = async (req, res, next) => {
  //  Getting token and check of it's there
  let token;

  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    res.status(200).json({ user: "null" });
    // const err = new AppError("You are noin taccess.", 401);
    // return next(err);
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, "secret");
  console.log(decoded);
  // 3) Check .lif user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    const err = new AppError("The user no longer exist.", 400);
    return next(err);
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently e log in again.", 401));
  }
  req.user = currentUser;
  next();
};

app.post("/", async (req, res) => {
  console.log(req.body);
  const newPost = new Achieve(req.body);
  try {
    // console.log(req)
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});

app.get("/", protect, async (req, res) => {
  // console.log(req.body)
  const newPost = await Achieve.find();
  try {
    // console.log(req.body)
    // const savedPost = await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});
app.post("/filter", async (req, res) => {
  console.log(req.body);
  const newPost = await Achieve.find({
    country: req.body.country,
    category: req.body.category,
  });
  try {
    // console.log(req.body)
    // const savedPost = await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});
const signToken = (id) => {
  return jwt.sign({ id }, process.env.sec, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

app.post("/signup", async (req, res) => {
  const user1 = await User.create(req.body);
  token = jwt.sign({ id: user1._id }, "secret", { expiresIn: 900 });
  res.status(201).json({ status: "success", token, user1: { user1 } });
});
app.post("/login", async (req, res, next) => {
  // try {
  const { userId } = req.body;
  const password = req.body.password;
  // 1) Check if userId and password exist
  if (!userId || !password) {
    return next(new AppError("Please provide userId and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ userId }).select("+password");
  // "userId":"jonfff@gh.io",
  // "password":"1qwvertzy",
  // const user = await User.findOne({ userId });
  // console.log(user)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(200).json({ user: "null" });
    // return next(new AppError("Incorrect userId or password", 401));
  }
  //
  // 3) If everything ok, send token to client
  token = jwt.sign({ id: user._id }, "secret", { expiresIn: 900000 });
  req.headers.authorization = token;
  console.log(req.headers.authorization);
  res.status(201).json({ status: "success", token, user1: { user } });

  //   createSendToken(user, 200, res);
  //   } catch {
  //     res.status(201).json({ status: "fail" });
  //   }
});

app.post("/postmessage", async (req, res) => {
  const post = await Post.create(req.body);

  res.status(201).json({ status: "success", post });
});
//
app.get("/postmessagesearch/:_id", async (req, res) => {
  console.log(req.params._id);
  const post = await Post.findById(req.params._id);
  console.log(123);
  res.status(201).json({ status: "success", post });
});
//
app.put("/postmessagesearch/:_id/like", async (req, res) => {
  console.log(req.body);
  const post = await Post.findByIdAndUpdate(
    req.params._id,
    { $push: { messages: req.body } },
    { new: true }
  );
  console.log(post);
  // await post?.updateOne({ $push: { messages: req.body } }, { new: true });
  res.status(200).send(post);
});
//
app.delete("/", async (req, res) => {
  const post = await Post.deleteMany();

  res.status(201).json({ status: "success", post });
});
//
app.delete("/achieve", async (req, res) => {
  const post = await Achieve.deleteMany();

  res.status(201).json({ status: "success", post });
});
//
app.listen(3001, () => {
  console.log("Server is running");
});

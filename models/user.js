const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      max: 500,
    },
    country:{type:String},
    state:{type:String},
    district:{type:String},
    mandal:{type:String}, town:{type:String},
    catagory: { type: String, default: "nocatagory" },
    rating: { type: Number, default: 0 },
    password: { type: String, default: 0 },
    img: {
      type: String,
    },
    
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword)
  console.log(userPassword)
 const rrr= await bcrypt.compare(candidatePassword,userPassword);
 console.log(rrr)

 return rrr
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

module.exports = mongoose.model("User", UserSchema);

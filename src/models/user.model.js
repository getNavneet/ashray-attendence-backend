import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "teacher", "manager", "employee"],
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {type: Number},
  photo: { type: String }
});
export const User = mongoose.model("User", userSchema);

// userSchema.pre("save", async function (next) {
//   if(!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10)
//   next()
// })
// userSchema.methods.isPasswordCorrect = async function(password){
//   return await bcrypt.compare(password, this.password)
// }

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
         
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}

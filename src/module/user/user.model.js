import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { compareSync, hashSync } from "bcrypt-nodejs";
import constants from "../../config/constants";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: [5, "Username must equal or longer than 5"],
      maxlength: [20, "Username must equal or shorter than 20"]
    },
    password: {
      type: String,
      minlength: [6, "Password must equal or longer than 6"]
    },
    fullname: String,
    role: Number,
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

UserSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },
  validatePassword(password) {
    return compareSync(password, this.password);
  },
  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + lifespan);
    return jwt.sign(
      {
        _id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
      },
      constants.JWT_SECRET
    );
  },
  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      role: this.role,
      active: this.active
    };
  },
  toAuthJSON() {
    return {
      ...this.toJSON(),
      token: this.generateJWT(constants.AUTH_TOKEN_LIFESPAN)
    };
  }
};

UserSchema.index({ username: "text" });

export default mongoose.model("User", UserSchema);

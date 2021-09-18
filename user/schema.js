const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    emailId: { type: String, required: true },
    f_name: String,
    l_name: String,
    password: { type:String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);

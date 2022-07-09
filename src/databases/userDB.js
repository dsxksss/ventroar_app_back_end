const { userSchema } = require("../schemas/userSchema"); //导入所需验证模型
const mongoose = require("mongoose"); //操纵MongoDB库
const jwt = require("jsonwebtoken");
const config = require("config");

//如果你要创建一个对象中的方法,那么你不应该用箭头函数,因为箭头函数没有自己的this
userSchema.methods.createUserToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtkey")
  );
  return token;
};

//创建数据验证模版类
const UserDB = mongoose.model("User", userSchema);
exports.UserDB = UserDB;

const { roarTextSchema } = require("../schemas/roarTextSchema"); //导入所需验证模型
const mongoose = require("mongoose"); //操纵MongoDB库
// const jwt = require("jsonwebtoken");
// const config = require("config");

//如果你要创建一个对象中的方法,那么你不应该用箭头函数,因为箭头函数没有自己的this
// roarTextSchema.methods.createUserToken = function () {
//   const token = jwt.sign(
//     {
//       _id: this._id,
//       isAdmin: this.isAdmin,
//       exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, //token失效时间为3天,
//     },
//     config.get("jwtKey"),
//   );
//   return token;
// };

//创建数据验证模版类
const RoarTextDB = mongoose.model("RoarText", roarTextSchema);
exports.RoarTextDB = RoarTextDB;

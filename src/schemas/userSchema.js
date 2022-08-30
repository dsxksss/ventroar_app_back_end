//----------------------------user数据验证模型---------------------------
const mongoose = require("mongoose"); //操纵MongoDB库
const userSchema = new mongoose.Schema({
  name: {
    type: String, //类型
    required: true, //必填项
    minlength: 3, //最小值
    maxlength: 10, //最大值
    unique: true, //唯一性
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 200, //之所以设置这么大，是因为密码打算用哈希加密计算
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    unique: true, //唯一性
  },
  createDate: {
    type: Number,
    minlength: 8,
    maxlength: 16,
    required: true,
  },
  authToken: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
  },
  isValidate: {
    type: Boolean,
    required: true,
  },
  friends: {
    type: Array,
    required: true,
  },
  inBox: {
    type: Array,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
  },
});

//导出模块
exports.userSchema = userSchema;

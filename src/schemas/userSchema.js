//----------------------------user数据验证模型---------------------------
const mongoose = require("mongoose"); //操纵MongoDB库
const userSchema = new mongoose.Schema({
  name: {
    type: String, //类型
    required: true, //必填项
    minlength: 3, //最小值
    maxlength: 8 //最大值
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 200 //之所以设置这么大，是因为密码打算用哈希加密计算
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    unique: true //唯一性，防止其他文档数据出现同样手机号码
  },
  createDate: {
    type: Number,
    minlength: 8,
    maxlength: 16,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  isLogin: {
    type: Boolean,
    required: true
  },
  isValidate: {
    type: Boolean,
    required: true
  },
  friends: {
    type: Array,
    required: true
  }
});

//导出模块
exports.userSchema = userSchema;

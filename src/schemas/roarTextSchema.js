//----------------------------user数据验证模型---------------------------
const mongoose = require("mongoose"); //操纵MongoDB库
const roarTextSchema = new mongoose.Schema({
  text: {
    type: String, //类型
    required: true, //必填项
    minlength: 3, //最小值
    maxlength: 8, //最大值
  },
  userId: {
    type: String,
    required: true,
  },
  createDate: {
    type: Number,
    minlength: 8,
    maxlength: 16,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  isShowUserName: {
    type: Boolean,
    required: true,
  },
  backRoarTexts: {
    type: Array,
    required: true,
  },
});

//导出模块
exports.roarTextSchema = roarTextSchema;

//----------------------------user数据验证模型---------------------------
const mongoose = require("mongoose"); //操纵MongoDB库
const roarTextSchema = new mongoose.Schema({
  text: {
    type: String, //类型
    required: true, //必填项
    minlength: 3, //最小值
    maxlength: 520, //最大值
  },
  userId: {
    type: String,
    required: true,
    minlength: 10, //最小值
    maxlength: 40, //最大值
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
  smil: {
    type: Number,
    min: 0,
    max: 1,
  },
  heart: {
    type: Number,
    min: 0,
    max: 1,
  },
  likeUsers: {
    type: Array,
  },
  backRoarTexts: {
    type: Array,
    required: true,
  },
});

//导出模块
exports.roarTextSchema = roarTextSchema;

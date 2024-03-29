const mongoose = require("mongoose"); //操纵MongoDB库

/**
 * @name 发送收件箱信件的封装函数
 * @param {string} msg 邮件内容
 * @param {string} isRead 是否已读
 * @param {string} msgType 信件类型
 */

const MsgType = {
  info: "info", //重要的通知
  unimportant: "unimportant", //不重要的信件
  warning: "warning", //低警告信件
  error: "error", //高警告信件
  addFriend: "addFriend", //好友申请通知
};

// async function sendBoxMsg({ msg, isRead = false, msgType, friendId = "null" }) {
//   if (msgType === MsgType.addFriend) {
//     this.push({
//       msg,
//       msgType,
//       isRead,
//       friendId,
//       isAgree: false,
//       _id: mongoose.Types.ObjectId(),
//       date: Math.round(new Date() / 1000),
//     }); //信件创建时间
//   } else {
//     this.push({
//       msg,
//       msgType,
//       isRead,
//       _id: mongoose.Types.ObjectId(),
//       date: Math.round(new Date() / 1000),
//     }); //信
//   }
// }

async function sendBoxMsg({ msg, isRead = false, msgType, friendId = "null" }) {
  let data = {
    msg,
    msgType,
    isRead,
    _id: mongoose.Types.ObjectId(),
    date: Math.round(new Date() / 1000),
  };
  if (msgType === MsgType.addFriend) {
    data.friendId = friendId;
    data.isAgree = false;
  }
  this.push(data);
}

exports.sendBoxMsg = sendBoxMsg;
exports.MsgType = MsgType;

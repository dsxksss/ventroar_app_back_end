/**
 * @name 发送收件箱信件的封装函数
 * @param {string} msg 邮件内容
 * @param {string} isRead 是否已读 
 * @param {string} msgType 信件类型
 */

exports.msgType = {
  info: "info", //重要的通知
  unimportant: "unimportant", //不重要的信件
  warning: "warning", //低警告信件
  error: "error" //高警告信件
};

async function sendBoxMsg({ msg, isRead = false, msgType }) {
  this.push({
    msg: msg,
    msgType: msgType,
    isRead: isRead,
    date: Math.round(new Date() / 1000) //用户创建时间
  });
}

exports.sendBoxMsg = sendBoxMsg;

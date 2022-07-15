const nodemailer = require("nodemailer");
const config = require("config"); //读取配置文件信息库

/**
 * @name 发送邮件封装函数
 * @param {string} to 发送给谁
 * @param {string} title 邮件标题
 * @param {string} body 邮件内容 
 */
const sendEmail = ({ to, title, body }) => {
  const selfEmail = nodemailer.createTransport({
    //创建发送邮箱的账户和授权码
    host: config.get("sendMailConfig.host"),
    secureConnection: true,
    port: config.get("sendMailConfig.port"),
    secure: true,
    auth: {
      user: config.get("sendMailUserName"),
      pass: config.get("sendMailPassword")
    }
  });
  const emailFrom = {
    //配置邮箱本体发送内容
    from: config.get("sendMailConfig.senderName"), //发件者
    to: to, //收件者
    subject: title, //邮件标题
    // text:"xxxxx",
    html: body //邮件具体内容,支持纯文本、html格式
  };
  //开始发送
  selfEmail.sendMail(emailFrom);
};

exports.sendEmail = sendEmail;

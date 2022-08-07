const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { idValidation } = require("../../functions/validateFuntions");
const { UserDB } = require("../../databases/userDB");

router.delete("/", [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = idValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入要删除的信件Id信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }

    let user = await UserDB.findById(req.userToken._id);

    let { inBox } = user;
    const inBoxLength = inBox.length; //利用原数组长度来判断是否含有该信件
    inBox.forEach((item, index) => {
      if (item._id == req.body.id) { //检查是否含有该msg信件
        return inBox.splice(index, 1);
      }
    });

    //利用原数组长度来判断是否含有该评论
    if (inBoxLength == inBox.length) {
      return res.status(404).send({ msg: "没找到该用户信件,请检查后重试!" });
    }
    let newInBox = await UserDB.findByIdAndUpdate(
      req.userToken._id,
      { inBox },
      {
        new: true,
      },
    ); //这里的true表示返回更新后的数据,默认是返回更新前的数据
    return res.status(200).send({ msg: "该信件已删除~", newInBox }); //注册成功后反馈给客户端一个头部token
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `删除该信件请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

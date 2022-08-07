const express = require("express");
const auth = require("../../middlewares/auth");

const { idValidation } = require("../../functions/validateFuntions");
const router = express.Router();
const { UserDB } = require("../../databases/userDB");

router.put("/", [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = idValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入要已读信件id信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let user = await UserDB.findById(req.userToken._id);
    let { inBox } = user;
    let msgIsHas = false;
    let newInBoxMsg;
    inBox.forEach((item) => {
      if (item._id == req.body.id) {
        msgIsHas = true;
        item.isRead = true;
        newInBoxMsg = item;
      }
    });
    if (msgIsHas) {
      await UserDB.findByIdAndUpdate(req.userToken._id, { inBox });
      return res.status(200).send({ msg: "信件已读", result: newInBoxMsg });
    } else {
      return res.status(404).send({ msg: "信件不存在!!!" });
    }
  } catch (err) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `已读信件api请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

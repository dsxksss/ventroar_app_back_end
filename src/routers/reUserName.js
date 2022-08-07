const express = require("express");
const auth = require("../middlewares/auth");

const { nameValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const router = express.Router();

router.put("/", auth, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = nameValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({ msg: `昵称格式不正确错误信息: ${error.details[0].message}` });
    }
    let user = await UserDB.findById(req.userToken._id);
    if (!user) {
      res.status(404).send({ msg: "数据库不存在此用户" });
    }
    user.name = req.body.name;
    await user.save();
    res.status(200).send({ msg: "修改昵称成功" });
  } catch (error) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `修改名字操作超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

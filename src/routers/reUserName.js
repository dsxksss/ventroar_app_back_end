const express = require("express");
const auth = require("../middlewares/auth");

const { nameValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const router = express.Router();

//upload.single() 只接受单个文件上传
router.put("/", auth, async (req, res) => {
  //接受数据并且先用现有模型验证格式是否正确;
  const { error } = nameValidation(req.body);
  if (error)
    return res
      .status(400) //客户端请求的语法错误，服务器无法理解
      .send({ msg: `昵称格式不正确 错误信息: ${error.details[0].message}` });
  let user = await UserDB.findById(req.userToken._id);
  if (!user) {
    res.status(404).send({ msg: "数据库不存在此用户" });
  }
  user.name = req.body.name;
  await user.save();
  res.status(200).send({ msg: "Upload successful", file: req.file });
});

module.exports = router;

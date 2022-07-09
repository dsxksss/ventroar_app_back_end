const express = require("express");
const bcryptjs = require("bcryptjs");
const { userCreateByTrue } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const router = express.Router();
const PATHNAME = "/";

// const mi = 10
// //加密
// bcryptjs.hash('要加密的内容', mi, (err,pwd)=>{
//     if(err) return res.send('加密失败')
//     res.send('加密成功' + pwd)
// })
// // 比对
// bcryptjs.compare('要比对的密码','加密后的密码',(err, flag)=>{
//     if (err) return res.send('比对失败' + err)
//     if (!flag) return res.send('密码不正确')
//     res.send('密码正确')
// })

router.post(PATHNAME, async (req, res) => {
  try {
    接受数据并且先用现有模型验证格式是否正确;
    const { error } = userCreateByTrue(req.body);
    if (error)
      res.status(400).send(`客户端传入的注册信息格式不正确 错误信息: ${error.details[0].message}`);
    let user = await UserDB.findOne({ email: req.body.email });
  } catch (e) {}
});

module.exports = router;

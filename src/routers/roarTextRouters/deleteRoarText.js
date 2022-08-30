const express = require("express");
const fs = require("fs");
const { RoarTextDB } = require("../../databases/roarTextDB");
const { idValidation } = require("../../functions/validateFuntions");
const { STATICPATH } = require("../../../staticPathProvider");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.delete(`/`, [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = idValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入要删除发泄帖子id格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let text = await RoarTextDB.findById(req.body.id);
    if (!text) {
      return res.status(404) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `没找到该帖子,请检查后重试!`,
        });
    }
    let { userId } = text; //结构出需要用的数据
    //拥有管理员权限的删除操作
    if (req.userToken.isAdmin) {
      let result = await RoarTextDB.findByIdAndDelete(req.body.id); //这里的true表示返回更新后的数据,默认是返回更新前的数据
      return res.status(200).send({ msg: "管理员删除宣泄帖成功", result });
    }
    //普通用户的删除操作
    if (userId != req.userToken._id) {
      return res.status(403).send({ msg: "您没有权限删除不属于自己的宣泄帖" });
    }
    const result = await RoarTextDB.findByIdAndDelete(req.body.id); //这里的true表示返回更新后的数据,默认是返回更新前的数据

    //删除图片
    if (result.textImages !== []) {
      for (let e of result.textImages) {
        fs.unlink(`${STATICPATH}/images/${e}`, (_) => {});
      }
    }

    return res.status(200).send({ msg: "删除宣泄帖成功", result });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `删除帖子操作超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

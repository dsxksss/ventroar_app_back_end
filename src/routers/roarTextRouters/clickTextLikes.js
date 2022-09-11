const express = require("express");
const { RoarTextDB } = require("../../databases/roarTextDB");

const { likesValidation } = require("../../functions/validateFuntions");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.put(`/`, [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = likesValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的点赞信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let text = await RoarTextDB.findById(req.body.textId);
    if (!text) {
      return res.status(404) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `没找到该帖子,请检查后重试!`,
        });
    }
    let { smil, heart, likeUsers } = text; //结构出需要用的数据
    //检查是否存在历史点赞记录
    //some此方法是将所有元素进行判断返回一个布尔值，如果存在元素都满足判断条件，
    //则返回true，若所有元素都不满足判断条件，则返回false
    if (text.likeUsers.some((userId) => userId === req.userToken._id)) {
      smil += req.body.smil && req.body.smil > 0 ? -1 : 0;
      heart += req.body.heart && req.body.heart > 0 ? -1 : 0;
      likeUsers.forEach((userId, index) => {
        if (userId === req.userToken._id) {
          return likeUsers.splice(index, 1);
        }
      });
    } else {
      smil += req.body.smil ? 1 : 0;
      heart += req.body.heart ? 1 : 0;
      //如果没问题再去增加点赞数量,并且记录该用户点赞记录
      likeUsers.push(req.userToken._id); //记录该用户点赞记录
    }
    let newData = await RoarTextDB.findByIdAndUpdate(req.body.textId, {
      smil,
      heart,
      likeUsers,
    }, { new: true });
    return res.status(200).send({
      msg: "成功",
      result: { smil: newData.smil, heart: newData.heart },
    });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `点赞操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

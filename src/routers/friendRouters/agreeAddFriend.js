const express = require("express");

const auth = require("../../middlewares/auth");
const { UserDB } = require("../../databases/userDB");
const { MsgType } = require("../../functions/sendBoxMsg");
const { idValidation } = require("../../functions/validateFuntions");
const router = express.Router();

router.put(`/`, [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = idValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的用户id信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }

    let { inBox, friends } = await UserDB.findById(req.userToken._id);
    let isHas = false; //是否含有提供的id信件
    let forNowFriendsId = ""; //用来暂时存放申请添加好友信件内的该用户id
    inBox.forEach((item) => {
      if (item.msgType === MsgType.addFriend) {
        if (item._id == req.body.id) {
          isHas = true;
          item.isRead = true; //并且已读该信件(未来可能会删除这段,保险起见先留下)
          forNowFriendsId = item.friendId;
        }
      }
    });

    //如果没有找到提供的id信件则返回结果至客户端
    if (!isHas) {
      return res.status(404).send({ msg: `没有找到添加好友信件` });
    }

    //利用inBox里的发起请求人id获取对方基本信息
    let user = await UserDB.findById(forNowFriendsId);
    if (!user) return res.status(404).send({ msg: "没找到提供的id用户,检查后再重复此操作!" });

    //检查是否已经添加了对方id
    if (
      friends.find((item) => item == forNowFriendsId) ||
      user.friends.find((item) => item == req.userToken._id)
    ) {
      return res.status(400).send({ msg: `你已经添加了对方,请勿重复添加` });
    }

    //将对方先添加至操作用户内
    friends.push(forNowFriendsId);
    friends = [...new Set(friends)]; //设置为set去重,重新存储
    await UserDB.findByIdAndUpdate(req.userToken._id, { friends, inBox });

    //将自己添加至对方用户内
    user.friends.push(req.userToken._id);
    user.friends = [...new Set(user.friends)]; //设置为set去重,重新存储
    await UserDB.findByIdAndUpdate(forNowFriendsId, { friends: user.friends });

    //确认无误后返回结果给客户端
    return res.status(200).send({ msg: `你们已经成为好友啦~` });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `添加好友操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

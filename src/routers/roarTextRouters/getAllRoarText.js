const { UserDB } = require("../../databases/UserDB");
const { RoarTextDB } = require("../../databases/roarTextDB");
const express = require("express");
const router = express.Router();

router.get("/", async (_req, res) => {
  //获取全部发泄内容并按心数和笑脸数升序获得
  try {
    const oldTexts = await RoarTextDB.find().sort({ heart: -1, smil: -1 });
    let usersId = [];
    let newTexts = [];
    oldTexts.forEach((roar) => usersId.push(roar.userId));
    let users = await UserDB.find({ _id: { $in: [...usersId] } }).select({
      name: 1,
      email: 1,
      avatarUrl: 1,
    });

    //加工数据
    oldTexts.forEach((textItem) => {
      users.forEach((item) => {
        if (textItem.userId == item._id) {
          newTexts.push({
            _id: textItem._id,
            text: textItem.text,
            isPublic: textItem.isPublic,
            isShowUserName: textItem.isShowUserName,
            isCanComment: textItem.isCanComment,
            likeUsers: textItem.likeUsers,
            textImages: textItem.textImages,
            textComments: textItem.textComments.length,
            createDate: textItem.createDate,
            smil: textItem.smil,
            heart: textItem.heart,
            userId: textItem.userId,
            userName: item.name,
            userEmail: item.email,
            userAvatarUrl: item.avatarUrl,
          });
        }
      });
    });
    return res.status(200).send({ msg: "获取全部text数据成功", result: newTexts });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `获取全部宣泄贴超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;

const express = require("express");
const auth = require("../../middlewares/auth");

const router = express.Router();
const { UserDB } = require("../../databases/userDB");

router.get("/", [auth], async (req, res) => {
  let user = await UserDB.findById(req.userToken._id);
  if (!user) {
    res.status(404).send({ msg: "数据库不存在此用户" });
  } else {
    res.status(200).send({ msg: "获取收件箱成功", inBox: user.inBox });
  }
});

module.exports = router;

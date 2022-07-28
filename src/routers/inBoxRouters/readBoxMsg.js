const express = require("express");
const auth = require("../../middlewares/auth");

const router = express.Router();
const { UserDB } = require("../../databases/userDB");

router.put("/:index", [auth], async (req, res) => {
  let user = await UserDB.findById(req.userToken._id);
  if (!user) {
    res.status(404).send({ msg: "数据库不存在此用户" });
  } else {
    if (req.params.index >= user.inBox.length) {
      res.status(400).send({ msg: "信件不存在!!!" });
    } else {
      user.inBox[req.params.index].isRead = true;
      await user.save();
      res.status(200).send({ msg: "信件已读", inBox: user.inBox });
    }
  }
});

module.exports = router;

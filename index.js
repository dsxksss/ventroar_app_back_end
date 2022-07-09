//SM:导入库
const express = require("express"); //express框架
const mongoose = require("mongoose"); //操纵MongoDB数据库的库
const cors = require("cors"); //处理本地调试跨域问题
const morgan = require("morgan"); //morgan是一个记录http请求日志的中间件
const config = require("config"); //读取配置文件信息库
const fs = require("fs"); //node自带的文件读取,这里用于https证书的读取
const https = require("https"); //创建https监听
const signup = require("./src/routers/post/signUp");
const app = express();

//检查环境变量是否设置,如果没设置的话则强制退出程序
//has代表是否存在于此环境变量
if (!config.has("jwtkey")) {
  console.log("缺少环境变量设置,请初始化环境变量再次启动服务...");
  process.exit(1);
}
//MongoDB数据库连接
mongoose
  //先连接这个数据库表
  //如果没有的话就创建这个表
  .connect("mongodb://localhost/ventroarAppApi")
  .then(() => console.log("Connect DataBase...... OK"))
  .catch(err => {
    console.log(`Could not connect to dataBase [ ${err} ] !!!`);
  });

//SM:中间件
//数据转换成req.body的JSON
app.use(express.json());

//解决跨域问题
app.use(cors());

//检测当前环境是否为开发环境，如果是，则使用morgan日志记录
if (app.get("env") === "development") {
  //tiny是简单的log记录方式,这里使用的是dev记录格式
  app.use(morgan("dev"));
  console.log("development !,morgan starting~");
}

//导入路由模组
app.use("/signup/", signup);

//读取安全keyfile
const keyfile = {
  key: fs.readFileSync("ventroar.xyz.key"),
  cert: fs.readFileSync("ventroar.xyz_bundle.crt")
};

//适合本地测试用的端口
app.listen(2547, () => {
  console.log(`localhost Server listening at http://localhost:2547`);
});

//开启https需要安全key文件
// https
//   .createServer(keyfile, app)
//   .listen(2546, () =>
//     console.log(`Server listening at https://localhost:2546`)
//   );

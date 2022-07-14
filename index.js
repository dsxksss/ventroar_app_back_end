//第三方库
const express = require("express"); //express框架
const mongoose = require("mongoose"); //操纵MongoDB数据库的库
const cors = require("cors"); //处理本地调试跨域问题
const morgan = require("morgan"); //morgan是一个记录http请求日志的中间件
const config = require("config"); //读取配置文件信息库
const fs = require("fs"); //node自带的文件读取,这里用于https证书的读取
const https = require("https"); //创建https监听

//全局变量
const DEBUG_HOST = config.get("dbConfig.debugDbConfig.host");
const DEBUG_PORT = config.get("dbConfig.debugDbConfig.port");
const RELEASE_HOST = config.get("dbConfig.releaseDbConfig.host");
const RELEASE_PORT = config.get("dbConfig.releaseDbConfig.port");
const app = express();
let HASENV_ERROR_NAME = []; //缺少的环境变量名字
let HASCONFIGF_ERROR_NAME = []; //缺少的配置文件变量名字

//配置信息如果缺少的话强制退出程序
//检查必要的环境变量
const HASENV = () => {
  if (!config.has("runMode")) {
    HASENV_ERROR_NAME.push("runMode");
  }
  if (!config.has("jwtkey")) {
    HASENV_ERROR_NAME.push("jwtket");
  }
  if (!config.has("sendMailUserName")) {
    HASENV_ERROR_NAME.push("sendMailUserName");
  }
  if (!config.has("sendMailPassword")) {
    HASENV_ERROR_NAME.push("sendMailPassword");
  }
  const result =
    !config.has("runMode") || //启动模式(development and production)
    !config.has("jwtkey") || //jwtTokenKey
    !config.has("sendMailUserName") || //邮箱发送服务的邮箱账号
    !config.has("sendMailPassword"); //邮箱发送服务的邮箱密码
  return result;
};

//检查配置文件信息
const HASCONFIGF = () => {
  if (!config.has("sendMailConfig.senderName")) {
    HASCONFIGF_ERROR_NAME.push("sendMailConfig.senderName");
  }
  if (!config.has("sendMailConfig.host")) {
    HASCONFIGF_ERROR_NAME.push("sendMailConfig.host");
  }
  if (!config.has("sendMailConfig.port")) {
    HASCONFIGF_ERROR_NAME.push("sendMailConfig.port");
  }
  if (!config.has("dbConfig.debugDbConfig.host")) {
    HASCONFIGF_ERROR_NAME.push("dbConfig.debugDbConfig.host");
  }
  if (!config.has("dbConfig.debugDbConfig.port")) {
    HASCONFIGF_ERROR_NAME.push("dbConfig.debugDbConfig.port");
  }
  if (!config.has("dbConfig.releaseDbConfig.host")) {
    HASCONFIGF_ERROR_NAME.push("dbConfig.releaseDbConfig.host");
  }
  if (!config.has("dbConfig.releaseDbConfig.port")) {
    HASCONFIGF_ERROR_NAME.push("dbConfig.releaseDbConfig.port");
  }

  const result =
    !config.has("sendMailConfig.senderName") || //邮箱发送者名字
    !config.has("sendMailConfig.host") || //邮件服务的服务方地址
    !config.has("sendMailConfig.port") || //邮件服务的服务方端口
    !config.has("dbConfig.debugDbConfig.host") || //debug运行环境下的host
    !config.has("dbConfig.debugDbConfig.port") || //debug运行环境下的port
    !config.has("dbConfig.releaseDbConfig.host") || //release运行环境下的host
    !config.has("dbConfig.releaseDbConfig.port"); //release运0行环境下的port
  return result;
};

if (HASENV()) {
  console.log(`缺少所需的环境变量[${HASENV_ERROR_NAME}],请初始化环境变量再次启动服务...`);
  process.exit(1);
}

if (HASCONFIGF()) {
  console.log(`配置文件default.json属性值[${HASCONFIGF_ERROR_NAME}],请检查配置文件再次启动服务...`);
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

//环境为开发环境启动的log
if (config.get("runMode") === "development") {
  //tiny是简单的log记录方式,这里使用的是dev记录格式
  app.use(morgan("dev"));
  console.log("development!,morgan[dev] log starting~");
  //适合本地测试用的端口(default:2547)
  app.listen(config.get("dbConfig.debugDbConfig.port"), () => {
    console.log(
      `localhost Server listening at http://${DEBUG_HOST}:${DEBUG_PORT}/`
    );
  });
}

//环境为生产环境启动的log
if (config.get("runMode") === "production") {
  //tiny是简单的log记录方式,这里使用的是dev记录格式
  app.use(morgan("dev"));
  console.log("production!,morgan[dev] log starting~");
  //开启https需要安全key文件
  //读取安全keyfile
  const keyfile = {
    key: fs.readFileSync("ventroar.xyz.key"),
    cert: fs.readFileSync("ventroar.xyz_bundle.crt")
  };
  //适合本地测试用的端口(default:2546)
  https
    .createServer(keyfile, app)
    .listen(config.get("dbConfig.releaseDbConfig.port"), () =>
      console.log(`Server listening at http://${RELEASE_HOST}:${RELEASE_PORT}/`)
    );
}

//导入注册路由
const signIn = require("./src/routers/signIn");
const signUp = require("./src/routers/signUp");
const tokenLogin = require("./src/routers/tokenLogin");
const rePassword = require("./src/routers/rePassword");
const emailActivation = require("./src/routers/emailActivation");
const sendActivationEmail = require("./src/routers/sendActivationEmail");

app.use("/signin", signIn);
app.use("/signup", signUp);
app.use("/tokenlogin", tokenLogin);
app.use("/repassword", rePassword);
app.use("/emailactivation", emailActivation);
app.use("/sendactivationemail", sendActivationEmail);

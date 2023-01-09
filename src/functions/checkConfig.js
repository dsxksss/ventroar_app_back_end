const config = require("config"); //读取配置文件信息库

function checkCofing() {
  let ENV_ERROR_NAME = []; //缺少的环境变量名字
  let FILE_ERROR_NAME = []; //缺少的配置文件变量名字

  //配置信息如果缺少的话强制退出程序
  //检查必要的环境变量
  const envConfigs = [
    "runMode", //启动模式(development and production)
    "jwtKey",
    "jwtKeyT",
    "sendMailUserName", //邮箱发送服务的邮箱账号
    "sendMailPassword", //邮箱发送服务的邮箱密码
  ];
  envConfigs.forEach((configName) => {
    if (!config.has(configName)) ENV_ERROR_NAME.push(configName);
  });

  //检查配置文件信息
  const fileConfigs = [
    "sendMailConfig.senderName", //邮箱发送者名字
    "sendMailConfig.host", //邮件服务的服务方地址
    "sendMailConfig.port", //邮件服务的服务方端口
    "dbConfig.debugDbConfig.host", //debug运行环境下的host
    "dbConfig.debugDbConfig.port", //debug运行环境下的port
    "dbConfig.releaseDbConfig.host", //release运行环境下的host
    "dbConfig.releaseDbConfig.port", //release运0行环境下的port
  ];
  fileConfigs.forEach((configName) => {
    if (!config.has(configName)) FILE_ERROR_NAME.push(configName);
  });

  if (ENV_ERROR_NAME.length > 0) {
    console.log(
      `缺少所需的环境变量[${ENV_ERROR_NAME}],请初始化环境变量再次启动服务...`,
    );
    process.exit(1);
  }

  if (FILE_ERROR_NAME.length > 0) {
    console.log(
      `配置文件default.json属性值[${FILE_ERROR_NAME}],请检查配置文件再次启动服务...`,
    );
    process.exit(1);
  }

  if (
    config.get("runMode") !== "development" &&
    config.get("runMode") !== "production"
  ) {
    console.log(`环境变量[runMode],配置不正确,只能为development或production`);
    process.exit(1);
  }
  
}

module.exports = checkCofing;

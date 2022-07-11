# 配置文件信息注释

## 1、配置文件结构

- custom-environment-variables.json 读取本地环境变量配置
- default.json 读取项目运行时要初始化的配置内容

## 2、custom-environment-variables.json **配置详解**

| 配置名                  | 配置方式                                        | 配置作用                                                  |
| -------------------- | ------------------------------------------- | ----------------------------------------------------- |
| **runMode**          | set LOCAL_RUN_MODE=development 或 production | 项目运行模式,分别为开发模式(development)和发布模式(production),默认:开发者模式 |
| **jwtkey**           | set LOCAL_JWT_KET=自定义密钥                     | JsonWebToken密钥值,用来校验用户token是否合法                       |
| **sendMailUserName** | set LOCAL_SEND_MAIL_USERNAME=邮箱账号           | 邮箱服务的账号名字                                             |
| **sendMailPassword** | set LOCAL_SEND_MAIL_PASSWORD=邮箱密码           | 邮箱服务的账号密码                                             |

## 3、default.json **配置详解**

| 配置名                               | 配置方式              | 配置作用               |
| --------------------------------- | ----------------- | ------------------ |
| **sendMailConfig**                | 信息集               | 邮箱服务基本信息集          |
| **sendMailConfig.senderName**     | default.json文件内配置 | 发送邮件的发件人名字         |
| **sendMailConfig.host**           | default.json文件内配置 | 邮件服务的服务方地址         |
| **sendMailConfig.port**           | default.json文件内配置 | 邮件服务的服务方端口         |
| **dbConfig**                      | 信息集               | 项目运行环境服务器基本信息集     |
| **dbConfig.debugDbConfig**        | 信息集               | dubug环境下服务器基本信息集   |
| **dbConfig.debugDbConfig.host**   | default.json文件内配置 | dubug环境下服务器启动地址    |
| **dbConfig.debugDbConfig.port**   | default.json文件内配置 | dubug环境下服务器启动端口    |
| **dbConfig.releaseDbConfig**      | 信息集               | release环境下服务器基本信息集 |
| **dbConfig.releaseDbConfig.host** | default.json文件内配置 | release环境下服务器启动地址  |
| **dbConfig.releaseDbConfig.port** | default.json文件内配置 | release环境下服务器启动端口  |

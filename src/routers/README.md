# API说明(路由路径规范为全小写)

# User基本操作api

| api名称                   | 路由路径                 | 作用                          | 参数                    | 方法   |
| ----------------------- | -------------------- | --------------------------- | --------------------- | ---- |
| **SignIn**              | /signin              | 登录账号(返回该登录用户基本数据)           | account,password      | POST |
| **SignUp**              | /signup              | 注册账号(不提供激活但发送验证邮件)          | name,email,password   | POST |
| **EmailActivation**     | /emailactivation     | 作用于接受邮箱激活账号                 | null                  | POST |
| **TokenLogin**          | /tokenlogin          | 仅接受头部token登录账号(返回该登录用户基本数据) | null header-token     | POST |
| **SendActivationEmail** | /sendactivationemail | 发送激活账号的验证邮件                 | email                 | POST |
| **RePassword**          | /repassword          | 发送修改密码的验证邮件                 | email                 | POST |
| **RePasswordValidate**  | /repassword/validate | 用于接受邮箱修改密码                  | password header-token | PUT  |
| **UploadImg**           | /uploadimg           | 用于上传图片资源 (返回file基本信息)       | null                  | POST |
| **UploadAvatar**        | /uploadavatar        | 用于上传用户头像资源 (返回file基本信息)     | null header-token     | POST |
| **ReUserName**          | /reusername          | 用于修改用户昵称                    | name header-token     | PUT  |
| **ReEmail**             | /reusername          | 用于修改用户邮箱                    | email header-token    | PUT  |

# inBox收件箱api

| api名称            | 路由路径                | 作用                          | 参数               | 方法     |
| ---------------- | ------------------- | --------------------------- | ---------------- | ------ |
| **GetUserInBox** | /getUserInBox       | 获取该用户的收件箱数据(inBox as Array) | account,password | GET    |
| **ReadBoxMsg**   | /readboxmsg/index   | 让提供的index下标信件已读             | params:index     | PUT    |
| **DeleteBoxMsg** | /deleteboxmsg/index | 删除提供的index下标信件              | params:index     | DELETE |
| **ClearInBox**   | /clearinbox         | 清空用户收件箱                     | null             | DELETE |

# roarText发泄墙api

| api名称                   | 路由路径                 | 作用                                   | 参数                                               | 方法     |
| ----------------------- | -------------------- | ------------------------------------ | ------------------------------------------------ | ------ |
| **GetAllRoarText**      | /getallroartext      | 获取全部用户发布的宣泄帖子                        | null                                             | GET    |
| **GetUserAllRoarText**  | /getuserallroartext  | 获取该用户的全部宣泄贴                          | null                                             | GET    |
| **PostRoarText**        | /postroartext        | 用户发布宣泄帖子                             | text,isPublic,isShowUserName,isCanComment        | POST   |
| **ClickTextLikes**      | /clicktextlikes      | 给指定的宣泄帖点赞                            | textId,smil(bool),heart(bool)                    | PUT    |
| **PutRoarText**         | /putroartext         | 编辑指定的宣泄帖内容                           | textId,text,isPublic,isShowUserName,isCanComment | PUT    |
| **DeleteRoarText**      | /deleteroartext      | 删除指定的宣泄帖(支持管理员删除)                    | id                                               | DELETE |
| **PostRoarTextComment** | /postroartextcomment | 评论指定的宣泄帖(未开启isCanComment功能时支持发帖本人评论) | textId,commentText,isShowUserName                | POST   |

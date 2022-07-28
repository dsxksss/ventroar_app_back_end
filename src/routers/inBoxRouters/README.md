# API说明(路由路径规范为全小写)

| api名称            | 路由路径              | 作用                          | 参数               | 方法  |
| ---------------- | ----------------- | --------------------------- | ---------------- | --- |
| **GetUserInBox** | /getUserInBox     | 获取该用户的收件箱数据(inBox as Array) | account,password | GET |
| **ReadBoxMsg**   | /readboxmsg/index | 让提供的index下标信件已读             | params:index     | PUT |

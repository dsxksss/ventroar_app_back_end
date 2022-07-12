const Joi = require("joi"); //导入数据验证库

// FUNCTION: 封装的数据验证函数;
const createUserValidation = data => {
  //创建前端传来的标准数据模版格式
  const schema = Joi.object({
    name: Joi.string().min(3).max(8).required(),
    email: Joi.string().email().max(20).required(),
    password: Joi.string().min(8).max(20).required()
  });
  //返回验证结果
  return schema.validate(data);
};

const signInValidation = data => {
  const schema = Joi.object({
    account: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).max(20).required()
  });
  return schema.validate(data);
};

const rePasswordValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email().max(20).required()
  });
  return schema.validate(data);
};
exports.createUserValidation = createUserValidation;
exports.signInValidation = signInValidation;
exports.rePasswordValidation = rePasswordValidation;

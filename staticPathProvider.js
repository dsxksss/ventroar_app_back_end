const fs = require("fs");
const STATICPATHNAEM = __dirname + "/static/";
if (!fs.existsSync(STATICPATHNAEM)) fs.mkdirSync(STATICPATHNAEM);

exports.STATICPATH = STATICPATHNAEM;

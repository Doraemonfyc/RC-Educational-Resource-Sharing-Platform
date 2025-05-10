require("dotenv").config();
console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("MongoDB URI:", process.env.MONGODB_URI);

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mysite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 配置中间件
app.use(express.static("public")); // 托管静态资源
app.use(express.json()); // 解析JSON请求体

// 路由配置
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// ...其他路由...

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});

app.use(express.static("public")); // 在server.js中配置

require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

// 添加中间件
app.use(express.json());

// 挂载路由
app.use(authRoutes);

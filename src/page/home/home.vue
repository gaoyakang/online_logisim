<template>
  <div class="container">
    <div class="home-header">
      <div class="home-header-left">
        <img src="../../assets/img/logisim.ico" alt="" />
        <span class="home-header-title">OnlineLogisim</span>
      </div>
      <div class="home-header-right">
        <span @click="() => lanuchSimulator()" style="cursor: pointer"
          ><a>模拟器</a></span
        >
        <span
          ><a href="http://www.cburch.com/logisim/" target="_blank"
            >关于</a
          ></span
        >
        <span style="margin-right: 70px"
          ><a href="https://github.com/gaoyakang/online_logisim" target="_blank"
            >源码</a
          ></span
        >
      </div>
    </div>
    <div class="home-content">
      <div class="home-content-intro">
        <div class="home-content-intro-left">
          <div class="home-content-intro-left-intr">免费深入逻辑电路的世界</div>
          <div class="home-content-intro-left-button">
            <button @click="() => lanuchSimulator()">启动模拟器</button>
          </div>
        </div>
        <div class="home-content-intro-right">
          <img
            src="../../assets/img/homeintr.png"
            class="home-content-intro-right-img"
          />
        </div>
      </div>
      <h1 class="example-title">最佳示例</h1>
      <div class="home-content-example">
        <div class="exampl1">
          <img src="../../assets/img/example1.jpg" alt="" />
          <div>
            <span>异或门</span>
            <button @click="() => lanuchSimulator('XOR')">查看</button>
          </div>
        </div>
        <div class="exampl2">
          <img src="../../assets/img/example2.jpg" alt="" />
          <div>
            <span>16bit CPU</span>
            <button @click="() => lanuchSimulator('')">查看</button>
          </div>
        </div>
        <div class="exampl3">
          <img src="../../assets/img/example3.jpg" alt="" />
          <div>
            <span>32bit CPU</span>
            <button @click="() => lanuchSimulator('')">查看</button>
          </div>
        </div>
      </div>
      <div class="home-content-example">
        <div class="exampl1">
          <img src="../../assets/img/example1.jpg" alt="" />
          <div>
            <span>8bit CPU</span>
            <button @click="() => lanuchSimulator('')">查看</button>
          </div>
        </div>
        <div class="exampl2">
          <img src="../../assets/img/example2.jpg" alt="" />
          <div>
            <span>16bit CPU</span>
            <button @click="() => lanuchSimulator('')">查看</button>
          </div>
        </div>
        <div class="exampl3">
          <img src="../../assets/img/example3.jpg" alt="" />
          <div>
            <span>32bit CPU</span>
            <button @click="() => lanuchSimulator('')">查看</button>
          </div>
        </div>
      </div>
    </div>
    <div class="home-footer">
      <div class="home-footer-top">
        <div class="home-footer-top-left">
          <img src="../../assets/img/logisim.ico" alt="" />
          <span class="home-header-title">OnlineLogisim</span>
        </div>
        <div class="home-footer-top-right">
          <span
            ><a
              href="https://beian.miit.gov.cn/#/Integrated/index"
              style="cursor: pointer"
              >津ICP备2020006776号-1</a
            ></span
          >
          <span><a>github</a></span>
          <span><a>bilibili</a></span>
          <span><a>Copyright © 2024 OnlineLogisim</a></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
// 跳转到模拟器页面
const lanuchSimulator = (name?: string) => {
  // const path = name ? `/simulator?name=${name}` : "/simulator";
  // router.push(path);
  router.push({
    path: "simulator", // 记得在路由表里给这条路由起个 name
    query: name ? { name } : undefined,
  });
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  min-height: 100vh; /* 容器至少占满整个视口的高度 */
}

span {
  padding: 15px;
}

.home-header {
  display: flex;
  justify-content: space-between; /* 子元素分散对齐 */
  align-items: center; /* 子元素在交叉轴上居中对齐 */
  height: 97px;
  position: fixed; /* 固定在顶部 */
  top: 0;
  width: 100%; /* 占满整个视口宽度 */
  background-color: white; /* 背景颜色 */
  z-index: 1000; /* 确保在页面内容之上 */
  border-bottom: 1px solid #ccc;
}

.home-header-left {
  display: flex;
  align-items: center; /* 子元素在交叉轴上居中对齐 */
  margin-left: 40px;
}

.home-header-title {
  padding: 15px;
  font-size: 18px; /* 默认字体大小 */
  color: green;
  transition: font-size 0.3s ease; /* 平滑过渡效果 */
}

.home-header-title:hover {
  font-size: 24px; /* hover时的字体大小 */
}

.home-header-title:hover,
img:hover {
  cursor: pointer;
}

.home-header-right {
  display: flex;
  align-items: center; /* 子元素在交叉轴上居中对齐 */
}

.home-content {
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 子元素在主轴上居中对齐 */
  margin-top: 97px; /* 为固定头部留出空间 */
}

.home-content-intro {
  width: 100%; /* 占满整个容器宽度 */
  display: flex;
  flex-direction: row; /* 子元素水平排列 */
  justify-content: space-between; /* 子元素分散对齐 */
}

.home-content-intro-left {
  flex: 1; /* 左侧部分占据一半空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.home-content-intro-left-intr {
  font-size: 24px; /* 文字大号 */
  margin-bottom: 20px; /* 与按钮之间的间距 */
}

.home-content-intro-left-button button {
  height: 50px;
  font-size: 20px;
  padding: 10px 20px; /* 按钮内边距 */
  background-color: green; /* 绿底 */
  border-radius: 8px;
  color: white; /* 白字 */
  border: none; /* 无边框 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  transition: transform 0.3s, background-color 0.3s; /* 平滑过渡效果 */
}

.home-content-intro-left-button button:hover {
  transform: translateY(-5px); /* hover时弹起效果 */
  background-color: darkgreen; /* hover时颜色变化 */
}

.home-content-intro-right {
  flex: 1; /* 右侧部分占据一半空间 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-content-intro-right-img {
  max-height: 700px;
  max-width: 100%;
}

.home-footer {
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  background-color: black; /* 黑底 */
  color: white; /* 白字 */
  padding: 20px;
  margin-top: 50px;
}

.home-footer-top {
  display: flex;
  justify-content: space-between; /* 子元素分散对齐 */
  align-items: center; /* 子元素在交叉轴上居中对齐 */
}

.home-footer-top-left {
  display: flex;
  align-items: center; /* 子元素在交叉轴上居中对齐 */
}

.home-footer-top-right {
  display: flex;
  flex-direction: row;
  align-items: center; /* 文本居中对齐 */
}

.home-footer-top-right-copyright {
  margin-top: 15px;
}

.home-content-example {
  width: 100%; /* 占满整个容器宽度 */
  display: flex;
  justify-content: space-between; /* 子元素分散对齐 */
  margin-top: 30px; /* 与上方内容保持一定距离 */
}

.exampl1,
.exampl2,
.exampl3 {
  border: 2px solid green; /* 绿色边框 */
  border-radius: 5px; /* 边框圆角 */
  overflow: hidden; /* 隐藏溢出的内容 */
  position: relative; /* 相对定位 */
  width: calc(30% - 40px); /* 每个框的宽度，减去间距 */
  margin: 20px; /* 每个框的外边距 */
}

.exampl1 img,
.exampl2 img,
.exampl3 img {
  width: 100%; /* 图片宽度占满框 */
  display: block; /* 避免图片下方出现空隙 */
}

.exampl1 div,
.exampl2 div,
.exampl3 div {
  padding: 10px; /* 内边距 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 子元素居中对齐 */
}

.exampl1 span,
.exampl2 span,
.exampl3 span {
  margin-bottom: 10px; /* 与按钮之间的间距 */
  border-top: 2px solid green; /* 绿色分隔线 */
  padding-top: 10px; /* 分隔线上方的内边距 */
}

.exampl1 button,
.exampl2 button,
.exampl3 button {
  padding: 10px 20px; /* 按钮内边距 */
  background-color: green; /* 绿底 */
  color: white; /* 白字 */
  border: none; /* 无边框 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  transition: transform 0.3s, background-color 0.3s; /* 平滑过渡效果 */
}

.exampl1 button:hover,
.exampl2 button:hover,
.exampl3 button:hover {
  transform: translateY(-5px); /* hover时弹起效果 */
  background-color: darkgreen; /* hover时颜色变化 */
}
.home-content-example {
  display: flex;
  justify-content: center; /* 子元素在主轴上居中对齐 */
  margin-top: 20px; /* 与上方内容保持一定距离 */
}

.example-title {
  text-align: center; /* 文本居中 */
  margin-top: 20px; /* 与上方内容保持一定距离 */
  margin-bottom: 30px; /* 与下方框保持一定距离 */
}

.example-box {
  border: 2px solid #ccc; /* 灰色边框 */
  border-radius: 5px; /* 边框圆角 */
  overflow: hidden; /* 隐藏溢出的内容 */
  position: relative; /* 相对定位 */
  width: calc(30% - 40px); /* 每个框的宽度，减去间距 */
  margin: 0 20px; /* 每个框的外边距 */
  transition: box-shadow 0.3s; /* 阴影过渡效果 */
}

.example-box:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.example-box img {
  width: 100%; /* 图片宽度占满框 */
  display: block; /* 避免图片下方出现空隙 */
}

.example-box div {
  padding: 10px; /* 内边距 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 子元素居中对齐 */
}

.example-box span {
  margin-bottom: 10px; /* 与按钮之间的间距 */
  border-top: 2px solid green; /* 绿色分隔线 */
  padding-top: 10px; /* 分隔线上方的内边距 */
}

.example-box button {
  padding: 10px 20px; /* 按钮内边距 */
  background-color: green; /* 绿底 */
  color: white; /* 白字 */
  border: none; /* 无边框 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  transition: transform 0.3s, background-color 0.3s; /* 平滑过渡效果 */
}

.example-box button:hover {
  transform: translateY(-5px); /* hover时弹起效果 */
  background-color: darkgreen; /* hover时颜色变化 */
}
</style>

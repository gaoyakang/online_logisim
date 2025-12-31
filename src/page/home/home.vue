<template>
  <div class="container">
    <div class="home-header">
      <div class="home-header-left">
        <img src="../../assets/img/logisim.ico" alt="" />
        <span class="home-header-title">OnlineLogisim</span>
      </div>
      <!-- 三横按钮 -->
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">☰</div>

      <!-- PC 导航（桌面端用） -->
      <nav class="home-header-right">
        <span @click="lanuchSimulator()"><a href="">模拟器</a></span>
        <span
          ><a href="http://www.cburch.com/logisim/" target="_blank"
            >关于</a
          ></span
        >
        <span>
          <a href="https://github.com/gaoyakang/online_logisim" target="_blank"
            >源码</a
          ></span
        >
      </nav>

      <!-- ✅ 全宽下拉：直接挂在 header -->
      <transition name="slide">
        <div v-if="isMobile && showMobileMenu" class="mobile-dropdown">
          <span @click="lanuchSimulator()">模拟器</span>
          <a href="http://www.cburch.com/logisim/" target="_blank">关于</a>
          <a href="https://github.com/gaoyakang/online_logisim" target="_blank"
            >源码</a
          >
        </div>
      </transition>
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
            <span>1bit半加器</span>
            <button @click="() => lanuchSimulator('OneBitHalfAdder')">
              查看
            </button>
          </div>
        </div>
        <div class="exampl3">
          <img src="../../assets/img/example3.jpg" alt="" />
          <div>
            <span>1bit全加器</span>
            <button @click="() => lanuchSimulator('OneBitFullAdder')">
              查看
            </button>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const isMobile = ref(false);
const showMobileMenu = ref(false); // 移动端菜单显示状态

const checkScreen = () => (isMobile.value = window.innerWidth <= 768);
const toggleMobileMenu = () => (showMobileMenu.value = !showMobileMenu.value);

// 监听屏幕尺寸变化
onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
});
onUnmounted(() => window.removeEventListener("resize", checkScreen));
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
  margin-right: 40px;
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

@media (max-width: 768px) {
  .home-content-example {
    flex-direction: column;
    align-items: center;
  }

  .exampl1,
  .exampl2,
  .exampl3 {
    width: 90%;
    margin: 10px 0;
  }

  .exampl1 div,
  .exampl2 div,
  .exampl3 div {
    padding: 10px;
  }

  .exampl1 span,
  .exampl2 span,
  .exampl3 span {
    font-size: 14px;
    padding: 5px;
  }

  .exampl1 button,
  .exampl2 button,
  .exampl3 button {
    font-size: 14px;
    padding: 8px 16px;
  }
}

/* ---------- 移动端导航 ---------- */
.mobile-menu-toggle {
  display: none;
  font-size: 28px;
  cursor: pointer;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }
  .home-header-right {
    position: absolute;
    top: 0px;
    left: 0px;
    flex-direction: column;
    background: #fff;
    border: 1px solid #ccc;
    width: 120px;
    display: none; /* 默认收起 */
  }
  .home-header-right.show {
    display: flex; /* 点击后展开 */
  }
  .home-header-right span {
    padding: 12px;
    text-align: center;
    width: 100%;
  }

  /* ---- 一屏适配 ---- */
  body {
    overflow-x: hidden;
  }
  .container {
    width: 100vw;
  }
  .home-content-intro {
    flex-direction: column;
    text-align: center;
  }
  .home-content-intro-right-img {
    max-height: 40vh;
    width: auto;
  }
  .example-title {
    margin: 15px 0;
  }

  /* 给 footer 文字加断字 */
  .home-footer-top-right {
    display: flex;
    flex-direction: column;
    font-size: 8px;
  }

  /* 兜底：整页禁止横向溢出 */
  body {
    overflow-x: hidden;
  }
}

/* ===== 移动端下拉菜单 ===== */
.mobile-nav {
  position: absolute;
  top: 97px; /* 紧贴header底部 */
  right: 0;
  width: 140px;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  z-index: 999;
}

.mobile-nav a,
.mobile-nav span {
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-nav a:hover,
.mobile-nav span:hover {
  background: #f2f2f2;
}

/* 下拉动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 桌面端隐藏 */
@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}

/* ===== 移动端下拉菜单 ===== */
/* ===== 真正全宽下拉 ===== */
.mobile-dropdown {
  position: absolute;
  top: 97px; /* header 高度 */
  left: 0;
  right: 0; /* 相对于 .home-header 全宽 */
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.mobile-dropdown span,
.mobile-dropdown a {
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-dropdown span:hover,
.mobile-dropdown a:hover {
  background: #f2f2f2;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (min-width: 769px) {
  .mobile-dropdown {
    display: none;
  }
}
.mobile-dropdown span:hover,
.mobile-dropdown a:hover {
  background: #2ecc71; /* 品牌绿 */
  color: #fff; /* 白字 */
}
.mobile-dropdown span,
.mobile-dropdown a {
  transition: background 0.2s, color 0.2s;
}
/* 移动端让标题离 header 远一点 */
.home-content-intro-left-intr {
  margin-top: 30px; /* 按需调大 */
  font-size: 20px; /* 也可顺便缩小字号 */
}
</style>

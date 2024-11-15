<template>
  <div>
    <div class="container" ref="containerRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AndGate from "./components/baseGate/AndGate.ts";
import OrGate from "./components/baseGate/OrGate.ts";
import NotGate from "./components/baseGate/NotGate.ts"
import XorGate from "./components/baseGate/XorGate.ts"
import Input from "./components/io/Input.ts";
import Output from "./components/io/Output.ts";
import Clock from "./components/io/Clock.ts";

import { lfInit } from './core/LFInstance/LFInit.ts'
import { registerNodes } from './core/nodes/registerNodes.ts'
import { setPlugins } from './core/plugins/setPlugins.ts'
import { onEdgeConnected } from "./core/edges/onEdgeConnected.ts";
import { onNodeClick } from "./core/nodes/index.ts";
import { renderLF } from "./core/LFInstance/renderLF.ts";

const containerRef = ref(); // 画布容器引用

onMounted(() => {
  // 1.LogicFlow初始化
  let lf = lfInit(containerRef)

  // 2.注册节点
  lf = registerNodes(lf, [AndGate, Input, Output, OrGate, NotGate, XorGate, Clock])

  // 3.设置插件
  lf = setPlugins(lf, containerRef);

  // 4.监听连线和节点事件
  lf = onEdgeConnected(lf);
  lf = onNodeClick(lf);

  // 5.渲染lf
  renderLF(lf, containerRef);
})
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.lf-container {
  flex: 1;
  border: 1px solid #ccc;
}
</style>

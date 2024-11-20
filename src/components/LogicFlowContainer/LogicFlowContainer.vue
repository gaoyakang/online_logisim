<template>
    <div>
      <div class="container" ref="containerRef"></div>
    </div>
  </template>
  
  <script setup lang="ts">
import { onMounted, ref } from "vue";

import { lfInit } from "../../core/LFInstance/LFInit";
import { renderLF } from "../../core/LFInstance/renderLF";
import { registerNodes } from "../../core/nodes/util/registerNodes";
import { setPlugins } from "../../core/plugins/setPlugins";
import { onNodeClick } from "../../core/nodes";
import { onEdgeConnected } from "../../core/edges/onEdgeConnected";


import AndGate from "../../core/nodes/baseGate/andGate/AndGate";
import NotGate from "../../core/nodes/baseGate/notGate/NotGate";
import OrGate from "../../core/nodes/baseGate/orGate/OrGate";
import XorGate from "../../core/nodes/baseGate/xorGate/XorGate";
import Clock from "../../core/nodes/io/clock/Clock";
import Input from "../../core/nodes/io/input/Input";
import Output from "../../core/nodes/io/output/Output";


  
  const containerRef = ref(); // 画布容器引用
  
  onMounted(() => {
    // 1.LogicFlow初始化
    let lf = lfInit(containerRef)
  
    // 2.注册节点
    lf = registerNodes(lf, [ Input, Output, Clock, AndGate, OrGate, NotGate, XorGate, ])
  
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
  
<template>
  <div>
    <div class="container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
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
import RsFlipFlop from "../../core/nodes/flipFlop/rsFlipFlop/rsFlipFlop";
import DFlipFlop from "../../core/nodes/flipFlop/dFlipFlop/dFlipFlop";
import { useRoute } from "vue-router";
import { PRESETS } from "../../presets";
import { isPresetMode } from "../../core/config";

const containerRef = ref(); // 画布容器引用
const route = useRoute();

onMounted(() => {
  // 0.判断是否有预设电路
  const presetName = route.query.name as string;
  const initData = PRESETS[presetName];
  isPresetMode.value = !!presetName; // 预设模式

  // 1.LogicFlow初始化
  let lf = lfInit(containerRef);

  // 2.注册节点
  lf = registerNodes(lf, [
    Input,
    Output,
    Clock,
    AndGate,
    OrGate,
    NotGate,
    XorGate,
    RsFlipFlop,
    DFlipFlop,
  ]);

  // 3.设置插件
  lf = setPlugins(lf, containerRef);

  // 4.监听连线和节点事件
  lf = onEdgeConnected(lf);
  lf = onNodeClick(lf);

  // 5.渲染lf
  renderLF(lf, containerRef, initData);
});
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

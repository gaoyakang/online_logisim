<template>
  <div>
    <div class="container" ref="containerRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import LogicFlow, { BaseNodeModel } from '@logicflow/core';
import { BezierEdge, BezierEdgeModel } from '@logicflow/core';
import { SelectionSelect,MiniMap } from '@logicflow/extension';
import { DndPanelVue } from "./extension/dnd-panel-vue";
import { Control } from "./extension/control-vue.ts";
import AndGate from "./components/baseGate/AndGate.ts";
import Input from "./components/io/Input.ts";
import Output from "./components/io/Output.ts";


type activeNodes = {
  // clicked是input节点要表明是否被点击了
  // active是所有节点维护的代表当前节点导通，即输出为1
  [id: string]: { clicked: boolean, type: string, active: boolean };
}
type activeEdge = {
  id: string
}
type activeNodesAndEdgesIds = {
  activeNodes:activeNodes
  activeEdge:activeEdge
}

const containerRef = ref(); // 画布容器引用
const simulationActive = ref(false); // 仿真按钮的状态
const inputActive = ref(false); // 输入是否被点击
const edgeStatus = ref(0); // 连线的状态

const activeNodesAndEdgesIds = ref<activeNodesAndEdgesIds>({
  activeNodes: {},
  activeEdge: { id: '' },
});//需要点亮的节点和边的id合集

const dndData = ref([
  {
    group: "基本逻辑门",
    items: [
      { id: '1', type: 'AndGate', label: '与门', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzdmdDYW52YXMiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PHJlY3QgeD0iMzAiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyOSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI4IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjciIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNiIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI2IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjYiIHk9IjE5IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNSIgeT0iMTYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI0IiB5PSIxNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjMiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMiIgeT0iMTMiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIxIiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjAiIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOSIgeT0iMTIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTciIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNiIgeT0iMTIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMTMiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI1IiB5PSIyMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjQiIHk9IjIxIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMyIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIyIiB5PSIyMyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjEiIHk9IjI0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMCIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE5IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjI0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTYiIHk9IjI0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNyIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE0IiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjE1IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMTYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE0IiB5PSIxOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE0IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMyIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjEyIiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTEiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMCIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjkiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSI4IiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTMiIHk9IjIyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMiIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjExIiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTAiIHk9IjIyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSI5IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iOCIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMzUiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMCIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIzNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PC9zdmc+' },
      { id: '2', type: 'AndGate', label: '或门', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzdmdDYW52YXMiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PHJlY3QgeD0iMzAiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyOSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI4IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjciIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNiIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI2IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjYiIHk9IjE5IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNSIgeT0iMTYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI0IiB5PSIxNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjMiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMiIgeT0iMTMiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIxIiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjUiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNCIgeT0iMjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIzIiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjIiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIwIiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTkiIHk9IjI0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE3IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTYiIHk9IjI0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE0IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjAiIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMTIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTYiIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNyIgeT0iMTIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTkiIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNiIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjEzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNiIgeT0iMTUiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE3IiB5PSIxNiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTciIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNiIgeT0iMjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTQiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNSIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE0IiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTMiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMSIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjEyIiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTAiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSI5IiB5PSIxNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iOCIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE0IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTMiIHk9IjIyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMiIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjExIiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTAiIHk9IjIyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSI5IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iOCIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIzNSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIzNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMCIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE5IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTciIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNyIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE3IiB5PSIxOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjIiIHk9IjEyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIzMSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjwvc3ZnPg==' },
      { id: '3', type: 'AndGate', label: '非门', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzdmdDYW52YXMiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PHJlY3QgeD0iMTgiIHk9IjExIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxMyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMTUiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxNiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNyIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTYiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjEzIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTIiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOSIgeT0iMTEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIwIiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjEiIHk9IjEzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMiIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE5IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjAiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMSIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIyIiB5PSIyMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjMiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNCIgeT0iMTkiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIzIiB5PSIxNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjQiIHk9IjE2IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNSIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI1IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjYiIHk9IjE2IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNyIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI3IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjYiIHk9IjE5IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjEwIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjgiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyOSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjMwIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMzEiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyOCIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjMwIiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjkiIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIzMSIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjMyIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PC9zdmc+' },
      { id: '4', type: 'rect', label: '矩形', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzdmdDYW52YXMiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PHJlY3QgeD0iMTgiIHk9IjExIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxMyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjE0IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMTUiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxNiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNyIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIxOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE4IiB5PSIyMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTgiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOCIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE1IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTYiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxNCIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjEzIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMTIiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxOSIgeT0iMTEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIwIiB5PSIxMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjEiIHk9IjEzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMiIgeT0iMTQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjE5IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjAiIHk9IjIzIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyMSIgeT0iMjIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIyIiB5PSIyMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjMiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNCIgeT0iMTkiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjIzIiB5PSIxNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjQiIHk9IjE2IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNSIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI1IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjYiIHk9IjE2IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyNyIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjI3IiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjYiIHk9IjE5IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIxMSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjEwIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjgiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyOSIgeT0iMTgiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjMwIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMzEiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJibHVlIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIyOCIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjMwIiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PHJlY3QgeD0iMjkiIHk9IjE3IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48cmVjdCB4PSIzMSIgeT0iMTciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxyZWN0IHg9IjMyIiB5PSIxOCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iYmx1ZSIgc3Ryb2tlPSJub25lIi8+PC9zdmc+' },
    ]
  },
  {
    group: "输入输出",
    items: [
      { id: '1', type: 'Input', label: '输入', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHQ9IjE3MzEzMjAwODYxNDIiIGNsYXNzPSJpY29uIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHAtaWQ9Ijc1MTciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTMxLjQ0NTIzNiAyOC4xNDkzMzV2OTYxLjEwOTUyOEg5OTIuNTU0NzY0VjI4LjE0OTMzNUgzMS40NDUyMzZ6TTkyMy43NDY4MDggOTIwLjQ1MDkwN0gxMDAuMjUzMTkyVjk2Ljk1NzI5MTAxSDkyMy43NDY4MDh2ODIzLjQ5MzYxNTk5eiIgZmlsbD0iIzA2MzBmMiIgcC1pZD0iNzUxOCIvPjxwYXRoIGQ9Ik01MTIgODkyLjc0NTE0MTE1YzIwNy41MDQ3MzMzIDAgMzc2LjMyMzM3MTIzLTE2OC44MTg2Mzc5NCAzNzYuMzIzMzcxMjMtMzc2LjMyMzM3MTIzIDAtMjA3LjUwNDczMzMtMTY4LjgxODYzNzk0LTM3Ni4zMjMzNzEyMy0zNzYuMzIzMzcxMjMtMzc2LjMyMzM3MTIzLTIwNy41MDQ3MzMzIDAtMzc2LjMyMzM3MTIzIDE2OC44MTY2ODA5Ni0zNzYuMzIzMzcxMjMgMzc2LjMyMzM3MTIzQzEzNS42NzY2Mjg3NyA3MjMuOTI2NTAzMjIgMzA0LjQ5NTI2NjcgODkyLjc0NTE0MTE1IDUxMiA4OTIuNzQ1MTQxMTV6IG0wLTY3NC4zNTg1NzkyYzE2NC4zMzY2NCAwIDI5OC4wMzUyMDc5NyAxMzMuNjk4NTY3OTcgMjk4LjAzNTIwNzk3IDI5OC4wMzUyMDc5N1M2NzYuMzM2NjQgODE0LjQ1Njk3Nzg5IDUxMiA4MTQuNDU2OTc3ODlzLTI5OC4wMzUyMDc5Ny0xMzMuNjk4NTY3OTctMjk4LjAzNTIwNzk3LTI5OC4wMzUyMDc5NyAxMzMuNjk4NTY3OTctMjk4LjAzNTIwNzk3IDI5OC4wMzUyMDc5Ny0yOTguMDM1MjA3OTd6IiBmaWxsPSIjMDYzMGYyIiBwLWlkPSI3NTE5Ii8+PC9zdmc+' },
      { id: '2', type: 'Output', label: '输出', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHQ9IjE3MzEzMTk4MTY5OTAiIGNsYXNzPSJpY29uIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHAtaWQ9IjE4ODgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTUxMiA5NjBjLTI0Ny4wNCAwLTQ0OC0yMDAuOTYtNDQ4LTQ0OFMyNjQuOTYgNjQgNTEyIDY0czQ0OCAyMDAuOTYgNDQ4IDQ0OC0yMDAuOTYgNDQ4LTQ0OCA0NDh6TTUxMiAxMjhjLTIxMS43NDI3MiAwLTM4NCAxNzIuMjU3MjgtMzg0IDM4NHMxNzIuMjU3MjggMzg0IDM4NCAzODQgMzg0LTE3Mi4yNTcyOCAzODQtMzg0LTE3Mi4yNTcyOC0zODQtMzg0LTM4NHoiIGZpbGw9IiMwNjMwZjIiIHAtaWQ9IjE4ODkiLz48cGF0aCBkPSJNNTE0LjU2IDgyOS40NGMtMTc1LjA0MjU2IDAtMzE3LjQ0LTE0Mi4zOTc0NC0zMTcuNDQtMzE3LjQ0czE0Mi4zOTc0NC0zMTcuNDQgMzE3LjQ0LTMxNy40NCAzMTcuNDQgMTQyLjM5NzQ0IDMxNy40NCAzMTcuNDQtMTQyLjM5NzQ0IDMxNy40NC0zMTcuNDQgMzE3LjQ0eiBtMC01ODkuNTMyMTZjLTE1MC4wMzY0OCAwLTI3Mi4wOTIxNiAxMjIuMDU1NjgtMjcyLjA5MjE2IDI3Mi4wOTIxNnMxMjIuMDU1NjggMjcyLjA5MjE2IDI3Mi4wOTIxNiAyNzIuMDkyMTZjMTUwLjA0MTYgMCAyNzIuMDkyMTYtMTIyLjA1NTY4IDI3Mi4wOTIxNi0yNzIuMDkyMTZTNjY0LjYwMTYgMjM5LjkwNzg0IDUxNC41NiAyMzkuOTA3ODR6IiBmaWxsPSIjMDYzMGYyIiBwLWlkPSIxODkwIi8+PC9zdmc+', }
    ]
  },
  {
    group: "触发器",
    items: [
      { id: '2', type: 'Input', label: '输入', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==' },
      { id: '3', type: 'Output', label: '输出', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=' },
    ]
  },
  {
    group: "存储器",
    items: [
      { id: '2', type: 'Input', label: '输入', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==' },
      { id: '3', type: 'Output', label: '输出', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=' },
    ]
  },
  {
    group: "运算器",
    items: [
      { id: '2', type: 'Input', label: '输入', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==' },
      { id: '3', type: 'Output', label: '输出', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=' },
    ]
  }
]) // 菜单列表

// Mounted钩子
onMounted(() => {
  // 1.LogicFlow初始化
  let lf = lfInit()

  // 2.注册节点
  lf = registerNodes(lf, [AndGate, Input, Output])

  // 3.设置插件
  lf = setPlugins(lf);

  // 4.监听连线和节点事件
  lf = onEdgeConnected(lf);
  lf = onNodeClick(lf);

  // 5.渲染lf
  renderLF(lf);
})

// LogicFlow初始化
const lfInit = () => {
  // 创建容器
  const lf = new LogicFlow({
    container: containerRef.value,
    grid: true, // 使用网格
    stopMoveGraph: true, // 画布不允许移动
    plugins: [DndPanelVue, Control, SelectionSelect, MiniMap],
    keyboard: {
      enabled: true, // 开启快捷键
    }
  });

  // 设置连线箭头
  lf.setTheme({
    arrow: {
      offset: 0,
      verticalLength: 0,
    },
  });

  // 连线为曲线
  lf.register({
    type: 'bezier',
    model: BezierEdgeModel,
    view: BezierEdge
  });
  lf.setDefaultEdgeType('bezier');

  // 修改对齐辅助线样式
  lf.setTheme({
    snapline: {
      stroke: '#1E90FF', // 对齐线颜色
      strokeWidth: 1, // 对齐线宽度
    },
  })

  return lf;
}

// 注册节点
const registerNodes = (lf: LogicFlow, nodes: any[]) => {
  nodes.forEach((item) => {
    lf.register(item);
  })
  return lf
}

// 设置插件
const setPlugins = (lf: LogicFlow) => {
  // 设置拖拽插件dndPanelVue
  lf = setDndPanelVuePlugin(lf)

  // 设置控制面板插件Control
  lf = setControlPlugin(lf)
  return lf;
}

// 设置拖拽插件dndPanelVue
const setDndPanelVuePlugin = (lf: LogicFlow) => {
  lf.extension.dndPanelVue.setPatternItems(dndData.value)
  return lf;
}

// 设置控制面板插件Control
const setControlPlugin = (lf: LogicFlow) => {
  // 添加仿真按钮
  lf.extension.control.addItem({
    key: 'simulation',
    // TODO: 现在切换还没实现
    iconClass: simulationActive.value ? "fa fa-pause" : "fa fa-play", // 在html引入了font样式
    text: "仿真",
    /* @ts-ignore */
    onClick: (lf: LogicFlow, ev: any) => {
      // 切换状态
      simulationActive.value = !simulationActive.value;
      // 获取所有节点
      lf = lf.lf; // bug-#IB3T6D : https://gitee.com/lonelyzoom/online-logisim/issues/IB3T6D
      const nodes = lf.graphModel.nodes;

      // 遍历所有节点，并更新每个节点的status属性
      // simulation代表处于仿真状态
      // normal代表处于一般状态
      // 此处更改会导致对应节点的getShape处改变节点形状
      nodes.forEach((node: { id: any; }) => {
        lf.setProperties(node.id, {
          status: simulationActive.value ? 'simulation' : 'normal',
        });
      });
    },
  })
  // 添加导航按钮
  lf.extension.control.addItem({
    key: 'guide',
    iconClass: "fa fa-eye",
    title: "导航",
    text: "导航",
    /* @ts-ignore */
    onClick: (lf: any, ev: any) => {
      // 指定小地图显示在特定位置
      lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320);
    }
  })
  // 移除适应/上一步/下一步按钮
  lf.extension.control.removeItem('reset')
  lf.extension.control.removeItem('undo')
  lf.extension.control.removeItem('redo')
  return lf;
}

// 监听边的创建事件
const onEdgeConnected = (lf: LogicFlow) => {
  // TODO: 确定连接点之间是否允许连接
  lf.on("edge:add", (edge) => {
    const { id } = edge.data
    // console.log(id, sourceNodeId, targetNodeId )
    updateEdgeByid(lf,id)
  })
  return lf;
}

// 渲染lf
const renderLF = (lf: LogicFlow) => {
  lf.render({
    nodes: [],
    edges: [],
  });

  // MiniMap.show()必须在lf.render()后调用。
  lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320)
}

// 处理节点点击
// 第一次点input节点，进入handleNodeClick
// 遍历所有节点依次处理
    // input节点：active在亮时true 暗时false
    // output节点：根据前一节点的active状态决定自身active状态
    // andGate节点: 根据前一节点的active状态决定自身active状态
// 处理节点点击
const handleNodeClick = (lf: LogicFlow, clickId: string) => {
  // TODO: 在处理节点前需要先理清节点处理顺序，因为后节点依赖于前节点的active
  // 因为Output节点的结果依赖于前面节点的active状态，所以需要后处理它们
  // 收集所有节点的类型和 ID
  const nodesToProcess = lf.graphModel.nodes.map(node => ({ id: node.id, type: node.type }));

  // 处理 Input 类型的节点
  nodesToProcess.forEach(node => {
    if (node.type === 'Input') {
      handleNodeBasedOnType(lf, node, clickId);
    }
  });

  // 处理非 Output 类型的节点
  nodesToProcess.forEach(node => {
    if (node.type !== 'Output' && node.type !== 'Input') {
      handleNodeBasedOnType(lf, node, clickId);
    }
  });

  // 处理 Output 类型的节点
  nodesToProcess.forEach(node => {
    if (node.type === 'Output') {
      handleNodeBasedOnType(lf, node, '');
    }
  });
};

// 根据节点类型处理节点
const handleNodeBasedOnType = (lf: LogicFlow, node: any, clickId:string) => {
  switch (node.type) {
    case 'Input':
      handleInputNode(lf, node.id, clickId);
      break;
    case 'Output':
      handleOutputNode(lf, node.id);
      break;
    case 'AndGate':
      handleAndGateNode(lf, node);
      break;
    default:
      console.log('未处理的节点类型');
  }
};

// 处理input类型节点
const handleInputNode = (lf: LogicFlow, nodeId: string, clickId: string) => {
  // 创建一个临时对象来记录本次点击事件中已处理的节点ID
  const processedNodes = new Set();
  // 检查节点ID是否与被点击的节点ID相同
  if (nodeId === clickId && !processedNodes.has(clickId)) {
        // 标记该节点已经被处理
        processedNodes.add(clickId);
        // 获取当前节点的状态，如果节点不存在，则默认 clicked 为 false
        const currentNode = activeNodesAndEdgesIds.value.activeNodes[clickId] || { clicked: false, type:'Input', active: false };
        const clicked = !currentNode.clicked;

        // 更新 LogicFlow 中的节点属性
        updateNodeById(lf,clickId,clicked)
        
        // 更新节点状态
        activeNodesAndEdgesIds.value.activeNodes[clickId] = { clicked, type:'Input', active:clicked };
  }
};

// 更新 LogicFlow 中的节点属性
const updateNodeById = (lf:LogicFlow, clickId: string, status: boolean) => {
  lf.setProperties(clickId, {
    clicked: status
  });
}

// 处理Output类型节点
const handleOutputNode = (lf: LogicFlow, nodeId: string) => {
  // 1.获得output节点的id
  // 2.获得output节点的前一个节点的id
  // 3.获得前一节点的active状态
  // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理

  // 遍历所有边，找到与当前Output节点相连的边
  lf.graphModel.edges.forEach(edge => {
    if (edge.targetNodeId === nodeId) {
          // 获得前一节点的active状态
          const previousNodeActiveState = activeNodesAndEdgesIds.value.activeNodes[edge.sourceNodeId];
          // console.log(activeNodesAndEdgesIds.value.activeNodes)
          // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理
          if (previousNodeActiveState && previousNodeActiveState.active) {
            // 将自身节点存到activeNodesAndEdgesIds
            activeNodesAndEdgesIds.value.activeNodes[nodeId] = { clicked:false, type:'Output', active:true };
            lf.setProperties(nodeId, {
              clicked: true
            });
          } else {
            // 将自身节点存到activeNodesAndEdgesIds
            activeNodesAndEdgesIds.value.activeNodes[nodeId] = { clicked:false, type:'Output', active:false };
            lf.setProperties(nodeId, {
              clicked: false
            });
          }
        }
  })
};

// 处理AndGate类型节点
const handleAndGateNode = (lf: LogicFlow, node: BaseNodeModel) => {
  // 获取当前节点的所有锚点
  const anchors = lf.getNodeModelById(node.id).getDefaultAnchor();
  
  // 定义锚点 ID
  const topAnchorId = anchors[0].id; // 假设第一个锚点是顶部锚点
  const bottomAnchorId = anchors[1].id; // 假设第二个锚点是底部锚点

  // 初始化变量来存储前一个节点的 active 状态
  let firstAnchorActive = false;
  let secondAnchorActive = false;

  // 遍历所有边，找到与当前节点锚点相连的边
  lf.graphModel.edges.forEach(edge => {
    if (edge.targetAnchorId === topAnchorId) {
      // 根据边的 sourceNodeId 找到前一个节点的 active 状态
      const sourceNodeId = edge.sourceNodeId;
      const sourceNodeActiveState = activeNodesAndEdgesIds.value.activeNodes[sourceNodeId];
      if (sourceNodeActiveState) { // 检查 sourceNodeActiveState 是否存在
        firstAnchorActive = sourceNodeActiveState.active;
      }
    } else if (edge.targetAnchorId === bottomAnchorId) {
      // 根据边的 sourceNodeId 找到前一个节点的 active 状态
      const sourceNodeId = edge.sourceNodeId;
      const sourceNodeActiveState = activeNodesAndEdgesIds.value.activeNodes[sourceNodeId];
      if (sourceNodeActiveState) { // 检查 sourceNodeActiveState 是否存在
        secondAnchorActive = sourceNodeActiveState.active;
      }
    }
  });

  // 判断两个输入节点的 active 状态
  const andGateActive = firstAnchorActive && secondAnchorActive;
  // 更新当前节点的 active 状态
  activeNodesAndEdgesIds.value.activeNodes[node.id] = {
    clicked: false,
    type: 'AndGate',
    active: andGateActive
  };
  // 更新 LogicFlow 中的节点属性
  lf.setProperties(node.id, {
    clicked: andGateActive
  });
};

// 点亮线
const updateEdgeByid = (lf: LogicFlow,edgeId:string) => {
  lf.updateAttributes(edgeId,{
          style:{
            stroke: 'green'
          }
  })
  return lf;
}

// 监听节点点击
const onNodeClick = (lf: LogicFlow) => {
  lf.on('node:click', (node) => {
    const { id, type, properties } = node.data;
    // 是否是仿真状态下点击
    if(properties.status === 'simulation'){
      // 被点击的节点是否是输入节点
      if(type === "Input"){
        debugger
        handleNodeClick(lf,id);
      }
    }
  })
  return lf;
}
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

import { Ref, ref } from "vue";
import LogicFlow from "@logicflow/core/types/LogicFlow";
import BaseNodeModel from "@logicflow/core/types/model/node/BaseNodeModel";
import { ActiveNodes } from "./types";
import { sortNodes } from "./util/sortNodes";
import { handlers } from "../constant";

export let activeNodes: Ref<ActiveNodes> = ref<ActiveNodes>({})

// 根据节点类型处理节点：采用表结构命中而非switch判断
const handleNodeBasedOnType = (lf: LogicFlow, node: BaseNodeModel, activeNodes: Ref<ActiveNodes>, clickId?: string, ) => {
  const handler = handlers[node.type];
  if (handler) {
    return handler(lf, node, activeNodes, clickId);
  } else {
    console.log('未处理的节点类型');
    return activeNodes; // 或者根据需要返回其他值
  }
};

// 处理节点点击
export const handleNodeClick = (lf: LogicFlow, clickId: string, isInitialProcessing:boolean = false) => {
  // 判断节点的锚点是否都连上了节点
  
  // 对树结构进行节点排序
  const { sortedKey, sortedNodesData } = sortNodes(lf)
  // 0 : ['5', '4', '3', '1']
  // 1 : ['4', '3', '1']

  // issue#1 : https://github.com/gaoyakang/online_logisim/issues/1
  // 如果是初次处理，先处理clock节点
  if (isInitialProcessing) {
    for(let i=0;i<sortedKey.length;i++){
      sortedNodesData[i][Number(sortedKey[i][0])].forEach((nodeId: string) => {
        const node = lf.graphModel.getNodeModelById(nodeId);
        if (node.type === 'Clock') {
          // 处理clock节点
          handleNodeBasedOnType(lf, node, activeNodes, clickId);
        }
      });
    }
  }

  // 处理其他节点
  for(let i=0;i<sortedKey.length;i++){
    for(let j=0;j<sortedKey[i].length;j++){
      sortedNodesData[i][Number(sortedKey[i][j])].forEach((nodeId: string) => {
        const node = lf.graphModel.getNodeModelById(nodeId);
        if (node.type !== 'Clock' || isInitialProcessing) {
          handleNodeBasedOnType(lf, node, activeNodes, clickId);
        }
      });
    }
  }

  // issue#2 : https://github.com/gaoyakang/online_logisim/issues/2
  // 在每次点击事件开始时重置所有节点的processedInCurrentRound标志
  // 这样下次节点点击来时不会被影响到更新
  Object.keys(activeNodes.value).forEach((id) => {
    activeNodes.value[id].processedInCurrentRound = false;
  });

  return lf;
};

// 监听节点点击
const onNodeClick = (lf: LogicFlow) => {
  lf.on('node:click', (node) => {
    const { id, type, properties } = node.data;
    // 是否是仿真状态下点击
    if(properties.status === 'simulation'){
      // 被点击的节点是否是输入节点
      if(type === "Input"){
        // debugger
        handleNodeClick(lf,id);
      }
    }
  })
  return lf;
}

export { onNodeClick }
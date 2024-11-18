import { Ref } from 'vue'
import { updateNodeById } from "./updateNodeById.ts";
import LogicFlow from "@logicflow/core/types/LogicFlow";
import { ActiveNodes } from './types/index.ts';

// 处理input类型节点
const handleInputNode = (lf: LogicFlow, nodeId: string, clickId: string, activeNodes: Ref<ActiveNodes>) => {
    // 检查节点是否已经在当前轮次被处理过
    if (activeNodes.value[nodeId]?.processedInCurrentRound) {
      return activeNodes;
    }
    // 创建一个临时对象来记录本次点击事件中已处理的节点ID
    const processedNodes = new Set();
    // 检查节点ID是否与被点击的节点ID相同
    if (nodeId === clickId && !processedNodes.has(clickId)) {
          // 标记该节点已经被处理
          processedNodes.add(clickId);
          // 获取当前节点的状态，如果节点不存在，则默认 clicked 为 false
          const currentNode = activeNodes.value[clickId] || { clicked: false, type:'Input', active: false };
          const clicked = !currentNode.clicked;
  
          // 更新 LogicFlow 中的节点属性
          updateNodeById(lf,clickId,clicked)
          
          // 更新节点状态
          activeNodes.value[clickId] = { clicked, type:'Input', active:clicked, processedInCurrentRound: true };
    }else{
      // 未点击的节点暂时不需要处理，给默认值即可
      if(!activeNodes.value[nodeId]){
        activeNodes.value[nodeId] = { clicked: false, type:'Input', active:false };
      }
    }
    return activeNodes;
  };
  
  export { handleInputNode }
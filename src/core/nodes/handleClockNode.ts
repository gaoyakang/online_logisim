import LogicFlow from "@logicflow/core";
import { ActiveNodes, handleNodeClick } from "./index.ts";
import { Ref } from 'vue'

// 处理clock类型节点：目前仅支持1个clock源
const handleClockNode = (lf: LogicFlow, node: any, activeNodes: Ref<ActiveNodes>) => {
    // 首次处理clock
    if(!activeNodes.value[node.id]){
        activeNodes.value[node.id] = { clicked: false, type:'Clock', active:false }
        handleNodeClick(lf,'')
    }else{
        // 再次处理
        // 每隔一秒更新一次节点
        setInterval(() => {
            activeNodes.value[node.id].active = !activeNodes.value[node.id].active;
            handleNodeClick(lf,'')
        },1000)
    }
    return activeNodes;
  };
  
  export { handleClockNode }
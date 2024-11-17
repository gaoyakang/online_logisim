import LogicFlow from "@logicflow/core/types/LogicFlow";
import { ActiveNodes, handleNodeClick } from "./index.ts";
import { Ref } from 'vue'

// 处理clock类型节点：目前仅支持1个clock源
type Timeout = /*unresolved*/ any
const handleClockNode = (lf: LogicFlow, node: any, activeNodes: Ref<ActiveNodes>) => {
    // 首次处理clock
    if (!activeNodes.value[node.id]) {
        activeNodes.value[node.id] = { clicked: false, type: 'Clock', active: false };
    } else {
        // 再次处理
        // 每隔一秒更新一次节点
        clearInterval(activeNodes.value[node.id].timer); // 清除之前的定时器
        const timer: Timeout = setInterval(() => {
        activeNodes.value[node.id].active = !activeNodes.value[node.id].active;
        handleNodeClick(lf, '', false); // 周期性处理时，不作为初次处理
        }, 1000);
        activeNodes.value[node.id].timer = timer; // 保存定时器引用
    }
    return activeNodes;
  };
  
  export { handleClockNode }
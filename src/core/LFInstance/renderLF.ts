import LogicFlow from "@logicflow/core/types/LogicFlow";
import { Ref } from "vue";
import {  activeNodes } from "../nodes";
import { restoreFromLocalStorage, restoreActiveNodesData } from "../nodes/util/storageNodes";


const renderLF = (lf: LogicFlow, containerRef: Ref<any, any>) => {
  // 恢复节点数据
  let nodes,edges:any[];
  const restoreData = restoreFromLocalStorage() || {nodes:[],edges:[]};
  nodes = restoreData.nodes
  edges = restoreData.edges
  activeNodes.value = restoreActiveNodesData()
  lf.render({
    nodes,
    edges,
  });
  
  // MiniMap.show()必须在lf.render()后调用。
  lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320)
}

  export { renderLF }
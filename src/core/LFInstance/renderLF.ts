import LogicFlow from "@logicflow/core/types/LogicFlow";
import { Ref } from "vue";
import { activeNodes } from "../nodes";
import {
  restoreFromLocalStorage,
  restoreActiveNodesData,
} from "../nodes/util/storageNodes";
import { PresetGraph } from "../../presets/type";

const renderLF = (
  lf: LogicFlow,
  containerRef: Ref<any, any>,
  initData: PresetGraph
) => {
  let nodes, edges: any[];
  // 预设电路
  if (initData && initData.nodes && initData.edges) {
    nodes = initData.nodes;
    edges = initData.edges;
  } else {
    // 恢复普通电路节点数据
    const restoreData = restoreFromLocalStorage() || { nodes: [], edges: [] };
    nodes = restoreData.nodes;
    edges = restoreData.edges;
    activeNodes.value = restoreActiveNodesData();
  }
  lf.render({
    nodes,
    edges,
  });

  // MiniMap.show()必须在lf.render()后调用。
  lf.extension.miniMap.show(
    containerRef.value.offsetWidth - 170,
    containerRef.value.offsetHeight - 320
  );
};

export { renderLF };

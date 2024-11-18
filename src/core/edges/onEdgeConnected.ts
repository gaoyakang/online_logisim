import LogicFlow from "@logicflow/core/types/LogicFlow";
import { updateEdgeById } from "./updateEdgeById";

// 监听边的创建事件
const onEdgeConnected = (lf: LogicFlow) => {
  // TODO: 确定连接点之间是否允许连接，调整连线控制线
  lf.on("edge:add", (edge) => {
    const { id } = edge.data
    updateEdgeById(lf,id)
  })
  return lf;
}

export { onEdgeConnected }
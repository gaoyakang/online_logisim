import LogicFlow from "@logicflow/core/types/LogicFlow";
import { updateEdgeById } from "./updateEdgeById";

// 监听边的创建事件
const onEdgeConnected = (lf: LogicFlow) => {
  lf.on("edge:add", (edge) => {
    const { id } = edge.data
    updateEdgeById(lf,id)
    // TODO: 调节连线样式
    // adjustEdge(lf, id);
  })
  return lf;
}

export { onEdgeConnected }

// const adjustEdge = (lf:LogicFlow, id:string) => {
  
  // const edge = lf.graphModel.getEdgeModelById(id)
  // 节点起点(x1,y1)
  // const sourceNodeX = edge?.sourceNode.x as number 
  // const sourceNodeY = edge?.sourceNode.y as number
  // // 节点终点(x2,y2)
  // const targetNodeX = edge?.targetNode.x as number
  // const targetNodeY = edge?.targetNode.y as number

  // x1 > x2 y1 > y2 目标节点在开始节点左上：从起点开始，先右一半距离，再上y距离，最后到终点
  // x1 > x2 y1 < y2 目标节点在开始节点左下：从起点开始，先右一半距离，再上y距离，最后到终点
  // x1 < x2 y1 > y2 目标节点在开始节点右上：从起点开始，先右一半距离，再上y距离，最后到终点
  // x1 < x2 y1 < y2 目标节点在开始节点右下：从起点开始，先右一半距离，再下y距离，最后到终点

  // if (edge) {
  //   edge.path = `
  //     M ${edge.startPoint.x} ${edge.startPoint.y}  

  //     L ${edge.startPoint.x + (targetNodeX - sourceNodeX)/2} ${edge.startPoint.y}
  //     L ${edge.startPoint.x + (targetNodeX - sourceNodeX)/2} ${edge.endPoint.y}

  //     ${edge.endPoint.x} ${edge.endPoint.y}`
  // }
// };
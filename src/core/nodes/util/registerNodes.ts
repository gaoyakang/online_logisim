import LogicFlow from "@logicflow/core/types/LogicFlow";
// 注册节点
const registerNodes = (lf: LogicFlow, nodes: any[]) => {
    nodes.forEach((item) => {
        lf.register(item);
    })
    return lf
}

export { registerNodes }
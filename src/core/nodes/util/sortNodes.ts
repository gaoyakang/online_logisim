import LogicFlow from "@logicflow/core/types/LogicFlow";
import { AnchorMap, SortMap, TreeNode } from "../types";
import { simulationActive } from "../../plugins/setPlugins";
import { saveTreeToLocalStorageData } from "./storageNodes";

// 创建树结构
export function buildTree(lf: LogicFlow) {
    
  // 获取所有节点和边的信息
  const { nodes, edges } = lf.graphModel;

  // 每个节点可能有多个锚点，每个锚点的命名为：节点名称-锚点位置-锚点类型(input/output)
  // 每个锚点应该至少有一条连线
  // 遍历nodes将每个node的锚点保存成{ nodeid: [nodeanchorid1,nodeanchorid2,...] }
  // 接着将每个节点的锚点nodeanchorid取出来，当nodeanchorid的锚点类型是：
  // input时判断edge.targetAnchorId === nodeanchorid，结果是true说明该锚点上有连线，false说明该锚点上没有连线
  // output时判断edge.sourceAnchorId === nodeanchorid，结果是true说明该锚点上有连线，false说明该锚点上没有连线
  // 只要发现一个false就抛出错误：console.error("电路中有未连接的节点")
  // 将每个节点的锚点保存成 { nodeid: [nodeanchorid1, nodeanchorid2, ...] } 的结构

  // 1.将每个节点的锚点保存成 { nodeid: [nodeanchorid1, nodeanchorid2, ...] } 的结构
  const nodeAnchors: AnchorMap = nodes.reduce((acc, node) => {
    const anchorArr: string[] = [];
    for (let i = 0; i < node.anchors.length; i++) {
      anchorArr.push(node.anchors[i].id as string);
    }
    acc[node.id] = anchorArr;
    return acc;
  }, {} as AnchorMap);
  
  // console.log(`nodeAnchors：${nodeAnchors}`)
  // 2.检查每个锚点是否有连线
  // issue#4: https://github.com/gaoyakang/online_logisim/issues/4
  for (const node of nodes) {
    const nodeAnchorIds = nodeAnchors[node.id] || [];
    for (const anchorId of nodeAnchorIds) {
      const isInput = anchorId.endsWith('-input');
      const isOutput = anchorId.endsWith('-output');
      let hasConnection = false;
  
      for (const edge of edges) {
        if (isInput && edge.targetAnchorId === anchorId && edge.targetNodeId === node.id) {
          hasConnection = true;
          break;
        } else if (isOutput && edge.sourceAnchorId === anchorId && edge.sourceNodeId === node.id) {
          hasConnection = true;
          break;
        }
      }
  
      if (!hasConnection) {
        // 重置 simulation 状态
        simulationActive.value = false;
        // 弹窗提醒
        alert("电路中有未连接的节点");
        throw new Error("电路中有未连接的节点"); // 抛出异常以立即停止所有操作
      }
    }
  }
  
  // 定义一个辅助函数，用于递归构建子树
  const buildSubTree = (nodeId: string, level: number): TreeNode => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      return { id: nodeId, type: 'Output', children: [], sort: level, x: 0, y: 0 };
    }

    const children = edges
      .filter(edge => edge.targetNodeId === nodeId) // 找到所有指向当前节点的边
      .map(edge => buildSubTree(edge.sourceNodeId, level + 1)) // 递归构建每个子节点的子树，并增加层级
      .flat(); // 将子数组平铺为一个数组

    // 为当前节点添加 sort 属性
    return { id: node.id, type: node.type, sort: level, x: node.x, y: node.y, children };
  };

  // 返回包含整个树的根节点
  // output节点应该是树顶节点
  const outputNodes = nodes.filter(node => node.type === 'Output');

  const treeNode = outputNodes.map(outputNode => ({
    id: outputNode.id,
    type: 'Output',
    x: outputNode.x, // 添加 x 位置
    y: outputNode.y, // 添加 y 位置
    sort: 1, // 最顶层的节点 sort 为 1
    children: buildSubTree(outputNode.id, 2).children // 从第二层开始构建子树
  }));

  return {
    lf,
    treeNode,
    edges
  };
}

// 从根节点数组开始遍历树
function groupNodesBySort(roots: TreeNode[]): SortMap {
    const sortMap: SortMap = {};
    traverseAndGroup(roots, sortMap);
    return sortMap;
}

  // 遍历树并按sort值分组节点id
function traverseAndGroup(nodes: TreeNode[], sortMap: SortMap): SortMap {
    nodes.forEach(node => {
      // 添加当前节点的id到对应的sort分组
      const idsForSort = sortMap[node.sort] || (sortMap[node.sort] = []);
      // issue#2 : https://github.com/gaoyakang/online_logisim/issues/2
      if (!idsForSort.includes(node.id)) {
        idsForSort.push(node.id);
      }
  
      // 递归遍历子节点
      traverseAndGroup(node.children, sortMap);
    });
    
    // 将Set转换为数组
    for (const key in sortMap) {
      sortMap[key] = Array.from(sortMap[key]);
    }
    return sortMap;
}
  
// 节点排序
function sortNodes(lf: LogicFlow) {
    // 1.在处理节点前需要先理清节点处理顺序，因为后节点依赖于前节点的active,
    // 因此构建树状结构来表示其层级
    const treeData = buildTree(lf);
    // 保存节点数据
    saveTreeToLocalStorageData(treeData)
    lf = treeData.lf
    const trees = treeData.treeNode;

    // 2.然后自底向上处理节点
    // groupNodesBySort会遍历treeNode将sort指相等的节点存在：{sort1:[id1,id2,...],sort2:[id3,id4,...]}
    let sortedNodesData = [];
    let sortedKey = [];
    for(let i=0;i<trees.length;i++){
      sortedNodesData.push(groupNodesBySort([trees[i]]))
    }
    for(let i=0;i<sortedNodesData.length;i++){
      sortedKey.push(Object.keys(sortedNodesData[i]).sort((a, b) => Number(b) - Number(a)))
    }
    // 对sortedNodesData的key从大到小排序，返回[key1,key2,key3,...]
    // (因为input节点位于treeNode最底层，所以key值最大，要到倒着处理)
    return { sortedKey, sortedNodesData }
}


export { sortNodes }
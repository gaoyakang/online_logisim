import LogicFlow from "@logicflow/core";

// 节点彼此连接关系的树结构类型
interface TreeNode {
    id: string;
    type: string;
    sort: number,
    children: TreeNode[];
  }
  
// 对树结构排序的类型
type SortMap = {
    [sort: number]: string[];
  };

// 创建树结构
function buildTree(lf: LogicFlow) {
    // 获取所有节点和边的信息
    const { nodes, edges } = lf.graphModel;
  
    // 定义一个辅助函数，用于递归构建子树
    const buildSubTree = (nodeId: string, level: number): TreeNode => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) {
        return { id: nodeId, type: 'Output', children: [], sort: level };
      }
  
      const children = edges
        .filter(edge => edge.targetNodeId === nodeId) // 找到所有指向当前节点的边
        .map(edge => buildSubTree(edge.sourceNodeId, level + 1)) // 递归构建每个子节点的子树，并增加层级
        .flat(); // 将子数组平铺为一个数组
  
      // 为当前节点添加 sort 属性
      return { id: node.id, type: node.type, sort: level, children };
    };
  
    // 返回包含整个树的根节点
    // output节点应该是树顶节点
    const outputNodes = nodes.filter(node => node.type === 'Output');
  
    const treeNode = outputNodes.map(outputNode => ({
      id: outputNode.id,
      type: 'Output',
      sort: 1, // 最顶层的节点 sort 为 1
      children: buildSubTree(outputNode.id, 2).children // 从第二层开始构建子树
    }));
  
    return {
      lf,
      treeNode
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
      idsForSort.push(node.id);
  
      // 递归遍历子节点
      traverseAndGroup(node.children, sortMap);
    });
  
    return sortMap;
  }
  

  function sortNodes(lf: LogicFlow) {
    // 1.在处理节点前需要先理清节点处理顺序，因为后节点依赖于前节点的active,
    // 因此构建树状结构来表示其层级
    const treeData = buildTree(lf);
    lf = treeData.lf
    const trees = treeData.treeNode;

    // 2.然后自底向上处理节点
    // groupNodesBySort会遍历treeNode将sort指相等的节点存在：{sort1:[id1,id2,...],sort2:[id3,id4,...]}
    const sortedNodesData = groupNodesBySort(trees)
    // 对sortedNodesData的key从大到小排序，返回[key1,key2,key3,...]
    // (因为input节点位于treeNode最底层，所以key值最大，要到倒着处理)
    const sortedKey = Object.keys(sortedNodesData).sort((a, b) => Number(b) - Number(a))
    return { sortedKey, sortedNodesData }
}

export { sortNodes }
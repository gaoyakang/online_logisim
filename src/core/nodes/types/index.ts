import LogicFlow from "@logicflow/core/types/LogicFlow";
import GraphModel from "@logicflow/core/types/model/GraphModel";
import BaseNodeModel from "@logicflow/core/types/model/node/BaseNodeModel";
import { Point } from "@logicflow/core/types/type";
import { Ref } from "vue";

// 处理clock类型节点：目前仅支持1个clock源
export type Timeout = /*unresolved*/ any

// 需要点亮的节点合集类型
export type ActiveNodes = {
    // clicked是input节点要表明是否被点击了
    // active是所有节点维护的代表当前节点导通，即输出为1
    // timer是为了存储clock节点的定时器
    // processedInCurrentRound是为了处理多棵树上的input是否被重复处理了
    [id: string]: { 
      clicked: boolean, 
      type: string, 
      active: boolean, 
      timer?:Timeout, 
      processedInCurrentRound?: boolean,
    };
}

// 节点彼此连接关系的树结构类型
export interface TreeNode {
  id: string
  type: string
  sort: number
  x: number
  y: number
  children: TreeNode[];
}

// 对树结构排序的类型
export type SortMap = {
  [sort: number]: string[];
};

// 定义锚点对象的类型
export type AnchorMap = { [nodeId: string]: string[] };

// 节点彼此连接关系的树结构类型
export interface EdgeType {
  id: string
  type: string
  startPoint:Point
  endPoint:Point
  pointsList: any[];
  properties:Object
  sourceNodeId: string
  targetNodeId: string
  graphModel?: GraphModel
  sourceAnchorId: string;
  targetAnchorId: string;
}

// control插件类型
export type ControlItem = {
  key: string
  iconClass: string
  title: string
  text: string
  onClick?: (lf: LogicFlow, e: MouseEvent) => void
  onMouseEnter?: (lf: LogicFlow, e: MouseEvent) => void
  onMouseLeave?: (lf: LogicFlow, e: MouseEvent) => void
}

// dnd插件类型
export type ShapeItem = {
  type?: string;
  text?: string;
  icon?: string;
  label?: string;
  className?: string;
  properties?: Record<string, any>;
  callback?: (lf: LogicFlow, container: HTMLElement) => void;
};

export type GroupItem = {
  group: string;
  items?: ShapeItem[];
};

// 不同类型节点处理函数的类型
export type Handler = (lf: LogicFlow, node: BaseNodeModel, activeNodes: Ref<ActiveNodes>, clickId?: string) => Ref<ActiveNodes>;

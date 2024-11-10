// MyNode.ts
import { Node, RectNodeModel, RectNodeView } from "@logicflow/core";

// 自定义节点模型
class MyNodeModel extends RectNodeModel {
  initNodeData(data: any): void {
    super.initNodeData(data);
    this.width = 100; // 设置节点的宽度
    this.height = 50; // 设置节点的高度
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#5F95FF'; // 设置节点边框颜色
    style.fill = '#D9ECFF'; // 设置节点填充颜色
    return style;
  }
}

// 自定义节点视图
class MyNodeView extends RectNodeView {
  getShape() {
    const { model } = this.props;
    const { width, height } = model;
    const style = model.getNodeStyle();

    return {
      shape: 'rect',
      ...style,
      x: -width / 2,
      y: -height / 2,
      width,
      height,
    };
  }
}

// 注册自定义节点
export default {
  type: 'my-node', // 节点类型，必须唯一
  view: MyNodeView,
  model: MyNodeModel,
};
import { h, CircleNode, CircleNodeModel } from "@logicflow/core";

// 节点形状
class OutputView extends CircleNode {
  getShape() {
    // 获取形状属性
    const { model } = this.props;
    const { x, y, radius, properties } = model;

    // 不同模式下的样式
    const normalStyle = {
      stroke: "black", // 圆环的边框颜色
      fill: "none", // 确保圆内部是空的
    };
    const simulationStyle = {
      stroke: "none", // 圆环的边框颜色
      fill: "black", // 确保圆内部是空的
    };
    const currentMode =
      properties.status === "simulation" ? simulationStyle : normalStyle;

    // 计算节点路径
    return h("g", {}, [
      // 节点外圆
      h("circle", {
        cx: x, // 圆心的x坐标
        cy: y, // 圆心的y坐标
        r: radius, // 圆的半径
        stroke: "black", // 圆环的边框颜色
        fill: "none", // 确保圆内部是空的
        "stroke-width": 2, // 圆环的宽度
      }),
      // 节点内圆
      h("circle", {
        cx: x, // 圆心的x坐标
        cy: y, // 圆心的y坐标
        r: 0.7 * radius, // 圆的半径
        stroke: currentMode.stroke, // 圆环的边框颜色
        fill: currentMode.fill, // 确保圆内部是空的
        "stroke-width": 2, // 圆环的宽度
      }),
      // 节点连接点
      h("circle", {
        cx: x - radius, // 圆心的x坐标
        cy: y, // 圆心的y坐标
        r: 3, // 圆的半径
        fill: "orange", // 确保圆内部是空的
      }),
    ]);
  }
}

// 节点数据
class OutputModel extends CircleNodeModel {
  // 节点形状初始化数据
  initNodeData(data: any): void {
    super.initNodeData(data);
    this.radius = 10;
  }

  // 节点样式
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "black";
    return style;
  }

  // 外选框样式
  getOutlineStyle() {
    // 当鼠标悬浮上去时取消显示外选框
    const style = super.getOutlineStyle();
    style.stroke = "none";
    if (style.hover) {
      style.hover.stroke = "none";
    }
    return style;
  }

  // 自定义锚点
  getDefaultAnchor() {
    const anchors = [];
    const { x, y, radius } = this;
    anchors.push({
      x: x - radius, // 锚点在圆的最左侧
      y: y,
      id: "output_left_anchor",
      type: "left",
      direction: "left",
      style: { fill: "orange", r: 3 }, // 设置锚点样式
    });
    return anchors;
  }
}

export default {
  type: "Output",
  view: OutputView,
  model: OutputModel,
};

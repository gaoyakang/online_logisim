import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class ClockView extends RectNode {
  getShape() {
    // 获取形状属性
    const { model } = this.props;
    const { x, y, width, height, } = model;
    // 获取样式属性
    const style = model.getNodeStyle();
    const clockPath = `
          M ${x} ${y + 3*width/4}
          L ${x+5} ${y + 3*width/4}
          L ${x+5} ${y + width/4}
          L ${x+10} ${y + width/4}
          L ${x+10} ${y + 3*width/4}
          L ${x+15} ${y + 3*width/4}
          L ${x+15} ${y + width/4}
          L ${x+20} ${y + width/4}
    `;
    // 计算节点路径
    return h("g", {}, [
      // 节点的外框
      h("rect", {
        ...style,
        x: x,
        y: y,
        width,
        height,
        rx: 0,
        ry: 0,
      }),
      // 方形波线条
      h('path', {
        ...style,
        d: clockPath,
      }),
      // 节点的输出点
      h("circle", {
        cx: x + width, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + height / 2, // 圆心的y坐标与矩形中心的y坐标相同
        r: 3, // 圆的半径，可以根据需要调整
        fill: "orange", // 确保圆内部是空的
      }),
    ]);
  }
}

// 节点数据
class ClockModel extends RectNodeModel {
  // 节点形状初始化数据
  initNodeData(data: any): void {
    super.initNodeData(data);
    this.width = 20;
    this.height = 20;
    this.radius = 5;
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
    const { x, y, width, height } = this;
    return [
      {
        x: x + width, // 锚点在矩形的最右侧
        y: y + height / 2,
        id: "clock-right-output",
        type: "right",
        direction: "right",
        // 设置锚点样式
        style: { fill: "orange", r: 3 },
      },
    ];
  }
}

export default {
  type: "Clock",
  view: ClockView,
  model: ClockModel,
};

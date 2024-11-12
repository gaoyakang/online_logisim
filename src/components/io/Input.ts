import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class InputView extends RectNode {
  getShape() {
    // 获取形状属性
    const { model } = this.props;
    const { x, y, width, height, radius, properties } = model;
    // 获取样式属性
    const style = model.getNodeStyle();

    // 不同模式下的样式
    const normalStyle = {
      stroke: "black", // 圆环的边框颜色
      fill: "none", // 确保圆内部是空的
    };
    const simulationStyle = {
      stroke: "none", // 圆环的边框颜色
      fill: "black", // 确保圆内部是空的
    };
    const clickedStyle = {
      stroke: "none", // 圆环的边框颜色
      fill: "green", // 确保圆内部是空的
    };

    // 确定样式
    let currentMode;
    if((properties.status === "simulation")){
      if(properties.clicked){
        currentMode = clickedStyle;
      }else{
        currentMode = simulationStyle
      }
    }else{
      currentMode = normalStyle;
    }
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
      // 节点的内圆
      h("circle", {
        cx: x + width / 2, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + height / 2, // 圆心的y坐标与矩形中心的y坐标相同
        r: radius, // 圆的半径，可以根据需要调整
        stroke: currentMode.stroke, // 圆环的边框颜色
        fill: currentMode.fill, // 确保圆内部是空的
        "stroke-width": 2, // 圆环的宽度，可以根据需要调整
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
class InputModel extends RectNodeModel {
  // 节点形状初始化数据
  initNodeData(data: any): void {
    super.initNodeData(data);
    this.width = 20;
    this.height = 20;
    this.radius = 5;
    // simulation代表处于仿真状态
    // normal代表处于一般状态
    this.properties.status = "normal";
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
        id: "input_right_anchor",
        type: "right",
        direction: "right",
        // 设置锚点样式
        style: { fill: "orange", r: 3 },
      },
    ];
  }
}

export default {
  type: "Input",
  view: InputView,
  model: InputModel,
};

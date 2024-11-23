import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class RsFlipFlopView extends RectNode {
  getShape() {
    // 获取形状属性
    const { model } = this.props;
    const { x, y, width, height, } = model;
    // 获取样式属性
    const style = model.getNodeStyle();
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
      // 节点文字
      h('text',{
        x: x+5,
        y: y+9,
        'font-size': 12,
        fill: '#333',
      },'s'),
      h('text',{
        x: x+5,
        y: y+18,
        'font-size': 12,
        fill: '#333',
      },'c'),
      h('text',{
        x: x+6,
        y: y+31,
        'font-size': 12,
        fill: '#333',
      },'r'),
      h('text',{
        x: x+width-15,
        y: y+12,
        'font-size': 12,
        fill: '#333',
      },'Q'),
      h('text',{
        x: x+width-16,
        y: y+28,
        'font-size': 12,
        fill: '#333',
      },'一'),
      h('text',{
        x: x+width-15,
        y: y+35,
        'font-size': 12,
        fill: '#333',
      },'Q'),
      // 节点的输入点
      h("circle", {
        cx: x, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + height / 5 - 5, // 圆心的y坐标与矩形中心的y坐标相同
        r: 3, // 圆的半径，可以根据需要调整
        fill: "orange", // 确保圆内部是空的
      }),
      h("circle", {
        cx: x, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + height / 2 - 5, // 圆心的y坐标与矩形中心的y坐标相同
        r: 3, // 圆的半径，可以根据需要调整
        fill: "orange", // 确保圆内部是空的
      }),
      h("circle", {
        cx: x, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + height / 2 + 5, // 圆心的y坐标与矩形中心的y坐标相同
        r: 3, // 圆的半径，可以根据需要调整
        fill: "orange", // 确保圆内部是空的
      }),
      // 节点的输出点
      h("circle", {
        cx: x + width, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + height / 4, // 圆心的y坐标与矩形中心的y坐标相同
        r: 3, // 圆的半径，可以根据需要调整
        fill: "orange", // 确保圆内部是空的
      }),
      h("circle", {
        cx: x + width, // 圆心的x坐标与矩形中心的x坐标相同
        cy: y + 3 * height / 4, // 圆心的y坐标与矩形中心的y坐标相同
        r: 3, // 圆的半径，可以根据需要调整
        fill: "orange", // 确保圆内部是空的
      }),
    ]);
  }
}

// 节点数据
class RsFlipFlopModel extends RectNodeModel {
  // 节点形状初始化数据
  initNodeData(data: any): void {
    super.initNodeData(data);
    this.width = 40;
    this.height = 40;
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
    // 节点的height=40
    // 锚点只能在0-25之间，否则就会失效，目前不知道原因
    return [
        //  左上
        {
            x: x,
            y: y + height / 5 - 5,
            id: "rsFlipFlop-lefttop-input",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        // 左中
        {
            x: x,
            y: y + height / 2 - 5,
            id: "rsFlipFlop-leftmiddle-input",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        // 左下
        {
            x: x,
            // y: y + 4*height / 5,
            y: y + height / 2 + 5,
            id: "rsFlipFlop-leftbottom-input",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        // 右上
        {
            x: x + width,
            y: y + height / 4,
            id: "rsFlipFlop-righttop-output",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        // 右下
        {
            x: x + width,
            y: y + 3 * height / 4,
            id: "rsFlipFlop-rightbottom-output",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
    ];
  }
}

export default {
  type: "RsFlipFlop",
  view: RsFlipFlopView,
  model: RsFlipFlopModel,
};


// dnd-panel-vue.ts
// 对于dnd-panel的改造使得其支持嵌套item展示
import LogicFlow from "@logicflow/core/types/LogicFlow";
import ACollapse from "ant-design-vue/es/collapse";
import ACollapsePanel from "ant-design-vue/es/collapse/CollapsePanel";
import { VNode, createApp, h } from "vue";
import { GroupItem, ShapeItem } from "../core/nodes/types";



class DndPanelVue {
  lf: LogicFlow;
  groupList!: GroupItem[];
  panelEl!: HTMLDivElement;
  static pluginName = "dndPanelVue";
  domContainer!: HTMLElement;
  app: any;
  childrens: any = [];
  private dragging = false;
  private startX = 0;
  private startY = 0;

  constructor(options: { lf: LogicFlow }) {
    this.lf = options.lf;
    this.lf.setPatternItems = (groupList: GroupItem[]) => {
      this.setPatternItems(groupList);
    };
  }

  render(_lf: LogicFlow, domContainer: HTMLElement) {
    this.destroy();
    if (!this.groupList || this.groupList.length === 0) {
      // 首次render后失败后，后续调用setPatternItems支持渲染
      this.domContainer = domContainer;
      return;
    }
    this.panelEl = document.createElement("div");
    this.panelEl.className = "lf-dndpanel";
    this.groupList.forEach((groupItem, index) => {
      // 创建一个折叠面板（Collapse）并将其添加到 DOM 中
      const collapse = this.createCollapse(index, groupItem);
      this.childrens.push(collapse);
    });
    domContainer.appendChild(this.panelEl);
    this.domContainer = domContainer;
    this.app = createApp({
      render: () => h(ACollapse, {
        accordion: true,
      }, {
        default: () => this.childrens,
      }),
    })
    this.app.mount(this.panelEl)
    this.panelEl.addEventListener('mousedown', this.handleMouseDown);
  }

  private handleMouseDown = (e: MouseEvent) => {
    // 检查点击的是否是子节点
    const target = e.target as Element | null;
    if (target && target.closest('.lf-dnd-item')) return;
  
    this.dragging = true;
    this.startX = e.clientX - this.panelEl.offsetLeft;
    this.startY = e.clientY - this.panelEl.offsetTop;
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };
  
  private handleMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;
    this.panelEl.style.left = `${e.clientX - this.startX}px`;
    this.panelEl.style.top = `${e.clientY - this.startY}px`;
  };
  
  private handleMouseUp = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };
  
  destroy() {
    if (
      this.domContainer &&
      this.panelEl &&
      this.domContainer.contains(this.panelEl)
    ) {
      this.domContainer.removeChild(this.panelEl);
    }
  }

  setPatternItems(groupList: GroupItem[]) {
    this.groupList = groupList;
    // 支持渲染后重新设置拖拽面板
    if (this.domContainer) {
      this.render(this.lf, this.domContainer);
    }
  }

  private createDndItem(shapeItem: ShapeItem): VNode {
    return h('div', {
      class: shapeItem.className ? `lf-dnd-item ${shapeItem.className}` : `lf-dnd-item`,
      onmousedown: (e: MouseEvent) => {
        e.stopPropagation();
        if (shapeItem.type) {
          this.lf.dnd.startDrag({
            type: shapeItem.type,
            properties: shapeItem.properties,
            text: shapeItem.text,
          });
        }
        if (shapeItem.callback) {
          shapeItem.callback(this.lf, this.domContainer);
        }
      },
      ondblclick: (e: any) => {
        this.lf.graphModel.eventCenter.emit("dnd:panel-dbclick", {
          e,
          data: shapeItem,
        });
      },
      onclick: (e: any) => {
        this.lf.graphModel.eventCenter.emit("dnd:panel-click", {
          e,
          data: shapeItem,
        });
      },
      oncontextmenu: (e: any) => {
        this.lf.graphModel.eventCenter.emit("dnd:panel-contextmenu", {
          e,
          data: shapeItem,
        });
      },
    }, [
      h('img', {
        class: "lf-dnd-shape",
        props:{
          'src':shapeItem.icon ? `url(${shapeItem.icon})` : ''
        },
        style: {
          'background-image': shapeItem.icon ? `url(${shapeItem.icon})` : ''
        },
      }),
      h('div', {
        class: "lf-dnd-text",
        innerText: shapeItem.label,
      })
    ])
  }

  // 使用ant-design的ACollapsePanel创建 collapse 元素
  private createCollapse(index: number, groupItem: GroupItem): VNode {
    const itemsLength = groupItem.items?.length || 0; // 确保 items 不是 undefined
    return h(ACollapsePanel, {
      key: index,
      header: groupItem.group,
      class: 'collapse-header',
    }, {
      default: () => [
        h('div', { class: itemsLength > 3 ? 'collapse-content' : '' }, 
          groupItem.items?.map((shapeItem) => this.createDndItem(shapeItem))
        )
      ]
    });
  }
}

export { DndPanelVue };
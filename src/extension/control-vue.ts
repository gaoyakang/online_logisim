import LogicFlow from "@logicflow/core/types/LogicFlow"
import { ControlItem } from "../core/nodes/types"

export class Control {
  static pluginName = 'control'

  private readonly lf: LogicFlow
  private controlItems: ControlItem[] = [
    {
      key: 'zoom-out',
      iconClass: 'lf-control-zoomOut',
      title: '缩小流程图',
      text: '缩小',
      onClick: () => {
        this.lf.zoom(false)
      },
    },
    {
      key: 'zoom-in',
      iconClass: 'lf-control-zoomIn',
      title: '放大流程图',
      text: '放大',
      onClick: () => {
        this.lf.zoom(true)
      },
    },
    {
      key: 'reset',
      iconClass: 'lf-control-fit',
      title: '恢复流程原有尺寸',
      text: '适应',
      onClick: () => {
        this.lf.resetZoom()
      },
    },
    {
      key: 'undo',
      iconClass: 'lf-control-undo',
      title: '回到上一步',
      text: '上一步',
      onClick: () => {
        this.lf.undo()
      },
    },
    {
      key: 'redo',
      iconClass: 'lf-control-redo',
      title: '移到下一步',
      text: '下一步',
      onClick: () => {
        this.lf.redo()
      },
    },
  ]
  private domContainer?: HTMLElement
  private toolEl?: HTMLElement

  // 添加拖拽功能
  private dragging = false
  private startX = 0
  private startY = 0

  constructor(lf: LogicFlow) {
    this.lf = lf
  }

  render(_: LogicFlow, domContainer: HTMLElement) {
    this.destroy()
    const toolEl = this.getControlTool()
    this.toolEl = toolEl
    domContainer.appendChild(toolEl)
    this.domContainer = domContainer
    this.initDrag()
  }

  destroy() {
    if (
      this.domContainer &&
      this.toolEl &&
      this.domContainer.contains(this.toolEl)
    ) {
      this.domContainer.removeChild(this.toolEl)
    }
    this.destroyDrag() // 移除拖拽事件
  }

  destroyDrag() {
    const toolEl = this.toolEl
    if (toolEl) {
      toolEl.removeEventListener('mousedown', this.handleMouseDown)
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  initDrag() {
    const toolEl = this.toolEl
    if (toolEl) {
      toolEl.addEventListener('mousedown', this.handleMouseDown)
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    }
  }

  private handleMouseDown = (e: MouseEvent) => {
    // 阻止默认事件
    e.preventDefault()
    this.dragging = true
    this.startX = e.clientX - (this.toolEl!.offsetLeft);
    this.startY = e.clientY - (this.toolEl!.offsetTop); 
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.dragging || !this.toolEl) return;
    let left = e.clientX - this.startX;
    let top = e.clientY - this.startY;
    // 限制拖拽范围，确保不会超出视口
    left = Math.max(0, Math.min(left, window.innerWidth - this.toolEl.offsetWidth));
    top = Math.max(0, Math.min(top, window.innerHeight - this.toolEl.offsetHeight));
    
    this.toolEl.style.left = `${left}px`;
    this.toolEl.style.top = `${top}px`;
    // 确保宽度保持不变
    this.toolEl.style.width = `${this.controlItems.length * 45 }px`; // 保持初始宽度
  };

  private handleMouseUp = () => {
    this.dragging = false
  }
  addItem(item: ControlItem) {
    this.controlItems.push(item)
  }

  removeItem(key: string) {
    const index = this.controlItems.findIndex((item) => item.key === key)
    return index == -1 ? null : this.controlItems.splice(index, 1)[0]
  }

  private getControlTool(): HTMLElement {
    const NORMAL = 'lf-control-item'
    const DISABLED = 'lf-control-item disabled'
    const controlTool = document.createElement('div')
    const controlElements: HTMLDivElement[] = []
    controlTool.className = 'lf-control'
    this.controlItems.forEach((item) => {
      const itemContainer = document.createElement('div')
      const icon = document.createElement('i')
      const text = document.createElement('span')
      itemContainer.className = DISABLED
      item.onClick && (itemContainer.onclick = item.onClick.bind(null, this.lf))
      item.onMouseEnter &&
        (itemContainer.onmouseenter = item.onMouseEnter.bind(null, this.lf))
      item.onMouseLeave &&
        (itemContainer.onmouseleave = item.onMouseLeave.bind(null, this.lf))
      icon.className = item.iconClass
      text.className = 'lf-control-text'
      text.title = item.title
      text.innerText = item.text
      itemContainer.append(icon, text)
      switch (item.text) {
        case '上一步':
          this.lf.on('history:change', ({ data: { undoAble } }: any) => {
            itemContainer.className = undoAble ? NORMAL : DISABLED
          })
          break
        case '下一步':
          this.lf.on('history:change', ({ data: { redoAble } }: any) => {
            itemContainer.className = redoAble ? NORMAL : DISABLED
          })
          break
        default:
          itemContainer.className = NORMAL
          break
      }
      controlElements.push(itemContainer)
    })
    controlTool.append(...controlElements)
    return controlTool
  }
}

export default Control
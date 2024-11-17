import LogicFlow from "@logicflow/core/types/LogicFlow";
import { Ref } from "vue";
import { restoreFromLocalStorage } from "../nodes/storageNodes";


const renderLF = (lf: LogicFlow,containerRef: Ref<any, any>) => {
  const {nodes, edges} = restoreFromLocalStorage();

    lf.render({
      nodes,
      edges,
    });
  
    // MiniMap.show()必须在lf.render()后调用。
    lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320)
  }

  export { renderLF }
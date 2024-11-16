import LogicFlow from "@logicflow/core";
import { Ref, ref } from 'vue'
import { handleNodeClick } from "../nodes";

// dnd菜单列表
const dndData = ref([
    {
      group: "基本逻辑门",
      items: [
        { id: '1', type: 'AndGate', label: '与门', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDIwIiBmaWxsPSJub25lIj4KPGxpbmUgeDE9IjEiIHkxPSIwLjUiIHgyPSIxNCIgeTI9IjAuNSIgc3Ryb2tlPSJibGFjayIvPgo8bGluZSB4MT0iMS41IiB5MT0iMTkuNSIgeDI9IjEzLjUiIHkyPSIxOS41IiBzdHJva2U9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjEiIGN5PSI1IiByPSIxIiBmaWxsPSIjMTEwMEZBIi8+CjxjaXJjbGUgY3g9IjEiIGN5PSIxNSIgcj0iMSIgZmlsbD0iIzExMDBGQSIvPgo8cGF0aCBkPSJNMjMgMTAuNUMyMyAxMS43NDc2IDIyLjc1NDMgMTIuOTgyOSAyMi4yNzY5IDE0LjEzNTVDMjEuNzk5NCAxNS4yODgxIDIxLjA5OTcgMTYuMzM1NCAyMC4yMTc1IDE3LjIxNzVDMTkuMzM1NCAxOC4wOTk3IDE4LjI4ODEgMTguNzk5NCAxNy4xMzU1IDE5LjI3NjlDMTUuOTgyOSAxOS43NTQzIDE0Ljc0NzYgMjAgMTMuNSAyMEwxMy41IDE4LjkzMjZDMTQuNjA3NCAxOC45MzI2IDE1LjcwMzkgMTguNzE0NSAxNi43MjcgMTguMjkwN0MxNy43NTAxIDE3Ljg2NjkgMTguNjc5NyAxNy4yNDU4IDE5LjQ2MjcgMTYuNDYyN0MyMC4yNDU4IDE1LjY3OTcgMjAuODY2OSAxNC43NTAxIDIxLjI5MDcgMTMuNzI3QzIxLjcxNDUgMTIuNzAzOSAyMS45MzI2IDExLjYwNzQgMjEuOTMyNiAxMC41SDIzWiIgZmlsbD0iIzAyMDIwMiIvPgo8cGF0aCBkPSJNMjMgOS41QzIzIDguMjUyNDQgMjIuNzU0MyA3LjAxNzEgMjIuMjc2OSA1Ljg2NDUxQzIxLjc5OTQgNC43MTE5MSAyMS4wOTk3IDMuNjY0NjQgMjAuMjE3NSAyLjc4MjQ5QzE5LjMzNTQgMS45MDAzMyAxOC4yODgxIDEuMjAwNTYgMTcuMTM1NSAwLjcyMzE0NEMxNS45ODI5IDAuMjQ1NzI1IDE0Ljc0NzYgLTUuNDUzMjVlLTA4IDEzLjUgMEwxMy41IDEuMDY3NDFDMTQuNjA3NCAxLjA2NzQxIDE1LjcwMzkgMS4yODU1MyAxNi43MjcgMS43MDkzMUMxNy43NTAxIDIuMTMzMDggMTguNjc5NyAyLjc1NDIyIDE5LjQ2MjcgMy41MzcyNkMyMC4yNDU4IDQuMzIwMyAyMC44NjY5IDUuMjQ5OSAyMS4yOTA3IDYuMjcyOTlDMjEuNzE0NSA3LjI5NjA4IDIxLjkzMjYgOC4zOTI2MiAyMS45MzI2IDkuNUgyM1oiIGZpbGw9ImJsYWNrIi8+CjxsaW5lIHgxPSIxLjUiIHgyPSIxLjUiIHkyPSIyMCIgc3Ryb2tlPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIyMi41IiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNGQUE1MDAiLz4KPC9zdmc+' },
        { id: '2', type: 'OrGate', label: '或门', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPGxpbmUgeDE9IjEwIiB5MT0iOC41IiB4Mj0iMTkiIHkyPSI4LjUiIHN0cm9rZT0iYmxhY2siLz4KPGxpbmUgeDE9IjEwIiB5MT0iMjcuNSIgeDI9IjE5IiB5Mj0iMjcuNSIgc3Ryb2tlPSJibGFjayIvPgo8cGF0aCBkPSJNMTguNSA4QzIxLjM3NDYgOCAyNC4xNjE0IDguOTkwNzggMjYuMzkwOCAxMC44MDU0QzI4LjYyMDMgMTIuNjIwMSAzMC4xNTYyIDE1LjE0NzcgMzAuNzM5NyAxNy45NjI0TDI5LjcwOTMgMTguMTc2QzI5LjE3NDkgMTUuNTk4MiAyNy43NjgzIDEzLjI4MzQgMjUuNzI2NiAxMS42MjE1QzIzLjY4NDggOS45NTk2NiAyMS4xMzI2IDkuMDUyMjkgMTguNSA5LjA1MjI5VjhaIiBmaWxsPSIjMDEwMTAxIi8+CjxwYXRoIGQ9Ik0xOC41IDI4QzIxLjM3NDYgMjggMjQuMTYxNCAyNy4wMDkyIDI2LjM5MDggMjUuMTk0NkMyOC42MjAzIDIzLjM3OTkgMzAuMTU2MiAyMC44NTIzIDMwLjczOTcgMTguMDM3NkwyOS43MDkzIDE3LjgyNEMyOS4xNzQ5IDIwLjQwMTggMjcuNzY4MyAyMi43MTY2IDI1LjcyNjYgMjQuMzc4NUMyMy42ODQ4IDI2LjA0MDMgMjEuMTMyNiAyNi45NDc3IDE4LjUgMjYuOTQ3N1YyOFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMCA4QzEyLjY1MjIgOCAxNS4xOTU3IDkuMDUzNTcgMTcuMDcxMSAxMC45Mjg5QzE4Ljk0NjQgMTIuODA0MyAyMCAxNS4zNDc4IDIwIDE4QzIwIDIwLjY1MjIgMTguOTQ2NCAyMy4xOTU3IDE3LjA3MTEgMjUuMDcxMUMxNS4xOTU3IDI2Ljk0NjQgMTIuNjUyMiAyOCAxMCAyOEwxMCAyNy4wODY2QzEyLjQwOTkgMjcuMDg2NiAxNC43MjExIDI2LjEyOTIgMTYuNDI1MiAyNC40MjUyQzE4LjEyOTIgMjIuNzIxMSAxOS4wODY2IDIwLjQwOTkgMTkuMDg2NiAxOEMxOS4wODY2IDE1LjU5MDEgMTguMTI5MiAxMy4yNzg5IDE2LjQyNTIgMTEuNTc0OEMxNC43MjExIDkuODcwNzcgMTIuNDA5OSA4LjkxMzQzIDEwIDguOTEzNDNWOFoiIGZpbGw9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjMxIiBjeT0iMTgiIHI9IjEiIGZpbGw9IiNGQUE1MDAiLz4KPGNpcmNsZSBjeD0iMzEiIGN5PSIxOCIgcj0iMSIgZmlsbD0iI0ZBQTUwMCIvPgo8L3N2Zz4=' },
        { id: '3', type: 'NotGate', label: '非门', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE1LjI1IDEzLjYwMjlMMjIgMTcuNUwxNS4yNSAyMS4zOTcxTDE1LjI1IDEzLjYwMjlaIiBmaWxsPSIjRkZGQUZBIiBzdHJva2U9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjIxLjUiIGN5PSIxNy41IiByPSIxIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIvPgo8bGluZSB4MT0iMjIiIHkxPSIxNy41IiB4Mj0iMzMiIHkyPSIxNy41IiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSI0IiB5MT0iMTcuNSIgeDI9IjE1IiB5Mj0iMTcuNSIgc3Ryb2tlPSJibGFjayIvPgo8L3N2Zz4=' },
        { id: '4', type: 'XorGate', label: '异或', properties: {}, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPGxpbmUgeDE9IjEwIiB5MT0iOC41IiB4Mj0iMTkiIHkyPSI4LjUiIHN0cm9rZT0iYmxhY2siLz4KPGxpbmUgeDE9IjEwIiB5MT0iMjcuNSIgeDI9IjE5IiB5Mj0iMjcuNSIgc3Ryb2tlPSJibGFjayIvPgo8cGF0aCBkPSJNMTguNSA4QzIxLjM3NDYgOCAyNC4xNjE0IDguOTkwNzggMjYuMzkwOCAxMC44MDU0QzI4LjYyMDMgMTIuNjIwMSAzMC4xNTYyIDE1LjE0NzcgMzAuNzM5NyAxNy45NjI0TDI5LjcwOTMgMTguMTc2QzI5LjE3NDkgMTUuNTk4MiAyNy43NjgzIDEzLjI4MzQgMjUuNzI2NiAxMS42MjE1QzIzLjY4NDggOS45NTk2NiAyMS4xMzI2IDkuMDUyMjkgMTguNSA5LjA1MjI5VjhaIiBmaWxsPSIjMDEwMTAxIi8+CjxwYXRoIGQ9Ik0xOC41IDI4QzIxLjM3NDYgMjggMjQuMTYxNCAyNy4wMDkyIDI2LjM5MDggMjUuMTk0NkMyOC42MjAzIDIzLjM3OTkgMzAuMTU2MiAyMC44NTIzIDMwLjczOTcgMTguMDM3NkwyOS43MDkzIDE3LjgyNEMyOS4xNzQ5IDIwLjQwMTggMjcuNzY4MyAyMi43MTY2IDI1LjcyNjYgMjQuMzc4NUMyMy42ODQ4IDI2LjA0MDMgMjEuMTMyNiAyNi45NDc3IDE4LjUgMjYuOTQ3N1YyOFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMCA4QzEyLjY1MjIgOCAxNS4xOTU3IDkuMDUzNTcgMTcuMDcxMSAxMC45Mjg5QzE4Ljk0NjQgMTIuODA0MyAyMCAxNS4zNDc4IDIwIDE4QzIwIDIwLjY1MjIgMTguOTQ2NCAyMy4xOTU3IDE3LjA3MTEgMjUuMDcxMUMxNS4xOTU3IDI2Ljk0NjQgMTIuNjUyMiAyOCAxMCAyOEwxMCAyNy4wODY2QzEyLjQwOTkgMjcuMDg2NiAxNC43MjExIDI2LjEyOTIgMTYuNDI1MiAyNC40MjUyQzE4LjEyOTIgMjIuNzIxMSAxOS4wODY2IDIwLjQwOTkgMTkuMDg2NiAxOEMxOS4wODY2IDE1LjU5MDEgMTguMTI5MiAxMy4yNzg5IDE2LjQyNTIgMTEuNTc0OEMxNC43MjExIDkuODcwNzcgMTIuNDA5OSA4LjkxMzQzIDEwIDguOTEzNDNWOFoiIGZpbGw9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjMxIiBjeT0iMTgiIHI9IjEiIGZpbGw9IiNGQUE1MDAiLz4KPGNpcmNsZSBjeD0iMzEiIGN5PSIxOCIgcj0iMSIgZmlsbD0iI0ZBQTUwMCIvPgo8cGF0aCBkPSJNNy41IDEwQzguNDg0OTEgMTAgOS40NjAxOCAxMC4xOTQgMTAuMzcwMSAxMC41NzA5QzExLjI4MDEgMTAuOTQ3OCAxMi4xMDY5IDExLjUwMDMgMTIuODAzMyAxMi4xOTY3QzEzLjQ5OTcgMTIuODkzMSAxNC4wNTIyIDEzLjcxOTkgMTQuNDI5MSAxNC42Mjk5QzE0LjgwNiAxNS41Mzk4IDE1IDE2LjUxNTEgMTUgMTcuNUMxNSAxOC40ODQ5IDE0LjgwNiAxOS40NjAyIDE0LjQyOTEgMjAuMzcwMUMxNC4wNTIyIDIxLjI4MDEgMTMuNDk5NyAyMi4xMDY5IDEyLjgwMzMgMjIuODAzM0MxMi4xMDY5IDIzLjQ5OTcgMTEuMjgwMSAyNC4wNTIyIDEwLjM3MDEgMjQuNDI5MUM5LjQ2MDE4IDI0LjgwNiA4LjQ4NDkxIDI1IDcuNSAyNUw3LjUgMjMuODM1OUM4LjMzMjA0IDIzLjgzNTkgOS4xNTU5MyAyMy42NzIgOS45MjQ2MyAyMy4zNTM2QzEwLjY5MzMgMjMuMDM1MiAxMS4zOTE4IDIyLjU2ODUgMTEuOTgwMSAyMS45ODAxQzEyLjU2ODUgMjEuMzkxOCAxMy4wMzUyIDIwLjY5MzMgMTMuMzUzNiAxOS45MjQ2QzEzLjY3MiAxOS4xNTU5IDEzLjgzNTkgMTguMzMyIDEzLjgzNTkgMTcuNUMxMy44MzU5IDE2LjY2OCAxMy42NzIgMTUuODQ0MSAxMy4zNTM2IDE1LjA3NTRDMTMuMDM1MiAxNC4zMDY3IDEyLjU2ODUgMTMuNjA4MiAxMS45ODAxIDEzLjAxOTlDMTEuMzkxOCAxMi40MzE1IDEwLjY5MzMgMTEuOTY0OCA5LjkyNDYzIDExLjY0NjRDOS4xNTU5MyAxMS4zMjggOC4zMzIwNCAxMS4xNjQxIDcuNSAxMS4xNjQxTDcuNSAxMFoiIGZpbGw9ImJsYWNrIi8+CjxsaW5lIHgxPSI0IiB5MT0iMTMuNSIgeDI9IjE4IiB5Mj0iMTMuNSIgc3Ryb2tlPSJibGFjayIvPgo8bGluZSB4MT0iNCIgeTE9IjIxLjUiIHgyPSIxOSIgeTI9IjIxLjUiIHN0cm9rZT0iYmxhY2siLz4KPC9zdmc+' },
      ]
    },
    {
      group: "输入输出",
      items: [
        { id: '1', type: 'Input', label: '输入', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPHJlY3QgeD0iNS41IiB5PSI2LjUiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNCIgZmlsbD0iI0ZERkFGQSIgc3Ryb2tlPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI5LjUiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIi8+Cjwvc3ZnPg==' },
        { id: '2', type: 'Output', label: '输出', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTMuNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iOS41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIvPgo8L3N2Zz4=', },
        { id: '3', type: 'Clock', label: '时钟', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPHJlY3QgeD0iNiIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjIzIiBmaWxsPSIjRkRGQUZBIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGxpbmUgeDE9IjciIHkxPSIyMS41IiB4Mj0iMTAiIHkyPSIyMS41IiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSI5LjUiIHkxPSIyMiIgeDI9IjkuNSIgeTI9IjEwIiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSIxNi41IiB5MT0iMjIiIHgyPSIxNi41IiB5Mj0iMTAiIHN0cm9rZT0iYmxhY2siLz4KPGxpbmUgeDE9IjIzLjUiIHkxPSIyMiIgeDI9IjIzLjUiIHkyPSIxMCIgc3Ryb2tlPSJibGFjayIvPgo8bGluZSB4MT0iOSIgeTE9IjkuNSIgeDI9IjE3IiB5Mj0iOS41IiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSIyMyIgeTE9IjkuNSIgeDI9IjMxIiB5Mj0iOS41IiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSIxNiIgeTE9IjIxLjUiIHgyPSIyNCIgeTI9IjIxLjUiIHN0cm9rZT0iYmxhY2siLz4KPGNpcmNsZSBjeD0iMzEiIGN5PSIxNSIgcj0iMSIgZmlsbD0iI0ZBQTUwMCIvPgo8L3N2Zz4=', }
      ]
    },
    {
      group: "触发器",
      items: [
        { id: '1', type: 'Input', label: '输入', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPHJlY3QgeD0iNS41IiB5PSI2LjUiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNCIgZmlsbD0iI0ZERkFGQSIgc3Ryb2tlPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI5LjUiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIi8+Cjwvc3ZnPg==' },
        { id: '2', type: 'Output', label: '输出', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTMuNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iOS41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIvPgo8L3N2Zz4=', }
      ]
    },
    {
      group: "存储器",
      items: [
        { id: '1', type: 'Input', label: '输入', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPHJlY3QgeD0iNS41IiB5PSI2LjUiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNCIgZmlsbD0iI0ZERkFGQSIgc3Ryb2tlPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI5LjUiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIi8+Cjwvc3ZnPg==' },
        { id: '2', type: 'Output', label: '输出', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTMuNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iOS41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIvPgo8L3N2Zz4=', }
      ]
    },
    {
      group: "运算器",
      items: [
        { id: '1', type: 'Input', label: '输入', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPHJlY3QgeD0iNS41IiB5PSI2LjUiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNCIgZmlsbD0iI0ZERkFGQSIgc3Ryb2tlPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI5LjUiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIi8+Cjwvc3ZnPg==' },
        { id: '2', type: 'Output', label: '输出', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTMuNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iOS41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIvPgo8L3N2Zz4=', }
      ]
    }
]) 

// 仿真按钮的状态
const simulationActive = ref(false); 

// 设置插件
const setPlugins = (lf: LogicFlow, containerRef: Ref<any, any>) => {
    // 设置拖拽插件dndPanelVue
    lf = setDndPanelVuePlugin(lf)
  
    // 设置控制面板插件Control
    lf = setControlPlugin(lf, containerRef)
    return lf;
}

// 设置拖拽插件dndPanelVue
const setDndPanelVuePlugin = (lf: LogicFlow) => {
  lf.extension.dndPanelVue.setPatternItems(dndData.value)
  return lf;
}
  
// 设置控制面板插件Control
const setControlPlugin = (lf: LogicFlow, containerRef: Ref<any, any>) => {
  let that = lf
  // 添加仿真按钮
  lf.extension.control.addItem({
      key: 'simulation',
      iconClass: simulationActive.value ? "fa fa-pause" : "fa fa-play", // 在html引入了font样式
      text: "仿真",
      /* @ts-ignore */
      onClick: (lf: LogicFlow, ev: any) => {

      // 切换状态
      simulationActive.value = !simulationActive.value;
      // 开始仿真就需要处理一遍节点，
      // 因为有可能有非门，当输入为0时非门就应该有1的状态
      // 同时又可能有时钟，需要每隔固定时间遍历一遍节点
      if(simulationActive.value){
        handleNodeClick(that,'')
      }else{
        // TODO: 重置activeNodes
      }
      // 获取所有节点
      lf = lf.lf; // bug-#IB3T6D : https://gitee.com/lonelyzoom/online-logisim/issues/IB3T6D
      const nodes = lf.graphModel.nodes;

      // 遍历所有节点，并更新每个节点的status属性
      // simulation代表处于仿真状态
      // normal代表处于一般状态
      // 此处更改会导致对应节点的getShape处改变节点形状
      nodes.forEach((node: { id: any; }) => {
          lf.setProperties(node.id, {
          status: simulationActive.value ? 'simulation' : 'normal',
          });
      });
  },
  })
  // 添加导航按钮
  lf.extension.control.addItem({
      key: 'guide',
      iconClass: "fa fa-eye",
      title: "导航",
      text: "导航",
      /* @ts-ignore */
      onClick: (lf: any, ev: any) => {
      // 指定小地图显示在特定位置
      lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320);
      }
  })
  // 添加源码按钮
  lf.extension.control.addItem({
    key: 'sourcecode',
    iconClass: "fa fa-code-branch",
    title: "源码",
    text: "源码",
    /* @ts-ignore */
    onClick: (lf: any, ev: any) => {
      // 跳转到源码地址
      const sourceCodeUrl = 'https://github.com/gaoyakang/online_logisim';
      // 使用 window.open 打开新标签页跳转到源码地址
      window.open(sourceCodeUrl, '_blank');
    }
})
  // 移除适应/上一步/下一步按钮
  lf.extension.control.removeItem('reset')
  lf.extension.control.removeItem('undo')
  lf.extension.control.removeItem('redo')
  return lf;
}

export { setPlugins }
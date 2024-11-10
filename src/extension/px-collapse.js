var f = Object.defineProperty;
var h = (o, e, t) => e in o ? f(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var s = (o, e, t) => (h(o, typeof e != "symbol" ? e + "" : e, t), t);
import { property as d, customElement as u, QuarkElement as l, createRef as m } from "quarkc";
const x = `details{background-color:#fff}.icon{float:right}details[open] .icon{transform:rotate(180deg)}summary{padding:13px 26px;color:var(--callapse-title-color, #666);font-size:var(--callapse-title-fontsize, 14px);position:relative;cursor:pointer;transition:all .4s}summary:first-of-type{list-style-type:none}.collapse-icon{position:absolute;right:26px;top:15px}.line{width:calc(100% - 52px);height:1px;background:#ebedf0;position:absolute;bottom:0}.expander-content{color:var(--callapse-content-color, #666);font-size:var(--callapse-content-fontsize, 14px);line-height:1.5;background-color:#fff;padding:12px 28px}:host([iconhide]) quark-icon-arrow-down{display:none}
`;
var v = Object.defineProperty, y = Object.getOwnPropertyDescriptor, c = (o, e, t, r) => {
  for (var n = r > 1 ? void 0 : r ? y(e, t) : e, a = o.length - 1, p; a >= 0; a--)
    (p = o[a]) && (n = (r ? p(e, t, n) : p(n)) || n);
  return r && n && v(e, t, n), n;
};
let i = class extends l {
  constructor() {
    super(...arguments);
    s(this, "open", !1);
    s(this, "title", "");
    s(this, "detailsEl", m());
  }
  componentDidMount() {
    if (this.open) {
      const { current: e } = this.detailsEl;
      e.open = !0;
    }
  }
  shouldComponentUpdate(e, t, r) {
    if (e === "open" && t !== r) {
      const { current: n } = this.detailsEl;
      n.open = r;
    }
    return !0;
  }
  render() {
    return /* @__PURE__ */ l.h("details", { ref: this.detailsEl }, /* @__PURE__ */ l.h("summary", null, /* @__PURE__ */ l.h("slot", { name: "title" }, this.title), /* @__PURE__ */ l.h("div", { className: "icon" }, "↓"), /* @__PURE__ */ l.h("div", { className: "line" })), /* @__PURE__ */ l.h("div", { class: "expander-content" }, /* @__PURE__ */ l.h("slot", null)));
  }
};
c([
  d({
    type: Boolean
  })
], i.prototype, "open", 2);
c([
  d({
    type: String
  })
], i.prototype, "title", 2);
i = c([
  u({
    tag: "px-collapse",
    style: x
  })
], i);

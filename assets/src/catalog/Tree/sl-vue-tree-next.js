import { defineComponent as Ge, ref as m, computed as I, onMounted as Qe, onBeforeUnmount as Ze, watchEffect as Me, resolveComponent as et, openBlock as S, createElementBlock as y, normalizeClass as ne, createElementVNode as D, Fragment as Be, renderList as Ee, withModifiers as re, normalizeStyle as Ie, renderSlot as x, toDisplayString as w, createCommentVNode as P, createTextVNode as oe, createBlock as tt, withCtx as _, withDirectives as lt, vShow as nt } from "vue";
const Le = (p, k) => {
  if (se(p) && se(k))
    for (const C in k)
      se(k[C]) ? (p[C] || Object.assign(p, { [C]: {} }), Le(p[C], k[C])) : Object.assign(p, { [C]: k[C] });
  return p;
}, se = (p) => p && typeof p == "object" && !Array.isArray(p), rt = {
  ref: "nodes",
  class: "sl-vue-tree-next-nodes-list"
}, ot = ["onPointerdown", "onPointerup", "onContextmenu", "onDblclick", "onClick", "onDragover", "onDrop", "path"], st = { class: "sl-vue-tree-next-gap" }, it = {
  key: 0,
  class: "sl-vue-tree-next-branch"
}, at = { key: 0 }, ut = { key: 1 }, ct = { class: "sl-vue-tree-next-title" }, dt = ["onClick"], ft = { class: "sl-vue-tree-next-sidebar" }, gt = /* @__PURE__ */ Ge({
  __name: "SlVueTreeNext",
  props: {
    modelValue: { default: () => [] },
    edgeSize: { default: 3 },
    allowMultiselect: { type: Boolean, default: !0 },
    showBranches: { type: Boolean, default: !1 },
    level: { default: 0 },
    parentInd: { default: void 0 },
    parentContext: {},
    rootContext: {},
    allowToggleBranch: { type: Boolean, default: !0 },
    multiSelectKey: {},
    scrollAreaHeight: { default: 70 },
    maxScrollSpeed: { default: 20 }
  },
  emits: [
    "update:modelValue",
    "select",
    "beforedrop",
    "drop",
    "toggle",
    "nodeclick",
    "nodedblclick",
    "updateNode",
    "nodecontextmenu",
    "externaldragover",
    "externaldrop"
  ],
  setup(p, { expose: k, emit: C }) {
    const c = p, ie = C, T = m(), ae = m(), F = m(null), A = m(0), X = m(0), V = m(null), Y = m(!1), B = m(!1), j = m({ x: 0, y: 0 }), z = m(!1), g = m([]), f = I(() => !c.level), ue = I(() => {
      const e = [];
      let t = c.level - 1;
      for (c.showBranches || t++; t-- > 0; ) e.push(t);
      return e;
    }), d = I(() => {
      var t;
      return f.value ? F.value : (t = M()) == null ? void 0 : t.cursorPosition.value;
    }), ce = I(() => ue.value.length), U = I(() => {
      var t, n, l, o;
      if (f.value) {
        const r = b(g.value);
        return fe(r);
      }
      return c.parentInd === null ? [] : (o = (l = (n = (t = M()) == null ? void 0 : t.currentNodes) == null ? void 0 : n.value) == null ? void 0 : l[c.parentInd]) == null ? void 0 : o.children;
    }), de = I(() => xe().length);
    I(() => te().length), Qe(() => {
      f.value && document.addEventListener("mouseup", ye);
    }), Ze(() => {
      document.removeEventListener("mouseup", ye);
    }), Me(() => {
      g.value = c.modelValue;
    });
    const L = (e) => {
      var t;
      if (f.value) {
        F.value = e;
        return;
      }
      (t = M()) == null || t.setCursorPosition(e);
    }, fe = (e, t = [], n = !0) => e.map((l, o) => {
      const r = t.concat(o);
      return H(r, l, e, n);
    }), H = (e, t = null, n = null, l = null) => {
      const o = e.slice(-1)[0];
      if (n = n || J(g.value, e), t = t || n && n[o] || null, l == null && (l = q == null ? void 0 : q(e)), !t) return null;
      const r = t.isExpanded == null ? !0 : !!t.isExpanded, i = t.isDraggable == null ? !0 : !!t.isDraggable, s = t.isSelectable == null ? !0 : !!t.isSelectable;
      return {
        // define the all TreeNodeModel props
        title: t.title,
        isLeaf: !!t.isLeaf,
        children: t.children ? fe(t.children, e, r) : [],
        isSelected: !!t.isSelected,
        isExpanded: r,
        isVisible: l,
        isDraggable: i,
        isSelectable: s,
        data: t.data !== void 0 ? t.data : {},
        // define the all TreeNode computed props
        path: e,
        pathStr: JSON.stringify(e),
        level: e.length,
        ind: o,
        isFirstChild: o == 0,
        isLastChild: o == ((n == null ? void 0 : n.length) ?? 0) - 1
      };
    }, q = (e) => {
      if (e.length < 2) return !0;
      let t = g.value;
      for (let n = 0; n < e.length - 1; n++) {
        let l = e[n], o = t[l];
        if (!(o.isExpanded == null ? !0 : !!o.isExpanded)) return !1;
        t = o.children || [];
      }
      return !0;
    }, O = (e) => {
      g.value = e, u().emit("update:modelValue", e);
    }, He = (e, t) => {
      u().emit("select", e, t);
    }, Te = (e, t, n) => {
      u().emit("beforedrop", e, t, n);
    }, Oe = (e, t, n) => {
      u().emit("drop", e, t, n);
    }, $e = (e, t) => {
      u().emit("toggle", e, t);
    }, Re = (e, t) => {
      u().emit("nodeclick", e, t);
    }, Ae = (e, t) => {
      u().emit("nodedblclick", e, t);
    }, Ve = (e, t) => {
      u().emit("nodecontextmenu", e, t);
    }, Ye = (e, t) => {
      t.preventDefault();
      const n = u(), l = n.getCursorPositionFromCoords(t.clientX, t.clientY);
      n.setCursorPosition(l), n.emit("externaldragover", l, t);
    }, ze = (e, t) => {
      const n = u(), l = n.getCursorPositionFromCoords(t.clientX, t.clientY);
      n.emit("externaldrop", l, t), L(null);
    }, W = (e, t = !1, n = null) => {
      const l = Array.isArray(c.multiselectKey) ? c.multiselectKey : [c.multiselectKey];
      t = (n && !!l.find((h) => n[h]) || t) && c.allowMultiselect;
      const r = H(e);
      if (!r) return null;
      const i = b(g.value), s = c.allowMultiselect && n && n.shiftKey && V.value, a = [];
      let v = !1;
      return N((h, E) => {
        var R;
        s ? ((h.pathStr === r.pathStr || h.pathStr === ((R = V.value) == null ? void 0 : R.pathStr)) && (E.isSelected = h.isSelectable, v = !v), v && (E.isSelected = h.isSelectable)) : h.pathStr === r.pathStr ? E.isSelected = h.isSelectable : t || E.isSelected && (E.isSelected = !1), E.isSelected && a.push(h);
      }, i), V.value = r, O(i), He(a, n), r;
    }, pe = (e) => {
      var Pe, ke;
      if (!f.value) {
        (Pe = u()) == null || Pe.onMousemoveHandler(e);
        return;
      }
      if (z.value) return;
      const t = B.value, n = t || Y.value && (j.value.x !== e.clientX || j.value.y !== e.clientY), l = t === !1 && n === !0;
      if (j.value = {
        x: e.clientX,
        y: e.clientY
      }, !n) return;
      const o = u().ref.value, r = o.getBoundingClientRect(), i = e.clientY - r.top + o.scrollTop - Number(((ke = T.value) == null ? void 0 : ke.style.marginBottom) ?? 0), s = e.clientX - r.left;
      T.value && (T.value.style.top = i + "px", T.value.style.left = s + "px");
      const a = ge(e.clientX, e.clientY), v = a == null ? void 0 : a.node, h = a == null ? void 0 : a.placement;
      if (l && !v.isSelected && W(v.path, !1, e), !te().length) {
        z.value = !0;
        return;
      }
      B.value = n, L({ node: v, placement: h });
      const R = r.bottom - c.scrollAreaHeight, be = (e.clientY - R) / (r.bottom - R), we = r.top + c.scrollAreaHeight, De = (we - e.clientY) / (we - r.top);
      be > 0 ? Ne(be) : De > 0 ? Ne(-De) : Q();
    }, ge = (e, t) => {
      const n = document.elementFromPoint(e, t), l = n != null && n.getAttribute("path") ? n : ve(n);
      let o, r;
      if (l) {
        if (!l) return;
        o = H(JSON.parse(l.getAttribute("path")));
        const i = l.offsetHeight, s = c.edgeSize, a = t - l.getBoundingClientRect().top;
        o.isLeaf ? r = a >= i / 2 ? "after" : "before" : a <= s ? r = "before" : a >= i - s ? r = "after" : r = "inside";
      } else {
        const s = u().ref.value.getBoundingClientRect();
        t > s.top + s.height / 2 ? (r = "after", o = he()) : (r = "before", o = G());
      }
      return { node: o, placement: r };
    }, ve = (e) => e ? e.getAttribute("path") ? e : ve(e.parentElement) : null, Je = (e) => {
      if (!f.value || !B.value) return;
      const n = u().ref.value.getBoundingClientRect();
      if (e.clientY >= n.bottom) {
        const l = structuredClone(U.value);
        L({ node: l[0], placement: "after" });
      } else e.clientY < n.top && L({ node: G(), placement: "before" });
    }, Ke = (e) => u().ref.value.querySelector(`[path="${JSON.stringify(e)}"]`), he = () => {
      let e = null;
      return N((t) => {
        e = t;
      }), e;
    }, G = () => H([0]), _e = (e, t) => {
      let n = null;
      return N((l) => {
        if (!(me(l.path, e) < 1) && (!t || t(l)))
          return n = l, !1;
      }), n;
    }, Fe = (e, t) => {
      let n = [];
      N((o) => {
        if (me(o.path, e) >= 0)
          return !1;
        n.push(o);
      });
      let l = n.length;
      for (; l--; ) {
        const o = n[l];
        if (!t || t(o)) return o;
      }
      return null;
    }, me = (e, t) => {
      for (let n = 0; n < e.length; n++) {
        if (t[n] == null || e[n] > t[n]) return 1;
        if (e[n] < t[n]) return -1;
      }
      return t[e.length] == null ? 0 : -1;
    }, Se = (e, t) => {
      if (e.button === 0) {
        if (!f.value) {
          u().onNodeMousedownHandler(e, t);
          return;
        }
        Y.value = !0;
      }
    }, Ne = (e) => {
      const t = u().ref.value;
      X.value !== e && (A.value && Q(), X.value = e, A.value = setInterval(() => {
        t.scrollTop += c.maxScrollSpeed * e;
      }, 20));
    }, Q = () => {
      clearInterval(A.value), A.value = 0, X.value = 0;
    }, ye = (e) => {
      B.value && Z(e);
    }, Z = (e, t = null) => {
      if (e.button !== 0) return;
      if (!f.value) {
        u().onNodeMouseupHandler(e, t);
        return;
      }
      if (Y.value = !1, !B.value && t && !z.value && W(t.path, !1, e), z.value = !1, !d.value) {
        $();
        return;
      }
      const n = te();
      for (let s of n) {
        if (s.pathStr == d.value.node.pathStr) {
          $();
          return;
        }
        if (We(s, d.value.node)) {
          $();
          return;
        }
      }
      const l = b(g.value), o = [];
      for (let s of n) {
        const v = J(l, s.path)[s.ind];
        o.push(v);
      }
      let r = !1;
      if (Te(n, d.value, () => r = !0), r) {
        $();
        return;
      }
      const i = [];
      for (let s of o)
        i.push(b(s)), s.toBeDeleted = !0;
      Ce(d.value, i, l), le((s, a, v) => {
        s.toBeDeleted && a.splice(v, 1);
      }, l), V.value = null, O(l), Oe(n, d.value, e), $();
    }, Xe = (e, t) => {
      c.allowToggleBranch && (ee({ path: t.path, patch: { isExpanded: !t.isExpanded } }), $e(t, e), e.stopPropagation());
    }, $ = () => {
      B.value = !1, Y.value = !1, L(null), Q();
    }, M = () => c.parentContext, u = () => f.value ? K : c.rootContext, J = (e, t) => t.length === 1 ? e : J(e[t[0]].children, t.slice(1)), ee = ({ path: e, patch: t }) => {
      if (!f.value) {
        ie("updateNode", { path: e, patch: t });
        return;
      }
      const n = JSON.stringify(e), l = b(g.value);
      N((o, r) => {
        if (o.pathStr === n)
          return Le(r, t), !1;
      }, l), O(l);
    }, xe = () => {
      const e = [];
      return N((t) => {
        t.isSelected && e.push(t);
      }), e;
    }, je = (e, t) => JSON.stringify(e.path.slice(0, t.path.length)) === t.pathStr, te = () => {
      const e = [];
      return N((t) => {
        t.isSelected && t.isDraggable && (e.some((l) => je(t, l)) || e.push(t));
      }), e;
    }, N = (e, t = null, n = []) => {
      t || (t = g.value);
      let l = !1;
      const o = [];
      for (let r = 0; r < t.length; r++) {
        const i = t[r], s = n.concat(r), a = H(s, i, t);
        if (l = e(a, i, t) === !1, a && o.push(a), l || i.children && (l = N(e, i.children, s) === !1, l))
          break;
      }
      return l ? !1 : o;
    }, le = (e, t) => {
      let n = t.length;
      for (; n--; ) {
        const l = t[n];
        l.children && le(e, l.children), e(l, t, n);
      }
      return t;
    }, Ue = (e) => {
      const t = e.map((l) => JSON.stringify(l)), n = b(g.value);
      N((l, o, r) => {
        for (const i of t)
          l.pathStr === i && (o.toBeDeleted = !0);
      }, n), le((l, o, r) => {
        l.toBeDeleted && o.splice(r, 1);
      }, n), O(n);
    }, Ce = (e, t, n) => {
      const l = b(e), o = l.node, r = J(n, o.path), i = r[o.ind];
      if (l.placement === "inside")
        i.children = i.children || [], i.children.unshift(...t);
      else {
        const s = l.placement === "before" ? o.ind : o.ind + 1;
        r.splice(s, 0, ...t);
      }
    }, qe = (e, t) => {
      const n = Array.isArray(t) ? t : [t], l = b(g.value);
      Ce(e, n, l), O(l);
    }, We = (e, t) => {
      const l = b(t).path;
      return JSON.stringify(l.slice(0, e.path.length)) == e.pathStr;
    }, b = (e) => JSON.parse(JSON.stringify(e)), K = {
      getRoot: u,
      setCursorPosition: L,
      currentNodes: U,
      cursorPosition: d,
      emit: ie,
      ref: ae,
      onNodeMousedownHandler: Se,
      onNodeMouseupHandler: Z,
      onMousemoveHandler: pe,
      getCursorPositionFromCoords: ge,
      updateNode: ee,
      getNode: H,
      traverse: N,
      select: W,
      getNodeEl: Ke,
      getFirstNode: G,
      getLastNode: he,
      getNextNode: _e,
      getPrevNode: Fe,
      getSelected: xe,
      insert: qe,
      remove: Ue,
      rootCursorPosition: F,
      selectionSize: de
    };
    return k(K), (e, t) => {
      const n = et("SlVueTreeNext", !0);
      return S(), y("div", {
        ref_key: "rootRef",
        ref: ae,
        class: ne(["sl-vue-tree-next", { "sl-vue-tree-next-root": f.value }]),
        onPointermove: pe,
        onPointerleave: Je,
        style: { "touch-action": "none" }
      }, [
        D("div", rt, [
          (S(!0), y(Be, null, Ee(U.value, (l, o) => (S(), y("div", {
            class: ne(["sl-vue-tree-next-node", { "sl-vue-tree-next-selected": l.isSelected }])
          }, [
            D("div", {
              class: "sl-vue-tree-next-cursor sl-vue-tree-next-cursor_before",
              onDragover: t[0] || (t[0] = re(() => {
              }, ["prevent"])),
              style: Ie({
                visibility: d.value && d.value.node.pathStr === l.pathStr && d.value.placement === "before" ? "visible" : "hidden",
                "--depth": ce.value
              })
            }, null, 36),
            D("div", {
              class: ne(["sl-vue-tree-next-node-item", {
                "sl-vue-tree-next-cursor-hover": d.value && d.value.node.pathStr === l.pathStr,
                "sl-vue-tree-next-cursor-inside": d.value && d.value.placement === "inside" && d.value.node.pathStr === l.pathStr,
                "sl-vue-tree-next-node-is-leaf": l.isLeaf,
                "sl-vue-tree-next-node-is-folder": !l.isLeaf
              }]),
              onPointerdown: (r) => Se(r, l),
              onPointerup: (r) => Z(r, l),
              onContextmenu: (r) => Ve(l, r),
              onDblclick: (r) => Ae(l, r),
              onClick: (r) => Re(l, r),
              onDragover: (r) => Ye(l, r),
              onDrop: (r) => ze(l, r),
              path: l.pathStr
            }, [
              (S(!0), y(Be, null, Ee(ue.value, (r) => (S(), y("div", st))), 256)),
              e.level && e.showBranches ? (S(), y("div", it, [
                x(e.$slots, "branch", { node: l }, () => [
                  l.isLastChild ? P("", !0) : (S(), y("span", at, w("├") + w("─") + "  ", 1)),
                  l.isLastChild ? (S(), y("span", ut, w("└") + w("─") + "  ", 1)) : P("", !0)
                ])
              ])) : P("", !0),
              D("div", ct, [
                l.isLeaf ? P("", !0) : (S(), y("span", {
                  key: 0,
                  class: "sl-vue-tree-next-toggle",
                  onClick: (r) => Xe(r, l)
                }, [
                  x(e.$slots, "toggle", { node: l }, () => [
                    D("span", null, w(l.isLeaf ? "" : l.isExpanded ? "-" : "+"), 1)
                  ])
                ], 8, dt)),
                x(e.$slots, "title", { node: l }, () => [
                  oe(w(l.title), 1)
                ]),
                !l.isLeaf && l.children.length == 0 && l.isExpanded ? x(e.$slots, "empty-node", {
                  key: 1,
                  node: l
                }) : P("", !0)
              ]),
              D("div", ft, [
                x(e.$slots, "sidebar", { node: l })
              ])
            ], 42, ot),
            l.children && l.children.length && l.isExpanded ? (S(), tt(n, {
              key: 0,
              "model-value": l.children,
              level: l.level,
              "parent-ind": o,
              "allow-multiselect": e.allowMultiselect,
              "allow-toggle-branch": e.allowToggleBranch,
              "edge-size": e.edgeSize,
              "show-branches": e.showBranches,
              "parent-context": K,
              "root-context": f.value ? K : e.rootContext,
              onUpdateNode: ee,
              onDragover: t[1] || (t[1] = re(() => {
              }, ["prevent"]))
            }, {
              title: _(({ node: r }) => [
                x(e.$slots, "title", { node: r }, () => [
                  oe(w(r.title), 1)
                ])
              ]),
              toggle: _(({ node: r }) => [
                x(e.$slots, "toggle", { node: r }, () => [
                  D("span", null, w(r.isLeaf ? "" : r.isExpanded ? "-" : "+"), 1)
                ])
              ]),
              sidebar: _(({ node: r }) => [
                x(e.$slots, "sidebar", { node: r })
              ]),
              "empty-node": _(({ node: r }) => [
                !r.isLeaf && r.children.length == 0 && r.isExpanded ? x(e.$slots, "empty-node", {
                  key: 0,
                  node: r
                }) : P("", !0)
              ]),
              _: 2
            }, 1032, ["model-value", "level", "parent-ind", "allow-multiselect", "allow-toggle-branch", "edge-size", "show-branches", "root-context"])) : P("", !0),
            D("div", {
              class: "sl-vue-tree-next-cursor sl-vue-tree-next-cursor_after",
              onDragover: t[2] || (t[2] = re(() => {
              }, ["prevent"])),
              style: Ie({
                visibility: d.value && d.value.node.pathStr === l.pathStr && d.value.placement === "after" ? "visible" : "hidden",
                "--depth": ce.value
              })
            }, null, 36)
          ], 2))), 256)),
          f.value ? lt((S(), y("div", {
            key: 0,
            ref_key: "dragInfoRef",
            ref: T,
            class: "sl-vue-tree-next-drag-info"
          }, [
            x(e.$slots, "draginfo", {}, () => [
              oe(" Items: " + w(de.value), 1)
            ])
          ], 512)), [
            [nt, B.value]
          ]) : P("", !0)
        ], 512)
      ], 34);
    };
  }
});
export {
  gt as SlVueTreeNext
};

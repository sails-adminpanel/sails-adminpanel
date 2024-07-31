const Ie = (p, k) => {
  if (ne(p) && ne(k))
    for (const x in k)
      ne(k[x]) ? (p[x] || Object.assign(p, { [x]: {} }), Ie(p[x], k[x])) : Object.assign(p, { [x]: k[x] });
  return p;
}, ne = (p) => p && typeof p == "object" && !Array.isArray(p), We = window.Vue.defineComponent, Be = window.Vue.renderList, Ee = window.Vue.Fragment, m = window.Vue.openBlock, N = window.Vue.createElementBlock, le = window.Vue.withModifiers, _e = window.Vue.normalizeStyle, V = window.Vue.createElementVNode, C = window.Vue.renderSlot, b = window.Vue.toDisplayString, D = window.Vue.createCommentVNode, se = window.Vue.createTextVNode, re = window.Vue.normalizeClass, Ge = window.Vue.resolveComponent, F = window.Vue.withCtx, Qe = window.Vue.createBlock, Ze = window.Vue.vShow, et = window.Vue.withDirectives, tt = {
  ref: "nodes",
  class: "sl-vue-tree-next-nodes-list"
}, ot = ["onMousedown", "onMouseup", "onContextmenu", "onDblclick", "onClick", "onDragover", "onDrop", "path"], nt = { class: "sl-vue-tree-next-gap" }, lt = {
  key: 0,
  class: "sl-vue-tree-next-branch"
}, st = { key: 0 }, rt = { key: 1 }, it = { class: "sl-vue-tree-next-title" }, at = ["onClick"], ut = { class: "sl-vue-tree-next-sidebar" }, S = window.Vue.ref, ct = window.Vue.onMounted, dt = window.Vue.onBeforeUnmount, ft = window.Vue.watchEffect, _ = window.Vue.computed, pt = /* @__PURE__ */ We({
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
  setup(p, { expose: k, emit: x }) {
    const c = p, ie = x, L = S(), ae = S(), K = S(null), $ = S(0), M = S(0), R = S(null), A = S(!1), B = S(!1), X = S({ x: 0, y: 0 }), z = S(!1), v = S([]), f = _(() => !c.level), ue = _(() => {
      const e = [];
      let t = c.level - 1;
      for (c.showBranches || t++; t-- > 0; )
        e.push(t);
      return e;
    }), d = _(() => {
      var t;
      return f.value ? K.value : (t = Z()) == null ? void 0 : t.cursorPosition.value;
    }), ce = _(() => ue.value.length), j = _(() => {
      var t, n, o, s;
      if (f.value) {
        const l = y(v.value);
        return fe(l);
      }
      return c.parentInd === null ? [] : (s = (o = (n = (t = Z()) == null ? void 0 : t.currentNodes) == null ? void 0 : n.value) == null ? void 0 : o[c.parentInd]) == null ? void 0 : s.children;
    }), de = _(() => Ce().length);
    _(() => te().length), ct(() => {
      f.value && document.addEventListener("mouseup", Ne);
    }), dt(() => {
      document.removeEventListener("mouseup", Ne);
    }), ft(() => {
      v.value = c.modelValue;
    });
    const I = (e) => {
      var t;
      if (f.value) {
        K.value = e;
        return;
      }
      (t = Z()) == null || t.setCursorPosition(e);
    }, fe = (e, t = [], n = !0) => e.map((o, s) => {
      const l = t.concat(s);
      return P(l, o, e, n);
    }), P = (e, t = null, n = null, o = null) => {
      const s = e.slice(-1)[0];
      if (n = n || Y(v.value, e), t = t || n && n[s] || null, o == null && (o = U == null ? void 0 : U(e)), !t)
        return null;
      const l = t.isExpanded == null ? !0 : !!t.isExpanded, i = t.isDraggable == null ? !0 : !!t.isDraggable, r = t.isSelectable == null ? !0 : !!t.isSelectable;
      return {
        // define the all TreeNodeModel props
        title: t.title,
        isLeaf: !!t.isLeaf,
        children: t.children ? fe(t.children, e, l) : [],
        isSelected: !!t.isSelected,
        isExpanded: l,
        isVisible: o,
        isDraggable: i,
        isSelectable: r,
        data: t.data !== void 0 ? t.data : {},
        // define the all TreeNode computed props
        path: e,
        pathStr: JSON.stringify(e),
        level: e.length,
        ind: s,
        isFirstChild: s == 0,
        isLastChild: s == ((n == null ? void 0 : n.length) ?? 0) - 1
      };
    }, U = (e) => {
      if (e.length < 2)
        return !0;
      let t = v.value;
      for (let n = 0; n < e.length - 1; n++) {
        let o = e[n], s = t[o];
        if (!(s.isExpanded == null ? !0 : !!s.isExpanded))
          return !1;
        t = s.children || [];
      }
      return !0;
    }, H = (e) => {
      v.value = e, u().emit("update:modelValue", e);
    }, Pe = (e, t) => {
      u().emit("select", e, t);
    }, Le = (e, t, n) => {
      u().emit("beforedrop", e, t, n);
    }, He = (e, t, n) => {
      u().emit("drop", e, t, n);
    }, Te = (e, t) => {
      u().emit("toggle", e, t);
    }, Oe = (e, t) => {
      u().emit("nodeclick", e, t);
    }, $e = (e, t) => {
      u().emit("nodedblclick", e, t);
    }, Re = (e, t) => {
      u().emit("nodecontextmenu", e, t);
    }, Ae = (e, t) => {
      t.preventDefault();
      const n = u(), o = n.getCursorPositionFromCoords(t.clientX, t.clientY);
      n.setCursorPosition(o), n.emit("externaldragover", o, t);
    }, ze = (e, t) => {
      const n = u(), o = n.getCursorPositionFromCoords(t.clientX, t.clientY);
      n.emit("externaldrop", o, t), I(null);
    }, q = (e, t = !1, n = null) => {
      const o = Array.isArray(c.multiselectKey) ? c.multiselectKey : [c.multiselectKey];
      t = (n && !!o.find((h) => n[h]) || t) && c.allowMultiselect;
      const l = P(e);
      if (!l)
        return null;
      const i = y(v.value), r = c.allowMultiselect && n && n.shiftKey && R.value, a = [];
      let g = !1;
      return w((h, E) => {
        var O;
        r ? ((h.pathStr === l.pathStr || h.pathStr === ((O = R.value) == null ? void 0 : O.pathStr)) && (E.isSelected = h.isSelectable, g = !g), g && (E.isSelected = h.isSelectable)) : h.pathStr === l.pathStr ? E.isSelected = h.isSelectable : t || E.isSelected && (E.isSelected = !1), E.isSelected && a.push(h);
      }, i), R.value = l, H(i), Pe(a, n), l;
    }, pe = (e) => {
      var De, ke;
      if (!f.value) {
        (De = u()) == null || De.onMousemoveHandler(e);
        return;
      }
      if (z.value)
        return;
      const t = B.value, n = t || A.value && (X.value.x !== e.clientX || X.value.y !== e.clientY), o = t === !1 && n === !0;
      if (X.value = {
        x: e.clientX,
        y: e.clientY
      }, !n)
        return;
      const s = u().ref.value, l = s.getBoundingClientRect(), i = e.clientY - l.top + s.scrollTop - Number(((ke = L.value) == null ? void 0 : ke.style.marginBottom) ?? 0), r = e.clientX - l.left;
      L.value && (L.value.style.top = i + "px", L.value.style.left = r + "px");
      const a = ve(e.clientX, e.clientY), g = a == null ? void 0 : a.node, h = a == null ? void 0 : a.placement;
      if (o && !g.isSelected && q(g.path, !1, e), !te().length) {
        z.value = !0;
        return;
      }
      B.value = n, I({ node: g, placement: h });
      const O = l.bottom - c.scrollAreaHeight, ye = (e.clientY - O) / (l.bottom - O), be = l.top + c.scrollAreaHeight, Ve = (be - e.clientY) / (be - l.top);
      ye > 0 ? we(ye) : Ve > 0 ? we(-Ve) : G();
    }, ve = (e, t) => {
      const n = document.elementFromPoint(e, t), o = n != null && n.getAttribute("path") ? n : ge(n);
      let s, l;
      if (o) {
        if (!o)
          return;
        s = P(JSON.parse(o.getAttribute("path")));
        const i = o.offsetHeight, r = c.edgeSize, a = t - o.getBoundingClientRect().top;
        s.isLeaf ? l = a >= i / 2 ? "after" : "before" : a <= r ? l = "before" : a >= i - r ? l = "after" : l = "inside";
      } else {
        const r = u().ref.value.getBoundingClientRect();
        t > r.top + r.height / 2 ? (l = "after", s = he()) : (l = "before", s = W());
      }
      return { node: s, placement: l };
    }, ge = (e) => e ? e.getAttribute("path") ? e : ge(e.parentElement) : null, Ye = (e) => {
      if (!f.value || !B.value)
        return;
      const n = u().ref.value.getBoundingClientRect();
      if (e.clientY >= n.bottom) {
        const o = structuredClone(j.value);
        I({ node: o[0], placement: "after" });
      } else
        e.clientY < n.top && I({ node: W(), placement: "before" });
    }, Je = (e) => u().ref.value.querySelector(`[path="${JSON.stringify(e)}"]`), he = () => {
      let e = null;
      return w((t) => {
        e = t;
      }), e;
    }, W = () => P([0]), Fe = (e, t) => {
      let n = null;
      return w((o) => {
        if (!(me(o.path, e) < 1) && (!t || t(o)))
          return n = o, !1;
      }), n;
    }, Ke = (e, t) => {
      let n = [];
      w((s) => {
        if (me(s.path, e) >= 0)
          return !1;
        n.push(s);
      });
      let o = n.length;
      for (; o--; ) {
        const s = n[o];
        if (!t || t(s))
          return s;
      }
      return null;
    }, me = (e, t) => {
      for (let n = 0; n < e.length; n++) {
        if (t[n] == null || e[n] > t[n])
          return 1;
        if (e[n] < t[n])
          return -1;
      }
      return t[e.length] == null ? 0 : -1;
    }, Se = (e, t) => {
      if (e.button === 0) {
        if (!f.value) {
          u().onNodeMousedownHandler(e, t);
          return;
        }
        A.value = !0;
      }
    }, we = (e) => {
      const t = u().ref.value;
      M.value !== e && ($.value && G(), M.value = e, $.value = setInterval(() => {
        t.scrollTop += c.maxScrollSpeed * e;
      }, 20));
    }, G = () => {
      clearInterval($.value), $.value = 0, M.value = 0;
    }, Ne = (e) => {
      B.value && Q(e);
    }, Q = (e, t = null) => {
      if (e.button !== 0)
        return;
      if (!f.value) {
        u().onNodeMouseupHandler(e, t);
        return;
      }
      if (A.value = !1, !B.value && t && !z.value && q(t.path, !1, e), z.value = !1, !d.value) {
        T();
        return;
      }
      const n = te();
      for (let r of n) {
        if (r.pathStr == d.value.node.pathStr) {
          T();
          return;
        }
        if (qe(r, d.value.node)) {
          T();
          return;
        }
      }
      const o = y(v.value), s = [];
      for (let r of n) {
        const g = Y(o, r.path)[r.ind];
        s.push(g);
      }
      let l = !1;
      if (Le(n, d.value, () => l = !0), l) {
        T();
        return;
      }
      const i = [];
      for (let r of s)
        i.push(y(r)), r.toBeDeleted = !0;
      xe(d.value, i, o), oe((r, a, g) => {
        r.toBeDeleted && a.splice(g, 1);
      }, o), R.value = null, H(o), He(n, d.value, e), T();
    }, Me = (e, t) => {
      c.allowToggleBranch && (ee({ path: t.path, patch: { isExpanded: !t.isExpanded } }), Te(t, e), e.stopPropagation());
    }, T = () => {
      B.value = !1, A.value = !1, I(null), G();
    }, Z = () => c.parentContext, u = () => f.value ? J : c.rootContext, Y = (e, t) => t.length === 1 ? e : Y(e[t[0]].children, t.slice(1)), ee = ({ path: e, patch: t }) => {
      if (!f.value) {
        ie("updateNode", { path: e, patch: t });
        return;
      }
      const n = JSON.stringify(e), o = y(v.value);
      w((s, l) => {
        if (s.pathStr === n)
          return Ie(l, t), !1;
      }, o), H(o);
    }, Ce = () => {
      const e = [];
      return w((t) => {
        t.isSelected && e.push(t);
      }), e;
    }, Xe = (e, t) => JSON.stringify(e.path.slice(0, t.path.length)) === t.pathStr, te = () => {
      const e = [];
      return w((t) => {
        t.isSelected && t.isDraggable && (e.some((o) => Xe(t, o)) || e.push(t));
      }), e;
    }, w = (e, t = null, n = []) => {
      t || (t = v.value);
      let o = !1;
      const s = [];
      for (let l = 0; l < t.length; l++) {
        const i = t[l], r = n.concat(l), a = P(r, i, t);
        if (o = e(a, i, t) === !1, a && s.push(a), o || i.children && (o = w(e, i.children, r) === !1, o))
          break;
      }
      return o ? !1 : s;
    }, oe = (e, t) => {
      let n = t.length;
      for (; n--; ) {
        const o = t[n];
        o.children && oe(e, o.children), e(o, t, n);
      }
      return t;
    }, je = (e) => {
      const t = e.map((o) => JSON.stringify(o)), n = y(v.value);
      w((o, s, l) => {
        for (const i of t)
          o.pathStr === i && (s.toBeDeleted = !0);
      }, n), oe((o, s, l) => {
        o.toBeDeleted && s.splice(l, 1);
      }, n), H(n);
    }, xe = (e, t, n) => {
      const o = y(e), s = o.node, l = Y(n, s.path), i = l[s.ind];
      if (o.placement === "inside")
        i.children = i.children || [], i.children.unshift(...t);
      else {
        const r = o.placement === "before" ? s.ind : s.ind + 1;
        l.splice(r, 0, ...t);
      }
    }, Ue = (e, t) => {
      const n = Array.isArray(t) ? t : [t], o = y(v.value);
      xe(e, n, o), H(o);
    }, qe = (e, t) => {
      const o = y(t).path;
      return JSON.stringify(o.slice(0, e.path.length)) == e.pathStr;
    }, y = (e) => JSON.parse(JSON.stringify(e)), J = {
      getRoot: u,
      setCursorPosition: I,
      currentNodes: j,
      cursorPosition: d,
      emit: ie,
      ref: ae,
      onNodeMousedownHandler: Se,
      onNodeMouseupHandler: Q,
      onMousemoveHandler: pe,
      getCursorPositionFromCoords: ve,
      updateNode: ee,
      getNode: P,
      traverse: w,
      select: q,
      getNodeEl: Je,
      getFirstNode: W,
      getLastNode: he,
      getNextNode: Fe,
      getPrevNode: Ke,
      getSelected: Ce,
      insert: Ue,
      remove: je,
      rootCursorPosition: K,
      selectionSize: de
    };
    return k(J), (e, t) => {
      const n = Ge("SlVueTreeNext", !0);
      return m(), N("div", {
        ref_key: "rootRef",
        ref: ae,
        class: re(["sl-vue-tree-next", { "sl-vue-tree-next-root": f.value }]),
        onMousemove: pe,
        onMouseleave: Ye
      }, [
        V("div", tt, [
          (m(!0), N(Ee, null, Be(j.value, (o, s) => (m(), N("div", {
            class: re(["sl-vue-tree-next-node", { "sl-vue-tree-next-selected": o.isSelected }])
          }, [
            V("div", {
              class: "sl-vue-tree-next-cursor sl-vue-tree-next-cursor_before",
              onDragover: t[0] || (t[0] = le(() => {
              }, ["prevent"])),
              style: _e({
                visibility: d.value && d.value.node.pathStr === o.pathStr && d.value.placement === "before" ? "visible" : "hidden",
                "--depth": ce.value
              })
            }, null, 36),
            V("div", {
              class: re(["sl-vue-tree-next-node-item", {
                "sl-vue-tree-next-cursor-hover": d.value && d.value.node.pathStr === o.pathStr,
                "sl-vue-tree-next-cursor-inside": d.value && d.value.placement === "inside" && d.value.node.pathStr === o.pathStr,
                "sl-vue-tree-next-node-is-leaf": o.isLeaf,
                "sl-vue-tree-next-node-is-folder": !o.isLeaf
              }]),
              onMousedown: (l) => Se(l, o),
              onMouseup: (l) => Q(l, o),
              onContextmenu: (l) => Re(o, l),
              onDblclick: (l) => $e(o, l),
              onClick: (l) => Oe(o, l),
              onDragover: (l) => Ae(o, l),
              onDrop: (l) => ze(o, l),
              path: o.pathStr
            }, [
              (m(!0), N(Ee, null, Be(ue.value, (l) => (m(), N("div", nt))), 256)),
              e.level && e.showBranches ? (m(), N("div", lt, [
                C(e.$slots, "branch", { node: o }, () => [
                  o.isLastChild ? D("", !0) : (m(), N("span", st, b("├") + b("─") + "  ", 1)),
                  o.isLastChild ? (m(), N("span", rt, b("└") + b("─") + "  ", 1)) : D("", !0)
                ])
              ])) : D("", !0),
              V("div", it, [
                o.isLeaf ? D("", !0) : (m(), N("span", {
                  key: 0,
                  class: "sl-vue-tree-next-toggle",
                  onClick: (l) => Me(l, o)
                }, [
                  C(e.$slots, "toggle", { node: o }, () => [
                    V("span", null, b(o.isLeaf ? "" : o.isExpanded ? "-" : "+"), 1)
                  ])
                ], 8, at)),
                C(e.$slots, "title", { node: o }, () => [
                  se(b(o.title), 1)
                ]),
                !o.isLeaf && o.children.length == 0 && o.isExpanded ? C(e.$slots, "empty-node", {
                  key: 1,
                  node: o
                }) : D("", !0)
              ]),
              V("div", ut, [
                C(e.$slots, "sidebar", { node: o })
              ])
            ], 42, ot),
            o.children && o.children.length && o.isExpanded ? (m(), Qe(n, {
              key: 0,
              "model-value": o.children,
              level: o.level,
              "parent-ind": s,
              "allow-multiselect": e.allowMultiselect,
              "allow-toggle-branch": e.allowToggleBranch,
              "edge-size": e.edgeSize,
              "show-branches": e.showBranches,
              "parent-context": J,
              "root-context": f.value ? J : e.rootContext,
              onUpdateNode: ee,
              onDragover: t[1] || (t[1] = le(() => {
              }, ["prevent"]))
            }, {
              title: F(({ node: l }) => [
                C(e.$slots, "title", { node: l }, () => [
                  se(b(l.title), 1)
                ])
              ]),
              toggle: F(({ node: l }) => [
                C(e.$slots, "toggle", { node: l }, () => [
                  V("span", null, b(l.isLeaf ? "" : l.isExpanded ? "-" : "+"), 1)
                ])
              ]),
              sidebar: F(({ node: l }) => [
                C(e.$slots, "sidebar", { node: l })
              ]),
              "empty-node": F(({ node: l }) => [
                !l.isLeaf && l.children.length == 0 && l.isExpanded ? C(e.$slots, "empty-node", {
                  key: 0,
                  node: l
                }) : D("", !0)
              ]),
              _: 2
            }, 1032, ["model-value", "level", "parent-ind", "allow-multiselect", "allow-toggle-branch", "edge-size", "show-branches", "root-context"])) : D("", !0),
            V("div", {
              class: "sl-vue-tree-next-cursor sl-vue-tree-next-cursor_after",
              onDragover: t[2] || (t[2] = le(() => {
              }, ["prevent"])),
              style: _e({
                visibility: d.value && d.value.node.pathStr === o.pathStr && d.value.placement === "after" ? "visible" : "hidden",
                "--depth": ce.value
              })
            }, null, 36)
          ], 2))), 256)),
          f.value ? et((m(), N("div", {
            key: 0,
            ref_key: "dragInfoRef",
            ref: L,
            class: "sl-vue-tree-next-drag-info"
          }, [
            C(e.$slots, "draginfo", {}, () => [
              se(" Items: " + b(de.value), 1)
            ])
          ], 512)), [
            [Ze, B.value]
          ]) : D("", !0)
        ], 512)
      ], 34);
    };
  }
});
export {
  pt as SlVueTreeNext
};

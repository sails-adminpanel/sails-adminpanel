var b = { exports: {} }, f = {};
var C;
function M() {
  if (C) return f;
  C = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), m = /* @__PURE__ */ Symbol.for("react.fragment");
  function c(i, s, t) {
    var a = null;
    if (t !== void 0 && (a = "" + t), s.key !== void 0 && (a = "" + s.key), "key" in s) {
      t = {};
      for (var d in s)
        d !== "key" && (t[d] = s[d]);
    } else t = s;
    return s = t.ref, {
      $$typeof: n,
      type: i,
      key: a,
      ref: s !== void 0 ? s : null,
      props: t
    };
  }
  return f.Fragment = m, f.jsx = c, f.jsxs = c, f;
}
var N;
function U() {
  return N || (N = 1, b.exports = M()), b.exports;
}
var e = U();
const S = window.React.useEffect, p = window.React.useState, V = window.JSComponents.AddForm, y = window.UIComponents.Button, I = window.UIComponents.Checkbox, T = window.UIComponents.Input, v = window.UIComponents.Label, P = window.UIComponents.Select, $ = window.UIComponents.SelectContent, q = window.UIComponents.SelectItem, A = window.UIComponents.SelectTrigger, J = window.UIComponents.SelectValue, R = window.LucideReact.LoaderCircle, z = window.LucideReact.Plus, j = window.axios;
function G(n) {
  return n.mode === "update" ? /* @__PURE__ */ e.jsx(O, { ...n }) : /* @__PURE__ */ e.jsx(D, { ...n });
}
function D({ template: n, itemType: m, parentId: c, actions: i }) {
  const [s, t] = p(!1), [a, d] = p(!1), [x, u] = p(!1), l = n.data, h = async (r) => {
    try {
      u(!0), (await j.post("", {
        data: {
          record: r,
          parentId: c,
          targetBlank: s,
          visible: a,
          _method: "select",
          type: m
        },
        _method: "createItem"
      })).data && (i.close(), await i.reload(null));
    } catch (w) {
      console.error(w);
    } finally {
      u(!1);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-4 flex-col", children: [
      /* @__PURE__ */ e.jsxs("div", { className: `grid gap-4 ${l.items.length ? "" : "opacity-50 pointer-events-none"}`, children: [
        /* @__PURE__ */ e.jsx(v, { children: l.labels.selectTitle }),
        /* @__PURE__ */ e.jsxs(P, { onValueChange: h, disabled: x, children: [
          /* @__PURE__ */ e.jsx(A, { className: "w-full max-w-[170px] cursor-pointer", children: /* @__PURE__ */ e.jsx(J, { placeholder: l.labels.selectTitle }) }),
          /* @__PURE__ */ e.jsx($, { className: "z-[1003]", children: l.items.map((r) => /* @__PURE__ */ e.jsx(q, { value: r.id.toString(), children: r.name }, `${r.id}-${r.name}`)) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        E,
        {
          labels: l.labels,
          targetBlank: s,
          visible: a,
          onTargetBlankChange: t,
          onVisibleChange: d
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "mt-8", children: /* @__PURE__ */ e.jsx("span", { children: /* @__PURE__ */ e.jsx("b", { children: l.labels.OR }) }) }),
    /* @__PURE__ */ e.jsxs(y, { className: "mt-8", onClick: () => i.openModelAdd(l.model), children: [
      /* @__PURE__ */ e.jsx(z, {}),
      l.labels.createTitle
    ] })
  ] });
}
function O({ template: n, selectedItem: m, messages: c, actions: i }) {
  const [s, t] = p(null), a = n.data.item, d = n.data.model ?? a.type ?? m?.type;
  S(() => {
    (async () => {
      const l = await j.get(`${window.routePrefix}/model/${d}/edit/${a.modelId}?without_layout=true`);
      t(l.data);
    })().catch(console.error);
  }, [a.modelId, d]);
  const x = async (u, l, h) => {
    const r = u[0];
    r.targetBlank = l, r.visible = h, r.treeId = a.id;
    const w = await j.put("", {
      type: a.type,
      data: { record: r },
      modelId: a.modelId,
      _method: "updateItem"
    });
    i.close(), await i.reload(w.data.data);
  };
  return s ? /* @__PURE__ */ e.jsx(
    V,
    {
      page: s,
      catalog: !0,
      callback: x,
      openNewWindowLabel: c["Open in a new window"],
      visibleLable: c.Visible,
      openNewWindow: a.targetBlank,
      DnavVisible: a.visible,
      isNavigation: !0
    }
  ) : /* @__PURE__ */ e.jsx(R, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 animate-spin" });
}
function W(n) {
  return /* @__PURE__ */ e.jsx(L, { ...n, templateType: "group" });
}
function Y(n) {
  return /* @__PURE__ */ e.jsx(L, { ...n, templateType: "link" });
}
function L({
  mode: n,
  template: m,
  parentId: c,
  actions: i,
  templateType: s
}) {
  const t = m.data, [a, d] = p({}), [x, u] = p(!1), [l, h] = p(!1), [r, w] = p(!1);
  S(() => {
    if (t.item) {
      d({
        name: t.item.name || "",
        ...Object.fromEntries(t.items.map((o) => [
          o.name,
          t.item ? t.item[o.name] : ""
        ]))
      }), u(t.item.targetBlank || !1), h(t.item.visible || !1);
      return;
    }
    d({
      name: "",
      ...Object.fromEntries(t.items.map((o) => [o.name, ""]))
    }), u(!1), h(!1);
  }, [t.item, t.items]);
  const k = (o) => {
    const { name: g, value: _ } = o.target;
    d((F) => ({ ...F, [g]: _ }));
  }, B = async (o) => {
    o.preventDefault(), w(!0);
    try {
      if (n === "update") {
        const g = await j.put("", {
          type: t.item?.type,
          modelId: t.item?.id,
          data: {
            ...t.item,
            ...a,
            targetBlank: x,
            visible: l
          },
          _method: "updateItem"
        });
        i.close(), await i.reload(g.data.data);
        return;
      }
      await j.post("", {
        data: {
          ...a,
          targetBlank: x,
          visible: l,
          parentId: c,
          type: s
        },
        _method: "createItem"
      }), i.close(), await i.reload(null);
    } catch (g) {
      console.error(g);
    } finally {
      w(!1);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ e.jsxs("form", { className: "grid gap-6", id: "navigation-group-link-template", onSubmit: B, children: [
      /* @__PURE__ */ e.jsx(
        E,
        {
          labels: t.labels,
          targetBlank: x,
          visible: l,
          onTargetBlankChange: u,
          onVisibleChange: h
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ e.jsx(v, { htmlFor: "name", children: t.labels.title }),
        /* @__PURE__ */ e.jsx(
          T,
          {
            required: !0,
            value: a.name || "",
            name: "name",
            placeholder: t.labels.title,
            onChange: k
          }
        )
      ] }),
      t.items.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ e.jsx(v, { children: o.label }),
        /* @__PURE__ */ e.jsx(
          T,
          {
            required: o.required,
            value: a[o.name] || "",
            name: o.name,
            placeholder: o.label,
            onChange: k
          }
        )
      ] }, o.name))
    ] }),
    /* @__PURE__ */ e.jsxs(y, { className: "mt-8 w-fit", form: "navigation-group-link-template", type: "submit", disabled: r, children: [
      t.labels.save,
      r && /* @__PURE__ */ e.jsx(R, { className: "h-4 w-4 animate-spin ml-2" })
    ] })
  ] });
}
function E({
  labels: n,
  targetBlank: m,
  visible: c,
  onTargetBlankChange: i,
  onVisibleChange: s
}) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-4 items-center", children: [
      /* @__PURE__ */ e.jsx(
        I,
        {
          id: "targetBlank",
          checked: m,
          onCheckedChange: (t) => i(!!t),
          className: "cursor-pointer size-5"
        }
      ),
      /* @__PURE__ */ e.jsx(v, { htmlFor: "targetBlank", children: n.openInNewWindow })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-4 items-center", children: [
      /* @__PURE__ */ e.jsx(
        I,
        {
          id: "visible",
          checked: c,
          onCheckedChange: (t) => s(!!t),
          className: "cursor-pointer size-5"
        }
      ),
      /* @__PURE__ */ e.jsx(v, { htmlFor: "visible", children: n.visible })
    ] })
  ] });
}
export {
  W as NavigationGroupTemplate,
  Y as NavigationLinkTemplate,
  G as NavigationModelLinkTemplate
};

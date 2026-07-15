var x = { exports: {} }, c = {};
var h;
function g() {
  if (h) return c;
  h = 1;
  var d = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.fragment");
  function a(i, t, n) {
    var r = null;
    if (n !== void 0 && (r = "" + n), t.key !== void 0 && (r = "" + t.key), "key" in t) {
      n = {};
      for (var o in t)
        o !== "key" && (n[o] = t[o]);
    } else n = t;
    return t = n.ref, {
      $$typeof: d,
      type: i,
      key: r,
      ref: t !== void 0 ? t : null,
      props: n
    };
  }
  return c.Fragment = l, c.jsx = a, c.jsxs = a, c;
}
var w;
function R() {
  return w || (w = 1, x.exports = g()), x.exports;
}
var e = R();
const u = window.React.useState, I = window.UIComponents.Button, T = window.UIComponents.Select, k = window.UIComponents.SelectContent, j = window.UIComponents.SelectItem, U = window.UIComponents.SelectTrigger, N = window.UIComponents.SelectValue, b = window.axios, E = window.UIComponents.Textarea, p = window.UIComponents.Label, L = window.UIComponents.Checkbox, _ = window.UIComponents.Toaster, f = window.sonner.toast, A = window.LucideReact;
function F({ data: d }) {
  const [l, a] = u(""), [i, t] = u(""), [n, r] = u(!1), [o, v] = u(!1), C = async (s) => {
    s.preventDefault(), r(!0);
    try {
      const m = {
        message: i,
        ...o ? { sendToAll: !0 } : { userId: l }
      }, S = await b.post("", m);
      console.log(S.data), f.success("Сообщение успешно отправлено!");
    } catch (m) {
      console.error(m), f.error("Ошибка при отправке сообщения.");
    } finally {
      r(!1);
    }
  };
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(_, { position: "top-center", richColors: !0, closeButton: !0 }),
    /* @__PURE__ */ e.jsx("div", { className: "grid gap-4", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: C, className: "flex flex-col gap-4 max-w-[400px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          L,
          {
            id: "send-to-all",
            checked: o,
            onCheckedChange: (s) => {
              v(s), s && a("");
            }
          }
        ),
        /* @__PURE__ */ e.jsx(p, { htmlFor: "send-to-all", children: "Всем пользователям" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx(p, { htmlFor: "user-select", className: "block mb-2 font-medium", children: "Выберите пользователя:" }),
        /* @__PURE__ */ e.jsxs(
          T,
          {
            onValueChange: (s) => a(s),
            value: l,
            disabled: o,
            children: [
              /* @__PURE__ */ e.jsx(U, { id: "user-select", className: "w-full", children: /* @__PURE__ */ e.jsx(N, { placeholder: "-- Выберите --" }) }),
              /* @__PURE__ */ e.jsx(k, { children: d?.users?.length > 0 ? d.users.map((s) => /* @__PURE__ */ e.jsx(j, { value: s.id.toString(), children: s.fullName }, s.id)) : /* @__PURE__ */ e.jsx(j, { value: "", disabled: !0, children: "Пользователей нет" }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx(p, { htmlFor: "message-input", className: "block mb-2 font-medium", children: "Сообщение:" }),
        /* @__PURE__ */ e.jsx(
          E,
          {
            id: "message-input",
            value: i,
            onChange: (s) => t(s.target.value),
            placeholder: "Введите сообщение..."
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 items-center", children: [
        /* @__PURE__ */ e.jsx(
          I,
          {
            type: "submit",
            className: "w-fit",
            disabled: n || !o && !l || !i.trim(),
            children: n ? "Отправка..." : "Отправить"
          }
        ),
        n && /* @__PURE__ */ e.jsx(A.Loader2, { className: "w-6 h-6 animate-spin" })
      ] })
    ] }) })
  ] });
}
export {
  F as default
};

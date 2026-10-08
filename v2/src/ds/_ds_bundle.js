/* @ds-bundle: {"format":4,"namespace":"SymptomMapDesignSystem_dfef9e","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Count","sourcePath":"components/feedback/Badge.jsx"},{"name":"InlineMessage","sourcePath":"components/feedback/InlineMessage.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"CodeInput","sourcePath":"components/forms/CodeInput.jsx"},{"name":"PillSelect","sourcePath":"components/forms/PillSelect.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/icons/Icon.jsx"},{"name":"Connection","sourcePath":"components/map/Connection.jsx"},{"name":"ConnectionLayer","sourcePath":"components/map/Connection.jsx"},{"name":"DiagnosisChip","sourcePath":"components/map/DiagnosisChip.jsx"},{"name":"DiagnosisNode","sourcePath":"components/map/DiagnosisNode.jsx"},{"name":"SourceTag","sourcePath":"components/map/SourceTag.jsx"},{"name":"SuggestionCard","sourcePath":"components/map/SuggestionCard.jsx"},{"name":"SymptomNode","sourcePath":"components/map/SymptomNode.jsx"},{"name":"SymptomRow","sourcePath":"components/map/SymptomRow.jsx"},{"name":"RING","sourcePath":"components/map/diagnosisColor.js"},{"name":"AI_COLOR","sourcePath":"components/map/diagnosisColor.js"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"MapControls","sourcePath":"components/navigation/MapControls.jsx"},{"name":"MapStatus","sourcePath":"components/navigation/MapControls.jsx"},{"name":"SidebarGroup","sourcePath":"components/navigation/SidebarGroup.jsx"},{"name":"StepCard","sourcePath":"components/onboarding/StepCard.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/surfaces/Card.jsx"},{"name":"Modal","sourcePath":"components/surfaces/Modal.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"eef2af606ae8","components/buttons/Button.jsx":"8ec981041876","components/buttons/IconButton.jsx":"e4e16827f34b","components/feedback/Badge.jsx":"8b4955248e71","components/feedback/InlineMessage.jsx":"935cc5d66b27","components/forms/Checkbox.jsx":"12b49ac6182a","components/forms/CodeInput.jsx":"cdae30f52ed5","components/forms/PillSelect.jsx":"5f32ad2d0efc","components/forms/Radio.jsx":"a4200107a17c","components/forms/Select.jsx":"e4380d675269","components/forms/TextField.jsx":"153bc8aedb3d","components/icons/Icon.jsx":"86304e4f5292","components/map/Connection.jsx":"cfcb5b63b5b3","components/map/DiagnosisChip.jsx":"d814a4ed7ec3","components/map/DiagnosisNode.jsx":"a3f5d984fb9b","components/map/SourceTag.jsx":"31b26945ca05","components/map/SuggestionCard.jsx":"64a8579cefb9","components/map/SymptomNode.jsx":"f238ffcc2deb","components/map/SymptomRow.jsx":"b053b3b5a3dc","components/map/diagnosisColor.js":"1d89d6be37a5","components/navigation/AppHeader.jsx":"dd177a575181","components/navigation/MapControls.jsx":"2c090e023431","components/navigation/SidebarGroup.jsx":"caf7221a2339","components/onboarding/StepCard.jsx":"12cc348f7c0c","components/surfaces/Card.jsx":"e171ead697bf","components/surfaces/Modal.jsx":"8455e07f3074","ui_kits/app/App.jsx":"a05aa5892ef3","ui_kits/app/DetailPanel.jsx":"c21ba0893060","ui_kits/app/MapCanvas.jsx":"4e8d74124bd3","ui_kits/app/Modals.jsx":"681054e000fb","ui_kits/app/Onboarding.jsx":"dc34157bd343","ui_kits/app/ReviewPanel.jsx":"ff7eed8c9866","ui_kits/app/Sidebar.jsx":"6cccd4421e80","ui_kits/app/data.js":"ca194662bf1e"},"inlinedExternals":[],"unexposedExports":[{"name":"addSlot","sourcePath":"components/map/diagnosisColor.js"},{"name":"assignSlots","sourcePath":"components/map/diagnosisColor.js"},{"name":"dxVars","sourcePath":"components/map/diagnosisColor.js"},{"name":"minSeparation","sourcePath":"components/map/diagnosisColor.js"},{"name":"ringDistance","sourcePath":"components/map/diagnosisColor.js"}]} */

(() => {

const __ds_ns = (window.SymptomMapDesignSystem_dfef9e = window.SymptomMapDesignSystem_dfef9e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
/* The mark is a small map: one person's diagnoses, connected — the original SymptomMap mark.
   No container disc and no ring: the constellation sits directly on cream, white or a neutral plate.
   The cyan-to-purple gradient belongs to the NAME only — never to the mark, never to UI. */
function Mark({
  size,
  flat
}) {
  if (flat) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 200",
      width: size,
      height: size,
      "aria-hidden": "true",
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "100",
      cy: "100",
      r: "100",
      fill: "#1a1a1a"
    }), /*#__PURE__*/React.createElement("g", {
      stroke: "#faf7f0",
      strokeOpacity: "0.75",
      strokeWidth: "2.6",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M52 104 L88 66"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M88 66 L120 96"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M52 104 L84 118"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M84 118 L64 142"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M64 142 L120 96"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M120 96 L152 74"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M120 96 L155 118"
    })), /*#__PURE__*/React.createElement("g", {
      fill: "#faf7f0"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "52",
      cy: "104",
      r: "21"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "88",
      cy: "66",
      r: "13"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "120",
      cy: "96",
      r: "17"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "84",
      cy: "118",
      r: "9"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "64",
      cy: "142",
      r: "11"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "152",
      cy: "74",
      r: "8"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "155",
      cy: "118",
      r: "7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "132",
      cy: "146",
      r: "5"
    })));
  }
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: size,
    height: size,
    "aria-hidden": "true",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeOpacity: "0.55",
    strokeWidth: "2.4",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M52 104 L88 66",
    stroke: "#4ba3f7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M88 66 L120 96",
    stroke: "#9190f8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 104 L84 118",
    stroke: "#c080df"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M84 118 L64 142",
    stroke: "#ed737b"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M64 142 L120 96",
    stroke: "#faca4b"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 96 L152 74",
    stroke: "#5ebd69"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 96 L155 118",
    stroke: "#13bfa5"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "52",
    cy: "104",
    r: "21",
    fill: "#4ba3f7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "88",
    cy: "66",
    r: "13",
    fill: "#df75b2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "120",
    cy: "96",
    r: "17",
    fill: "#9190f8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "84",
    cy: "118",
    r: "9",
    fill: "#c080df"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "142",
    r: "11",
    fill: "#ed737b"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "152",
    cy: "74",
    r: "8",
    fill: "#5ebd69"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "155",
    cy: "118",
    r: "7",
    fill: "#f68d4d"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "132",
    cy: "146",
    r: "5",
    fill: "#c7e03e"
  }));
}
function Logo({
  variant = "lockup",
  size = 34,
  tagline = false,
  className = ""
}) {
  const flat = variant === "flat";
  const nameSize = variant === "lockup" ? Math.round(size * 0.58) : Math.round(size * 0.7);
  if (variant === "mark") return /*#__PURE__*/React.createElement(Mark, {
    size: size,
    flat: false
  });
  if (variant === "mark-flat") return /*#__PURE__*/React.createElement(Mark, {
    size: size,
    flat: true
  });
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-logo", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement(Mark, {
    size: size,
    flat: flat
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, variant === "wordmark" ? /*#__PURE__*/React.createElement("div", {
    className: "sm-logo__name sm-logo__name--gradient",
    style: {
      fontSize: nameSize + "px"
    }
  }, "SymptomMap") : /*#__PURE__*/React.createElement("div", {
    className: "sm-logo__name",
    style: {
      fontSize: nameSize + "px"
    }
  }, "Symptom", /*#__PURE__*/React.createElement("span", {
    className: "sm-logo__map"
  }, "Map")), tagline ? /*#__PURE__*/React.createElement("div", {
    className: "sm-logo__tagline"
  }, "Making comorbidity visible") : null));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* SymptomMap button. Cyan #48CAE4 with a charcoal label; hover deepens to #00B4D8.
   Radius 16, min-height 46, Plus Jakarta Sans 15/600, comfortable 22-24px padding.
   Text only — a button with a label never also carries an icon. */
function Button({
  variant = "primary",
  size = "md",
  wrap = false,
  block = false,
  grow = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const cls = ["sm-btn", "sm-btn--" + variant, size === "sm" ? "sm-btn--sm" : "", wrap ? "sm-btn--wrap" : "", block ? "sm-btn--block" : "", grow ? "sm-btn--grow" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    disabled: disabled
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Icon-only utility button — 44x44 at radius 16 (36x36 at radius 14 for sm). Light cyan hover.
   Always needs an accessible label: an icon never carries meaning alone. */
function IconButton({
  label,
  variant = "outline",
  size = "md",
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const cls = ["sm-icon-btn", size === "sm" ? "sm-icon-btn--sm" : "", variant === "ghost" ? "sm-icon-btn--ghost" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label,
    title: label,
    disabled: disabled
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
/* Small tag in the UI face. Rectangular, so feedback and metadata never read as a diagnosis
   (diagnosis colour is round). */
function Badge({
  tone = "neutral",
  className = "",
  children
}) {
  const cls = ["sm-badge", tone === "ai" ? "sm-badge--ai" : "", tone === "success" ? "sm-badge--success" : "", tone === "error" ? "sm-badge--error" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", {
    className: cls
  }, children);
}

/* Count pill used beside sidebar group titles. */
function Count({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "sm-count"
  }, children);
}
Object.assign(__ds_scope, { Badge, Count });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/forms/CodeInput.jsx
try { (() => {
/* Verification code — n mono cells on the input grammar (radius 12, 1.5px border).
   Filled and focused cells take the cyan border; the whole group errors together. */
function CodeInput({
  label,
  length = 5,
  value = "",
  error,
  disabled = false,
  onChange,
  hint,
  className = ""
}) {
  const chars = String(value).slice(0, length).split("");
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-field", disabled ? "is-disabled" : "", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__label"
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "sm-code"
  }, Array.from({
    length: length
  }).map(function (_, i) {
    const ch = chars[i] || "";
    return /*#__PURE__*/React.createElement("input", {
      key: i,
      className: ["sm-code__cell", ch ? "is-filled" : "", error ? "is-error" : ""].filter(Boolean).join(" "),
      inputMode: "numeric",
      maxLength: 1,
      value: ch,
      disabled: disabled,
      "aria-label": "Digito " + (i + 1),
      onChange: function (e) {
        if (!onChange) return;
        const next = chars.slice();
        next[i] = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
        onChange(next.join(""));
      }
    });
  })), error ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint sm-field__hint--error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { CodeInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/CodeInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/* Radio and checkbox share one shell: 20px control, 1.5px warm border,
   cyan fill with a charcoal mark when checked. */
function Radio({
  label,
  help,
  checked = false,
  disabled = false,
  error = false,
  name,
  onChange,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["sm-choice", "sm-choice--radio", checked ? "is-checked" : "", disabled ? "is-disabled" : "", error ? "is-error" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__box"
  }, checked ? /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__mark"
  }) : null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__label"
  }, label), help ? /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__help"
  }, help) : null));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Interface icon set: 24px grid, stroke 1.6, round caps and joins, exactly one colour.
   Never two colours inside one icon, never filled or shadowed glyphs, never emoji. */
const SHAPES = {
  add: /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  }),
  minus: /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }),
  close: /*#__PURE__*/React.createElement("path", {
    d: "M6.5 6.5l11 11M17.5 6.5l-11 11"
  }),
  expand: /*#__PURE__*/React.createElement("path", {
    d: "M6 9.5l6 6 6-6"
  }),
  edit: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 20l4.2-1L19 8.2 15.8 5 5 15.8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6l3 3"
  })),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "6.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 16l4.5 4.5"
  })),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11v5.5M12 8.2v.2"
  })),
  alert: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5v5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16.2v.2"
  })),
  suggest: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 4.5 L13.7 9.3 L18.5 11 L13.7 12.7 L12 17.5 L10.3 12.7 L5.5 11 L10.3 9.3 Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18.6",
    cy: "17.6",
    r: "1.5"
  })),
  connect: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "8",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "16",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 9.6l6 4.8"
  })),
  node: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "7.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2.4"
  })),
  date: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "6",
    width: "15",
    height: "13",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 4v3.4M15.5 4v3.4M4.5 10.5h15"
  })),
  fullscreen: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 5h5v5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 5l-6.5 6.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 19H5v-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 19l6.5-6.5"
  })),
  accept: /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4 10-10"
  }),
  check: /*#__PURE__*/React.createElement("path", {
    d: "M5 12.5l4.5 4.5L19 7.5"
  }),
  eye: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 12S7 6.5 12 6.5 20.5 12 20.5 12 17 17.5 12 17.5 3.5 12 3.5 12z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2.6"
  }))
};
function Icon({
  name,
  size = 24,
  color = "var(--sm-ink)",
  strokeWidth = 1.6,
  className = "",
  ...rest
}) {
  const shape = SHAPES[name];
  if (!shape) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
    className: className
  }, rest), shape);
}
const ICON_NAMES = Object.keys(SHAPES);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/feedback/InlineMessage.jsx
try { (() => {
/* Inline feedback next to the thing it is about. State colours are dark, saturated and
   rectangular; they never appear on a node, a chip or an edge. */
const GLYPH = {
  error: "alert",
  success: "accept",
  warning: "alert",
  info: "info"
};
const INK = {
  error: "var(--sm-error-ink)",
  success: "var(--sm-success-ink)",
  warning: "var(--sm-warning-ink)",
  info: "var(--sm-ink-meta)"
};
function InlineMessage({
  tone = "error",
  icon = true,
  className = "",
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ["sm-inline-msg", "sm-inline-msg--" + tone, className].filter(Boolean).join(" ")
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: GLYPH[tone] || "info",
    size: 14,
    color: INK[tone],
    strokeWidth: 1.8,
    style: {
      marginTop: "2px",
      flex: "none"
    }
  }) : null, /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { InlineMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/InlineMessage.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/* Same shell as Radio, square 6px corners: the check mark is charcoal on Cyan 400. */
function Checkbox({
  label,
  help,
  checked = false,
  disabled = false,
  error = false,
  onChange,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["sm-choice", "sm-choice--checkbox", checked ? "is-checked" : "", disabled ? "is-disabled" : "", error ? "is-error" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__box"
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13,
    strokeWidth: 2.6
  }) : null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__label"
  }, label), help ? /*#__PURE__*/React.createElement("span", {
    className: "sm-choice__help"
  }, help) : null));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/PillSelect.jsx
try { (() => {
/* Single- or multi-select pills. Selection is a TONAL FILL plus a check — never an outline. */
function PillSelect({
  label,
  options = [],
  value,
  multiple = false,
  disabled = false,
  onChange,
  hint,
  className = ""
}) {
  const selected = multiple ? value || [] : value == null ? [] : [value];
  const isOn = function (v) {
    return selected.indexOf(v) >= 0;
  };
  function pick(v) {
    if (!onChange) return;
    if (!multiple) return onChange(v);
    onChange(isOn(v) ? selected.filter(function (x) {
      return x !== v;
    }) : selected.concat([v]));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-field", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__label"
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px"
    },
    role: multiple ? "group" : "radiogroup"
  }, options.map(function (o) {
    const val = typeof o === "string" ? o : o.value;
    const lab = typeof o === "string" ? o : o.label;
    const on = isOn(val);
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      role: multiple ? "checkbox" : "radio",
      "aria-checked": on,
      disabled: disabled,
      onClick: function () {
        pick(val);
      },
      className: ["sm-pill", on ? "is-selected" : "", disabled ? "is-disabled" : ""].filter(Boolean).join(" ")
    }, on ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 12,
      strokeWidth: 2.4
    }) : null, lab);
  })), hint ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { PillSelect });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/PillSelect.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Select — the text field shell plus a chevron. Same 44px / radius 12 geometry. */
function Select({
  label,
  value,
  options = [],
  placeholder,
  hint,
  error,
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  const cls = ["sm-input", "sm-select", error ? "is-error" : "", disabled ? "is-disabled" : ""].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-field", disabled ? "is-disabled" : "", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "sm-field__label",
    htmlFor: id
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "sm-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    className: cls,
    value: value,
    disabled: disabled
  }, rest), placeholder ? /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder) : null, options.map(function (o) {
    const val = typeof o === "string" ? o : o.value;
    const lab = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-select-wrap__caret"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "expand",
    size: 16,
    color: "var(--sm-ink-meta)",
    strokeWidth: 1.8
  }))), error ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint sm-field__hint--error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* 46px min-height, radius 12, 1.5px warm border. The label sits above the field in sentence case;
   the placeholder is an EXAMPLE ("ej. 16"), never an instruction.
   Hover warms the border; focus takes the cyan-500 edge plus a charcoal inset stroke. */
function TextField({
  label,
  type = "text",
  value,
  placeholder,
  hint,
  error,
  disabled = false,
  focused = false,
  multiline = false,
  state,
  id,
  className = "",
  ...rest
}) {
  const isSearch = type === "search";
  const isPassword = type === "password";
  const inputCls = ["sm-input", multiline ? "sm-input--textarea" : "", error ? "is-error" : "", focused ? "is-focus" : "", disabled ? "is-disabled" : ""].filter(Boolean).join(" ");
  const field = multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: id,
    className: inputCls,
    value: value,
    placeholder: placeholder,
    disabled: disabled
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: isSearch ? "text" : type,
    className: inputCls,
    value: value,
    placeholder: placeholder,
    disabled: disabled
  }, rest));
  const wrapped = isSearch ? /*#__PURE__*/React.createElement("div", {
    className: "sm-input-affix"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-input-affix__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 17,
    color: "var(--sm-ink-meta)"
  })), field) : isPassword ? /*#__PURE__*/React.createElement("div", {
    className: "sm-input-affix sm-input-affix--trailing"
  }, field, /*#__PURE__*/React.createElement("span", {
    className: "sm-input-affix__icon"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-icon-btn sm-icon-btn--ghost",
    "aria-label": "Mostrar contrasena"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "eye",
    size: 15,
    color: "var(--sm-ink-meta)"
  })))) : field;
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-field", disabled ? "is-disabled" : "", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "sm-field__label",
    htmlFor: id
  }, label) : null, wrapped, error ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint sm-field__hint--error"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "alert",
    size: 14,
    color: "var(--sm-error-ink)",
    strokeWidth: 1.8
  }), error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__hint"
  }, hint) : null, state ? /*#__PURE__*/React.createElement("span", {
    className: "sm-field__state"
  }, state) : null);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/map/SuggestionCard.jsx
try { (() => {
/* An AI suggestion — the most emotionally sensitive surface in the product.
   Copy names the experience, not the label; it is always hedged, always reversible,
   never invalidating, and carries no severity or score. Two sentences is the ceiling. */
function SuggestionCard({
  title,
  body,
  sources,
  compact = false,
  accepted = false,
  acceptLabel = "Aceptar",
  rejectLabel = "Rechazar",
  onAccept,
  onReject,
  meta = "sugerencia · no confirmada",
  className = ""
}) {
  const cls = ["sm-suggestion", compact ? "sm-suggestion--compact" : "", accepted ? "is-accepted" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("article", {
    className: cls
  }, compact ? null : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "ai"
  }, "IA"), meta ? /*#__PURE__*/React.createElement(__ds_scope.Badge, null, meta) : null), /*#__PURE__*/React.createElement("h4", {
    className: "sm-suggestion__title"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "sm-suggestion__body"
  }, body), sources ? /*#__PURE__*/React.createElement("div", {
    className: "sm-suggestion__sources"
  }, sources) : null, /*#__PURE__*/React.createElement("div", {
    className: "sm-suggestion__actions"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: compact ? "sm" : "inline",
    grow: true,
    onClick: onAccept,
    disabled: accepted
  }, compact ? acceptLabel : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "accept",
    size: 15,
    strokeWidth: 2
  }), acceptLabel)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: compact ? "sm" : "inline",
    onClick: onReject,
    disabled: accepted
  }, rejectLabel)));
}
Object.assign(__ds_scope, { SuggestionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/SuggestionCard.jsx", error: String((e && e.message) || e) }); }

// components/map/diagnosisColor.js
try { (() => {
/* The diagnosis colour-assignment system.
   Colour is NOT a property of a diagnosis — it is assigned per map, chosen to keep one
   person's five or six nodes as far apart as possible. Two people can both have TDAH in
   different colours; inside one map, nothing looks alike.

   Rule 01 — even spread on create:  slot(i) = round(i * 10 / n). Deterministic.
   Rule 02 — widest gap on add:      a new diagnosis drops into the widest remaining gap;
                                     nothing already on the map ever recolours.
   Rule 03 — past ten, go deeper:    an 11th diagnosis reuses the ring at a darker value
                                     tier and the map switches to label-first rendering.
   Rule 04 — never leaves the map:   nodes, chips, edges and source tags only.

   Guaranteed separation: 2 -> 160 deg, 3 -> 96, 4 -> 64, 5 -> 58, 6-10 -> 32.
   Slot 0 in this module means ring position 1 (tokens are 1-indexed: --sm-dx-1-base). */

const RING = [{
  slot: 1,
  name: "Blue",
  hue: 250,
  base: "#4ba3f7",
  ink: "#005fad",
  tint: "#e9f3ff"
}, {
  slot: 2,
  name: "Violet",
  hue: 282,
  base: "#9190f8",
  ink: "#534dae",
  tint: "#f0f1ff"
}, {
  slot: 3,
  name: "Orchid",
  hue: 314,
  base: "#c080df",
  ink: "#7b3d97",
  tint: "#f7effc"
}, {
  slot: 4,
  name: "Rose",
  hue: 346,
  base: "#df75b2",
  ink: "#95316f",
  tint: "#fdedf5"
}, {
  slot: 5,
  name: "Coral",
  hue: 18,
  base: "#ed737b",
  ink: "#a12e3c",
  tint: "#ffeded"
}, {
  slot: 6,
  name: "Orange",
  hue: 50,
  base: "#f68d4d",
  ink: "#9c3b00",
  tint: "#fff1e9"
}, {
  slot: 7,
  name: "Gold",
  hue: 88,
  base: "#faca4b",
  ink: "#8a4f00",
  tint: "#fef7e6"
}, {
  slot: 8,
  name: "Lime",
  hue: 118,
  base: "#c7e03e",
  ink: "#5e6500",
  tint: "#f6fbe5"
}, {
  slot: 9,
  name: "Green",
  hue: 146,
  base: "#5ebd69",
  ink: "#00721f",
  tint: "#ebf7eb"
}, {
  slot: 10,
  name: "Teal",
  hue: 178,
  base: "#13bfa5",
  ink: "#00745e",
  tint: "#e8f7f3"
}];

/* Cyan is reserved for AI and excluded from the ring, so no diagnosis can be mistaken
   for a machine guess. Dashed ring = not yours yet. */
const AI_COLOR = {
  base: "#2dcbec",
  ink: "#006c88",
  tint: "#eafaff",
  halo: "rgba(45,203,236,.18)"
};

/** CSS custom properties for a ring position (1-10) or "ai". Spread onto style. */
function dxVars(slot) {
  if (slot === "ai") {
    return {
      "--dx-base": AI_COLOR.base,
      "--dx-tint": AI_COLOR.tint,
      "--dx-tint-hover": AI_COLOR.tint,
      "--dx-tint-selected": AI_COLOR.tint,
      "--dx-ink": AI_COLOR.ink,
      "--dx-halo": AI_COLOR.halo
    };
  }
  const n = Math.max(1, Math.min(10, Number(slot) || 1));
  return {
    "--dx-base": "var(--sm-dx-" + n + "-base)",
    "--dx-tint": "var(--sm-dx-" + n + "-tint)",
    "--dx-tint-hover": "var(--sm-dx-" + n + "-tint-hover)",
    "--dx-tint-selected": "var(--sm-dx-" + n + "-tint-selected)",
    "--dx-ink": "var(--sm-dx-" + n + "-ink)",
    "--dx-halo": "var(--sm-dx-" + n + "-halo)"
  };
}

/** Rule 01 — the even spread a new map is created with. Returns n ring positions (1-10). */
function assignSlots(n) {
  const out = [];
  const count = Math.max(1, Math.min(10, n));
  for (let i = 0; i < count; i++) out.push(Math.round(i * 10 / count) % 10 + 1);
  return out;
}

/** Distance between two ring positions, measured around the ring. */
function ringDistance(a, b) {
  const d = Math.abs(a - b) % 10;
  return Math.min(d, 10 - d);
}

/** Rule 02 — the position a newly added diagnosis takes. Existing slots never change. */
function addSlot(taken) {
  if (taken.length >= 10) return null;
  let best = null;
  let score = -1;
  for (let i = 1; i <= 10; i++) {
    if (taken.indexOf(i) >= 0) continue;
    let nearest = 10;
    for (const t of taken) nearest = Math.min(nearest, ringDistance(t, i));
    if (nearest > score) {
      score = nearest;
      best = i;
    }
  }
  return best;
}

/** Smallest hue gap in a set of ring positions — the separation a map actually achieves. */
function minSeparation(slots) {
  let min = 360;
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = RING[slots[i] - 1].hue;
      const b = RING[slots[j] - 1].hue;
      const d = Math.abs(a - b) % 360;
      min = Math.min(min, Math.min(d, 360 - d));
    }
  }
  return slots.length < 2 ? 360 : min;
}
Object.assign(__ds_scope, { RING, AI_COLOR, dxVars, assignSlots, ringDistance, addSlot, minSeparation });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/diagnosisColor.js", error: String((e && e.message) || e) }); }

// components/map/Connection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Map edges, drawn in an SVG layer under the nodes.
   The diagnosis-to-diagnosis chain is warm-neutral at 1.25px; a symptom edge takes the
   colour of the diagnosis it belongs to, at 55% opacity.

   `curve` bows the edge, which is how the prototype draws relationships: when one symptom
   belongs to several diagnoses, each source gets its own arc so the overlap stays readable
   instead of collapsing into one overlapping line. Straight edges are the exception, not
   the default — do not flatten a relationship edge without product approval. */
function Connection({
  x1,
  y1,
  x2,
  y2,
  slot,
  variant = "neutral",
  dashed = false,
  curve = 0,
  style,
  className = "",
  ...rest
}) {
  const cls = ["sm-edge", variant === "diagnosis" ? "sm-edge--diagnosis" : "", dashed ? "sm-edge--shared" : "", className].filter(Boolean).join(" ");
  const css = Object.assign({}, slot ? __ds_scope.dxVars(slot) : null, style);
  if (curve) {
    /* Quadratic bow: control point offset perpendicular to the chord by `curve` px. */
    const mx = (+x1 + +x2) / 2,
      my = (+y1 + +y2) / 2;
    const dx = +x2 - +x1,
      dy = +y2 - +y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const cx = mx + -dy / len * curve,
      cy = my + dx / len * curve;
    return /*#__PURE__*/React.createElement("path", _extends({
      className: cls,
      d: "M" + x1 + " " + y1 + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + x2 + " " + y2,
      fill: "none",
      style: css
    }, rest));
  }
  return /*#__PURE__*/React.createElement("line", _extends({
    className: cls,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    style: css
  }, rest));
}

/* Convenience wrapper: the <svg> layer edges live in. Sits under the node layer. */
function ConnectionLayer({
  width,
  height,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: width,
    height: height,
    "aria-hidden": "true",
    style: Object.assign({
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }, style)
  }, rest), children);
}
Object.assign(__ds_scope, { Connection, ConnectionLayer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/Connection.jsx", error: String((e && e.message) || e) }); }

// components/map/DiagnosisChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Sidebar row for one diagnosis. Radius 14, tonal fill, no outline.
   Selection is a step up in tint plus a small check — never a strong border, never a ring.
   A diagnosis not yet on the map has no colour at all: cream fill, grey label, inert dot. */
function DiagnosisChip({
  label,
  slot = 1,
  selected = false,
  inert = false,
  compact = false,
  disabled = false,
  meta,
  actions,
  style,
  className = "",
  ...rest
}) {
  const cls = ["sm-chip", selected ? "is-selected" : "", inert ? "sm-chip--inert" : "", compact ? "sm-chip--compact" : "", disabled ? "is-disabled" : "", className].filter(Boolean).join(" ");
  const chip = /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-pressed": selected,
    disabled: disabled,
    style: Object.assign({}, actions ? {} : __ds_scope.dxVars(slot), style)
  }, rest), selected && !inert ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: compact ? 14 : 15,
    color: "var(--dx-ink)",
    strokeWidth: 2.3,
    style: {
      flex: "none"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    className: "sm-chip__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-chip__label"
  }, label), meta ? /*#__PURE__*/React.createElement("span", {
    className: "sm-chip__meta"
  }, meta) : null);

  /* Trailing actions are SIBLINGS of the chip, never children: a button inside a button is
     invalid HTML and traps the keyboard. The row carries the tint so both read as one chip. */
  if (!actions) return chip;
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-chip-row", selected ? "is-selected" : "", inert ? "sm-chip-row--inert" : "", disabled ? "is-disabled" : ""].filter(Boolean).join(" "),
    style: Object.assign({}, __ds_scope.dxVars(slot), style)
  }, chip, /*#__PURE__*/React.createElement("span", {
    className: "sm-chip-row__actions"
  }, actions));
}
Object.assign(__ds_scope, { DiagnosisChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/DiagnosisChip.jsx", error: String((e && e.message) || e) }); }

// components/map/DiagnosisNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A diagnosis on the map: perfect circle, tint fill, 1.5px base ring, crisp halo (no blur).
   64-86px. Size means kind, not importance. The label is ALWAYS rendered — colour groups
   and guides, it never carries meaning alone. */
function DiagnosisNode({
  label,
  slot = 1,
  size = 74,
  selected = false,
  suggested = false,
  style,
  className = "",
  ...rest
}) {
  const cls = ["sm-node", selected ? "sm-node--selected" : "", suggested ? "sm-node--suggested" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: Object.assign({
      width: size + "px",
      height: size + "px"
    }, __ds_scope.dxVars(suggested ? "ai" : slot), style)
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-node__label"
  }, label));
}
Object.assign(__ds_scope, { DiagnosisNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/DiagnosisNode.jsx", error: String((e && e.message) || e) }); }

// components/map/SourceTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The diagnoses a suggestion or symptom comes from. Pill shape, 1px base border, tint fill,
   ink label in sentence case. Diagnosis colour is allowed here because a tag is part of the map. */
function SourceTag({
  label,
  slot = 1,
  size = "md",
  inert = false,
  style,
  className = "",
  ...rest
}) {
  const cls = ["sm-source-tag", size === "sm" ? "sm-source-tag--sm" : "", inert ? "sm-source-tag--inert" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: Object.assign({}, __ds_scope.dxVars(slot), style)
  }, rest), label);
}
Object.assign(__ds_scope, { SourceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/SourceTag.jsx", error: String((e && e.message) || e) }); }

// components/map/SymptomNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A symptom on the map: 17-22px white circle, base ring, small base dot, label UNDER it.

   Shared symptoms are the whole insight, so a symptom belonging to several diagnoses is drawn
   as a SEGMENTED node — one arc per connected diagnosis, in that diagnosis's ring colour,
   around a white core. Equal weights divide the circle evenly (50/50, 33/33/33); when one
   diagnosis is more prominent, its arc takes proportionally more of the circle (70/30,
   50/25/25). Never a generic multicolour ring, and never flattened to one colour. */
function SymptomNode({
  label,
  slot = 1,
  size = 17,
  suggested = false,
  shared = false,
  segments,
  style,
  className = "",
  ...rest
}) {
  const parts = normalizeSegments(segments);
  const isPie = !suggested && parts.length > 1;
  const cls = ["sm-symptom", suggested ? "sm-symptom--suggested" : "", shared || isPie ? "sm-symptom--shared" : "", isPie ? "sm-symptom--segmented" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: Object.assign({}, __ds_scope.dxVars(suggested ? "ai" : slot), style)
  }, rest), isPie ? /*#__PURE__*/React.createElement(SegmentedDot, {
    size: size,
    parts: parts
  }) : /*#__PURE__*/React.createElement("span", {
    className: "sm-symptom__dot",
    style: {
      width: size + "px",
      height: size + "px"
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    className: "sm-symptom__label"
  }, label) : null);
}

/* Accepts [1, 4] or [{ slot: 1, weight: 2 }, { slot: 4, weight: 1 }].
   Missing weights mean "no relative weighting known" — the circle divides equally. */
function normalizeSegments(segments) {
  if (!segments || !segments.length) return [];
  const raw = segments.map(s => typeof s === "object" ? s : {
    slot: s
  });
  const total = raw.reduce((t, s) => t + (Number(s.weight) > 0 ? Number(s.weight) : 1), 0);
  let at = 0;
  return raw.map(s => {
    const share = (Number(s.weight) > 0 ? Number(s.weight) : 1) / total * 100;
    const seg = {
      slot: s.slot,
      share,
      start: at
    };
    at += share;
    return seg;
  });
}
function SegmentedDot({
  size,
  parts
}) {
  const stroke = Math.max(3.4, size * 0.3);
  const r = (size - stroke) / 2;
  const gap = parts.length > 1 ? 1.6 : 0;
  return /*#__PURE__*/React.createElement("svg", {
    className: "sm-symptom__pie",
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "sm-symptom__pie-core",
    cx: size / 2,
    cy: size / 2,
    r: r,
    strokeWidth: stroke
  }), parts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    className: "sm-symptom__pie-seg",
    cx: size / 2,
    cy: size / 2,
    r: r,
    pathLength: "100",
    strokeWidth: stroke,
    strokeDasharray: Math.max(0.5, p.share - gap) + " " + (100 - Math.max(0.5, p.share - gap)),
    strokeDashoffset: -(p.start + gap / 2),
    stroke: segColor(p.slot)
  })));
}
function segColor(slot) {
  const n = Math.max(1, Math.min(__ds_scope.RING.length, Number(slot) || 1));
  return "var(--sm-dx-" + n + "-base)";
}
Object.assign(__ds_scope, { SymptomNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/SymptomNode.jsx", error: String((e && e.message) || e) }); }

// components/map/SymptomRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Symptom list row: a 3px colour bar, the symptom in the person's own words, and one dot per
   diagnosis it belongs to. A shared symptom is the whole insight, so it never gets one colour. */
function SymptomRow({
  label,
  slot = 1,
  sources = [],
  selected = false,
  compact = false,
  style,
  className = "",
  ...rest
}) {
  const cls = ["sm-symptom-row", compact ? "sm-symptom-row--compact" : "", selected ? "is-selected" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    style: Object.assign({}, __ds_scope.dxVars(slot), style)
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-symptom-row__bar"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-symptom-row__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "sm-symptom-row__sources"
  }, sources.map(function (s, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        background: "var(--sm-dx-" + s + "-base)"
      }
    });
  })));
}
Object.assign(__ds_scope, { SymptomRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/SymptomRow.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
/* 58px white bar, hairline bottom border: logo lockup, map context, then utilities. */
function AppHeader({
  context,
  actions,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: ["sm-app-header", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "lockup",
    size: 26
  }), context ? /*#__PURE__*/React.createElement("span", {
    className: "sm-app-header__context"
  }, context) : null, /*#__PURE__*/React.createElement("span", {
    className: "sm-app-header__spacer"
  }), actions);
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MapControls.jsx
try { (() => {
/* Zoom pair (bottom-left) and the count pill (bottom-right) that float over the cream canvas. */
function MapControls({
  onZoomIn,
  onZoomOut,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-map-tools", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-map-tools__btn",
    "aria-label": "Acercar",
    onClick: onZoomIn
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "add",
    size: 15,
    strokeWidth: 1.7
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-map-tools__btn",
    "aria-label": "Alejar",
    onClick: onZoomOut
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 15,
    strokeWidth: 1.7
  })));
}
function MapStatus({
  children,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-map-status", className].filter(Boolean).join(" ")
  }, children);
}
Object.assign(__ds_scope, { MapControls, MapStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MapControls.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarGroup.jsx
try { (() => {
/* Collapsible sidebar section: sentence-case title, optional count, chevron.
   The sidebar is white; the map canvas beside it is cream. */
function SidebarGroup({
  title,
  count,
  collapsed = false,
  onToggle,
  className = "",
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: ["sm-sidebar-group", collapsed ? "is-collapsed" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-sidebar-group__head",
    onClick: onToggle,
    "aria-expanded": !collapsed
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-sidebar-group__title"
  }, title), count != null ? /*#__PURE__*/React.createElement(__ds_scope.Count, null, count) : null, /*#__PURE__*/React.createElement("span", {
    className: "sm-sidebar-group__caret"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "expand",
    size: 13,
    color: "var(--sm-grey)",
    strokeWidth: 1.8
  }))), collapsed ? null : /*#__PURE__*/React.createElement("div", {
    className: "sm-sidebar-group__items"
  }, children));
}
Object.assign(__ds_scope, { SidebarGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarGroup.jsx", error: String((e && e.message) || e) }); }

// components/onboarding/StepCard.jsx
try { (() => {
/* A structurally neutral step card: title, copy, optional progress, one or two actions.
   Deliberately NOT an onboarding design — SymptomMap onboarding will be designed as a real
   product walkthrough. No required illustration, no fixed number of steps, no icon doctrine. */
function StepCard({
  title,
  step,
  total,
  media,
  wide = false,
  primaryLabel = "Continuar",
  secondaryLabel,
  onPrimary,
  onSecondary,
  footer,
  className = "",
  children
}) {
  const showProgress = typeof step === "number" && typeof total === "number" && total > 1;
  const dots = showProgress ? Array.from({
    length: total
  }).map(function (_, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: ["sm-progress__dot", i === step - 1 ? "is-active" : ""].filter(Boolean).join(" ")
    });
  }) : null;
  return /*#__PURE__*/React.createElement("article", {
    className: ["sm-tutorial", wide ? "sm-tutorial--wide" : "", className].filter(Boolean).join(" ")
  }, media ? /*#__PURE__*/React.createElement("div", {
    className: "sm-tutorial__media"
  }, media) : null, /*#__PURE__*/React.createElement("div", {
    className: "sm-tutorial__body"
  }, showProgress ? /*#__PURE__*/React.createElement("div", {
    className: "sm-tutorial__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-progress"
  }, dots), /*#__PURE__*/React.createElement("span", {
    className: "sm-tutorial__step"
  }, step, " / ", total)) : null, /*#__PURE__*/React.createElement("h3", {
    className: "sm-tutorial__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "sm-body",
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }
  }, children), primaryLabel || secondaryLabel ? /*#__PURE__*/React.createElement("div", {
    className: "sm-tutorial__actions"
  }, primaryLabel ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    grow: !wide,
    onClick: onPrimary
  }, primaryLabel) : null, secondaryLabel ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    onClick: onSecondary
  }, secondaryLabel) : null, footer) : null));
}
Object.assign(__ds_scope, { StepCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/onboarding/StepCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* White surface with elevation — the only container the product uses.
   Radius 18 for cards, 22 for panels and sheets; padding 24-40. */
function Card({
  variant = "card",
  flush = false,
  as = "div",
  className = "",
  style,
  children,
  ...rest
}) {
  const Tag = as;
  const cls = ["sm-card", variant === "panel" ? "sm-card--panel" : "", variant === "rest" ? "sm-card--rest" : "", variant === "calm" ? "sm-card--calm" : "", variant === "quiet" ? "sm-card--quiet" : "", flush ? "sm-card--flush" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: style
  }, rest), children);
}

/* Small sentence-case eyebrow above titles inside cards and sections.
   No uppercase, no wide tracking, no monospace. */
function Eyebrow({
  tone = "meta",
  className = "",
  children
}) {
  const color = tone === "accent" ? "var(--sm-purple)" : tone === "ink" ? "var(--sm-ink)" : "var(--sm-ink-meta)";
  return /*#__PURE__*/React.createElement("div", {
    className: ["sm-eyebrow", className].filter(Boolean).join(" "),
    style: {
      color: color
    }
  }, children);
}
Object.assign(__ds_scope, { Card, Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Modal.jsx
try { (() => {
/* Sheet at radius 22 on elevation 03, over a warm cream scrim.
   Title in Outfit 500/28, supporting line in body copy, actions at the foot. */
function Modal({
  title,
  description,
  actions,
  onClose,
  width = 520,
  open = true,
  className = "",
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
      padding: "32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: ["sm-modal", className].filter(Boolean).join(" "),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    style: {
      position: "relative",
      width: width
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-modal__head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sm-h2",
    style: {
      flex: 1
    }
  }, title), onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "Cerrar",
    variant: "ghost",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 13,
    strokeWidth: 1.8
  })) : null), description ? /*#__PURE__*/React.createElement("p", {
    className: "sm-body-sm"
  }, description) : null), /*#__PURE__*/React.createElement("div", {
    className: "sm-modal__body"
  }, children), actions ? /*#__PURE__*/React.createElement("div", {
    className: "sm-modal__foot"
  }, actions) : null));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Modal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
/* App shell — three panels, exactly as the prototype: header, left sidebar, map canvas,
   right detail panel, plus the suggestion slide-over and the two sheets. */
const {
  AppHeader,
  IconButton,
  Icon,
  Button
} = window.SymptomMapDesignSystem_dfef9e;
const addSlot = window.SM.addSlot;
function Toast({
  text
}) {
  if (!text) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 400,
      background: "var(--sm-white)",
      boxShadow: "var(--sm-elev-3)",
      borderRadius: "var(--sm-radius-pill)",
      padding: "12px 22px",
      fontFamily: "var(--sm-font-ui)",
      fontWeight: 500,
      fontSize: 14.5,
      color: "var(--sm-ink)"
    }
  }, text);
}
function App({
  start
}) {
  const [stage, setStage] = React.useState(start || "onboarding");
  const [user, setUser] = React.useState("Ana");
  const [diags, setDiags] = React.useState(window.SM.diagnoses);
  const [symptoms, setSymptoms] = React.useState(window.SM.symptoms);
  const [selected, setSelected] = React.useState(null);
  const [multi, setMulti] = React.useState([]);
  const [filter, setFilter] = React.useState([]);
  const [groups, setGroups] = React.useState({
    diags: true,
    add: false,
    list: true
  });
  const [review, setReview] = React.useState({
    open: false,
    items: []
  });
  const [modal, setModal] = React.useState(null);
  const [zoom, setZoom] = React.useState(1);
  const [legend, setLegend] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [analysis, setAnalysis] = React.useState("");
  const [toast, setToast] = React.useState("");
  const [id, setId] = React.useState(100);
  const say = t => {
    setToast(t);
    window.clearTimeout(say._t);
    say._t = window.setTimeout(() => setToast(""), 2600);
  };
  const nextId = () => {
    const n = "n" + id;
    setId(id + 1);
    return n;
  };
  const select = (nodeId, e) => {
    const isSymptom = symptoms.some(s => s.id === nodeId);
    if (e && (e.shiftKey || e.metaKey) && isSymptom) {
      setMulti(m => m.includes(nodeId) ? m.filter(x => x !== nodeId) : m.concat(nodeId));
      setAnalysis("");
      return;
    }
    setMulti([]);
    setAnalysis("");
    setSelected(nodeId);
    setReview(r => r.open ? {
      ...r,
      open: false
    } : r);
  };
  const suggest = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setReview({
        open: true,
        items: window.SM.suggestions.map(s => ({
          ...s,
          state: null
        }))
      });
    }, 700);
  };
  const accept = sid => {
    const s = review.items.find(x => x.id === sid);
    const hub = diags.find(d => d.id === s.sources[0]) || {
      x: 520,
      y: 300
    };
    setSymptoms(list => list.concat({
      id: nextId(),
      name: s.name,
      sources: s.sources,
      ai: s.reason,
      x: hub.x + (s.sources.length > 1 ? 40 : -30) + list.length % 3 * 34,
      y: hub.y + 250 + list.length % 2 * 36
    }));
    setReview(r => ({
      ...r,
      items: r.items.map(x => x.id === sid ? {
        ...x,
        state: "accepted"
      } : x)
    }));
    say("Añadido a tu mapa");
  };
  const reject = sid => {
    setReview(r => ({
      ...r,
      items: r.items.map(x => x.id === sid ? {
        ...x,
        state: "rejected"
      } : x)
    }));
  };
  const acceptAll = () => {
    review.items.filter(x => !x.state).forEach(x => accept(x.id));
  };
  const addSymptom = ({
    name,
    context,
    sources
  }) => {
    const hub = diags.find(d => d.id === sources[0]);
    setSymptoms(list => list.concat({
      id: nextId(),
      name,
      context,
      sources,
      floating: sources.length === 0,
      x: hub ? hub.x + 70 - list.length % 3 * 60 : 840,
      y: hub ? hub.y + 280 : 470
    }));
    say(sources.length ? "Síntoma añadido" : "Añadido como síntoma suelto");
  };
  const analyse = () => {
    setBusy(true);
    setAnalysis("");
    window.setTimeout(() => {
      setBusy(false);
      setAnalysis(multi.length > 1 ? "Puede que los tres compartan un punto: cuando el cuerpo lleva rato en alerta, lo primero que se va es el sueño y lo segundo la paciencia contigo misma." : "Puede que esto aparezca sobre todo los días en que has sostenido mucho por fuera. No es falta de ganas, y tú decides si lo dejas en el mapa.");
    }, 800);
  };
  const addDiagnosis = label => {
    const slot = addSlot(diags.map(d => d.slot)) || 1;
    const x = 150 + diags.length * 238;
    setDiags(list => list.concat({
      id: "d" + slot,
      label,
      full: label,
      slot,
      x: Math.min(x, 980),
      y: 158,
      profile: false
    }));
    setModal(null);
    say("Diagnóstico añadido — su color es el más separado que queda");
  };
  const node = selected ? symptoms.find(s => s.id === selected) || diags.find(d => d.id === selected) : null;
  const multiNodes = multi.map(mid => symptoms.find(s => s.id === mid)).filter(Boolean);
  if (stage === "onboarding") return /*#__PURE__*/React.createElement(Onboarding, {
    onDone: n => {
      setUser(n);
      setStage("app");
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--sm-cream)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    context: "Mapa de " + user,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      label: "Buscar en mi mapa",
      size: "sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    })), /*#__PURE__*/React.createElement(IconButton, {
      label: "Pantalla completa",
      size: "sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "fullscreen",
      size: 16
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setStage("onboarding")
    }, "Ver la intro"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    diags: diags,
    symptoms: symptoms,
    selected: selected,
    filter: filter,
    groups: groups,
    busy: busy,
    toggleGroup: k => setGroups(g => ({
      ...g,
      [k]: !g[k]
    })),
    onSelect: select,
    onFilter: fid => setFilter(f => f.includes(fid) ? f.filter(x => x !== fid) : f.concat(fid)),
    onProfile: pid => setModal({
      kind: "profile",
      id: pid
    }),
    onAddDiagnosis: () => setModal({
      kind: "add"
    }),
    onSuggest: suggest,
    onAddSymptom: addSymptom
  }), /*#__PURE__*/React.createElement(MapCanvas, {
    diags: diags,
    symptoms: symptoms,
    selected: selected,
    multi: multi,
    filter: filter,
    onSelect: select,
    onBackground: () => {
      setSelected(null);
      setMulti([]);
    },
    zoom: zoom,
    setZoom: setZoom,
    legend: legend,
    setLegend: setLegend
  }), (node || multiNodes.length > 1) && /*#__PURE__*/React.createElement(DetailPanel, {
    node: node,
    diags: diags,
    multiNodes: multiNodes,
    analysis: analysis,
    busy: busy,
    onClose: () => {
      setSelected(null);
      setMulti([]);
    },
    onDelete: did => {
      setSymptoms(list => list.filter(s => s.id !== did));
      setSelected(null);
      say("Quitado del mapa");
    },
    onSave: (sid, patch) => setSymptoms(list => list.map(s => s.id === sid ? {
      ...s,
      ...patch
    } : s)),
    onAnalyse: analyse
  }), /*#__PURE__*/React.createElement(ReviewPanel, {
    open: review.open,
    items: review.items.filter(i => i.state !== "rejected"),
    diags: diags,
    onAccept: accept,
    onReject: reject,
    onAcceptAll: acceptAll,
    onClose: () => setReview(r => ({
      ...r,
      open: false
    }))
  })), modal && modal.kind === "profile" && /*#__PURE__*/React.createElement("div", {
    style: scrimStyle
  }, /*#__PURE__*/React.createElement(ProfileModal, {
    diag: diags.find(d => d.id === modal.id),
    onClose: () => setModal(null),
    onSave: pid => {
      setDiags(list => list.map(d => d.id === pid ? {
        ...d,
        profile: true
      } : d));
      setModal(null);
      say("Perfil guardado — las sugerencias lo tendrán en cuenta");
    }
  })), modal && modal.kind === "add" && /*#__PURE__*/React.createElement("div", {
    style: scrimStyle
  }, /*#__PURE__*/React.createElement(AddDiagnosisModal, {
    nextSlot: addSlot(diags.map(d => d.slot)) || 1,
    onClose: () => setModal(null),
    onAdd: addDiagnosis
  })), /*#__PURE__*/React.createElement(Toast, {
    text: toast
  }));
}
const scrimStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 300,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  background: "rgba(250,247,240,.72)",
  backdropFilter: "blur(2px)",
  padding: "40px 32px",
  overflowY: "auto"
};
Object.assign(window, {
  App,
  Toast
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DetailPanel.jsx
try { (() => {
/* Right panel — node detail, multi-selection intersection, and the user-initiated AI read.
   AI never fills anything in on its own: the analysis appears only after a tap, and stays a
   note on the side, not a fact in the map. */
const {
  Card,
  Button,
  IconButton,
  Icon,
  Badge,
  SourceTag,
  TextField,
  InlineMessage,
  SuggestionCard
} = window.SymptomMapDesignSystem_dfef9e;
function PanelSection({
  title,
  badge,
  open,
  onToggle,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "none",
      border: 0,
      padding: 0,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sm-font-ui)",
      fontWeight: 600,
      fontSize: 13.5,
      color: "var(--sm-ink-meta)"
    }
  }, title), badge, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      transform: open ? "none" : "rotate(-90deg)",
      transition: "transform .16s ease"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "expand",
    size: 13,
    color: "var(--sm-grey)"
  }))), open && children);
}
function DetailPanel({
  node,
  diags,
  multiNodes,
  onClose,
  onDelete,
  onSave,
  analysis,
  onAnalyse,
  busy
}) {
  const [sections, setSections] = React.useState({
    detail: true,
    ai: false
  });
  const [context, setContext] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => {
    setContext(node && node.context || "");
    setNotes(node && node.notes || "");
    setSaved(false);
    setSections({
      detail: true,
      ai: false
    });
  }, [node && node.id]);
  if (multiNodes && multiNodes.length > 1) {
    return /*#__PURE__*/React.createElement("aside", {
      style: panelShell
    }, /*#__PURE__*/React.createElement("div", {
      style: panelHead
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--sm-font-ui)",
        fontWeight: 600,
        fontSize: 13.5,
        color: "var(--sm-ink-meta)",
        flex: 1
      }
    }, multiNodes.length, " s\xEDntomas seleccionados"), /*#__PURE__*/React.createElement(IconButton, {
      label: "Cerrar el panel",
      variant: "ghost",
      onClick: onClose
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 15,
      color: "var(--sm-ink-meta)"
    }))), /*#__PURE__*/React.createElement("div", {
      style: panelBody
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "calm",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontFamily: "var(--sm-font-body)",
        fontSize: 15,
        lineHeight: 1.55,
        color: "var(--sm-ink)"
      }
    }, multiNodes.map(n => n.name).join(" · ")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      block: true,
      disabled: busy,
      onClick: onAnalyse,
      style: {
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "ai"
    }, "IA"), busy ? "Mirando…" : "¿Qué tienen en común?")), analysis && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontFamily: "var(--sm-font-body)",
        fontStyle: "italic",
        fontSize: 15,
        lineHeight: 1.6,
        color: "var(--sm-ink-body)",
        textWrap: "pretty"
      }
    }, analysis)));
  }
  if (!node) return null;
  const isDiagnosis = !!node.full;
  const sources = (node.sources || []).map(c => diags.find(d => d.id === c)).filter(Boolean);
  return /*#__PURE__*/React.createElement("aside", {
    style: panelShell
  }, /*#__PURE__*/React.createElement("div", {
    style: panelHead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sm-font-ui)",
      fontWeight: 600,
      fontSize: 13.5,
      color: "var(--sm-ink-meta)",
      flex: 1
    }
  }, isDiagnosis ? "Diagnóstico" : "Síntoma"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Cerrar el panel",
    variant: "ghost",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 15,
    color: "var(--sm-ink-meta)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: panelBody
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-display)",
      fontWeight: 500,
      fontSize: 24,
      lineHeight: 1.25,
      letterSpacing: "-.015em",
      color: "var(--sm-ink)"
    }
  }, isDiagnosis ? node.full : node.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 12
    }
  }, isDiagnosis ? /*#__PURE__*/React.createElement(SourceTag, {
    label: node.label,
    slot: node.slot,
    size: "sm"
  }) : sources.length ? sources.map(d => /*#__PURE__*/React.createElement(SourceTag, {
    key: d.id,
    label: d.label,
    slot: d.slot,
    size: "sm"
  })) : /*#__PURE__*/React.createElement(SourceTag, {
    label: "Origen a\xFAn sin ubicar",
    size: "sm",
    inert: true
  }))), !isDiagnosis && node.sources.length === 0 && /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    style: {
      padding: "16px 17px"
    }
  }, /*#__PURE__*/React.createElement(InlineMessage, {
    tone: "info",
    icon: false
  }, "No hemos encontrado una conexi\xF3n clara con tus diagn\xF3sticos. Puede ser algo que valga la pena mirar con tu terapeuta.")), /*#__PURE__*/React.createElement(PanelSection, {
    title: isDiagnosis ? "Sobre este diagnóstico" : "Detalle del síntoma",
    open: sections.detail,
    onToggle: () => setSections(s => ({
      ...s,
      detail: !s.detail
    }))
  }, isDiagnosis ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--sm-ink-body)"
    }
  }, node.profile ? "Tienes un perfil guardado para este diagnóstico. Las sugerencias lo tienen en cuenta." : "Aún no has contado cómo se manifiesta en ti. Si quieres, puedes rellenar su perfil desde el panel izquierdo.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextField, {
    label: "\xBFCu\xE1ndo o c\xF3mo aparece?",
    multiline: true,
    placeholder: "ej. en sitios con mucha gente, al despertar\u2026",
    value: context,
    onChange: e => {
      setContext(e.target.value);
      setSaved(false);
    }
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Tus notas",
    multiline: true,
    placeholder: "\xBFQu\xE9 lo dispara? \xBFC\xF3mo se siente?",
    value: notes,
    onChange: e => {
      setNotes(e.target.value);
      setSaved(false);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    grow: true,
    onClick: () => {
      onSave(node.id, {
        context,
        notes
      });
      setSaved(true);
    }
  }, "Guardar"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => onDelete(node.id)
  }, "Quitar del mapa")), saved && /*#__PURE__*/React.createElement(InlineMessage, {
    tone: "success"
  }, "Guardado."))), !isDiagnosis && /*#__PURE__*/React.createElement(PanelSection, {
    title: "Lectura de la IA",
    badge: /*#__PURE__*/React.createElement(Badge, {
      tone: "ai"
    }, "IA"),
    open: sections.ai,
    onToggle: () => setSections(s => ({
      ...s,
      ai: !s.ai
    }))
  }, node.ai && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontStyle: "italic",
      fontSize: 14.5,
      lineHeight: 1.6,
      color: "var(--sm-ink-body)",
      textWrap: "pretty"
    }
  }, node.ai), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    block: true,
    disabled: busy,
    onClick: () => onAnalyse(node.id),
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ai"
  }, "IA"), busy ? "Mirando…" : node.ai ? "Volver a mirarlo" : "Mirar este síntoma"), analysis && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontStyle: "italic",
      fontSize: 14.5,
      lineHeight: 1.6,
      color: "var(--sm-ink-body)",
      textWrap: "pretty"
    }
  }, analysis), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 13,
      lineHeight: 1.5,
      color: "var(--sm-ink-meta)"
    }
  }, "Es una lectura, no un diagn\xF3stico. Si no encaja, ign\xF3rala."))));
}
const panelShell = {
  width: 300,
  flex: "none",
  background: "var(--sm-white)",
  borderLeft: "1px solid var(--sm-line-hairline)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
};
const panelHead = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "16px 16px 0 20px"
};
const panelBody = {
  display: "flex",
  flexDirection: "column",
  gap: 22,
  padding: "16px 20px 24px",
  overflowY: "auto"
};
Object.assign(window, {
  DetailPanel,
  PanelSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DetailPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/MapCanvas.jsx
try { (() => {
/* The map — the distinctive core of SymptomMap. Structure and interaction logic follow the
   prototype (src/js/graph.js): diagnosis hubs in a row, symptom nodes hanging off them, one
   coloured edge per source diagnosis for a shared symptom, a neutral chain between diagnoses,
   dashed edge for a provisional link, floating node for an unknown origin. Visual execution
   follows the design system. */
const {
  DiagnosisNode,
  SymptomNode,
  Connection,
  ConnectionLayer,
  MapControls,
  MapStatus,
  Card,
  Button,
  Icon,
  IconButton
} = window.SymptomMapDesignSystem_dfef9e;
const WORLD = {
  w: 790,
  h: 500
};
function centerOf(n) {
  return {
    x: n.x,
    y: n.y
  };
}
function MapEdges({
  diags,
  symptoms,
  filter,
  selected
}) {
  const byId = {};
  diags.forEach(d => {
    byId[d.id] = d;
  });
  const dim = s => filter.length > 0 && !s.sources.some(c => filter.includes(c));
  return /*#__PURE__*/React.createElement(ConnectionLayer, {
    width: WORLD.w,
    height: WORLD.h,
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  }, diags.slice(0, -1).map((d, i) => /*#__PURE__*/React.createElement(Connection, {
    key: "chain" + d.id,
    x1: d.x,
    y1: d.y,
    x2: diags[i + 1].x,
    y2: diags[i + 1].y,
    variant: "neutral"
  })), symptoms.map(s => s.sources.map((cid, i) => {
    const hub = byId[cid];
    if (!hub) return null;
    const p = centerOf(s),
      h = centerOf(hub);
    /* Prototype behaviour: relationship edges bow. With several sources each one gets its
       own arc, fanned around the chord, so an overlap reads as N relationships and not as
       one thick line. */
    const n = s.sources.length;
    /* Edge weight follows the segment weight: a diagnosis that owns more of the node's
       circle also draws the heavier line to it. */
    const wts = s.weights || s.sources.map(() => 1);
    const wTotal = wts.reduce((t, w) => t + w, 0);
    const bow = n > 1 ? (i - (n - 1) / 2) * 26 + (i % 2 ? 4 : -4) : 13;
    return /*#__PURE__*/React.createElement(Connection, {
      key: s.id + "-" + cid,
      x1: h.x,
      y1: h.y,
      x2: p.x,
      y2: p.y,
      slot: hub.slot,
      variant: "diagnosis",
      dashed: s.pending,
      curve: bow,
      style: {
        strokeOpacity: dim(s) ? 0.08 : s.id === selected ? 0.9 : n > 1 ? 0.6 : 0.42,
        strokeWidth: n > 1 ? (1.1 + wts[i] / wTotal * n * 0.6).toFixed(2) : 1.25
      }
    });
  })));
}
function MapLegend({
  onClose
}) {
  const row = (swatch, label) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      display: "flex",
      justifyContent: "center"
    }
  }, swatch), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sm-font-ui)",
      fontSize: 13,
      color: "var(--sm-ink-body)"
    }
  }, label));
  return /*#__PURE__*/React.createElement(Card, {
    variant: "rest",
    style: {
      position: "absolute",
      left: 24,
      bottom: 24,
      padding: "18px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 11,
      width: 232
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sm-font-ui)",
      fontWeight: 600,
      fontSize: 13.5,
      color: "var(--sm-ink-meta)",
      flex: 1
    }
  }, "C\xF3mo leer el mapa"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Ocultar leyenda",
    variant: "ghost",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 14,
    color: "var(--sm-ink-meta)"
  }))), row(/*#__PURE__*/React.createElement("span", {
    style: {
      width: 15,
      height: 15,
      borderRadius: "50%",
      background: "var(--sm-dx-1-tint)",
      border: "1.5px solid var(--sm-dx-1-base)"
    }
  }), "Diagnóstico"), row(/*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: "50%",
      background: "var(--sm-white)",
      border: "1.5px solid var(--sm-dx-4-base)"
    }
  }), "Síntoma de uno"), row(/*#__PURE__*/React.createElement(SymptomNode, {
    size: 20,
    segments: [{
      slot: 1,
      weight: 7
    }, {
      slot: 6,
      weight: 3
    }]
  }), "Compartido — un segmento por diagnóstico"), row(/*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: "50%",
      background: "var(--sm-cream)",
      border: "1.5px dashed var(--sm-grey)"
    }
  }), "Origen aún sin ubicar"), row(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 6 Q11 0 22 6",
    fill: "none",
    stroke: "var(--sm-dx-6-base)",
    strokeWidth: "1.6"
  })), "Conexión"), row(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 6 Q11 0 22 6",
    fill: "none",
    stroke: "var(--sm-ai)",
    strokeWidth: "1.6",
    strokeDasharray: "4 4"
  })), "Sugerencia sin confirmar"));
}
function MapCanvas({
  diags,
  symptoms,
  selected,
  multi,
  filter,
  onSelect,
  onBackground,
  zoom,
  setZoom,
  legend,
  setLegend
}) {
  const dim = s => filter.length > 0 && !s.sources.some(c => filter.includes(c));
  const wrap = React.useRef(null);
  const [fit, setFit] = React.useState(1);
  React.useEffect(() => {
    const measure = () => {
      if (!wrap.current) return;
      const {
        clientWidth: w,
        clientHeight: h
      } = wrap.current;
      /* Labels counter-scale (see kit.css), so fitting down no longer costs legibility —
         the inset keeps the outermost symptom labels inside the pane. */
      setFit(Math.max(0.7, Math.min(1, (w - 120) / WORLD.w, (h - 80) / WORLD.h)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: wrap,
    style: {
      position: "relative",
      flex: 1,
      overflow: "hidden",
      background: "var(--sm-cream)"
    },
    onClick: onBackground
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-map-world",
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: WORLD.w,
      height: WORLD.h,
      transform: "translate(-50%,-50%) scale(" + (fit * zoom).toFixed(3) + ")",
      transformOrigin: "center",
      "--sm-map-label-px": (10 / Math.min(1, fit * zoom)).toFixed(2) + "px"
    }
  }, /*#__PURE__*/React.createElement(MapEdges, {
    diags: diags,
    symptoms: symptoms,
    filter: filter,
    selected: selected
  }), diags.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      position: "absolute",
      left: d.x,
      top: d.y,
      transform: "translate(-50%,-50%)",
      opacity: filter.length && !filter.includes(d.id) ? 0.18 : 1
    }
  }, /*#__PURE__*/React.createElement(DiagnosisNode, {
    label: d.label,
    slot: d.slot,
    size: d.label.length > 9 ? 88 : 78,
    selected: selected === d.id,
    onClick: e => {
      e.stopPropagation();
      onSelect(d.id, e);
    }
  }))), symptoms.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      position: "absolute",
      left: s.x,
      top: s.y - 9,
      transform: "translateX(-50%)",
      width: 116,
      opacity: dim(s) ? 0.16 : 1,
      cursor: "pointer"
    },
    onClick: e => {
      e.stopPropagation();
      onSelect(s.id, e);
    }
  }, /*#__PURE__*/React.createElement(SymptomNode, {
    label: s.name,
    slot: s.sources.length ? (window.SM.diagnoses.find(d => d.id === s.sources[0]) || {}).slot : 1,
    shared: s.sources.length > 1,
    segments: s.sources.length > 1 ? s.sources.map((cid, i) => ({
      slot: (window.SM.diagnoses.find(d => d.id === cid) || {}).slot,
      weight: s.weights ? s.weights[i] : 1
    })) : undefined,
    suggested: s.pending,
    size: s.sources.length > 1 ? 26 : 17,
    style: Object.assign(s.sources.length === 0 && !s.pending ? {
      "--dx-base": "var(--sm-grey)",
      "--dx-halo": "transparent"
    } : {}, selected === s.id || multi.includes(s.id) ? {
      outline: "none"
    } : {})
  }), (selected === s.id || multi.includes(s.id)) && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: 9,
      width: 34,
      height: 34,
      marginLeft: -17,
      marginTop: -17,
      borderRadius: "50%",
      boxShadow: "inset 0 0 0 1.5px rgba(26,26,26,.45)",
      pointerEvents: "none"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 20,
      left: 24
    }
  }, /*#__PURE__*/React.createElement(MapStatus, null, /*#__PURE__*/React.createElement(Icon, {
    name: "node",
    size: 14,
    color: "var(--sm-ink-meta)"
  }), diags.length, " diagn\xF3sticos \xB7 ", symptoms.filter(s => !s.pending).length, " s\xEDntomas \xB7 ", symptoms.filter(s => s.sources.length > 1).length, " compartidos")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 20,
      right: 24,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, !legend && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: e => {
      e.stopPropagation();
      setLegend(true);
    }
  }, "C\xF3mo leer el mapa"), /*#__PURE__*/React.createElement(MapControls, {
    onZoomIn: () => setZoom(Math.min(1.3, +(zoom + 0.1).toFixed(2))),
    onZoomOut: () => setZoom(Math.max(0.55, +(zoom - 0.1).toFixed(2)))
  })), legend && /*#__PURE__*/React.createElement(MapLegend, {
    onClose: () => setLegend(false)
  }), multi.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)"
    }
  }, /*#__PURE__*/React.createElement(MapStatus, null, multi.length, " s\xEDntomas seleccionados \xB7 mira el panel de la derecha")));
}
Object.assign(window, {
  MapCanvas,
  MapLegend,
  WORLD
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/MapCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Modals.jsx
try { (() => {
/* Sheets — the per-diagnosis profile questionnaire and adding a diagnosis.
   Colour is NOT chosen here: the ring assigns the widest free position (Rule 02), so nothing
   already on the map ever recolours. That differs from the prototype's colour picker on purpose. */
const {
  Modal,
  Button,
  TextField,
  PillSelect,
  SourceTag,
  InlineMessage,
  Icon,
  Badge
} = window.SymptomMapDesignSystem_dfef9e;
function ProfileModal({
  diag,
  onClose,
  onSave
}) {
  const f = window.SM.profileFields[diag.id];
  const [subtype, setSubtype] = React.useState(f.subtype.value);
  const [triggers, setTriggers] = React.useState(f.triggers.value);
  const [age, setAge] = React.useState(f.age.value);
  const [known, setKnown] = React.useState(f.known.value);
  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    title: f.title,
    description: f.desc,
    onClose: onClose,
    width: 560,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => onSave(diag.id)
    }, "Guardar perfil"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Omitir por ahora"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SourceTag, {
    label: diag.full,
    slot: diag.slot
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sm-font-body)",
      fontSize: 14,
      color: "var(--sm-ink-meta)"
    }
  }, "Solo t\xFA ves esto.")), /*#__PURE__*/React.createElement(PillSelect, {
    label: f.subtype.label,
    options: f.subtype.options,
    value: subtype,
    onChange: setSubtype
  }), /*#__PURE__*/React.createElement(PillSelect, {
    label: f.triggers.label,
    options: f.triggers.options,
    value: triggers,
    multiple: true,
    onChange: setTriggers,
    hint: "Elige los que reconozcas. Puedes cambiarlos cuando quieras."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "140px 1fr",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: f.age.label,
    type: "number",
    placeholder: f.age.placeholder,
    value: age,
    onChange: e => setAge(e.target.value)
  }), /*#__PURE__*/React.createElement(TextField, {
    label: f.known.label,
    placeholder: f.known.placeholder,
    value: known,
    onChange: e => setKnown(e.target.value)
  })));
}
function AddDiagnosisModal({
  nextSlot,
  onClose,
  onAdd
}) {
  const [query, setQuery] = React.useState("");
  const [picked, setPicked] = React.useState("");
  const list = window.SM.catalogue.filter(c => c.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0);
  const custom = query.trim().length > 1 && list.length === 0;
  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    title: "A\xF1adir un diagn\xF3stico",
    description: "Solo diagn\xF3sticos que ya tengas confirmados. SymptomMap no diagnostica.",
    onClose: onClose,
    width: 520,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      disabled: !picked && !custom,
      onClick: () => onAdd(picked || query.trim())
    }, "A\xF1adir al mapa"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancelar"))
  }, /*#__PURE__*/React.createElement(TextField, {
    type: "search",
    label: "Buscar en la lista",
    placeholder: "ej. ansiedad, fibromialgia\u2026",
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setPicked("");
    }
  }), list.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      maxHeight: 168,
      overflowY: "auto"
    }
  }, list.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "sm-pill" + (picked === c ? " is-selected" : ""),
    onClick: () => setPicked(c)
  }, picked === c && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 13
  }), c))), custom && /*#__PURE__*/React.createElement(InlineMessage, {
    tone: "info",
    icon: false
  }, "No est\xE1 en la lista. Se a\xF1adir\xE1 tal como lo has escrito: \xAB", query.trim(), "\xBB."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement(SourceTag, {
    label: "Color " + nextSlot + " de tu mapa",
    slot: nextSlot,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sm-font-body)",
      fontSize: 13.5,
      lineHeight: 1.5,
      color: "var(--sm-ink-meta)"
    }
  }, "Le damos el color m\xE1s separado de los que ya usas. Los dem\xE1s no cambian.")));
}
Object.assign(window, {
  ProfileModal,
  AddDiagnosisModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Modals.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Onboarding.jsx
try { (() => {
/* NOT THE APPROVED ONBOARDING. Exploratory sketch only — kept for reference, superseded.

   The current product flow is:
     account creation → eligibility → MFA → onboarding → disclaimer/consent → empty map
   Name and email are collected BEFORE onboarding, so the name step below is wrong, and the
   disclaimer sits after onboarding as its own consent step, not inside step two.

   Onboarding is being designed separately. Do not treat this file, its steps, or its ordering
   as a SymptomMap pattern, and do not build new screens from it. StepCard remains a neutral
   shell either way. */
const {
  StepCard,
  Logo,
  Button,
  TextField,
  PillSelect,
  Card,
  DiagnosisNode,
  SymptomNode,
  Connection,
  ConnectionLayer,
  InlineMessage
} = window.SymptomMapDesignSystem_dfef9e;
function MiniMap({
  stage
}) {
  const hubA = {
    x: 92,
    y: 74,
    slot: 1
  };
  const hubB = {
    x: 252,
    y: 92,
    slot: 4
  };
  const symA = [{
    x: 44,
    y: 178,
    name: "hiperfoco"
  }, {
    x: 140,
    y: 196,
    name: "olvidos"
  }];
  const symB = [{
    x: 300,
    y: 182,
    name: "miedo al abandono"
  }];
  const shared = {
    x: 196,
    y: 240,
    name: "sensibilidad al rechazo"
  };
  const node = (p, label, slot, shared_) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      position: "absolute",
      left: p.x,
      top: p.y - 9,
      transform: "translateX(-50%)",
      width: 96
    }
  }, /*#__PURE__*/React.createElement(SymptomNode, {
    label: label,
    slot: slot,
    shared: shared_,
    size: shared_ ? 20 : 17
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 276,
      height: 236
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 340,
      height: 290,
      transform: "scale(.81)",
      transformOrigin: "top left"
    }
  }, /*#__PURE__*/React.createElement(ConnectionLayer, {
    width: 340,
    height: 290,
    style: {
      position: "absolute",
      inset: 0
    }
  }, stage >= 2 && symA.map(s => /*#__PURE__*/React.createElement(Connection, {
    key: s.name,
    x1: hubA.x,
    y1: hubA.y,
    x2: s.x,
    y2: s.y,
    slot: hubA.slot,
    variant: "diagnosis"
  })), stage >= 3 && /*#__PURE__*/React.createElement(Connection, {
    x1: hubA.x,
    y1: hubA.y,
    x2: hubB.x,
    y2: hubB.y,
    variant: "neutral"
  }), stage >= 3 && symB.map(s => /*#__PURE__*/React.createElement(Connection, {
    key: s.name,
    x1: hubB.x,
    y1: hubB.y,
    x2: s.x,
    y2: s.y,
    slot: hubB.slot,
    variant: "diagnosis"
  })), stage >= 3 && /*#__PURE__*/React.createElement(Connection, {
    x1: hubA.x,
    y1: hubA.y,
    x2: shared.x,
    y2: shared.y,
    slot: hubA.slot,
    variant: "diagnosis"
  }), stage >= 3 && /*#__PURE__*/React.createElement(Connection, {
    x1: hubB.x,
    y1: hubB.y,
    x2: shared.x,
    y2: shared.y,
    slot: hubB.slot,
    variant: "diagnosis"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: hubA.x,
      top: hubA.y,
      transform: "translate(-50%,-50%)"
    }
  }, /*#__PURE__*/React.createElement(DiagnosisNode, {
    label: "TDAH",
    slot: hubA.slot,
    size: 70
  })), stage >= 2 && symA.map(s => node(s, s.name, hubA.slot)), stage >= 3 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: hubB.x,
      top: hubB.y,
      transform: "translate(-50%,-50%)"
    }
  }, /*#__PURE__*/React.createElement(DiagnosisNode, {
    label: "TLP",
    slot: hubB.slot,
    size: 66
  })), stage >= 3 && symB.map(s => node(s, s.name, hubB.slot)), stage >= 3 && node(shared, shared.name, hubA.slot, true)));
}
function Onboarding({
  onDone
}) {
  const [step, setStep] = React.useState(1);
  const [lang, setLang] = React.useState("Español");
  const [name, setName] = React.useState("");
  const [stage, setStage] = React.useState(1);
  const walkthrough = [{
    title: "Empiezas por un diagnóstico que ya tienes",
    body: "Lo añades desde el panel izquierdo. Aparece en el mapa con un color propio, y ese color es solo tuyo."
  }, {
    title: "Luego añades lo que reconoces en ti",
    body: "Con tus palabras, no con las de un informe. Cada experiencia queda colgando del diagnóstico del que venga."
  }, {
    title: "Y ves lo que comparten",
    body: "Cuando una experiencia sale de dos diagnósticos a la vez, el mapa la conecta con los dos. Eso es lo que cuesta explicar de palabra."
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
      padding: "48px 24px",
      background: "var(--sm-cream)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "wordmark",
    size: 44,
    tagline: true
  }), step === 1 && /*#__PURE__*/React.createElement(StepCard, {
    step: 1,
    total: 3,
    title: "\xBFEn qu\xE9 idioma te acompa\xF1amos?",
    primaryLabel: "Continuar",
    onPrimary: () => setStep(2),
    style: {
      width: 520
    }
  }, /*#__PURE__*/React.createElement(PillSelect, {
    options: ["Español", "English"],
    value: lang,
    onChange: setLang
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--sm-ink-body)"
    }
  }, "Puedes cambiarlo m\xE1s tarde sin perder tu mapa.")), step === 2 && /*#__PURE__*/React.createElement(StepCard, {
    step: 2,
    total: 3,
    title: "\xBFC\xF3mo quieres que te llamemos?",
    primaryLabel: "Continuar",
    onPrimary: () => setStep(3),
    secondaryLabel: "Atr\xE1s",
    onSecondary: () => setStep(1),
    style: {
      width: 520
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Tu nombre o un apodo",
    placeholder: "ej. Ana",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(Card, {
    variant: "calm",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "20px 22px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--sm-ink)"
    }
  }, "SymptomMap es para personas que ya tienen uno o m\xE1s diagn\xF3sticos confirmados por un profesional."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--sm-ink-body)"
    }
  }, "Te ayuda a ver y ordenar lo que ya sabes de ti. No diagnostica, no trata y no sustituye a tu equipo de salud."))), step === 3 && /*#__PURE__*/React.createElement(StepCard, {
    wide: true,
    step: 3,
    total: 3,
    title: walkthrough[stage - 1].title,
    media: /*#__PURE__*/React.createElement(MiniMap, {
      stage: stage
    }),
    primaryLabel: stage < 3 ? "Siguiente" : "Empezar mi mapa",
    onPrimary: () => stage < 3 ? setStage(stage + 1) : onDone(name || "Ana"),
    secondaryLabel: stage > 1 ? "Atrás" : "Atrás",
    onSecondary: () => stage > 1 ? setStage(stage - 1) : setStep(2),
    style: {
      width: 880
    },
    footer: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--sm-font-body)",
        fontSize: 13.5,
        color: "var(--sm-ink-meta)"
      }
    }, "Lo que ves aqu\xED es el mapa de verdad, con datos de ejemplo.")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 16.5,
      lineHeight: 1.62,
      color: "var(--sm-ink-body)",
      textWrap: "pretty"
    }
  }, walkthrough[stage - 1].body)));
}
Object.assign(window, {
  Onboarding,
  MiniMap
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ReviewPanel.jsx
try { (() => {
/* Suggestion review — a slide-over of PENDING suggestions. Nothing here is on the map yet:
   each card is one tap to add and one tap to dismiss, with no follow-up nudge. */
const {
  SuggestionCard,
  SourceTag,
  Badge,
  Button,
  IconButton,
  Icon
} = window.SymptomMapDesignSystem_dfef9e;
function ReviewPanel({
  open,
  items,
  diags,
  onAccept,
  onReject,
  onAcceptAll,
  onClose
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: 372,
      zIndex: 120,
      background: "var(--sm-white)",
      borderLeft: "1px solid var(--sm-line-hairline)",
      boxShadow: "var(--sm-elev-3)",
      display: "flex",
      flexDirection: "column",
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform .22s ease"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "20px 20px 16px",
      borderBottom: "1px solid var(--sm-line-hairline)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ai"
  }, "IA"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      flex: 1,
      fontFamily: "var(--sm-font-display)",
      fontWeight: 500,
      fontSize: 20,
      letterSpacing: "-.01em",
      color: "var(--sm-ink)"
    }
  }, "S\xEDntomas sugeridos"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Cerrar",
    variant: "ghost",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 15,
    color: "var(--sm-ink-meta)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 14,
      lineHeight: 1.55,
      color: "var(--sm-ink-meta)"
    }
  }, "Ninguna est\xE1 en tu mapa todav\xEDa. Si alguna no encaja, qu\xEDtala \u2014 no pasa nada."), items.map(s => /*#__PURE__*/React.createElement(SuggestionCard, {
    key: s.id,
    compact: true,
    accepted: s.state === "accepted",
    title: s.name,
    body: s.reason,
    meta: s.state === "accepted" ? "En tu mapa" : "",
    sources: s.sources.map(c => {
      const d = diags.find(x => x.id === c);
      return d ? /*#__PURE__*/React.createElement(SourceTag, {
        key: c,
        label: d.label,
        slot: d.slot,
        size: "sm"
      }) : null;
    }),
    acceptLabel: "A\xF1adir",
    rejectLabel: "No me encaja",
    onAccept: () => onAccept(s.id),
    onReject: () => onReject(s.id)
  })), items.every(s => s.state) && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 14,
      lineHeight: 1.55,
      color: "var(--sm-ink-meta)"
    }
  }, "Has revisado todas. Puedes pedir m\xE1s cuando quieras.")), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: "flex",
      gap: 10,
      padding: "16px 20px 20px",
      borderTop: "1px solid var(--sm-line-hairline)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    grow: true,
    onClick: onAcceptAll,
    disabled: items.every(s => s.state)
  }, "A\xF1adir las que quedan"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Cerrar")));
}
Object.assign(window, {
  ReviewPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ReviewPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Sidebar.jsx
try { (() => {
/* Left panel — the prototype's three accordions: my diagnoses, add a symptom, symptoms.
   Sentence case, Spanish, no monospace, no uppercase labels. */
const {
  SidebarGroup,
  DiagnosisChip,
  SymptomRow,
  Button,
  IconButton,
  Icon,
  Badge,
  TextField,
  Checkbox,
  Count
} = window.SymptomMapDesignSystem_dfef9e;
function Sidebar({
  diags,
  symptoms,
  selected,
  filter,
  groups,
  toggleGroup,
  onSelect,
  onFilter,
  onProfile,
  onAddDiagnosis,
  onSuggest,
  onAddSymptom,
  busy
}) {
  const [name, setName] = React.useState("");
  const [context, setContext] = React.useState("");
  const [conds, setConds] = React.useState([]);
  const submit = () => {
    if (!name.trim()) return;
    onAddSymptom({
      name: name.trim(),
      context: context.trim(),
      sources: conds
    });
    setName("");
    setContext("");
    setConds([]);
  };
  return /*#__PURE__*/React.createElement("aside", {
    className: "sm-sidebar",
    style: {
      gap: 18,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement(SidebarGroup, {
    title: "Mis diagn\xF3sticos",
    count: diags.length,
    collapsed: !groups.diags,
    onToggle: () => toggleGroup("diags")
  }, diags.map(d => /*#__PURE__*/React.createElement(DiagnosisChip, {
    key: d.id,
    label: d.label,
    slot: d.slot,
    compact: true,
    selected: selected === d.id,
    onClick: () => onSelect(d.id),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      label: filter.includes(d.id) ? "Quitar el filtro del mapa" : "Ver solo este diagnóstico",
      variant: "ghost",
      onClick: e => {
        e.stopPropagation();
        onFilter(d.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 14,
      color: filter.includes(d.id) ? "var(--sm-ink)" : "var(--sm-ink-meta)"
    })), /*#__PURE__*/React.createElement(IconButton, {
      label: "Editar el perfil de este diagn\xF3stico",
      variant: "ghost",
      onClick: e => {
        e.stopPropagation();
        onProfile(d.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 14,
      color: d.profile ? "var(--sm-ink)" : "var(--sm-ink-meta)"
    })))
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    block: true,
    onClick: onAddDiagnosis,
    style: {
      marginTop: 2
    }
  }, "+ A\xF1adir diagn\xF3stico"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    block: true,
    disabled: busy,
    onClick: onSuggest,
    style: {
      marginTop: 6,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ai"
  }, "IA"), busy ? "Buscando…" : "Sugerir síntomas"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontFamily: "var(--sm-font-body)",
      fontSize: 13,
      lineHeight: 1.5,
      color: "var(--sm-ink-meta)"
    }
  }, "T\xFA decides qu\xE9 entra en tu mapa. Nada se a\xF1ade solo.")), /*#__PURE__*/React.createElement("hr", {
    className: "sm-divider"
  }), /*#__PURE__*/React.createElement(SidebarGroup, {
    title: "A\xF1adir s\xEDntoma",
    collapsed: !groups.add,
    onToggle: () => toggleGroup("add")
  }, /*#__PURE__*/React.createElement(TextField, {
    placeholder: "ej. n\xE1useas, insomnio\u2026",
    value: name,
    onChange: e => setName(e.target.value)
  }), name.length > 1 && /*#__PURE__*/React.createElement(TextField, {
    label: "\xBFCu\xE1ndo o c\xF3mo aparece? (opcional)",
    multiline: true,
    placeholder: "ej. cuando hay mucha gente, al despertar\u2026",
    value: context,
    onChange: e => setContext(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-field__label",
    style: {
      marginTop: 2
    }
  }, "\xBFDe qu\xE9 diagn\xF3stico viene? (opcional)"), /*#__PURE__*/React.createElement("div", {
    className: "sm-choice-group",
    style: {
      gap: 9
    }
  }, diags.map(d => /*#__PURE__*/React.createElement(Checkbox, {
    key: d.id,
    label: d.label,
    checked: conds.includes(d.id),
    onChange: () => setConds(conds.includes(d.id) ? conds.filter(c => c !== d.id) : conds.concat(d.id))
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    block: true,
    disabled: !name.trim(),
    onClick: submit,
    style: {
      marginTop: 4
    }
  }, "A\xF1adir al mapa"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--sm-font-body)",
      fontSize: 13,
      lineHeight: 1.5,
      color: "var(--sm-ink-meta)"
    }
  }, "Sin diagn\xF3stico queda como s\xEDntoma suelto \u2014 puedes ubicarlo m\xE1s tarde.")), /*#__PURE__*/React.createElement("hr", {
    className: "sm-divider"
  }), /*#__PURE__*/React.createElement(SidebarGroup, {
    title: "S\xEDntomas",
    count: symptoms.filter(s => !s.pending).length,
    collapsed: !groups.list,
    onToggle: () => toggleGroup("list")
  }, symptoms.filter(s => !s.pending).map(s => /*#__PURE__*/React.createElement(SymptomRow, {
    key: s.id,
    label: s.name,
    compact: true,
    slot: s.sources.length ? (diags.find(d => d.id === s.sources[0]) || {}).slot : undefined,
    sources: s.sources.map(c => (diags.find(d => d.id === c) || {}).slot).filter(Boolean),
    selected: selected === s.id,
    onClick: () => onSelect(s.id)
  }))));
}
Object.assign(window, {
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
/* Fake data for the SymptomMap app UI kit.
   Shared symptoms carry `weights` alongside `sources`: equal weights split the segmented node
   evenly, a heavier weight takes more of the circle (insomnio 70/30, disociacion 50/25/25).
   Diagnosis colour comes from ring slots assigned PER MAP (assignSlots(4) -> 1,4,6,9),
   exactly as components/map/diagnosisColor.js prescribes. Never per diagnosis. */
window.SM = function () {
  const diagnoses = [{
    id: "tda",
    label: "TDAH",
    full: "TDA / TDAH",
    slot: 1,
    x: 116,
    y: 133,
    profile: true
  }, {
    id: "tlp",
    label: "TLP",
    full: "TLP / Borderline",
    slot: 4,
    x: 310,
    y: 124,
    profile: true
  }, {
    id: "cptsd",
    label: "C-PTSD",
    full: "C-PTSD / TEPT complejo",
    slot: 6,
    x: 500,
    y: 139,
    profile: false
  }, {
    id: "aut",
    label: "Rasgos autistas",
    full: "Rasgos autistas / TEA",
    slot: 9,
    x: 667,
    y: 133,
    profile: false
  }];
  const symptoms = [{
    id: "s1",
    name: "procrastinación",
    sources: ["tda"],
    x: 60,
    y: 252,
    context: "cuando la tarea no tiene un final claro"
  }, {
    id: "s2",
    name: "hiperfoco",
    sources: ["tda"],
    x: 178,
    y: 276
  }, {
    id: "s3",
    name: "olvidos frecuentes",
    sources: ["tda"],
    x: 91,
    y: 356
  }, {
    id: "s4",
    name: "miedo al abandono",
    sources: ["tlp"],
    x: 273,
    y: 245
  }, {
    id: "s5",
    name: "vaivenes emocionales",
    sources: ["tlp"],
    x: 376,
    y: 257
  }, {
    id: "s6",
    name: "hipervigilancia",
    sources: ["cptsd"],
    x: 501,
    y: 245
  }, {
    id: "s7",
    name: "vergüenza intensa",
    sources: ["cptsd"],
    x: 593,
    y: 301
  }, {
    id: "s8",
    name: "sobrecarga sensorial",
    sources: ["aut"],
    x: 700,
    y: 264
  }, {
    id: "s9",
    name: "enmascaramiento",
    sources: ["aut"],
    x: 748,
    y: 366
  }, {
    id: "s10",
    name: "sensibilidad al rechazo",
    sources: ["tda", "tlp"],
    weights: [1, 1],
    x: 212,
    y: 348,
    notes: "Pasa sobre todo en el trabajo."
  }, {
    id: "s11",
    name: "insomnio",
    sources: ["tda", "cptsd"],
    weights: [7, 3],
    x: 261,
    y: 430,
    context: "las noches después de un día social"
  }, {
    id: "s12",
    name: "disociación bajo estrés",
    sources: ["tlp", "cptsd", "aut"],
    weights: [2, 1, 1],
    x: 465,
    y: 402,
    ai: "Puede que aparezca cuando tres cosas coinciden: una conversación tensa, mucho ruido y poco sueño."
  }, {
    id: "s13",
    name: "náuseas al despertar",
    sources: [],
    x: 611,
    y: 467,
    floating: true
  }];

  /* AI suggestions stay PENDING until the person chooses. Hedged, plain words, no severity. */
  const suggestions = [{
    id: "g1",
    name: "cansancio después de socializar",
    sources: ["aut", "cptsd"],
    reason: "Puede que sostener la atención social te cueste más de lo que se ve desde fuera, y que el cuerpo lo cobre al día siguiente."
  }, {
    id: "g2",
    name: "dificultad para empezar tareas",
    sources: ["tda"],
    reason: "A veces no es falta de ganas: es que la tarea no tiene un primer paso visible."
  }, {
    id: "g3",
    name: "vergüenza tras un conflicto",
    sources: ["tlp", "cptsd"],
    reason: "Suele llegar cuando una discusión se cierra sin reparación, aunque la otra persona ya lo haya olvidado."
  }, {
    id: "g4",
    name: "necesidad de silencio total",
    sources: ["aut"],
    reason: "Puede que el silencio no sea un gusto, sino la forma de recuperar espacio propio."
  }];

  /* Diagnosis-profile questionnaire — the prototype's per-diagnosis fields, one modal per diagnosis. */
  const profileFields = {
    tda: {
      title: "TDA / TDAH",
      desc: "Cuéntame cómo se manifiesta en ti. Con esto las sugerencias se acercan más a tu experiencia.",
      subtype: {
        label: "Presentación principal",
        options: ["Inatento predominante", "Hiperactivo predominante", "Combinado", "No sé / mixto"],
        value: "Combinado"
      },
      triggers: {
        label: "Detonadores frecuentes",
        options: ["Estrés", "Ruido / ambiente", "Tareas largas", "Interacciones sociales", "Sueño irregular", "Pantallas"],
        value: ["Tareas largas", "Sueño irregular"]
      },
      age: {
        label: "Edad de diagnóstico",
        placeholder: "ej. 22",
        value: "22"
      },
      known: {
        label: "Síntomas que ya sabes que tienes",
        placeholder: "ej. procrastinación, hiperfoco, olvidos…",
        value: "procrastinación, hiperfoco"
      }
    },
    tlp: {
      title: "TLP — Borderline",
      desc: "El TLP se expresa distinto en cada persona. Esto ayuda a personalizar las sugerencias.",
      subtype: {
        label: "Patrón más reconocible en ti",
        options: ["Miedo al abandono intenso", "Cambios de identidad", "Impulsividad", "Vaivenes emocionales rápidos", "Disociación frecuente"],
        value: "Vaivenes emocionales rápidos"
      },
      triggers: {
        label: "Detonadores frecuentes",
        options: ["Rechazo percibido", "Conflictos", "Soledad", "Estrés laboral", "Cambios inesperados", "Críticas"],
        value: ["Rechazo percibido", "Críticas"]
      },
      age: {
        label: "Edad de diagnóstico",
        placeholder: "ej. 28",
        value: "26"
      },
      known: {
        label: "Síntomas que reconoces en ti",
        placeholder: "ej. vergüenza intensa, vaivenes…",
        value: ""
      }
    },
    cptsd: {
      title: "C-PTSD",
      desc: "Varía mucho según el tipo de trauma y cómo se procesa. Esto personaliza las sugerencias.",
      subtype: {
        label: "Manifestación más presente",
        options: ["Hipervigilancia", "Disociación", "Flashbacks emocionales", "Vergüenza tóxica", "Dificultad de confianza"],
        value: ""
      },
      triggers: {
        label: "Detonadores frecuentes",
        options: ["Conflictos", "Críticas", "Abandono percibido", "Estrés acumulado", "Sensaciones corporales"],
        value: []
      },
      age: {
        label: "Edad de diagnóstico",
        placeholder: "ej. 32",
        value: ""
      },
      known: {
        label: "Síntomas que reconoces en ti",
        placeholder: "ej. disociación bajo estrés…",
        value: ""
      }
    },
    aut: {
      title: "Rasgos autistas",
      desc: "El perfil autista es muy individual. Tu experiencia concreta cambia mucho las sugerencias.",
      subtype: {
        label: "Áreas más presentes en ti",
        options: ["Sensorial (hiper/hipo)", "Social / comunicación", "Rutinas y rigidez", "Intereses intensos", "Fatiga autista", "Enmascaramiento"],
        value: "Sensorial (hiper/hipo)"
      },
      triggers: {
        label: "Detonadores frecuentes",
        options: ["Sobrecarga sensorial", "Cambios de rutina", "Interacción social intensa", "Imprevistos", "Entornos ruidosos"],
        value: ["Sobrecarga sensorial"]
      },
      age: {
        label: "Edad de diagnóstico",
        placeholder: "ej. 35",
        value: ""
      },
      known: {
        label: "Síntomas que reconoces en ti",
        placeholder: "ej. meltdowns, shutdowns…",
        value: ""
      }
    }
  };

  /* The catalogue the "add diagnosis" sheet searches — a slice of the prototype's registry. */
  const catalogue = ["Ansiedad generalizada", "Trastorno de pánico", "Fobia social", "TOC", "Depresión mayor", "Distimia", "Trastorno bipolar II", "Anorexia nerviosa", "Bulimia nerviosa", "ARFID", "Insomnio crónico", "Fibromialgia", "TDPM", "Dislexia", "Dispraxia / TDC"];

  /* Rule 02 — a new diagnosis drops into the widest free ring position; nothing recolours.
     Same logic as components/map/diagnosisColor.js (lowercase helpers are not on the
     bundle namespace, so the kit carries its own copy). */
  function ringDistance(a, b) {
    const d = Math.abs(a - b) % 10;
    return Math.min(d, 10 - d);
  }
  function addSlot(taken) {
    if (taken.length >= 10) return null;
    let best = null,
      score = -1;
    for (let i = 1; i <= 10; i++) {
      if (taken.indexOf(i) >= 0) continue;
      let nearest = 10;
      for (const t of taken) nearest = Math.min(nearest, ringDistance(t, i));
      if (nearest > score) {
        score = nearest;
        best = i;
      }
    }
    return best;
  }
  return {
    diagnoses,
    symptoms,
    suggestions,
    profileFields,
    catalogue,
    addSlot
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Count = __ds_scope.Count;

__ds_ns.InlineMessage = __ds_scope.InlineMessage;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.CodeInput = __ds_scope.CodeInput;

__ds_ns.PillSelect = __ds_scope.PillSelect;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Connection = __ds_scope.Connection;

__ds_ns.ConnectionLayer = __ds_scope.ConnectionLayer;

__ds_ns.DiagnosisChip = __ds_scope.DiagnosisChip;

__ds_ns.DiagnosisNode = __ds_scope.DiagnosisNode;

__ds_ns.SourceTag = __ds_scope.SourceTag;

__ds_ns.SuggestionCard = __ds_scope.SuggestionCard;

__ds_ns.SymptomNode = __ds_scope.SymptomNode;

__ds_ns.SymptomRow = __ds_scope.SymptomRow;

__ds_ns.RING = __ds_scope.RING;

__ds_ns.AI_COLOR = __ds_scope.AI_COLOR;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.MapControls = __ds_scope.MapControls;

__ds_ns.MapStatus = __ds_scope.MapStatus;

__ds_ns.SidebarGroup = __ds_scope.SidebarGroup;

__ds_ns.StepCard = __ds_scope.StepCard;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Modal = __ds_scope.Modal;

})();

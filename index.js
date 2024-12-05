"use strict";

const parser = require("postcss-value-parser");
const processed = Symbol("processed");

const defaults = {
  variables: {},
  treatErrorsAsWarnings: false,
};

function isVarFunction(node) {
  return (
    node.type === "function" &&
    node.value === "var" &&
    node.nodes &&
    node.nodes.length > 0
  );
}

const plugin = (options = {}) => {
  const opts = { ...defaults, ...options };
  return {
    postcssPlugin: "postcss-var-func-fallback",
    Declaration(decl, { result }) {
      function failOrWarn(text, name) {
        if (opts.treatErrorsAsWarnings) {
          decl.warn(result, text);
          return;
        }
        throw decl.error(text, { word: name });
      }

      if (decl[processed] || !decl.value.includes("var(--")) {
        return;
      }

      let updateDecl = false;
      const parsedValue = parser(decl.value);

      parsedValue.walk((node) => {
        if (!isVarFunction(node)) {
          return;
        }

        const varName = node.nodes[0].value;

        if (node.nodes.length > 1) {
          failOrWarn(`Fallback value already provided for variable ${varName}`, varName);
          return;
        }

        const varValue = opts.variables[varName];

        if (!varValue) {
          failOrWarn(`Fallback value not found for variable ${varName}`, varName);
          return;
        }

        node.nodes.push({ type: "div", value: ",", before: "", after: " " });
        node.nodes.push({ type: "word", value: varValue });
        updateDecl = true;
      });

      if (updateDecl) {
        decl.value = parsedValue.toString();
        decl[processed] = true;
      }
    },
  };
};

plugin.postcss = true;

module.exports = plugin;

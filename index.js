'use strict';

const parser = require('postcss-value-parser');
const processed = Symbol('processed');

module.exports = (opts = { variables: {} }) => {
  return {
    postcssPlugin: 'postcss-var-func-fallback',
    Declaration(decl, { result }) {
      if (decl[processed] || !decl.value.includes('var(--')) {
        return;
      }

      let updateDecl = false;
      const parsedValue = parser(decl.value);

      parsedValue.walk((node) => {
        if (node.type !== 'function' || node.value !== 'var' || !node.nodes || !node.nodes.length) {
          return;
        }

        const varName = node.nodes[0].value;

        if (node.nodes.length > 1) {
          decl.warn(result, `Fallback value already provided for variable ${varName}`);
          return;
        }

        const varValue = opts.variables[varName];

        if (!varValue) {
          decl.warn(result, `Fallback value not found for variable ${varName}`);
          return;
        }

        node.nodes.push({ type: 'div', value: ',', before: '', after: ' ' });
        node.nodes.push({ type: 'word', value: varValue });
        updateDecl = true;
      });

      if (updateDecl) {
        decl.value = parsedValue.toString();
        decl[processed] = true;
      }
    }
  };
}

module.exports.postcss = true

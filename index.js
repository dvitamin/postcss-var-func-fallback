'use strict';

const postcss = require('postcss');
const parser = require('postcss-value-parser');
const processed = Symbol('processed');

module.exports = postcss.plugin('postcss-var-func-fallback', (opts = { variables: {}, failOnWarnings: false }) => {
  return (root, result) => {
    root.walkDecls(decl => {

      function failOrWarn(result, text) {
        if(opts.failOnWarnings) {
          throw Error(text);
        }
        decl.warn(result, text);
      }

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
          failOrWarn(result, `Fallback value already provided for variable ${varName}`)
          return;
        }

        const varValue = opts.variables[varName];

        if (!varValue) {
          failOrWarn(result, `Fallback value not found for variable ${varName}`)
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
    });
  }
});

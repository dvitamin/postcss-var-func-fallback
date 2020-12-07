# PostCSS Var Func Fallback

[PostCSS] plugin Adds fallback values to var(name) occurences.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    /* Input example */
    color: var(--theme);
}
```

```css
.foo {
    /* Output example */
    color: var(--theme, royalblue);
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-var-func-fallback
```

**Step 2:** Check your project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-var-func-fallback'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

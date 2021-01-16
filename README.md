# PostCSS var() fallback

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
+   require('postcss-var-func-fallback')({
+     variables: {
+       '--theme': 'royalblue'
+     }
+   }),
    require('autoprefixer')
  ]
}
```

## Options

### `variables` (default: `{}`)

An object map of variable declarations in JavaScript that will be used to complement var(name) occurences with fallback values.

### `failOnWarnings` (default: `false`)

Throws an error if a warning occur.

## Notes

- This plugin fits well when having external css-variable declarations (see [get-css-variables](https://github.com/OlofFredriksson/get-css-variables) plugin for extracting an object map)
- This plugin don't solve IE11 support (see [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables) plugin)

[official docs]: https://github.com/postcss/postcss#usage

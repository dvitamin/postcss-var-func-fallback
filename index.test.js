const postcss = require('postcss');
const plugin = require('./');

async function run(input, output, opts = {}, expectedWarning) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);

  if (expectedWarning) {
    expect(result.warnings()).toHaveLength(1);
    expect(result.warnings()[0].text).toEqual(expectedWarning);
  } else {
    expect(result.warnings()).toHaveLength(0);
  }
}

it('adds fallback value to var func', async () => {
  await run(
    'a{ border: var(--border-size) solid var(--border-color) }',
    'a{ border: var(--border-size, 1px) solid var(--border-color, orange) }',
    {
      variables: {
        '--border-size': '1px',
        '--border-color': 'orange'
      }
    }
  );
});

it('warns if fallback value already provided', async () => {
  await run(
    'a{ border: var(--border-size) solid var(--border-color, orange) }',
    'a{ border: var(--border-size, 1px) solid var(--border-color, orange) }',
    {
      variables: {
        '--border-size': '1px',
        '--border-color': 'orange'
      }
    },
    'Fallback value already provided for variable --border-color'
  );
});

it('warns if fallback value not found in variables', async () => {
  await run(
    'a{ border: var(--border-size) solid var(--border-color) }',
    'a{ border: var(--border-size) solid var(--border-color, orange) }',
    {
      variables: {
        '--border-color': 'orange'
      }
    },
    'Fallback value not found for variable --border-size'
  );
});

it('ignores other funcs', async () => {
  await run(
    'div{ background-color: rgba(233, 45, 66, .5) }',
    'div{ background-color: rgba(233, 45, 66, .5) }',
    {}
  );
});

it('build fails if fallback value not found in variables', async () => {
  const input = 'a{ border: var(--border-size) solid var(--border-color) }';
  const opts = {failOnWarnings: true};
  await expect(postcss([plugin(opts)]).process(input, { from: undefined })).rejects.toThrow("Cannot read property '--border-size' of undefined");
});

it('build fails if fallback value already provided', async () => {
  const input = 'a{ border: var(--border-size) solid var(--border-color, orange) }';
  const opts = {
    variables: {
    '--border-size': '1px',
    '--border-color': 'orange'
   },failOnWarnings: true};
  await expect(postcss([plugin(opts)]).process(input, { from: undefined })).rejects.toThrow("Fallback value already provided for variable --border-color");
});

it('ignores non-funcs', async () => {
  await run(
    'div{ background-color: aliceblue }',
    'div{ background-color: aliceblue }',
    {}
  );
});


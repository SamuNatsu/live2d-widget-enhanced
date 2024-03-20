/// Rollup config
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { createFilter } from '@rollup/pluginutils';
import terser from '@rollup/plugin-terser';

/** @returns {import('rollup').Plugin} */
function string(opts = {}) {
  // Check options
  if (!opts.include) {
    throw Error('include option should be specified');
  }

  // Create module filter
  const filter = createFilter(opts.include, opts.exclude);

  // Return plugin
  return {
    name: 'string',
    transform(code, id) {
      if (filter(id)) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: '' }
        };
      }
    },
    renderChunk(code) {
      return `/*!
 * Live2D Widget Enhanced
 * https://github.com/SamuNatsu/live2d-widget-enhanced
 */
${code}`;
    }
  };
}

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/waifu-tips.js',
  output: {
    file: 'dist/waifu-tips.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    terser(),
    string({
      include: '**/*.svg'
    })
  ]
};

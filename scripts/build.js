/// Build script
import fs from 'fs';
import path from 'path';

import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

import { rollup } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

import pkg from '../package.json' assert { type: 'json' };

// Alias options
/** @type {import('@rollup/plugin-alias').RollupAliasOptions} */
const aliasOptions = {
  '@': path.resolve('../src'),
  '@api': path.resolve('../src/api'),
  '@core': path.resolve('../src/core')
};

// SVG loader
/** @returns {import('rollup').Plugin} */
function svgLoader() {
  const filter = createFilter('**/*.svg');
  return {
    name: 'svg-loader',
    transform(code, id) {
      if (filter(id)) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: { mappings: '' }
        };
      }
    }
  };
}

// Build autoload.min.js
{
  const bundle = await rollup({
    input: 'src/autoload.ts',
    plugins: [
      alias(aliasOptions),
      json(),
      svgLoader(),
      typescript(),
      nodeResolve()
    ]
  });

  await bundle.write({
    file: 'dist/autoload.min.js',
    format: 'iife',
    banner: `/*! Live2D Widget Enhanced v${pkg.version} (https://github.com/SamuNatsu/live2d-widget-enhanced) */`,
    plugins: [terser()]
  });

  await bundle.close();
}

// Build core.min.js
{
  const bundle = await rollup({
    input: 'src/core/index.ts',
    plugins: [
      alias(aliasOptions),
      json(),
      svgLoader(),
      typescript(),
      nodeResolve()
    ]
  });

  await bundle.write({
    name: 'l2dwe',
    file: 'dist/core.min.js',
    format: 'iife',
    banner: `/*! Live2D Widget Enhanced v${pkg.version} (https://github.com/SamuNatsu/live2d-widget-enhanced) */`,
    plugins: [terser()]
  });

  await bundle.close();
}

// Copy public files
fs.cpSync('public/', 'dist/', { recursive: true });

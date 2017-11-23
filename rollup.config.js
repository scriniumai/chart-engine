
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  moduleName: 'Engine',
  entry: 'src/index.js',
  dest: 'dist/engine.js',
  format: 'umd',
  plugins: [
    babel(),
    nodeResolve(),
    commonjs()
  ]
}
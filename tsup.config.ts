import { Options, defineConfig } from "tsup";

const env = process.env.NODE_ENV;
const settings: Options | Options[] = {
  target: 'es2020',
  entryPoints: env.includes('production') ? ['src/index.ts'] : undefined,
  entry: env.includes('production') ? ['src/**/*.ts'] : {
    'pixi-basis-ktx2': "src/index.ts"
  }, //include all files under src
  format: env.includes('production') ? ["cjs", "esm"] : ["cjs"], // Build for commonJS and ESmodules
  outDir: env.includes('production') ? 'dist' : 'lib',
  dts: env.includes('production'), // Generate declaration file (.d.ts)
  skipNodeModulesBundle: true,
  splitting: false,
  sourcemap: true,
  minifySyntax: true,
  minifyWhitespace: false,
  minifyIdentifiers: true,
  outExtension: env.includes('production') ? undefined : ({options}) => {
    const formatExtension = [options.minify ? '.min' : ''].filter(Boolean);
    return {
      js: `${formatExtension}.js`,
    };
  },
}
console.log(settings);

export default defineConfig(settings);

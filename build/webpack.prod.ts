import Path from 'path';
import * as Glob from 'glob';
import { Configuration } from 'webpack';
import TypescriptDeclarationPlugin from 'typescript-declaration-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

function getEntries(): Record<string, string> {
    const extension = '.ts';
    // Recursively find all the `.ts` files inside src folder.
    const matchedFiles = Glob.sync(`./src/**/*${extension}`, {
        nodir: false,
    });
    const entry: Record<string, string> = {};
    matchedFiles.forEach((file) => {
        const SRC_FOLDER = Path.join(__dirname, 'src');
        const ABS_PATH = Path.join(__dirname, file);
        // Generates relative file paths like `src/test/file.ts`
        const relativeFile = './' + Path.relative(SRC_FOLDER, ABS_PATH);
        // fileKey is relative filename without extension.
        // E.g. `src/test/file.ts` becomes `src/test/file`
        const fileKey = Path.join(Path.dirname(relativeFile), Path.basename(relativeFile, extension));
        entry[fileKey] = relativeFile;
    });
    return entry;
}

const config: Configuration = {
    context: Path.join(__dirname, '..', 'src'),
    entry: getEntries(),
    output: {
        path: Path.resolve(__dirname, '..', 'lib'),
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        defaults: false,
                        unused: true,
                    },
                    mangle: false,
                    format: {
                        comments: 'all',
                    },
                },
            }),
        ],
    },
    plugins: [new TypescriptDeclarationPlugin(), new CleanWebpackPlugin()],
};

export default config;

import Path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const config: Configuration = {
    entry: './src/index.ts',
    output: {
        filename: process.env.MINIFY ? 'pixi-basis-ktx2.min.js' : 'pixi-basis-ktx2.js',
        path: Path.resolve(__dirname, '..', 'dist'),
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
        minimize: Boolean(process.env.MINIFY),
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.log statements
                    },
                    output: {
                        comments: false, // Remove comments
                    },
                },
                extractComments: false, // Remove license file with extracted comments
            }),
        ],
    },
};

export default config;

import Path from 'path';
import * as Glob from 'glob';
import { Configuration } from 'webpack';

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
    resolve: {
        extensions: ['.ts', '.js', '.d.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.types.json',
                },
            },
        ],
    },
};

export default config;

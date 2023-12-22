module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-plugin/eslint-recommended', // Adjust default rules for typescript support
        'plugin:@typescript-eslint/eslint-plugin/recommended', // Default typescript rules
        'plugin:@typescript-eslint/eslint-plugin/recommended-requiring-type-checking', // Enable typescript typechecking
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            files: ['*.ts', '*.tsx'], // Your TypeScript files extension

            // As mentioned in the comments, you should extend TypeScript plugins here,
            // instead of extending them outside the `overrides`.
            // If you don't want to extend any rules, you don't need an `extends` attribute.
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'],

            parserOptions: {
                project: ['./tsconfig.base.json'], // Specify it only for TypeScript files
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['node_modules/**', 'dist/**', 'lib/**', 'assets/**', 'types/**'],
    rules: {},
};

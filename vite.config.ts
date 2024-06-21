import { resolve } from 'path'
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_'],
    resolve: {
        alias: {
            '@interfaces': resolve(__dirname, './src/static/types'),
            '@components': resolve(__dirname, './src/components'),
            '@containers': resolve(__dirname, './src/containers'),
            '@routes': resolve(__dirname, './src/routes'),
            '@pages': resolve(__dirname, './src/pages'),
            '@styles': resolve(__dirname, './src/styles'),
            '@config': resolve(__dirname, './src/config'),
            '@src': resolve(__dirname, './src'),
            '@assets': resolve(__dirname, './src/assets'),
            '@hooks': resolve(__dirname, './src/utils/hooks'),
            '@store': resolve(__dirname, './src/store'),
            '@static': resolve(__dirname, './src/static'),
            '@utils': resolve(__dirname, './src/utils'),
        },
    },
    plugins: [solidPlugin(), optimizeLodashImports()],
    server: {
        port: 3000,
        host: true,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ['**/src-tauri/**'],
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                docs: resolve(__dirname, 'src/windows/docs/index.html'),
            },
        },
        // Tauri supports es2021
        target: ['es2021', 'esnext'],
        // don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG,
    },
})

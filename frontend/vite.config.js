// Filename - Plugins.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: () => 'bundle',
                entryFileNames: `bundle.js`,
                chunkFileNames: `bundle.js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        css: true,
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.test.{js,jsx,ts,tsx}',
                '**/*.config.{js,ts}',
                '**/main.jsx',
                '**/vite.config.js'
            ],
            thresholds: {
                global: {
                    branches: 70,
                    functions: 70,
                    lines: 70,
                    statements: 70
                }
            }
        },
        testTimeout: 10000,
        watch: false
    },
    server: {
        port: 3000,
        open: true
    }
})
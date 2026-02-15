// Filename - Plugins.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config that forces a single JS bundle named `bundle.js`
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                // Force everything into one file named bundle.js
                manualChunks: () => 'bundle',
                entryFileNames: `bundle.js`,
                chunkFileNames: `bundle.js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
})
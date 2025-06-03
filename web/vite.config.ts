import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';
  
  return {
    plugins: [
      react(),
      ...(isLib ? [dts({ insertTypesEntry: true })] : []),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5000,
      host: '0.0.0.0',
    },
    ...(isLib ? {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'DesignSystem',
          formats: ['es', 'umd'],
          fileName: (format) => `design-system.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    } : {}),
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
  };
}); 
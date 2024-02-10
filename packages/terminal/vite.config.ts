import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const MODE = process.env.MODE ?? 'lib';

const resolve: UserConfig['resolve'] = {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
};

const libConfig = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  resolve,
  build: {
    lib: MODE === 'lib' && {
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'MyLib',
      formats: ['es', 'umd'],
      fileName: (format) => `lib.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        },
        banner: '"use client";\n',
      },
    },
  },
});

const uiConfig = defineConfig({
  plugins: [react()],
  resolve,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

export default MODE === 'lib' ? libConfig : uiConfig;

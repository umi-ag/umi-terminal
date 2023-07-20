import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const MODE = process.env.MODE ?? 'lib';

const libConfig = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
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
      },
    },
  },
});

const uiConfig = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});

export default MODE === 'lib' ? libConfig : uiConfig;

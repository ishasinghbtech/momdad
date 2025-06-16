import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { visualizer } from 'rollup-plugin-visualizer';

// export default defineConfig({
//   base: './',
//   plugins: [
//     react(),
//     visualizer({
//       open: true, // Automatically opens report in browser
//       filename: 'dist/report.html',
//       gzipSize: true,
//       brotliSize: true,
//     })
//   ],
// });



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   base: './',
// //   plugins: [react()],
// //   server: {
// //     headers: {
// //       'Content-Security-Policy': "script-src 'self' 'unsafe-eval'"
// //     }
// //   }
// // })

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     minify: 'esbuild', // faster + safer than terser
//   },
//   esbuild: {
//     legalComments: 'none',
//     pure: ['eval', 'new Function'],
//   }
// });


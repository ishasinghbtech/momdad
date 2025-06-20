// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,jsx}'],
//   theme: { extend: {} },
//   plugins: [],
// };

  //  /** @type {import('tailwindcss').Config} */
  // export default{
  //    content: [
  //     './index.html',
  //      "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths as necessary
  //    ],
  //    theme: {
  //      extend: {},
  //    },
  //    plugins: [],
  //  };
   
  /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default {
  content: [
    './views/**/*.hbs',
    './src/**/*.{js,ts}',
    './views/layouts/component/**/*.hbs',
    './views/layouts/**/*.hbs',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
  prefix: 'tw-',
  important: true,
  corePlugins: {
    preflight: false,
  },
  variants: {
    extend: {
      opacity: ['group-hover'],
      textColor: ['group-hover'],
      backgroundColor: ['group-hover'],
      translate: ['group-hover'],
      scale: ['group-hover'],
    },
  },
};
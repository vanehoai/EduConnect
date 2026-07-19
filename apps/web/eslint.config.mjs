import nextPlugin from '@next/eslint-plugin-next';
import config from '@school/eslint-config/browser';

export default [
  { ignores: ['next-env.d.ts'] },
  ...config,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];

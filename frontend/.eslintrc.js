module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Désactiver les règles qui causent des erreurs de build
    'no-unused-vars': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@tailwindcss/line-clamp': 'off'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}; 
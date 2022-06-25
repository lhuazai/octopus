module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ['@babel/preset-env', {
      'targets': {
        'browsers': ['last 2 versions', 'safari >= 7']
        // 'android': >= 3.2
      },
      'useBuiltIns': 'usage',
      'corejs': 3
    }]
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
};

const path = require('path');
const webpack = require('webpack');

const conCobertura = process.argv.includes('--coverage');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    files: [{ pattern: 'test/index.cjs', watched: false }],
    preprocessors: { 'test/index.cjs': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
           
            test: /\.m?js$/,
            resolve: { fullySpecified: false },
          },
          {
            
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
                plugins: conCobertura ? ['istanbul'] : [],
              },
            },
          },
          {
        
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'test'),
            use: {
              loader: 'babel-loader',
              options: { presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]] },
            },
          },
        ],
      },
      plugins: [new webpack.ProvidePlugin({ process: 'process/browser.js' })],
    },

    reporters: conCobertura ? ['progress', 'kjhtml', 'coverage'] : ['progress', 'kjhtml'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html', subdir: 'html' }, { type: 'text-summary' }, { type: 'lcovonly', subdir: '.' }],
    },

    browsers: ['ChromeHeadless'],
    customLaunchers: {
     
      ChromeHeadlessSinSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },
    singleRun: false,
    restartOnFileChange: true,
  });
};
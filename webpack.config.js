const path = require('path');

module.exports = {
    entry: {
        background: './src/background/background.js',
        content: './src/background/content.js',
        popup: './src/popup/popup.js',
        options: './src/options/options.js'
    },
    output: {
        path: path.join(__dirname, 'src', 'bundle'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};

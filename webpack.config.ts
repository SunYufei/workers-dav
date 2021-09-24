const path = require('path');

const mode = process.env.NODE_ENV || 'production';

module.exports = {
    output: {
        path: path.join(__dirname, 'dist')
    },
    mode: mode,
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: []
    },
    module: {
        rules: [{
            loader: 'ts-loader',
            options: {
                transpileOnly: true
            }
        }]
    }
}
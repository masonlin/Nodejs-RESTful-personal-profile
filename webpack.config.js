module.exports = {
    entry: './js/app.js',
    output: {
        path: './js/',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'jsx-loader' }
        ]
    }
};

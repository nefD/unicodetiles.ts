var webpack = require('webpack'),
	path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');

module.exports = {
    entry: "./src/app/index.ts",
    output: {
		path: BUILD_DIR,
        filename: "bundle.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
}
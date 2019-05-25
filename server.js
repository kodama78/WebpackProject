const express = require('express');
const path = require('path');

const app = express();

// only want to use this if we're not in production
if (process.env.NODE_ENV !== 'production') {
	const webpackMiddleware = require('webpack-dev-middleware');
	const webpack = require('webpack');
	const webpackConfig = require('./webpack.config');
	app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
	// tells express to make everything in dist available for use
	app.use(express.static('dist'));
	// used specifically for compatibility with react-router and browserhistory module
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'dist/index.html'))
	})
}

app.listen(process.env.PORT || 3050, () => console.log('Listening'));

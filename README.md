### Webpack Notes
- started with the advent of Single Page Apps
    - SPAs have a much larger amount of JS code that needs to be compiled
    - Problems inherent in SPAs
        - javascript modules were created to get away from having files thousands of lines long
            - this separated files into many small files
                - load order, the order in which files are loaded becomes important since some code depends on others
            - having many JS files and loading them over HTTPS slows down the page, especially for mobile
    - Webpack takes the collection of JS modules and merges them into a large, single file
    - Webpack uses a config file to configure how we create the output file `bundle.js`
    
### Webpack Config Properties
- **Entry Property**
    - typically the entry point of the application is the `index.js` file
    - however, the entry point is typically the point where the other code is being imported into, and
    is not dependent on the other code
    - `entry` property is the path of the entry point file relative to the root project directory, can be a 
    `string` or an `object` for multiple entry points
- **Output Property**
    - `output` property tells Webpack where to build the app. It has two properties:
        - `path` - is where the file should be saved, *must* be an absolute file reference
        - `publicPath` - prepends the string of the folder you wish to expose public assets to 
        - `filename` is the name of the bundle, it can be anything
    - `module` - this is the system that is used to define which module loaders (known as `rules`) are used  on which files
        - `rules` - rules are the name for the loaders that are used on each file that is passed through webpack
            - `use` - property in the `rules` object that identifies the loader to be used by npm name
                - the order of the loaders given does matter such as: `use: ['style-loader', 'css-loader']`, the `style-loader`
                must come before the `css-loader`
                - `options` - inside the object sometimes used for `use`, this is where you pass in the paramemters needed
                by the module/loader
            - `test` - property that is a regex expression to define which files will be passed into the loader
            - `exclude` - use regex to tell modules what files/directories to exclude
            
    
        
    
### Module Systems
- rules and syntax that are used that link together files
    - 3 common ones:
        1. CommonJS
            - recommended and used by Node JS
                - uses `require`
                - uses `module.exports`
        2. AMD - Asynchronous Module Definition
            - used on the front end primarily in code that can be loaded up asynchronously
            - uses `define`
            - uses `require`
        3. ES2015 - Ecmascript standard
            - uses `export`
            - uses `import`
### Module Loaders
- Webpack can be used to handle all types of different files and transpile them into the `bundle.js`
- Each loader tends to be specific towards certain files. Therefore, within the config, you need to specify which files
are handled by which loaders
    - Common Loaders
        - **Babel** - Babel is used to transpile ES 6/7/8 code into ES5 code so it is readable by older browsers
            - babel-loader - connects babel to webpack
            - babel-core - takes in the code, passes it through babel and outputs the ES5 files
            - babel-preset-env - ruleset that tells babel exactly what pieces of ES 6/7/8 syntax to look for and how
            to turn it into ES5 code
            - **Babel will require a `.babelrc` file to tell Babel what to do with our JS files**
        - **CSS**
            - css-loader - knows how to deal with CSS imports
            - style-loader - takes the CSS imports and adds them to the HTML document
                - by default these two loaders will inject the CSS into a style tag inside the `head` of our 
                HTML file
                    - separate style sheets is a lot faster to download due to how the browser handles
                    parallel download requests
        - **Images**
            - image-webpack-loader - will resize/compress an image for us
            - url-loader - behaves differently based on the size of the image
                - if smaller than 10kb, it'll include th eimage in bundle as raw data
                - if larger, it includes the raw image in the output directory
    - Plugins
        - Plugins are different from loaders. Loaders are used for pre-processing before a file is included in the webpack
        bundle.
        - Plugins work somewhat outside that pipeline. They have the ability to keep files outside the bundle.
        
### Codesplitting
-  allows us to split the bundle into separate JS files and then programmatically decide when to load up the bundle inside our
codebase
- by adding an `import` call, you can effectively split your bundle up
    - will need 2 node modules:
        - `babel-plugin-dynamic-import-webpack`
        - `babel-plugin-syntax-dynamic-import`
            - these allow for dynamic imports that can be placed in your codebase
- Codesplitting w/ `react-router`
    - This is the idea of splitting up the code based on the routes in react-router
        - in the main bundle there will be the router home along with the `IndexRoute`
- #### Chunking and Hashing
    - Chunking is a form of splitting your code up into chunks
        - in this repo we split up the code into `bundle` and vendor
            - `bundle` is the code we've created
            - `vendor` is our react libraries
        - we expect `bundle` to change a lot while we don't expect `vendor` to change often
        - we want to use the browser cache for the vendors as much as possible to reduce load time
            - so we use `webpack.optimize.CommonsChunkPlugin()`
            - for `filename` we use `'[name].[chunkhash].js'`
                - this will add a unique ID to our `bundle` and `vendor` files
                - *the hash will only change, and therefore need to be updated by the browser if any of the code has changed*
                - this is referred to as *cache busting* 

            
### Optimizations
- Webpack cannot help with optimizing the speed of our runtime properties (like fetching data)
    - helps us w/ the amount of time it takes to load our JS dependencies
- #### browser caching
    - when user first visits site, browser will look for cached file first

### Useful Additions for webpack
- `webpack-dev-server` - this is used to run webpack in memory. There is no need for a `dist` directory. It greatly increases the time 
it takes to build webpack as it only updates the files that have changed.

### Deployment
- by default Webpack deploys static assets only
    - static assets - anything not served by a dynamic web server
- produces a built application
    - a web server (node) could be used to serve the static assets and access a custom db
- Practices
    - `new webpack.DefinePlugin` - this makes the `process.env.NODE_ENV` available in the window scope and defines window
    scope variables in our `bundle.js`
        - `process.env.NODE_ENV` - several libraries (including react.js) make use of the `NODE_ENV` flag.
            - Whenever they run they look for the variable `process.env.NODE_ENV` in the `window` scope
                - If this flag is `"production"` it does less error checking and assumes this is a user
            - This is a variable that the developer sets.
                - We set this in the `package.json` inside the `build` script:
                    - `"build": "NODE_ENV=production npm run clean && webpack -p"`
                        - the `-p` tells webpack we want a production version
- #### Services for Deployment - Static Sites
    - **Surge**
        - Fantastic for static sites that have no backend
            - npm install surge
        - `surge -p dist` - command that tells surge the directory you want to deploy
        - creates your site at the generated url
    - **Github Pages**
        - when you create a github repo there is a special branch named `gh-pages`.
            - this will create a specially created page at a github created URL
                - `https://<Username>.github.io/<RepoName>`
            - when on the `gh-pages` branch use the following command:
                - `git subtree push --prefix dist origin gh-pages`
                    - this command lets git know that you only want to push a certain directory to the branch and nothing else
        - to make this easy, you can make a script in your `package.json`. For github here is the following
            - `"deploy": "npm run build && git subtree push --prefix dist origin gh-pages"`
    - **Amazon S3**
        - no logic involved
        - serves up folders/files
        - install `-g s3-website` - automatically creates an s3 bucket and deploys our site to it
            - create API keys, give it to `s3-website`
                - go to aws, go to Access Keys
        - create `.env` file
            - make two variables
                - `AWS_ACCESS_KEY_ID`
                - `AWS_SECRET_ACCESS_KEY`
                    copy and past your keys in there
        - run command `s3-website create <name of bucket>`
            - this creates the bucket
        - run `s3-website deploy dist`
            - uploads everything in the `dist` to the bucket
        - cleanup
            - google "how to keep access keys safe"
            - delete the s3 bucket to make sure you're not getting charged
- #### Services for Deployment - Dynamic Sites
    - This is for when you have a site that is interfacing w/ a webserver, such as Node.
        - The webserver is not only serving up your files, but could also be reaching out to a 
        database
        - Two ways to set this up:
            - Two separate addresses:
                - One address sends the built application. What the user sees at `www.app.com`
                - Built app will send requests to a second address(think `www.api.app.com`) through the 
                webserver for any requests
                - this is the way how large applications tend to work
            - Single server that serves up **all** assets:
                - Example:
                    - Node server serves up the built app and has the ability to hit db with requests
                - Benefit is that it is a **monolithic** application. The setup for deployment is easier since
                it is a single server that needs to be deployed
                - adds a bit of compatibility setup between **webpack** and **node**
            - **The rest of this will concentrate on the Single Server setup**
            - Node server will behave differently depending on environment (dev vs. production)
                - **DEV**
                    - it will run the webpack build (kind of like using the `webpack-dev-server`) as middleware
                        - When node/express gets the request, it'll see we are looking for `index.html` and pass it off to
                        the webpack build
                    - install webpack middleware `webpack-dev-middleware`
                        - you'll need `webpack`, `webpackConfig` file, and `webpackMiddleware`
                            - Each will require the previous one `app.use(webpackMiddleware(webpack(webpackConfig)));`
                                - Essentially, running webpack inside of expres
                    
                - **PRODUCTION**
                    - we don't want to be running webpack at all as it's resource hog
                    - want to build our app one time
                    - when the user hits our page, node server goes to our built assets
                    - create a conditional in the `server.js` file that checks for prod flag
                        - `if (process.env.NODE_ENV !== 'production') {
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
                           }`
                           - **NOTE** - it's important to note that the `process.env.NODE_ENV` flag can change
                           depending on what deployment service you are using
                           - Because we are accessing our files in `dist` directly. Make sure that everything is built before 
                           releasing to public deployment
                    - to add additional logic (like auth) you would need to add additional routes **ABOVE** the webpack build
                        - this is due to the user of the `'*'`. This will cause express to never reach any routes underneath the '*'
    - *HEROKU*
        - Make a `Procfile` - automatically executed by Heroku and tells Heroku what to run whenever we want to start
        up our server
            - `start: node server.js` - this command tells Heroku that when we want start up our server as a web server
            to run this command
            - Heroku works off git repositories (not github)
            - Heroku CLI needed
            - login to heroku with `heroku login -i`
            - run `heroku create` inside project
                - this will create the heroku project, give you the url and add it to the heroku git repository
            - now push to the heroku master branch
             
        
                        
                    
    
        
        
                    
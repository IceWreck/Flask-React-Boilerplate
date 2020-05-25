# React Flask Integration: Part 1 - Setup with Webpack

Hi !
This is a two part article. In the first part, we will connect react with flask and use webpack for transpiling JSX to browser readable JavaScript. In the second part, I'll talk about passing data from flask to react and vice-versa.

__GitHub Repo: https://github.com/IceWreck/Flask-React-Boilerplate__ 


## Exploring Different Solutions

* Develop + host flask and react separately. Connect them via an API. This is what most projects do. This approach is perfectly fine but not suitable if you want to use react in a part of your website instead of letting it control the flow.
* Use create-react-app (CRA) and serve react from flask. This method is somewhat hacky as you have to make flask work with CRA's directory structure. You cannot have two completely independent react components in your application.
* Eject your react app from CRA and then serve react from flask. Ejecting gives you the webpack configuration underneath CRA. However, this may leave some bloat and additional scripts that you probably do not need. You have to edit the leftover webpack configuration anyways, so why not just make your own ? This brings us to the next solution.
* Creating your own toolchain. This gives you the freedom to use as much (or as little) react as you like. I'll go with this approach in this tutorial.

## Let's Begin

Like react's docs [recommend](https://reactjs.org/docs/create-a-new-react-app.html#creating-a-toolchain-from-scratch), we need a JavaScript package manager like yarn or npm and a bundler like webpack.

This tutorial will use yarn, a safer, faster and slightly less messier alternative to npm. Yarn is just a frontend, it uses the npm registry under the hood.

You can use npm if you like, the yarn commands mentioned here will have to be slightly changed but in the end it comes down to personal preference. 


So what is webpack ?


Webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles.

In fact, create-react-app is an abstraction on top of webpack.

[This article](https://dev.to/crishanks/it-isn-t-magic-it-s-webpack-3ca4) explains webpack in detail.

...Graphic from their website...


Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph.


In your empty project directory

```bash
# Initiate a project
yarn init -y

# Install React
yarn add react react-dom

# Install Webpack and loaders
yarn add -D webpack webpack-cli webpack-dev-server
yarn add -D @babel/core @babel/preset-env @babel/preset-react babel-loader file-loader
yarn add -D style-loader css-loader

```

Note that `-D` means that its a development dependency. 

Fill up some meta information like name, etc and your package.json should look something like this: 

```json
{
    "name": "react-flask-integration",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "devDependencies": {
        "@babel/core": "^7.9.6",
        "@babel/preset-env": "^7.9.6",
        "@babel/preset-react": "^7.9.4",
        "babel-loader": "^8.1.0",
        "css-loader": "^3.5.3",
        "file-loader": "^6.0.0",
        "style-loader": "^1.2.1",
        "webpack": "^4.43.0",
        "webpack-cli": "^3.3.11",
        "webpack-dev-server": "^3.11.0"
    },
    "dependencies": {
        "react": "^16.13.1",
        "react-dom": "^16.13.1"
    }
}
```

In the same directory, create a virtual environment if you want to and install flask.

```bash
python3 -m venv venv
source venv/bin/activate
pip install flask
```

Now, we will setup flask. Create a file called `app.py` and two empty directories called `static` and `templates`. Create your flask application.

In `app.py`

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)

```

I've set flask to run in debug mode by default but you can remove this if you want and configure debug mode via an environment variable.

In `templates/index.html`

```html
<!DOCTYPE html>
<html>
    <head>
        <title>React-Flask Integration</title>

        <meta charset="utf-8" />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>

    <body>
        <div id="render-react-here">
        </div>
        <script
            type="text/javascript"
            src="{{ url_for('static', filename='dist/main.bundle.js') }}"
        ></script>
    </body>
</html>
```

This is regular jinja templating. Do whatever you do in flask. To add a react component, create an empty `<div>` and add an id like _render-react-here_.

Our very basic flask setup is essentially done . Now comes the react part.

In `static/js/SomePage.js`
```javascript
import SomeComponent from "./components/SomeComponent";
import React from "react";
import ReactDOM from "react-dom";

const SomePage = () => {
    return <SomeComponent />;
};

ReactDOM.render(<SomePage />, document.getElementById("render-react-here"));
```
This `static/js/SomePage.js` file is the entrypoint of your independent react componenent which is placed in your flask/jinja template (`index.html`).
After configuration, webpack will take care of any other components, css files and images that are imported here or in any child components.


If you want to create another independent react component to add to flask, go ahead and create `static/js/Otherpage.js`.


Now lets do our webpack configuration.

In our main project directory, create `webpack.config.js` and `babel.config.js`


In `webpack.config.js`
```javascript
module.exports = {
    entry: {
        main: "./static/js/SomePage.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                loader: "file-loader",

                options: {
                    name: "[name].[ext]",
                    outputPath: "../../static/dist",
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: __dirname + "/static/dist",
        filename: "[name].bundle.js",
    },
};
```

In `babel.config.js`
```javascript
module.exports = {
    presets: ["@babel/preset-env", "@babel/preset-react"],
};
```

Woah! Thats quite a mouthful. 

* The object at the top is called `entry` and the one at the bottom is called `output`. We specify the entrypoint files of our independent components we want webpack to process and the output format of the compiled and minified JavaScript file.
* Here, we name our `./static/js/SomePage.js` file as `main`. So output file will be `./static/dist/main.bundle.js` which is fed into the flask/jinja template. If you created `./static/js/OtherPage.js` add it to the webpack config as well and name it something else.
* The module section has loaders. Babel will convert JSX (the html like tags we use in react) into pure JavaScript. The file-loader will take care of any files (images) we load into our react components. The style-loader and css-loader will convert imported CSS files into CSS-in-JavaScript.


Now to run webpack,

```bash
yarn webpack --mode development
```

Replace `development` with `production` if you do not want to use react debug tools.


Running this after every change is cumbersome so we can configure webpack to do this automatically.

```bash
yarn webpack --mode development --watch
```

Start flask in another terminal with `./venv/bin/python3 app.py`

Here is our directory structure after all this setup
```
.
├── app.py
├── babel.config.js
├── Makefile
├── package.json
├── README.md
├── static
│   ├── dist
│   │   ├── main.bundle.js
│   │   └── react.png
│   ├── img
│   │   └── react.png
│   └── js
│       ├── SomePage.js
│       ├── components
│       │   ├── SomeComponent.js
│       │   └── SomeStyle.css
│       └── Otherpage.js
├── templates
│   └── index.html
├── webpack.config.js
└── yarn.lock
```


## Wrap Up

Everything's up and running. If you do not want to run webpack's `--watch` and flask's development server in different terminals, use can combine them into a single command and the their output's together. 

I'm using a Makefile. 

```Makefile
start-dev:
	yarn webpack --mode development --watch & ./venv/bin/python3 app.py

prod-build:
	yarn webpack --mode production
```

So `make start-dev` is all I need to start development. When I want a leaner site, without the react debug tools, I can do `make prod-build`


__GitHub Repo: https://github.com/IceWreck/Flask-React-Boilerplate__ 

Other Pointers:
* If you are too lazy to press your browser's reload button after an edit then you can configure flask/jinja to load JavaScript from the webpack development server. (requires additional webpack configuration)
* There are lots of other optimizations you can do for production builds, mentioned in both the React and webpack docs.
* Do not put anything in the ./static/dist folder as webpack may overwrite it.
* The webpack config is based on a directory structure I thought was suitable for a simple project, you can change the relative paths to suit your usecase.

I plan to make a second part next week where I will discuss routing and passing data back and forth between flask. 

_Sorry if this post isn't worded correctly and you don't understand a thing. This is my first time doing technical writing._
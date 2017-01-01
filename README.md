Google Design Starter Kit
===========================

Google design starter kit with Polymer


##Install

``` bash

git clone https://github.com/ellipticaljs/google-design.git
mv google-design my-project
cd my-project
npm install
bower install

```

##Tasks

``` bash
gulp app-scaffold (optional)
gulp app-build (optional)

gulp start-app

```

##Browser

``` bash
http://localhost:9040/

```



## Additional Tasks

``` bash
gulp start-server
gulp sass-compile
gulp css-minify
gulp sass-watch
gulp app-build
gulp app-imports
gulp app-clean
gulp app-watch
gulp watch
gulp vulcanize
gulp vulcanize-min
gulp web-component --tag <tag> --d <directory>

```


## Scaffold tasks, ellipticaljs es6/7 MVC app(optional)

```bash

# scaffold initial app
gulp app-scaffold

# crud controller
gulp app-crud-controller --class <className> --icon <icon>

# empty controller
gulp app-empty-controller --name <controllerName>

# empty view
gulp app-empty-view --name <view> --folder <viewFolder>

# list view
gulp app-list-view --name <view> --folder <viewFolder> --class <className> --icon <icon>

# detail view
gulp app-detail-view --name <view> --folder <viewFolder> --class <className> --icon <icon>

# service
gulp app-service --class <className>

# provider
gulp app-provider --class <className>

# binding
gulp app-binding --name <name>


```

# Demo

http://ellipticaljs.github.io/google-design/
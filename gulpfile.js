
var config=require('./config.json');
var Tasks=require('elliptical-gulp');
var gulp=require('gulp');
var ScaffoldTasks=require('elliptical-scaffold');

var tasks=new Tasks(config);
var scaffoldTasks=new ScaffoldTasks(config);

// app tasks -----------------------------------------------------------------------------------------------------------

gulp.task('init',function(){
    build();
});

gulp.task('default',function(){
    tasks.default();
});

gulp.task('start-server',function(){
    tasks.startServer();
});

gulp.task('start',function(){
    tasks.start();
});

gulp.task('start-app',function(){
    tasks.startApp();
});

gulp.task('start-app-no-sass',function(){
    tasks.startAppNoSass();
});

gulp.task('sass-compile', function () {
    tasks.sassCompile();
});

gulp.task('sass-compile-min', function () {
    tasks.sassCompileMin();
});

gulp.task('sass-watch', function () {
    tasks.sassWatch();
});

gulp.task('app-watch', function () {
    tasks.appWatch();
});

gulp.task('app-build', function () {
    tasks.appBuild();
});

gulp.task('app-imports', function () {
    tasks.appImports();
});

gulp.task('watch', function () {
    tasks.watch();
});

gulp.task('app-clean', function () {
    tasks.appClean();
});

gulp.task('vulcanize', function () {
    tasks.vulcanize();
});

gulp.task('vulcanize-min', function () {
    tasks.vulcanizeMin();
});




///app scaffold---------------------------------------------------------------------------------------------------------
gulp.task('app-crud-controller', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var className=argv.class;
    var icon=argv.icon;
    if(icon===undefined) icon='edit';
    if(className===undefined){
        console.log("Error: Class required");
        return;
    }
    var params={
        class:className,
        icon:icon
    };
    scaffoldTasks.appCreateCrudController(config,params);
});

gulp.task('app-empty-controller', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    if(name===undefined){
        console.log("Error: Controller name required");
        return;
    }
    var params={
        name:name
    };
    scaffoldTasks.appCreateEmptyController(config,params);
});

gulp.task('app-empty-view', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    var folder=argv.folder;
    if(name===undefined){
        console.log("Error: view name required");
        return;
    }
    if(folder===undefined){
        console.log("Error: view folder required");
        return;
    }
    var params={
        name:name,
        folder:folder
    };
    scaffoldTasks.appCreateEmptyView(config,params);
});

gulp.task('app-list-view', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    var folder=argv.folder;
    var className=argv.class;
    var icon=argv.icon;
    if(name===undefined){
        console.log("Error: view name required");
        return;
    }
    if(folder===undefined){
        console.log("Error: view folder required");
        return;
    }
    if(className===undefined){
        console.log("Error: Class required");
        return;
    }
    if(icon===undefined) icon='edit';
    var params={
        name:name,
        folder:folder,
        class:className,
        icon:icon
    };
    scaffoldTasks.appCreateListView(config,params);
});

gulp.task('app-detail-view', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    var folder=argv.folder;
    var className=argv.class;
    var icon=argv.icon;
    if(name===undefined){
        console.log("Error: view name required");
        return;
    }
    if(folder===undefined){
        console.log("Error: view folder required");
        return;
    }
    if(className===undefined){
        console.log("Error: Class required");
        return;
    }
    if(icon===undefined) icon='edit';
    var params={
        name:name,
        folder:folder,
        class:className,
        icon:icon
    };
    scaffoldTasks.appCreateDetailView(config,params);
});

gulp.task('app-binding', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    if(name===undefined){
        console.log("Error:  name required");
        return;
    }
    var params={
        name:name
    };
    scaffoldTasks.appCreateBinding(config,params);
});

gulp.task('app-service', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var className=argv.class;
    if(className===undefined){
        console.log("Error: class required");
        return;
    }
    var params={
        class:className
    };
    scaffoldTasks.appCreateService(config,params);
});

gulp.task('app-provider', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var className=argv.class;
    if(className===undefined){
        console.log("Error: class required");
        return;
    }
    var params={
        class:className
    };
    scaffoldTasks.appCreateProvider(config,params);
});

gulp.task('app-scaffold', function () {
    scaffoldTasks.appScaffold(config);
});

/// web component-------------------------------------------------------------------------------------------------------
gulp.task('web-component', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var tag=argv.tag;
    var dir=argv.d;
    if(tag===undefined){
        console.log("Error: tag required");
        return;
    }
    if(dir===undefined){
        console.log("Error: directory location required");
        return;
    }
    var params={
        tag:tag,
        dir:dir
    };
    scaffoldTasks.webCreateComponent(config,params);
});



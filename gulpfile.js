
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



///scaffold tasks ------------------------------------------------------------------------------------------------------
gulp.task('db-crud-controller', function () {
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
    scaffoldTasks.dbCreateCrudController(config,params);
});

gulp.task('db-empty-controller', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    if(name===undefined){
        console.log("Error: Controller name required");
        return;
    }
    var params={
        name:name
    };
    scaffoldTasks.dbCreateEmptyController(config,params);
});

gulp.task('db-content-controller', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    if(name===undefined){
        console.log("Error: Controller name required");
        return;
    }
    var params={
        name:name
    };
    scaffoldTasks.dbCreateContentController(config,params);
});

gulp.task('db-empty-view', function () {
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
    scaffoldTasks.dbCreateEmptyView(config,params);
});

gulp.task('db-content-view', function () {
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
    scaffoldTasks.dbCreateContentView(config,params);
});

gulp.task('db-list-view', function () {
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
    scaffoldTasks.dbCreateListView(config,params);
});

gulp.task('db-grid-view', function () {
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
    scaffoldTasks.dbCreateGridView(config,params);
});

gulp.task('db-detail-view', function () {
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
    scaffoldTasks.dbCreateDetailView(config,params);
});

gulp.task('db-binding', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var name=argv.name;
    if(name===undefined){
        console.log("Error:  name required");
        return;
    }
    var params={
        name:name
    };
    scaffoldTasks.dbCreateBinding(config,params);
});

gulp.task('db-service', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var className=argv.class;
    if(className===undefined){
        console.log("Error: class required");
        return;
    }
    var params={
        class:className
    };
    scaffoldTasks.dbCreateService(config,params);
});

gulp.task('db-provider', function () {
    var argv = require('minimist')(process.argv.slice(2));
    var className=argv.class;
    if(className===undefined){
        console.log("Error: class required");
        return;
    }
    var params={
        class:className
    };
    scaffoldTasks.dbCreateProvider(config,params);
});


///app -----------------------------------------------------------------------------------------------------------------
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


// --private build tasks------------------------------------------------------------------------------------------------




function build(){
    copyCommonPublicTask();
    copyServicesTask();
    copyProvidersTask();
    copyDependenciesTask();
    copyReferencesTask();
    copySassTask();
    copyIndexTask();
    copyBowerTask();
    copyMainAppFileTask();
    copyImportFileTask();
    copyAppImportFileTask();
    copyVulcanized();

}

function copyCommonPublicTask(){
    gulp.src('./node_modules/dashboard-common/src/public/**/*.*')
        .pipe(gulp.dest('./public/'));
}

function copyServicesTask(){
    gulp.src('./src/public/app/services/**/*.*')
        .pipe(gulp.dest('./public/app/services/'));
}

function copyDependenciesTask(){
    gulp.src('./src/public/app/dependencies/**/*.*')
        .pipe(gulp.dest('./public/app/dependencies/'));
}

function copyReferencesTask(){
    gulp.src('./src/public/app/references/**/*.*')
        .pipe(gulp.dest('./public/app/references/'));
}

function copyProvidersTask(){
    gulp.src('./src/public/app/providers/**/*.*')
        .pipe(gulp.dest('./public/app/providers/'));
}

function copySassTask(){
    gulp.src('./node_modules/dashboard-common/src/sass/**/*.*')
        .pipe(gulp.dest('./sass/'));
}

function copyIndexTask(){
    gulp.src('./src/public/index.html')
        .pipe(gulp.dest('./public/'));
}

function copyBowerTask(){
    gulp.src('./node_modules/dashboard-common/src/bower.json')
        .pipe(gulp.dest('./'));
}

function copyMainAppFileTask(){
    gulp.src('./src/public/app/app.js')
        .pipe(gulp.dest('./public/app/'));
}

function copyImportFileTask(){
    gulp.src('./src/public/imports/import.html')
        .pipe(gulp.dest('./public/imports/'));
}

function copyAppImportFileTask(){
    gulp.src('./src/public/imports/app.html')
        .pipe(gulp.dest('./public/imports/'));
}

function copyVulcanized(){
    gulp.src('./src/public/vulcanized/import.html')
        .pipe(gulp.dest('./public/vulcanized/'));
}

import elliptical from './references/elliptical';
import startup from './startup';
import {progress} from './modules/ui';

//create the app
var app = elliptical();


//-------configuration-------------------------------------------------
//views root
var viewsRoot = '/app/views';
var $Template = elliptical.$Template; ///template provider
$Template.setRoot(viewsRoot);  ///set views root
var View=elliptical.View;
View.$provider=$Template;



app.configure(function () {
    //app.router
    app.use(app.router);

    //error
    app.use(elliptical.httpError());

    //http 404
    app.use(elliptical.http404());
});



//bind startup
startup(app);

//global View onBeforeRender callback
app.onBeforeRender = function (req, res, context, callback) {
    progress.end();
    callback(context);
};


/* listen */
app.listen();

export default app;
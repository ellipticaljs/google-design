
import HomeController from './controllers/homeController';

export default (app)=>{
//-------controllers------------------------------------------------------------
    new HomeController(app,'Home','/@action');

}
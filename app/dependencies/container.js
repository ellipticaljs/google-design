
import elliptical from '../references/elliptical';

var container=elliptical.container;

var http = elliptical.http;
var Service = elliptical.Service;
var Location = elliptical.Location;
var $Cookie = elliptical.$Cookie;
var Sort = elliptical.Sort;
var $Sort = elliptical.$Sort;
var DomEvent = elliptical.DomEvent;
var $Rest = elliptical.$Rest;


//set Rest endpoint props
$Rest.protocol = 'http';
$Rest.host = '';
$Rest.path = '/api';
$Rest.port = 80;

var $rest = new $Rest();




//registrations
container.mapType('Service', Service, $rest);
container.mapType('Sort', Sort, $Sort);
container.mapType('Notify', elliptical.Notify, elliptical.$Notify);
container.registerType('$Rest', $Rest);
container.registerType('Location', Location);
container.registerType('$Local', elliptical.$Local);
container.registerType('$Cookie', $Cookie);
container.registerType('DomEvent', DomEvent);
container.registerType('$ViewData', elliptical.$ViewData);


export default container;

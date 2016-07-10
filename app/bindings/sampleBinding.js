
import elliptical from '../references/elliptical';
import container from '../dependencies/container';


elliptical.binding('sample', function (node) {
    var DomEvent = container.getType('DomEvent');
    var dom = new DomEvent(node, this);
    
    this.dispose = ()=> {
        dom.unbind();
    };

});

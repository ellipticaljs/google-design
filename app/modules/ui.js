import container from '../dependencies/container';
var DELAY = 1000;
var MESSAGE='Loading...';
var DURATION=100000;
var $Notify=container.getType('$Notify');

class Progress{
    constructor(){
        this.active=false;
        this.showing=false;
    }

    start(){
        var self = this;
        this.active = true;
        this.showing=false;
        setTimeout(function(){
            if(self.active){
                self.showing=true;
                $Notify.show(MESSAGE,DURATION);
            }

        },DELAY);
    }

    end(){
        this.active=false;
        if(this.showing){
            $Notify.hide();
            this.showing=false;
        }
    }
}

export const progress = new Progress();
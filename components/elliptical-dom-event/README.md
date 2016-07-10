ELLIPTICAL DOM EVENT
===========================

Delegated DOM Events Module.

# Installation

```bash
  bower install elliptical-dom-event --save

```

# Usage

```html
<link rel="import" href="bower_components/elliptical-dom-event/elliptical-dom-event.html">

```

```js
 var DomEvent=elliptical.DomEvent;
 /**
    * @param {object} node -html element
    * @param {object} [context] -callback scope context
    * @constructor
  */
 var dom=new DomEvent(node,this);

 //delegated button click handler for the node's descendant button elements
 dom.event('click','button',onButtonClick);

 function onButtonClick(){}

 //a tap handler for the node
 dom.event('tap',onTap);

 function onTap(){}

 //device scroll
 dom.onScroll(handleScroll);

 function handleScroll(){}

//node preloader
dom.preload(onImagesLoaded);

function onImagesLoaded(){};

//node descendants selector
dom.find(selector);


//device events
//"click"==desktop click, mobile touchstart
//"press"==desktop click, mobile touchend
//"tap"==desktop click, mobile tap

 //disposal
 dom.dispose() //removes all event handlers


```

# Usage with Elliptical Binding

```bash
  bower install elliptical-binding --save
  bower install elliptical-dom-event --save

```

```html
  <link rel="import" href="bower_components/elliptical-binding/elliptical-binding.html">
  <link rel="import" href="bower_components/elliptical-dom-event/elliptical-dom-event.html">


  <div class="card-container" ea-bind="infinite-scroll">
         <div class="card">
           <h2>Card Title</h2>
           <div class=card-content">

           </div>
           <a class="see-more">see more</a>
         </div>
  </div>

```

```js

//anonymous callback invoked on the node's "added" mutation event
elliptical.binding('infinite-scroll',function(node){
    var DomEvent=elliptical.DomEvent;
    var dom=new DomEvent(node,this);

    dom.event('click','a.see-more',onClick);

    function onClick(){
       dom.onScroll(handleScroll);
    }

    function handleScroll(){}

    //dispose method invoked on the node's "removed" mutation event
    this.dispose=function(){
        dom.dispose();
    }
});


```
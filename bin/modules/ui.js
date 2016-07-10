(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../dependencies/container'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../dependencies/container'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.container);
        global.ui = mod.exports;
    }
})(this, function (exports, _container) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.progress = undefined;

    var _container2 = _interopRequireDefault(_container);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var DELAY = 1000;
    var MESSAGE = 'Loading...';
    var DURATION = 100000;
    var $Notify = _container2.default.getType('$Notify');

    class Progress {
        constructor() {
            this.active = false;
            this.showing = false;
        }

        start() {
            var self = this;
            this.active = true;
            this.showing = false;
            setTimeout(function () {
                if (self.active) {
                    self.showing = true;
                    $Notify.show(MESSAGE, DURATION);
                }
            }, DELAY);
        }

        end() {
            this.active = false;
            if (this.showing) {
                $Notify.hide();
                this.showing = false;
            }
        }
    }

    const progress = exports.progress = new Progress();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvdWkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLFFBQUksUUFBUSxJQUFaO0FBQ0EsUUFBSSxVQUFRLFlBQVo7QUFDQSxRQUFJLFdBQVMsTUFBYjtBQUNBLFFBQUksVUFBUSxvQkFBVSxPQUFWLENBQWtCLFNBQWxCLENBQVo7O0FBRUEsVUFBTSxRQUFOLENBQWM7QUFDVixzQkFBYTtBQUNULGlCQUFLLE1BQUwsR0FBWSxLQUFaO0FBQ0EsaUJBQUssT0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFFRCxnQkFBTztBQUNILGdCQUFJLE9BQU8sSUFBWDtBQUNBLGlCQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsaUJBQUssT0FBTCxHQUFhLEtBQWI7QUFDQSx1QkFBVyxZQUFVO0FBQ2pCLG9CQUFHLEtBQUssTUFBUixFQUFlO0FBQ1gseUJBQUssT0FBTCxHQUFhLElBQWI7QUFDQSw0QkFBUSxJQUFSLENBQWEsT0FBYixFQUFxQixRQUFyQjtBQUNIO0FBRUosYUFORCxFQU1FLEtBTkY7QUFPSDs7QUFFRCxjQUFLO0FBQ0QsaUJBQUssTUFBTCxHQUFZLEtBQVo7QUFDQSxnQkFBRyxLQUFLLE9BQVIsRUFBZ0I7QUFDWix3QkFBUSxJQUFSO0FBQ0EscUJBQUssT0FBTCxHQUFhLEtBQWI7QUFDSDtBQUNKO0FBekJTOztBQTRCUCxVQUFNLDhCQUFXLElBQUksUUFBSixFQUFqQiIsImZpbGUiOiJtb2R1bGVzL3VpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbnRhaW5lciBmcm9tICcuLi9kZXBlbmRlbmNpZXMvY29udGFpbmVyJztcbnZhciBERUxBWSA9IDEwMDA7XG52YXIgTUVTU0FHRT0nTG9hZGluZy4uLic7XG52YXIgRFVSQVRJT049MTAwMDAwO1xudmFyICROb3RpZnk9Y29udGFpbmVyLmdldFR5cGUoJyROb3RpZnknKTtcblxuY2xhc3MgUHJvZ3Jlc3N7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5hY3RpdmU9ZmFsc2U7XG4gICAgICAgIHRoaXMuc2hvd2luZz1mYWxzZTtcbiAgICB9XG5cbiAgICBzdGFydCgpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93aW5nPWZhbHNlO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZihzZWxmLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93aW5nPXRydWU7XG4gICAgICAgICAgICAgICAgJE5vdGlmeS5zaG93KE1FU1NBR0UsRFVSQVRJT04pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sREVMQVkpO1xuICAgIH1cblxuICAgIGVuZCgpe1xuICAgICAgICB0aGlzLmFjdGl2ZT1mYWxzZTtcbiAgICAgICAgaWYodGhpcy5zaG93aW5nKXtcbiAgICAgICAgICAgICROb3RpZnkuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5zaG93aW5nPWZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgcHJvZ3Jlc3MgPSBuZXcgUHJvZ3Jlc3MoKTsiXX0=
/*
 * OwlScript v0.1.4-beta by Val Tenyotkin (val@tenyotk.in)
 *
 * Variables and properties prefixed with an underscore, though global, are
 * internal and can be minified.  Global minification to common variable names
 * such as a, b, c, etc. is not adviseable.  Convention of this file is to use
 * a less common sequence _1, _2, _3, etc.
 *
 */

/******************************************************************************/
/*** Variables ****************************************************************/
/******************************************************************************/

// canvas object
var _canvas_object;

// canvas itself
var _canvas;

// notebook object, created in standalone.js
var _notebook;

// default drawing parameters
var _default_color;
var _default_background_color;
var _default_line_width;
var _default_rotation_angle;

// some recurring constants (for minification)
var _tau        = 2*Math.PI;
var _object     = 'object';
var _undefined  = 'undefined';

// dimensions of the current canvas
var width, height;

// animation frames
var _frames;

// flags
var _animation_in_progress = 0;
var _stop_loops = 0;
var _loop_in_progress;

// seeding SimpleRNG variables
var _SimpleRNG_U = 0xdead * (new Date().getMilliseconds() * new Date().getSeconds() + 1);
var _SimpleRNG_V = 0xbeef * (new Date().getMilliseconds() * new Date().getMinutes() + 1);

/******************************************************************************/
/*** Drawing ******************************************************************/
/******************************************************************************/

// self-explanatory
function _initialize_defaults() {
    _default_color          = '#000';
    _default_line_width     = 1;
    _loop_in_progress       = 0;
    _default_rotation_angle = 0;
    _canvas.globalAlpha     = 1;
    _frames                 = [];

    _set_default_background_color('#fff');
}

// self-explanatory
color = set_default_color = function(color) {
    _default_color = color;
}

// self-explanatory
line_thickness = set_default_line_thickness = function(width) {
    _default_line_width = width;
}

// self-explanatory
_set_default_background_color =
 set_default_background_color = 
             background_color = function(color) {
    // store the color in the current canvas object
    _default_background_color =
    // change the style of the canvas
    _canvas_object.style.backgroundColor = color;
}

// self-explanatory
function line(x0, y0, x1, y1, color, width) {
    with(_canvas) {
        beginPath();
        lineWidth = width || _default_line_width;
        strokeStyle = color || _default_color;
        moveTo(x0, y0);
        lineTo(x1, y1);
        stroke();
    }
}

// self-explanatory
function circle(x, y, r, color, width) {
    with(_canvas) {
        beginPath();
        lineWidth = width || _default_line_width;
        strokeStyle = color || _default_color;
        arc(x, y, r, 0, _tau, 0);
        stroke();
    }
}

// self-explanatory
disk = 
fill_circle = function(x, y, r, color) {
    with(_canvas) {
        beginPath();
        fillStyle = color || _default_color;
        arc(x, y, r, 0, _tau, 0);
        fill();
    }
}

// self-explanatory
function rectangle(x0, y0, x1, y1, color, width) {
    with(_canvas) {
        beginPath();
        lineWidth = width || _default_line_width;
        strokeStyle = color || _default_color;
        rect(x0, y0, x1-x0, y1-y0);
        stroke();
    }
}

// self-explanatory
sheet = 
fill_rectangle = function(x0, y0, x1, y1, color) {
    _canvas.fillStyle = color || _default_color;
    _canvas.fillRect(x0, y0, x1-x0, y1-y0);
}

// self-explanatory
function _draw_polygon(x, y) {
    with(_canvas) {
        beginPath();
        moveTo(x[0], y[0]);
        for(var i = 1; i < x.length; i++)
            lineTo(x[i], y[i]);
        closePath();
    }
}

// self-explanatory
_polygon = polygon = function(x, y, color, width) {
    with(_canvas) {
        lineWidth = width || _default_line_width;
        strokeStyle = color || _default_color;
        _draw_polygon(x, y);
        stroke();
    }
}

// self-explanatory
_fill_polygon = fill_polygon = function(x, y, color) {
    _canvas.fillStyle = color || _default_color;
    _draw_polygon(x, y);
    _canvas.fill();
}

// set global rotation
function rotate(angle) {
    _default_rotation_angle = _tau*angle/360;
}

// self-explanatory
function opacity(alpha) {
    _canvas.globalAlpha = alpha/100;
}

// calculate the (x,y) pairs for a regular polygon
function _compute_regular_polygon(x, y, ri, ro, n) {
    var X = [], Y = [];
    for(var i=0, a=_default_rotation_angle; i<n; i++, a+=_tau/n) {
        X[i] = x + (i%2?ri:ro)*Math.sin(a);
        Y[i] = y - (i%2?ri:ro)*Math.cos(a);
    }
    return [X, Y];
}

// self-explanatory
function regular_polygon(x, y, r, n, color, width) {
    star(x, y, r, r, n/2, color, width);
}

// self-explanatory
function fill_regular_polygon(x, y, r, n, color) {
    fill_star(x, y, r, r, n/2, color);
}

// self-explanatory
function star(x, y, ri, ro, n, color, thickness) {
    // compute the star
    var xy = _compute_regular_polygon(x, y, ri, ro, 2*n);
    // fill the polygon
    _polygon(xy[0], xy[1], color, thickness);
}

// self-explanatory
function fill_star(x, y, ri, ro, n, color) {
    // compute the star
    var xy = _compute_regular_polygon(x, y, ri, ro, 2*n);
    // fill the polygon
    _fill_polygon(xy[0], xy[1], color);
}

// erase with the current background color
function clear_canvas() {
    // clear the text output
    _notebook.innerHTML = '';
    // store the opacity
    var previous_opacity = _canvas.globalAlpha;
    // set opacity to 100%
    _canvas.globalAlpha = 1;
    // clear the screen
    fill_rectangle(0, 0, width, height, _default_background_color);
    // restore opacity
    _canvas.globalAlpha = previous_opacity;
}

/******************************************************************************/
/*** Animaiton ****************************************************************/
/******************************************************************************/

// makes a copy of a canvas and returns it
function _clone_canvas(canvas) {
    var new_canvas = document.createElement('canvas');
    new_canvas.width  = canvas.width;
    new_canvas.height = canvas.height;
    new_canvas.getContext('2d').drawImage(canvas, 0, 0);
    return new_canvas;
}

// self-explanatory
function begin_animation() {
    // create the _frames entry
    _frames = [];
}

// store the current frame
function new_frame() {
    _frames.push(_clone_canvas(_canvas_object));
}

// start the animation
function animate(delay) {

    // prevent multiple loops, animations, and combinations thereof
    if(!_animation_in_progress && !_loop_in_progress) {

        // raise the animation flag
        _animation_in_progress = 1;

        // initiate the animation cycle at a default rate of 10 fps
        _animation_cycle(0, delay*1000 || 100);
    }
}

// animation cycle handler
function _animation_cycle(index, delay) {

    // display the current frame
    _canvas.drawImage(_frames[index % _frames.length],0,0);

    // schedule the display of the next frame
    // unless the loop termination flag has been raised
    if(_stop_loops) 
        _stop_loops =
        _animation_in_progress = 0;
    else {
        setTimeout(function() {
            _animation_cycle(index+1, delay);
        }, delay);
    }
}

/******************************************************************************/
/*** Mathematics **************************************************************/
/******************************************************************************/

/*** Array Operations *********************************************************/

(function() {
    var body;
    for(var name in body = {
        'add'       : function(a, b) { return a+b },
        'subtract'  : function(a, b) { return a-b },
        'multiply'  : function(a, b) { return a*b },
        'divide'    : function(a, b) { return a/b },
        'negative'  : function(a)    { return -a },
        'minus'     : function(a)    { return -a }
    })
        Array.prototype[name] = (function(action) {
            return function(x) {
                for(var i = this.length, $ = []; i-->0;)
                    $[i] = action(this[i], typeof x === _object ? x[i % x.length] : x);
                return $;
            }
        })(body[name]);
})();


// redundant simplified loop prototype
Array.prototype.loop = function(action) {
    if(typeof action === 'function') {
        for(var i = 0, $ = []; i < this.length; i++)
            $[i] = action(this[i]);
        return $;
    }
}

// loop() processor
function _keep_looping(action, delay) {

    // if the stop is signaled, stop
    if(_stop_loops)
        _stop_loops = 
        _animation_in_progress = 0;
    // else keep looping
    else
        setTimeout(function() {
            action();
            _keep_looping(action, delay);
        }, delay);
}

// simplified loop construct
loop = repeat = function(from, to, step, action) {

    // of one or less argument is supplied, this repeat the entire function
    if(typeof to === _undefined) {
        // prevent multiple loop() and/or animation calls, a.k.a. fork bombs
        if(!_loop_in_progress && !_animation_in_progress) {
            // raise the "do not redraw" flag
            _animation_in_progress = 1;
            // don't fork bomb me, bro!
            _loop_in_progress = 1;
            // initiate the regular calls of the caller
            _keep_looping(arguments.callee.caller, from*1000 || 100);
        }
        return;
    }
        
    // no 'to' or 'step' implies that the function is to looped from 1 to 'from'
    if(typeof to === 'function')
        for(var i = 1; i <= from; i++)
            to(i);
    else
        range(from, to, step).loop(action);
}

/*** Simplified Syntax Functions **********************************************/

// define a universal argument function
function _define(name, action) {
    window[name] = function(x) {
            var $ = [];
            // if the argument is an array, perform action() on each element
            if(typeof x === _object)
                for(var i = x.length; i-->0; $[i] = action(x[i]));
            // otherwise, i.e number or a string, return action(x)
            else
                $ = action(x);
            return $;
        };
}

(function() {
    var body;
    for(var name in body = {
        'abs'       : function(y) { return Math.abs(y) },
        'sin'       : function(y) { return Math.sin(y*_tau/360) },
        'cos'       : function(y) { return Math.cos(y*_tau/360) },
        'tan'       : function(y) { return Math.tan(y*_tau/360) },
        'round'     : function(y) { return Math.round(y) },
        'sign'      : function(y) { return y < 0 ? -1 : 1 },
        'sqrt'      : function(y) { return Math.sqrt(y) },
        'sq'        : function(y) { return y*y },
        'minus'     : function(y) { return -y },
        'negative'  : function(y) { return -y }
    })
        _define(name, body[name]);
})();

// modulus
function mod(a, b) {
    // if a is an array, do the thing
    if(typeof a === _object) {
        for(var i = a.length, c = []; i-->0; c[i] = a[i] % b);
        return c;
    }
    return a % b;
}

// part of the simplified power consutrct: a ^ b ==> Math.pow(a, b)
Number.prototype._power = function(n) {
    return Math.pow(this.valueOf(), n);
}

// part of the simplified prray ower consutrct
Array.prototype._power = function(n) {
    var a = this.valueOf(), b = [];
    for(var i = a.length; i-->0; b[i] = Math.pow(a[i], n));
    return b;
}

/*
 * Returns a "random" number between min and max.  If either of the arguments is
 * a floating-point number, so is the returned random number.
 *
 * If the first and only argument is an array, return a random element from it.
 *
 * If the first and only argument is a string, return a random color:
 *
 *      'color'     : random color
 *      'red'       : random reddish color
 *      'green'     :    "      "      "
 *      'blue'      :    "      "      "
 *      'yellow'    :    "      "      "
 *      'teal'      :    "      "      "
 *      'violet'    :    "      "      "
 *      'gray'      :    "      "      "
 *
 */

_random = random = function(min, max) {

    // if the argument is an array
    if(typeof min === _object)
        // return a _random element from it
        return min[_random(0, min.length - 1)];

    // _random color special case
    if(typeof min === 'string') {

        // return a color octet
        // type =   : low color
        //        1 : high color
        //        2 : any color
        function octet(type) {
            var rnd =
                _random(
                    type == 1 ? 155 : 0,
                    type == 2 ? 255 : 100
                );
            return (rnd < 16 ? '0' : '') + rnd.toString(16);
        }

        var high = octet(1);

        // various random colors
        switch(min) {
            case 'color'  : return '#'+octet(2)+octet(2)+octet(2);
            case 'red'    : return '#'+high+octet()+octet();
            case 'green'  : return '#'+octet()+high+octet();
            case 'blue'   : return '#'+octet()+octet()+high;
            case 'yellow' : return '#'+high+high+octet();
            case 'violet' : return '#'+high+octet()+high;
            case 'teal'   : return '#'+octet()+high+high;
            case 'gray'   : return '#'+(high=octet(2))+high+high;
        }
    }

    // SimpleRNG
    _SimpleRNG_U = 36969 * ((_SimpleRNG_U & 65535) >>> 0) + (_SimpleRNG_U >>> 16);
    _SimpleRNG_V = 18000 * ((_SimpleRNG_V & 65535) >>> 0) + (_SimpleRNG_V >>> 16);
    var rnd = ((((_SimpleRNG_U << 16) >>> 0) + _SimpleRNG_V) & 0xffffffff) >>> 0;

    // if the arguments are integers, return an integer
    // otherwise return a floating-point number
    return min % 1 == 0 && max % 1 == 0 ?
        min + rnd % (max - min + 1) :
        min + rnd * (max - min)/4294967297;     // 2^32 + 1
}

// seed SimpleRNG for predictable randomness
function randomize(seed) {
    if(typeof seed === _undefined)
        seed = 0;
    _SimpleRNG_U = 0xface1e55 + seed;
    _SimpleRNG_V = 0xbeef1e55 - seed;
}

// objectify x
function _(x) {
    return typeof x === _object ? x : [x];
}

// returns a minimum of any combination of the following arguments:
//      number, number
//      array,  number
//      number, array
//      array,  array
function min(a, b) {

    // convert a, and b if available, to an array
    a = typeof b === _undefined ? _(a) : _(a).concat(b);

    // find the minimum in the resulting array
    for(var i = a.length, m = 1e50; i-->0;)
        a[i] < m && (m = a[i]);

    return m;
}

// clever max() made out of min()
function max(a, b) {
    return -min(minus(_(a)), minus(_(b)));
}

/******************************************************************************/
/*** Miscellaneous ************************************************************/
/******************************************************************************/

// self-explanatory
function set_title(title) {
    document.title = title;
}

// print text
function print(text, color) {

    // convert to string
    text += '';

    // show text
    _notebook.innerHTML 
        += '<div style="color:' +
        (color || _default_color)
        +'">'
        + text.replace(/\s/g, '&nbsp')
        + '</div>';
}

// returns time in a neat object
function time() {
    var date = new Date();
    return {
        hour : date.getHours(),
        minute : date.getMinutes(),
        second : date.getSeconds(),
        millisecond : date.getMilliseconds()
    };
}

// returns an array from a to b in step increments
function range(a, b, step) {

    // if b is missing, assume the range is from 1 to a
    if(typeof b === _undefined) {
        b = a;
        a = 1;
    }

    // if the step is not defined or zero, set it to 1
    step = abs(step) || 1;

    // create the range
    var r = [];

    if(a < b)
        for(; a <= b; a+= step)
            r.push(a);
    else
        for(; b <= a; a-= step)
            r.push(a);

    return r;
}

/******************************************************************************/
/*** Parser *******************************************************************/
/******************************************************************************/

function _parse(code) {

    return code
        // x { ==> function(x) {
        .replace(/(\w+)\s*{/g, function(match, contents, offset, s) {
            return contents.match(/(else|once)/) ? match : 'function('+contents+'){';
            })
        // , , ==> , 0 ,   or   ( , ==> ( 0 ,
        .replace(/([(,])\s*,/g, '$1 0,')
        // loop(50, { ==> loop(50, function(___) {
        .replace(/loop\s*\((.*),\s*{/gi, 'loop($1, function(___){')
        // loop 50 ==> loop(50, function(___) {
        .replace(/loop\s+(\w+)/gi, 'loop($1,function(___){')
        // end loop ==> })
        .replace(/end/gi, '})')
        // f(x) = sin(x+1) ==> _define("f", function(x) { return sin(x); });
        .replace(/(\w+)\s*\(\s*(\w+)\s*\)\s*=\s*(.*)/g, '_define("$1",function($2){return($3)});')
        // static variables
        .replace(/static\s+(\w+)\s*=/g,'if(!_loop_in_progress||!_animation_in_progress)$1=')
        // kind of like static variables
        .replace(/once\s*{/g,'if(!_loop_in_progress||!_animation_in_progress){')
        // a ^ b ==> Math.pow(a, b)
        .replace(/\^\s*([\w\.]+)\s*/g, ' ._power($1)')
        .replace(/\s*\^\s*/g, ' ._power');
}


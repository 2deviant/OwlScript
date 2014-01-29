/*
 * OwlScript v0.11 by Val Tenyotkin (val@tenyotk.in)
 *
 * Variables and properties prefixed with an underscore, though global, are
 * internal and can be minified.  Global minification to common variable names
 * such as a, b, c, etc. is not adviseable.  Convention of this file is to use
 * a less common sequence _1, _2, _3, etc.
 *
 */

/******************************************************************************/
/*** Drawing ******************************************************************/
/******************************************************************************/

// canvas object
var _canvas_object;

// canvas itself
var _canvas;

// default drawing parameters
var _default_color              = '#000';
var _default_background_color   = '#fff';
var _default_line_width         = 1;

// some recurring constants (for minification)
var _tau        = 2*Math.PI;
var _object     = 'object';
var _undefined  = 'undefined';

// dimensions of the current canvas
var width, height;

// animation frames
var _frames = [];

// flags
var _animation_in_progress = 0;

// self-explanatory
function set_default_color(color) {
    _default_color = color;
}

// self-explanatory
function set_default_line_width(width) {
    _default_line_width = width;
}

// self-explanatory
function set_default_background_color(color) {
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

// self-explanatory (filled circle)
function disk(x, y, r, color) {
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

// self-explanatory (filled recrangle)
function sheet(x0, y0, x1, y1, color) {
    with(_canvas) {
        fillStyle = color || _default_color;
        fillRect(x0, y0, x1-x0, y1-y0);
    }
}

// self-explanatory
function polygon(x, y, color, width) {
    with(_canvas) {
        beginPath();
        lineWidth = width || _default_line_width;
        strokeStyle = color || _default_color;
        moveTo(x[0], y[0]);
        for(var i = 1; i < x.length; i++)
            lineTo(x[i], y[i]);
        closePath();
        stroke();
    }
}

// self-explanatory
function regular_polygon(x, y, r, n, color, width) {
    var angles = range(0, 360*(1-1/n), 360/n);
    polygon(
        sin(angles).multiply( r).add(x),
        cos(angles).multiply(-r).add(y),
        color,
        width);
}

// erase with the current background color
function clear_canvas() {
    sheet(0, 0, width, height, _default_background_color);
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

    // raise the animation flag
    _animation_in_progress = 1;

    // initiate the animation cycle at a default rate of 10 fps
    _animation_cycle(0, delay*1000 || 100);
}

// animation cycle handler
function _animation_cycle(index, delay) {

    // display the current frame
    _canvas.drawImage(_frames[index % _frames.length],0,0);

    // schedule the display of the next frame
    setTimeout(function() {
        _animation_cycle(index+1, delay);
    }, delay);
}

/******************************************************************************/
/*** Mathematics **************************************************************/
/******************************************************************************/

/*** Array Operations *********************************************************/

for(var _name in _body = {
    'add'       : function(a, b) { return a+b },
    'subtract'  : function(a, b) { return a-b },
    'multiply'  : function(a, b) { return a*b },
    'divide'    : function(a, b) { return a/b },
    'negative'  : function(a)    { return -a },
    'minus'     : function(a)    { return -a }
})
    Array.prototype[_name] = (function(action) {
        return function(x) {
            for(var i = this.length, $ = []; i-->0;)
                $[i] = action(this[i], typeof x === _object ? x[i % x.length] : x);
            return $;
        }
    })(_body[_name]);

// simplified loop prototype
Array.prototype.loop = function(action) {
    for(var i = 0, $ = []; i < this.length; i++)
        $[i] = action(this[i]);
    return $;
}

// redundant simplified loop prototype
function loop(from, to, step, action) {

    // no 'to' or 'step' implies that the function is to looped 'from' times
    if(typeof to === 'function')
        range(from).loop(to);
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

for(var _name in _body = {
    'abs'       : function(y) { return Math.abs(y) },
    'sin'       : function(y) { return Math.sin(y*_tau/360) },
    'cos'       : function(y) { return Math.cos(y*_tau/360) },
    'round'     : function(y) { return Math.round(y) },
    'sign'      : function(y) { return y < 0 ? -1 : 1 },
    'sqrt'      : function(y) { return Math.sqrt(y) },
    'sq'        : function(y) { return y*y },
    'minus'     : function(y) { return -y },
    'negative'  : function(y) { return -y }
})
    _define(_name, _body[_name]);

// returns a "random" number between min and max
//
// if either of the arguments is a floating-point number, so is the returned
// random number
//
// if the first and only argument is an array, return a random element from it
function random(min, max) {

    // if the argument is an array
    if(typeof min === _object)
        // return a random element from it
        return min[random(0, min.length - 1)];

    // random color special case
    if(min === 'color') {
        var $ = '0123456789abcdef'.split('');
        return '#'+random($)+random($)+random($);
    }

    // generate a random number
    var rnd = min + Math.random()*(max - min);

    // round it if both arguments are integers
    return min % 1 === 0 && max % 1 === 0 ? Math.round(rnd) : rnd;
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

    // convert to text
    text += '';

    // show text
    $('_notebook').innerHTML 
        += '<div style="color:' +
        (color || _default_color)
        +'">'
        + text.replace(/\s/g, '&nbsp')
        + '</div>';
}

// call the caller of this function again after a default delay of 0.1 seconds
function repeat(delay) {
    // raise the "do not redraw" flag
    _animation_in_progress = 1;
    // call the caller
    setTimeout(arguments.callee.caller, delay*1000 || 100);
}

// returns time in a neat object
function time() {
    var date = new Date();
    return {
        hour : date.getHours(),
        minute : date.getMinutes(),
        second : date.getSeconds(),
        millisecond: date.getMilliseconds()
    };
}

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

// self-explanatory
function $(id) {
    return document.getElementById(id);
}

/******************************************************************************/
/*** Parser *******************************************************************/
/******************************************************************************/

function _parse(code) {
        // x { ==> function(x) {
    return code.replace(/(\w)\s*{/g, 'function($1){')
        // , , ==> , 0 ,   or   ( , ==> ( 0 ,
        .replace(/([(,])\s*,/g, '$1 0,')
        // loop(50, { ==> loop(50, function($$$) {
        .replace(/loop\s*\((.*,)\s*{/g, 'loop($1 function($$$){')
        // f(x) = sin(x+1) ==> _define("f", function(x) { return sin(x); });
        .replace(/(\w+)\s*\(\s*(\w+)\s*\)\s*=\s*(.*)/g, '_define("$1",function($2){return($3)});');
}

/******************************************************************************/
/*** Bootstrap ****************************************************************/
/******************************************************************************/

// measure the screen and (re)draw
function _initialize_image() {

    // clear the screen
    _canvas_object.width  = width  = window.innerWidth;
    _canvas_object.height = height = window.innerHeight;

    // do not re-render if animaiton or repeat() is in progress
    if(_animation_in_progress)
        return;

    // clear the text screen
    $('_notebook').innerHTML = '';

    // execute the code
    main();
}

// self-explanatory
window.onload = function() {

    var body = document.getElementsByTagName('body')[0];

    // create canvas element
    _canvas_object = body.appendChild(
        document.createElement('canvas')
    );

    // get the drawing context
    _canvas = _canvas_object.getContext("2d");

    // set the body margin to zero
    body.style.margin = 0;

    // create and ID the notebook element
    var notebook = document.createElement('div');
    notebook.id = '_notebook';
    notebook.style.position = 'absolute';
    notebook.style.top = '0';
    notebook.style.left = '0';
    notebook.style.width = '100%';
    notebook.style.height = '100%';
    notebook.style.fontFamily = 'courier';
    notebook.style.overflow = 'scroll';

    body.appendChild(notebook);

    /* parse the script */

    // extract the code and delete the original script element
    var input = $('owlscript');
    var code = input.innerHTML;
    input.parentNode.removeChild(input);

    // create the new script element and parse the code
    body.appendChild(document.createElement('script')).innerHTML = _parse(code);

    // execute
    _initialize_image();
}

// redraw on resize
window.onresize = function() {
    _initialize_image();
}

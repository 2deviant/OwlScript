/*
 * OwlScript Standalone v0.1.5-beta by Val Tenyotkin (val@tenyotk.in)
 *
 * Variables and properties prefixed with an underscore, though global, are
 * internal and can be minified.  Global minification to common variable names
 * such as a, b, c, etc. is not adviseable.  Convention of this file is to use
 * a less common sequence _1, _2, _3, etc.
 *
 */

// self-explanatory
function $(id) {
    return document.getElementById(id);
}

// redraw on resize
window.onresize =
// measure the screen and (re)draw
_initialize_image = function() {

    // clear the screen
    _canvas_object.width  = width  = window.innerWidth;
    _canvas_object.height = height = window.innerHeight;

    // do not re-render if animaiton or repeat() is in progress
    if(_animation_in_progress)
        return;

    // clear the text screen
    _notebook.innerHTML = '';

    // self-explanatory
    _initialize_defaults();

    // execute the code
    _main();
}

// self-explanatory
window.onload = function() {

    // create canvas element
    _canvas_object = document.body.appendChild(
        document.createElement('canvas')
    );

    // get the drawing context
    _canvas = _canvas_object.getContext("2d");

    // set the body margin to zero
    document.body.style.margin = 0;

    // create and ID the notebook element
    _notebook = document.createElement('div');
    with(_notebook) {
        style.top = '0';
        style.left = '0';
        style.width = '100%';
        style.height = '100%';
        style.overflow = 'scroll';
        style.position = 'absolute';
        style.fontFamily = 'courier';
    }
    document.body.appendChild(_notebook);

    // extract the code and delete its container
    var input = $('owlscript');
    var code = input.parentNode.removeChild(input).innerHTML
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<');

    // create the new script element and parse the code
    document.body.appendChild(document.createElement('script')).innerHTML =
        'function _main(){'+_parse(code)+'\n}';

    // execute
    _initialize_image();
}


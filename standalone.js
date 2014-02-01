// measure the screen and (re)draw
function _initialize_image() {

    // clear the screen
    _canvas_object.width  = width  = window.innerWidth;
    _canvas_object.height = height = window.innerHeight;

    // do not re-render if animaiton or repeat() is in progress
    if(_animation_in_progress)
        return;

    // clear the text screen
    _notebook.innerHTML = '';

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
    _notebook = document.createElement('div');
    _notebook.style.position = 'absolute';
    _notebook.style.top = '0';
    _notebook.style.left = '0';
    _notebook.style.width = '100%';
    _notebook.style.height = '100%';
    _notebook.style.fontFamily = 'courier';
    _notebook.style.overflow = 'scroll';

    body.appendChild(_notebook);

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

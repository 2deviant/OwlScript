// OwlScript input window
var _owlscript;

// Owl
var _owl;

// key processing flag
var _key_processing = 0;

// measure the screen and (re)draw
function _initialize_image() {
    
    // do absolutely nothing if the code editor is visible
    if(!_owlscript._hidden)
        return;

    // clear the screen
    _canvas_object.width  = width  = window.innerWidth;
    _canvas_object.height = height = window.innerHeight;

    // do not re-render if animaiton or loop() is in progress
    if(_animation_in_progress)
        return;

    // clear the text screen
    _notebook.innerHTML = '';

    // execute the code
    main();
}

// self-explanatory
window.onload = function() {

    // acquire the canvas object
    _canvas_object = $('screen');

    // get the drawing context
    _canvas = _canvas_object.getContext('2d');

    // acquire the notebook object
    _notebook = $('notebook');

    // acquire the OwlScript input object
    _owlscript = $('owlscript');

    // acquire The Owl
    _owl = $('owl');

    // self-explanatory
    _attach_tab_event();

    // check for previous code
    if(localStorage._owlscript)
        _owlscript.value = localStorage._owlscript;

    // add a key press listener
    addEventListener("keydown", function(e) {

        // Escape key
        if(e.keyCode === 27 && !_key_processing) {

            // erase the old main()
            window.main = null;

            // prevent duplicate event handling
            _key_processing = 1;

            // store the code
            localStorage._owlscript = _owlscript.value;

            // if the controls are hidden
            if(_owlscript._hidden == 1) {
                // show them
                _owlscript._hidden = 0;
                _owlscript.classList.remove('hide');
                _owl.classList.remove('hide');
                // dim the background
                _notebook.classList.add('dim');
                _canvas_object.classList.add('dim');
                // focus on the code editing window
                _owlscript.focus();
                // stop animation and/or repetition
                _stop_loops = 1;
            }
            // otherwise
            else {
                // continue animation and/or repetition
                _stop_loops = 0;

                // the code editor is hidden
                _owlscript._hidden = 1;

                // attempt to process the code
                try {
                    // process the new code
                    eval(_parse(_owlscript.value));
                }
                // if an error is encountered
                catch(error) {
                    // just kidding, code editor is not really hidden
                    _owlscript._hidden = 0;
                    // prevent any loops from starting
                    _stop_loops = 1;
                    // display it
                    alert(error.name + ': ' + error.message);
                }
                // attempt to run the code
                try {
                    _initialize_image();
                }
                catch(error) {
                    // just kidding, code editor is not really hidden
                    _owlscript._hidden = 0;
                    // prevent any loops from starting
                    _stop_loops = 1;
                    // display it
                    alert(error.name + ': ' + error.message);
                }
                if(!_stop_loops) {
                    // hide the controls
                    _owlscript.classList.add('hide');
                    _owl.classList.add('hide');
                    // undim the background
                    _notebook.classList.remove('dim');
                    _canvas_object.classList.remove('dim');
                }
            }

            // allow another ESC key event in 200ms
            setTimeout(function() {
                _key_processing = 0;
            }, 200);
        }
    });
}

// force normal TAB behavior while inside the TEXTAREA
function _attach_tab_event() {

    _owlscript.addEventListener('keydown', function(e) {

        // TAB = 9
        if(e.keyCode === 9) {

            // acquire the cursor position
            var start   = this.selectionStart;

            // text = before cursor + '    ' + after cursor
            this.value =
                this.value.substring(0, start)
                + '    '
                + this.value.substring( this.selectionEnd);

            // move the cursor after the tab
            this.selectionStart = this.selectionEnd = start + 4;

            // prevent focus loss by ignoring default TAB event handling
            e.preventDefault();
        }
    });

}

// redraw on resize
window.onresize = function() {
    _initialize_image();
}

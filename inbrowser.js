/*
 * OwlScript In Browser v0.1-beta by Val Tenyotkin (val@tenyotk.in)
 *
 * Variables and properties prefixed with an underscore, though global, are
 * internal and can be minified.  Global minification to common variable names
 * such as a, b, c, etc. is not adviseable.  Convention of this file is to use
 * a less common sequence _1, _2, _3, etc.
 *
 */

/******************************************************************************/
/*** Global Variables *********************************************************/
/******************************************************************************/

// OwlScript input window
var _owlscript;

// Owl
var _owl;

// file name wrapper
var _file;

// file name input
var _filename;

// code
var _code;

// code toolbar
var _code_toolbar;

// key processing flag
var _key_processing = 0;

// for minification purposes
var _localStorage = localStorage;

/******************************************************************************/
/*** Initialization ***********************************************************/
/******************************************************************************/

// self-explanatory
window.onload = function() {

    // self-explanatory
    _acquire_global_objects();

    // replicate the expected behavior of the TAB key in the code editor
    _attach_tab_event();

    // file name handling
    _attach_filename_resizing_event();

    // self-explanatory
    _attach_toolbar_events();

    // self-explanatory
    _check_local_storage();

    // run on ESC
    addEventListener('keydown', function(e) {

        // ESC = ASCII 27
        if(e.keyCode === 27)
            // prevent duplicate event handling
            if(!_key_processing) {
                _key_processing = 1;

                // self-explanatory
                _attempt_to_run_the_code();

                // allow another ESC key event in 300ms
                setTimeout(function() {
                    _key_processing = 0;
                }, 300);
            }
    });
}

// redraw on resize
window.onresize = function() {
    _initialize_image();
}

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
function _attach_toolbar_events() {

    $('new_code').onclick = function() {
        _save_current_code();
        _new_code();
    }

    $('list_codes').onclick = function() {
        _list_local_codes();
    }

    $('clone_code').onclick = function() {
        _new_code(
            'Clone of ' + _filename.value ,
            '// Clone of ' + _filename.value
            + ' (ID: ' + _localStorage.current_code + ')\n\n'
            + _code.value
        );
    }

    $('delete_code').onclick = function() {

        // acquire the code ID list
        var IDs = _localStorage.codes.split(/,/);

        if(IDs.length <= 1)
            alert('Unable to delete the last code.');
        else
            if(confirm('Are you sure you want to delete '
                        +_filename.value
                        +' forever?'))
                _delete_current_code();
    }
}

// self-explanatory
function _acquire_global_objects() {

    // acquire the canvas object
    _canvas_object = $('screen');

    // get the drawing context
    _canvas = _canvas_object.getContext('2d');

    // acquire the notebook object
    _notebook = $('notebook');

    // acquire the OwlScript editor object
    _owlscript = $('owlscript');

    // acquire the code
    _code = $('code');

    // acquire The Owl
    _owl = $('owl');

    // acquire the file name wrapper
    _file = $('file');

    // acquire the file name input
    _filename = $('filename');
 
    // acquire the code toolbar   
    _code_toolbar = $('code_toolbar');
}

/******************************************************************************/
/*** Code Editor **************************************************************/
/******************************************************************************/

// self-explanatory
function _show_code_editor() {

    // hide the code editor
    _show(_code_toolbar);
    _show(_owlscript);
    _show(_file);
    _show(_owl);

    // dim the background
         _notebook._add_class('dim');
    _canvas_object._add_class('dim');

    // focus on TEXTAREA
    _owlscript.focus();
}

// self-explanatory
function _hide_code_editor() {

    // hide the code editor
    _hide(_code_toolbar);
    _hide(_owlscript);
    _hide(_file);
    _hide(_owl);

    // undim the background
         _notebook._remove_class('dim');
    _canvas_object._remove_class('dim');

    // hide the code list, for good measure
    if($('_code_list'))
        _hide_window('_code_list');
}

// attempt to the run the code, hide the code editor if successful,
// report an error otherwise
function _attempt_to_run_the_code() {

    // erase the old main()
    window.main = null;

    // store the code
    _save_current_code();

    // if the code editor is hidden
    if(_owlscript._hidden == 1) {
        // mark the code editor visible
        _owlscript._hidden = 0;
        // show it
        _show_code_editor()
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
            eval(_parse(_code.value));
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
        // hide the code editor, if appropriate
        if(!_stop_loops)
            _hide_code_editor();
    }
}

/******************************************************************************/
/*** Local Storage ************************************************************/
/******************************************************************************/

// self-explanatory
function _initialize_local_storage() {

    // current code ID
    _localStorage.current_code = 100000;

    // highest code ID
    _localStorage.latest_code = 100000;

    // comma-separated list of code IDs
    _localStorage.codes = '100000';

    // name of the 0th code
    _filename.value = 
    _localStorage.name100000 = 'Untitled 100000';

    // store whatever initial code is in the TEXTAREA
    _localStorage.body100000 = _code.value;

    // date of creation of 0th code, now
    _localStorage.created100000 = (new Date()).toLocaleString();
}

// self-explanatory
function _load_code(id) {

    // self-explanatory
    _save_current_code();

    // change current code ID
    _localStorage.current_code = id;

    // load the code body
    _code.value = _localStorage['body' + id];

    // load the code name
    _filename.value = _localStorage['name' + id];
}

// self-explanatory
function _delete_current_code() {

    // acquire the code ID list
    var IDs = _localStorage.codes.split(/,/);

    // restrict the deletion of the last code
    if(IDs.length <= 1)
        return;

    // acquire the current code ID
    var id = _localStorage.current_code;

    // remove the ID form the list
    var index = IDs.indexOf(id);
    IDs.splice(index, 1);
    _localStorage.codes = IDs;

    // remove all associated data
    _localStorage.removeItem('name'+id);
    _localStorage.removeItem('body'+id);
    _localStorage.removeItem('created'+id);
    _localStorage.removeItem('modified'+id);

    // if there'a another code after the recently deleted one
    if(IDs[index])
        // load it
        _load_code(IDs[index]);
    // if there's one before the recently deleted one, load it
    else
        _load_code(IDs[index-1]);

}

// self-explanatory
function _save_current_code() {
    // if the code has changed
    if(_localStorage['body'+_localStorage.current_code] !== _code.value) {
        // save it
        _localStorage['body'+_localStorage.current_code] = _code.value;
        // update the modification time
        _localStorage['modified'+_localStorage.current_code] = (new Date()).toLocaleString();
    }
}

// self-explanatory
function _rename_current_code() {
    // store the name
    _localStorage['name'+_localStorage.current_code] = _filename.value;
}

// check if some code is stored locally
function _check_local_storage() {

    // if the code exists
    if(_localStorage.current_code) {
        // load it
        _code.value     = _localStorage['body'+_localStorage.current_code];
        // name it
        _filename.value = _localStorage['name'+_localStorage.current_code];
    }
    // otherwise create first local code
    else
        _initialize_local_storage();
}

// save current code, create new code
function _new_code(name, body) {

    // create the new triacontahexadecimal code ID via incrementing the largest
    // ID so far and update the current code

    var n =
    _localStorage.current_code = 
    _localStorage.latest_code = 
        (parseInt(_localStorage.latest_code, 36) + 1).toString(36).toUpperCase();

    // add new code ID to the code list
    _localStorage.codes += (_localStorage.codes.length ? ',' : '' ) + n;

    // create default name and body and display them
                      _localStorage['created'+n] = (new Date()).toLocaleString();
    _filename.value = _localStorage['name'   +n] = name || 'Untitled '+n;
    _code.value     = _localStorage['body'   +n] = body || 'function main() {\n\n\n\n\n}';

}

// self-explanatory
function _list_local_codes() {

    // acquire the code ID list
    var codeIDs = _localStorage.codes.split(/,/);

    // create code list table
    var table = _create_element('table');

    // table row shorthand
    function create_table_row(cells) {

        // create the row
        var tr = _create_element('tr');

        // add cells to it
        for(var i = 0; i < cells.length; i++)
            tr._append_child(_create_element('td')).innerHTML = cells[i];

        // return the row
        return tr;
    }

    // loop through them
    for(var i = 0; i < codeIDs.length; i++)
        table._append_child(
            create_table_row([
                                         codeIDs[i],
                _localStorage['name'    +codeIDs[i]],
                _localStorage['created' +codeIDs[i]],
                _localStorage['modified'+codeIDs[i]] || 'Unmodified'
            ])
        );

    // create the code list window
    var code_list = _create_window('_code_list');

    // clear it
    code_list.innerHTML = '';

    // create and attach the heading
    var heading = _create_element('table');
    heading.id = 'code_list_heading';
    heading._append_child(
        create_table_row(['ID', 'Name', 'Created', 'Modified'])
    );
    code_list._append_child(heading);

    // create the wrapper DIV
    var div = _create_element('div');
    // ID it
    div.id = 'code_list';
    div._append_child(table);

    // attach delegated click event
    table.addEventListener('click', function(e) {
        _load_code(e.target.parentNode.firstChild.innerHTML);
        _hide_window('_code_list');
    });

    // inject it with aforecreated content
    code_list._append_child(div);
    // show it
    _show_window('_code_list');
}


/******************************************************************************/
/*** Forcing a Website to Behave Like a Word Processor ************************/
/******************************************************************************/

// normal TAB behavior while inside the TEXTAREA
function _attach_tab_event() {

    _code.addEventListener('keydown', function(e) {

        // TAB = 9
        if(e.keyCode === 9) {

            // acquire the cursor position
            var start   = this.selectionStart;

            // text = before cursor + '    ' + after cursor
            this.value =
                this.value.substring(0, start)
                + '    '
                + this.value.substring(this.selectionEnd);

            // move the cursor after the tab
            this.selectionStart = this.selectionEnd = start + 4;

            // prevent focus loss by ignoring default TAB event handling
            e.preventDefault();
        }
    });
}

// dynamic file name input field resizing
function _attach_filename_resizing_event() {

    _filename.onfocus =
    _filename.onkeydown =
    _filename.onkeyup = function() {

        // empty names are not allowed
        if(!this.value.trim().length)
            this.value = 'Untitled';

        // store the name 
        _rename_current_code();

        // create an element with the contents of the input field
        // for the purpose of measuring it
        var div = _create_element('div');
        div.className = 'filename';
        div.innerHTML = _filename.value.replace(/\s/g, '&nbsp;');
        document.body._append_child(div);
        // measure it
        var size = div.getBoundingClientRect().width;
        // delete it
        div.parentNode.removeChild(div);

        // resize the input field, unless it is larger than half of the code editor
        if(size < _owlscript.getBoundingClientRect().width/2) {
            _filename.parentNode.style.width = 
            _filename.style.width = size + 16 + 'px';
        }
    }
}

/******************************************************************************/
/*** Cool Window **************************************************************/
/******************************************************************************/

// create a cool-looking window
function _create_window(id, width, height, left, top) {

    // if the window already exists, stop
    if($(id))
        return $(id);

    // create the window
    var div = _create_element('div');
    // create the [x]  button
    var xxx = _create_element('div');

    // identify them
    div.id = id;
    xxx.id = 'x'+id;

    // make them pretty and hide them
    div.className = 'window translucent hide superhide';
    xxx.className = 'window_close translucent hide superhide';

    // position them
    div.style.width  = width  || '50%';
    div.style.height = height || '50%';
    xxx.style.left   =
    div.style.left   = left   || '25%';
    xxx.style.top    =
    div.style.top    = top    || '25%';

    // attach close event to the [x]
    xxx.onclick = function() {
        _hide_window(id);
    }

    // attach them to the body
    document.body._append_child(div);
    document.body._append_child(xxx);

    // return the created window
    return div;
}

// self-explanatory
function _show_window(id) {
    _show($(    id));
    _show($('x'+id));
}

// self-explanatory
function _hide_window(id) {
    _hide($(    id));
    _hide($('x'+id));
}

/******************************************************************************/
/*** Utilities ****************************************************************/
/******************************************************************************/

function _create_element(tag) {
    return document.createElement(tag);
}

// fancy hide: first dim, then display:none;
function _hide(object) {
    object._add_class('hide');
    setTimeout(function() {
        object._add_class('superhide');
    }, 250);
}

// fancy show: first remove display:none, then fade in
function _show(object) {
    object._remove_class('superhide');
    setTimeout(function() {
        object._remove_class('hide');
    }, 20);
}

// for minification only
Object.prototype._add_class = function(Class) {
    this.classList.add(Class);
}

// for minification only
Object.prototype._remove_class = function(Class) {
    this.classList.remove(Class);
}

// for minification only
Object.prototype._append_child = function(child) {
    return this.appendChild(child);
}

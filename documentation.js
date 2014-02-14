function ajax(url) {

    // create an asynchronous request object
    var request = new XMLHttpRequest();

    // open it
    request.open('get', url, true);

    // when the response arrives
    request.onreadystatechange = function() {
        // if the request is successful
        if (request.readyState == 4) 
            // show code
            $('view_code').innerHTML = request.responseText
                // remove HTML tags
                .replace(/<[^<>]+>/g,'');
        }

    // send the request
    request.send();
}

// self-explanatory
function $(id) {
    return document.getElementById(id);
}

function install_close_code_events() {

    // install the close event on click
    $('view_code_close').onclick = function() {
        // hide the code viewer
        hide($('view_code_close'));
        hide($('view_code'));
    }

    // install the close event on ESC
    addEventListener('keyup', function(e) {
        if(e.keyCode === 27) {
            // hide the code viewer
            hide($('view_code_close'));
            hide($('view_code'));
        }
    });
}

// self-explanatory
function instantiate_view_code_buttons() {

    // acquire all of the buttons
    var divs = document.querySelectorAll('div.view_code');

    // go through them
    for(var i = divs.length; i-->0;) {
        // on click
        divs[i].onclick = function() {

            // show the code viewer and display an encouraging message
            $('view_code').innerHTML = 'Loading code...';
            show($('view_code_close'));
            show($('view_code'));

            // start loading the code
            ajax(this.nextSibling.href);
        }
    }
}

// fancy hide: first dim, then display:none;
function hide(object) {
    object.classList.add('hide');
    setTimeout(function() {
        object.classList.add('superhide');
    }, 250);
}

// fancy show: first remove display:none, then fade in
function show(object) {
    object.classList.remove('superhide');
    setTimeout(function() {
        object.classList.remove('hide');
    }, 20);
}

// self-explanatory
window.addEventListener('load', function() {
    instantiate_view_code_buttons();
    install_close_code_events();
}, false);

function statusLoading(text){
    showSpinner(true);
    showStatus(true);
    $('#status').text(text);
}

function statusLoaded(text){
    showSpinner(false);
    showStatus(true);
    $('#status').text(text);
}

function statusHide(text){
    showSpinner(false);
    showStatus(false);
}

function showSpinner(show){
    setShow('#spinner', show);
}

function showStatus(show){
    setShow('#status', show);
}

function setShow(id, show){
    if(show) $(id).removeClass('invisible');
    else $(id).addClass('invisible');
}
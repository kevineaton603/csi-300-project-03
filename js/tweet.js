const electron = require('electron')
const remote = electron.remote
const $ = require('jquery')
const ipc = electron.ipcRenderer

$(document).ready(()=>{
    $('#tweet-form').submit((event)=>{
        var tweet = $( '#tweet-form' ).serializeArray();
        event.preventDefault()
        ipc.send('tweet', tweet);
        var window = remote.getCurrentWindow();
        window.close();
    })
})


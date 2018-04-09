const electron = require('electron')
const {ipcRenderer} = require('electron')
const remote = electron.remote
const path = require('path')
const $ = require('jquery')
const mysql = require('mysql')
const ipc = electron.ipcRenderer
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter'
})
connection.connect()
$(document).ready(()=>{
    $('#tweet-form').submit((event)=>{
        var tweet = $( '#tweet-form' ).serializeArray();
        event.preventDefault()
        ipc.send('tweet', tweet);
        var window = remote.getCurrentWindow();
        window.close();
    })
})
connection.end()

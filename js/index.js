const electron = require('electron')
const {ipcRenderer} = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
const path = require('path')
const fs = require('fs')
const $ = require('jquery')
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter'
})
let win = electron.remote.getCurrentWindow()
var user_id;
/**
 * Gets init timeline on load up
 * and displays on page
 * @param id: the id of the user (Default: 0)
 * @return none
 */
async function get_timeline(id=0)
{
    try{
        const timeline_query = await get_query('sql/timeline.sql')
        const timeline_results = await query(timeline_query, [id,id,id,id]);
        const user_results = await query('SELECT * FROM users WHERE users.user_id = ?', [id])
        var html = "";
        $('#timeline').html(html);
        timeline_results.forEach(element => {
            //console.log(element);
            if(element.is_rt)
            {
                html = element.name +" retweeted "+ element.og_tweeter +"'s tweet: " + element.tweet_body + "<br>"
            }
            else
            {
                html = element.name+" tweeted: "+element.tweet_body + "<br>"
            }
            $('#timeline').append(html)
        });
    }
    catch(err)
    {
        console.error('Error: Timeline()', err)
    }
    
}
async function get_user_info()
{
    const login = await get_query(path.join(__dirname, 'sql/login.sql'))
    const login_info = await get_user_file(path.join(__dirname, 'user.json'))
    const get_user_id = await query(login, [login_info['username'], login_info['password']])
    return get_user_id[0]['user_id']
}
function login()
{
    const loginPath =  path.join('file://', __dirname, 'html/login.html')
    let win = new BrowserWindow({frame: true, alwaysOnTop: true, /*width: 400, height: 200*/})
    win.on('close', ()=>{win = null})
    win.loadURL(loginPath)
    win.show()
}
function get_user_file(filename)
{
    return new Promise((resolve, reject)=>{
        fs.readFile(filename, (err, data) => {  
            if (err){reject(err)};
            if(data)
            {
                data = JSON.parse(data)
                resolve(data)
            }
            else{
                reject(0)
            }
          });
    })
}
function get_query(filename)
{
    return new Promise((resolve, reject)=>{
        fs.readFile(filename, (err, data)=>{
            if(err) {reject(err)};
            if(data)
            {
                data = data.toString()
                resolve(data)
            }
            else{
                reject(0)
            }
            
        })
    })
}
function query(sql, values=[])
{
    return new Promise((resolve, reject)=>{
        connection.query({
            sql: sql,
            values: values
            }, 
            function (error, results, fields) {
            if (error){ reject(error); }
            resolve(results);
        });
    })
}
//MAIN FUNCTION
$(document).ready(()=>{
    connection.connect();
    //Needs to be test against if invalid information is held with json packet
    get_user_info().then((results)=>{
        get_timeline(results);
        user_id = results;
    })
    $('#tweet').on('click', ()=>{
        const modalPath = path.join('file://', __dirname, 'html/tweet.html')
        let win = new BrowserWindow({frame: true, alwaysOnTop: true, width: 400, height: 200})
        win.on('close', ()=>{win = null})
        win.loadURL(modalPath)
        win.show()
    })
    $('#reload-timeline').on('click', ()=>{
        get_timeline(user_id)
    })
    $('#login').on('click',()=>{
        login()
    })
})
//IPC PROCESSES
ipcRenderer.on('update-timeline', (event,arg)=>{
    values = [user_id,arg[0]['value']]
    connection.query({
        sql: "INSERT INTO `tweet`(`user_id`, `time_posted`, `tweet_body`) VALUES (?, (SELECT NOW()), ?)",
        values: values
        }, 
        function (error, results, fields) {
        if (error){ throw(error); }
    });
    get_timeline(user_id)
})

//WINDOW PROCESS
win.on('close', ()=>{
    connection.end();
})
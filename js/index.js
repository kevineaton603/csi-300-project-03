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
const timeline = "SELECT 1 is_rt, t.tweet_body, r.time_retweeted AS time_posted, u.name, u2.name AS og_tweeter FROM retweet AS r INNER JOIN tweet AS t ON t.tweet_id = r.tweet_id INNER JOIN users AS u ON r.user_id = u.user_id INNER JOIN users as u2 ON t.user_id = u2.user_id WHERE r.user_id IN ( SELECT users.user_id FROM users WHERE users.user_id IN ( SELECT followers.user_id FROM followers WHERE followers.follower_id = ? ) ) UNION SELECT 0, tweet.tweet_body, tweet.time_posted, users.name, null FROM users INNER JOIN tweet ON users.user_id = tweet.user_id WHERE tweet.user_id IN ( SELECT users.user_id FROM users WHERE users.user_id IN ( SELECT followers.user_id FROM followers WHERE followers.follower_id = ? ) ) ORDER BY time_posted"
let win = electron.remote.getCurrentWindow()
var sql = fs.readFileSync('sql/timeline.sql').toString();
/**
 * Gets init timeline on load up
 * and displays on page
 */
async function get_timeline()
{
    try{
        const timeline_results = await query(sql, [11,11,11,11]);
        const user_results = await query('SELECT * FROM users WHERE users.user_id = ?', [11])
        var html = "";
        $('#timeline').html(html);
        timeline_results.forEach(element => {
            //console.log(element);
            if(element.is_rt)
            {
                html = element.name +" retweeted "+ element.og_tweeter +"'s tweet: " + element.tweet_body + "<br>"
            }
            else{
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

function query(sql, values=[])
{
    return new Promise((resolve, reject)=>{
        connection.query({
            sql: sql,
            values: values
            }, 
            function (error, results, fields) {
            if (error){ reject(error); }
            //console.log(results)
            resolve(results);
        });
    })
}
//MAIN FUNCTION
$(document).ready(()=>{
    connection.connect();
    get_timeline()
    $('#tweet').on('click', ()=>{
        //console.log("hello world");
        const modalPath = path.join('file://', __dirname, 'html/tweet.html')
        let win = new BrowserWindow({frame: true, alwaysOnTop: true, /*width: 400, height: 200*/})
        win.on('close', ()=>{win = null})
        win.loadURL(modalPath)
        win.show()
    })
    $('#reload-timeline').on('click', ()=>{
        get_timeline()
    })
})
//IPC PROCESSES
ipcRenderer.on('update-timeline', (event,arg)=>{
    values = [11,arg[0]['value']]
    connection.query({
        sql: "INSERT INTO `tweet`(`user_id`, `time_posted`, `tweet_body`) VALUES (?, (SELECT NOW()), ?)",
        values: values
        }, 
        function (error, results, fields) {
        if (error){ throw(error); }
        console.log(results)
    });
    console.log();
    get_timeline()
})

win.on('close', ()=>{
    connection.end();
})
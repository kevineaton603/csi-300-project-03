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

class User
{
    constructor()
    {
        this.is_logged_in = false
        this.user_id = -1
        this.favorites = new Array();
        this.retweets = new Array();
        this.file = "user.json"
    }
}
async function get_info(user_id){
    try{
        rt_array = new Array("tweet_id", "retweet", "user_id", user_id)
        fav_array = new Array("tweet_id", "favorite", "user_id", user_id)
        results = {
            "retweet":new Array(),
            "favorite":new Array()
        }
        const info_sql = await fileToStr(path.join(__dirname, 'sql/get_info.sql'))
        const favorite = await query(info_sql, fav_array)
        const retweet = await query(info_sql, rt_array)
        favorite.forEach(element => {
            results.favorite.push(element.tweet_id)
        });
        retweet.forEach(element => {
            results.retweet.push(element.tweet_id)
        });
        
        console.log(results);
        return results;
    }
    catch(err)
    {
        console.error(err);
    }
}
function fileToJSON(filename)
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
function fileToStr(filename)
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
/**
 * Gets init timeline on load up
 * and displays on page
 * @param id: the id of the user (Default: 0)
 * @return none
 */
async function get_timeline(id=0)
{
    console.log(user_id);
    try{
        const timeline_query = await fileToStr('sql/timeline.sql')
        const timeline_results = await query(timeline_query, [id,id,id,id]);
        var html = "";
        $('#timeline').html(html);
        console.log(timeline_results);
        console.log(user)
        timeline_results.forEach(element => {
            if(element.is_rt)
            {
                html = "<div class='tweet' data='"
                    + element.tweet_id 
                    + "'>"
                        + "<div class='retweeter'>"
                            + element.name + " retweeted"
                        + "</div>"
                        + "<div class='name'>"
                            + element.og_tweeter
                        + "</div>"
                        + "<div class='tweet_body'>"
                            + element.tweet_body
                        + "</div>"
                        + "<div class='retweet' data='"
                            + element.tweet_id 
                        + "'>" + (user.retweets.includes(element.tweet_id) ? "UNRETWEET":"RETWEET") 
                        + "</div>"
                        + "<div class='favorite' data='"
                            + element.tweet_id 
                        + "'>" + (user.favorites.includes(element.tweet_id) ? "UNFAVORITE":"FAVORITE")
                        +"</div>"
                    + "</div>"
            }
            else
            {
                html = "<div class='tweet' data='"
                    + element.tweet_id 
                    + "'>"
                        + "<div class='name'>"
                            + element.name
                        + "</div>"
                        + "<div class='tweet_body'>"
                            + element.tweet_body
                        + "</div>"
                        + "<div class='retweet' data='"
                            + element.tweet_id 
                        + "'>" + (user.retweets.includes(element.tweet_id) ? "UNRETWEET":"RETWEET") 
                        + "</div>"
                        + "<div class='favorite' data='"
                            + element.tweet_id 
                        + "'>" + (user.favorites.includes(element.tweet_id) ? "UNFAVORITE":"FAVORITE")
                        +"</div>"
                    + "</div>"
            }
            $('#timeline').append(html)
        });
    }
    catch(err)
    {
        console.error('Error: Timeline()', err)
    }
    
}

async function find_new_followers(user_id)
{
    const sql = await fileToStr(path.join(__dirname, 'sql/find_new_users.sql'))
    const new_users = await query(sql, [user_id])
    var html = "";
    $('#follow').html(html);
    new_users.forEach(element => {
        //console.log(element);
        html += "<div data='"+element.user_id+"' class='to_follow'>"+ element.name+ ": " + element.username + "</div>"
    });
    $('#follow').html(html);
}
async function follow(user_id, id)
{
    const follow_sql = await fileToStr(path.join(__dirname, 'sql/follow.sql'));
    const follow = await query(follow_sql, [user_id, id]);
    return follow;
}
async function retweet(tweet_id, user_id)
{
    try{
        const retweet_sql = await fileToStr('sql/retweet.sql');
        const retweet = await query(retweet_sql, [tweet_id, user_id]);
        return retweet;
    }
    catch(err)
    {
        console.error(err);
    }
}
async function favorite(tweet_id, user_id)
{   
    const favorite_sql = await fileToStr(path.join(__dirname, 'sql/favorite.sql'));
    const favorite = await query(favorite_sql, [tweet_id, user_id]);
    return favorite;
}
function launch_login()
{
    const loginPath =  path.join('file://', __dirname, 'html/login.html')
    let win = new BrowserWindow({frame: true, alwaysOnTop: true, /*width: 400, height: 200*/})
    win.on('close', ()=>{win = null})
    win.loadURL(loginPath)
    win.show()
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
async function login_async()
{
    try{
        const login_sql = await fileToStr(path.join(__dirname, 'sql/login.sql'))
        const login_info = await fileToJSON(path.join(__dirname, 'user.json'))
        const validate_user = await query(login_sql, [login_info['username'], login_info['password']])
        if(validate_user.length == 1)
        {
            return validate_user[0]['user_id'];
        }
        else{
            return -1;
        }
    }
    catch(err){
        console.error(err)
    }
}
function setTweetAttr()
{
    $('.retweet').on('click', (event)=>{
        console.log(event);
        
        tweet_id = event.target.attributes[0].value
        if(!user.retweets.includes(tweet_id))
        {
            //retweet(tweet_id, user_id);
            //user.retweets.push(tweet_id);
            //event.target.innerHTML = "UNRETWEET";
        }
        else{
            //We want to delete retweet here
            console.log("Already Retweeted!!");
            //unretweet(tweet_id, user_id);
            //index = user.favorites.indexOf(tweet_id);
            //user.favorite.splice(index, 1);
            //event.target.innerHTML = "RETWEET";
        }
    })
    $('.favorite').on('click', (event)=>{
        tweet_id = parseInt(event.target.attributes[1].value)
        if(!user.retweets.includes(tweet_id))
        {
            //favorite(tweet_id, user_id);
            //user.favorites.push(tweet_id);
            //event.target.innerHTML = "UNFAVORITE";
        }
        else{
            //We want to delete favorite here
            console.log("Already Favorited!!");
            //unfavorite(tweet_id, user_id);
            //index = user.favorites.indexOf(tweet_id);
            //user.favorite.splice(index, 1);
            //event.target.innerHTML = "FAVORITE";
        }
        
    })
}
var user = new User();
//MAIN FUNCTION
$(document).ready(()=>{
    
    login_async().then((results)=>{
        if(results != -1)
        {
            console.log(results);
            user_id = results;
            user.user_id = results;
            user.is_logged_in = true;
            get_info(user_id).then((results)=>{
                user.favorites = results.favorite
                user.retweets = results.retweet
                console.log( user.favorites, user.retweets);
                
                get_timeline(user.user_id).then((timeline_results)=>{
                    setTweetAttr()
                });
            });
            find_new_followers(user_id).then((results)=>{
                $('.to_follow').click((event)=>{
                    follow(user_id, event.target.attributes[0].value).then((results)=>{
                        console.log(results);
                        console.log("USER_ID: ",user_id, "\t now follows: ", event.target.id);
                    })
                })
            })
        }
        else{
            alert("Automatic Login Failed please login!!")
        }
    })
    $('#tweet').on('click', ()=>{
        const modalPath = path.join('file://', __dirname, 'html/tweet.html')
        let win = new BrowserWindow({frame: true, alwaysOnTop: true, width: 400, height: 200})
        win.on('close', ()=>{win = null})
        win.loadURL(modalPath)
        win.show()
    })
    $('#reload-timeline').on('click', ()=>{
        get_timeline(user_id).then((timeline_results)=>{
            setTweetAttr()
        });
    })
    $('#login').on('click',()=>{
        launch_login()
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
    get_timeline(user_id).then((timeline_results)=>{
        setTweetAttr()
    });
})

//WINDOW PROCESS
win.on('close', ()=>{
})
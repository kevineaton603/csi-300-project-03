const path = require('path');
const fs = require('fs');
const $ = require('jquery');
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter'
});
class User
{
    constructor(user_id = -1)
    {
        this.is_logged_in = false
        this.user_id = user_id
        this.favorites = new Array();
        this.retweets = new Array();
        this.followers = new Array();
        this.following = new Array();
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
function setTweetAttr(user)
{    
    $('.retweet').on('click', function(event){
        tweet_id = parseInt(event.target.attributes[1].value);
        var rt = $("[data-rt='"+tweet_id+"']")
        
        if(!user.retweets.includes(tweet_id))
        {
            //retweet(tweet_id, user_id);
            //user.retweets.push(tweet_id);
            $(rt).each( function(event){
                $(this).html("UNRETWEET")
            })
        }
        else{
            //We want to delete retweet here
            //unretweet(tweet_id, user_id);
            //index = user.favorites.indexOf(tweet_id);
            //user.favorite.splice(index, 1);
            $(rt).each( function(event){
                $(this).html("RETWEET")
            })
        }
    })
    $('.favorite').on('click', function(event){
        tweet_id = parseInt(event.target.attributes[1].value)
        var fav = $("[data-fav='"+tweet_id+"']")
        
        if(!user.favorites.includes(tweet_id))
        {
            //favorite(tweet_id, user_id);
            //user.favorites.push(tweet_id);
            $(fav).each( function(event){
                $(this).html("UNFAVORITE")
            })
        }
        else{
            //We want to delete favorite here
            console.log("Already Favorited!!");
            //unfavorite(tweet_id, user_id);
            //index = user.favorites.indexOf(tweet_id);
            //user.favorite.splice(index, 1);
            $(fav).each( function(event){
                $(this).html("FAVORITE")
            })
        }
        
    })
}
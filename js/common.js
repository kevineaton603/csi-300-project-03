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
        this.is_logged_in = false;
        this.user_id = user_id;
        this.username = "";
        this.name = "";
        this.favorites = new Array();
        this.retweets = new Array();
        this.followers = new Array();
        this.following = new Array();
        this.tweets = new Array();
        this.file = "user.json"
    }
}
async function get_user_info(user)
{
    try{
        rt_array            = new Array("tweet_id",  "retweet", "user_id", user.user_id)
        fav_array           = new Array("tweet_id", "favorite", "user_id", user.user_id)
        follower_array      = new Array("follower_id", "user_id", user.user_id)
        following_array     = new Array("user_id", "follower_id", user.user_id)
        const info_sql      = await fileToStr(path.join(__dirname, 'sql/get_info.sql'))
        const follow_sql    = await fileToStr(path.join(__dirname, 'sql/followers.sql'))
        const tweets_sql    = await fileToStr('sql/num_of_tweets.sql')
        const num_of_tweets = await query(tweets_sql, [user.user_id])
        const favorite      = await query(info_sql, fav_array)
        const retweet       = await query(info_sql, rt_array)
        user.followers      = await query(follow_sql, follower_array)
        user.following      = await query(follow_sql, following_array)
        user.tweets = num_of_tweets[0][0].num
        favorite.forEach(element => {
            user.favorites.push(element.tweet_id)
        });
        retweet.forEach(element => {
            user.retweets.push(element.tweet_id)
        });
        return true;
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
            return validate_user[0];
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
    const follow_sql = await fileToStr('sql/follow.sql');
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
    const favorite_sql = await fileToStr('sql/favorite.sql');
    const favorite = await query(favorite_sql, [tweet_id, user_id]);
    return favorite;
}

/**
 * 
 * @param {str} table 
 * @param {int} tweet_id 
 * @param {int} user_id 
 */
async function make_delete(table, tweet_id, user_id)
{   
    const delete_sql = await fileToStr('sql/delete_fav_rt.sql');
    const delete_results = await query(delete_sql, [table, tweet_id, user_id]);
    return delete_results;
}
async function delete_tweet(tweet_id)
{   
    const delete_sql = await fileToStr('sql/delete_tweet.sql');
    const delete_results = await query(delete_sql, [tweet_id]);
    return delete_results;
}
async function delete_user(user_id)
{

}
function setTweetAttr(user)
{    
    $('.retweet').on('click', function(event){
        tweet_id = parseInt(event.target.parentElement.attributes[1].value);
        var rt = $("[data-rt='"+tweet_id+"']")
        
        if(!user.retweets.includes(tweet_id))
        {
            retweet(tweet_id, user.user_id);
            user.retweets.push(tweet_id);
            $(rt).each( function(event){
                $(this).html("<i class='fas fa-retweet retweeted'></i>")
            })
        }
        else{
            //We want to delete retweet here
            make_delete("retweet", tweet_id, user.user_id);
            index = user.retweets.indexOf(tweet_id);
            user.retweets.splice(index, 1);
            $(rt).each( function(event){
                $(this).html("<i class='fas fa-retweet'></i>")
            })
        }
    })
    $('.favorite').on('click', function(event){
        tweet_id = parseInt(event.target.parentElement.attributes[1].value)
        var fav = $("[data-fav='"+tweet_id+"']")
        if(!user.favorites.includes(tweet_id))
        {
            favorite(tweet_id, user.user_id);
            user.favorites.push(tweet_id);
            $(fav).each( function(event){
                $(this).html("<i class='fas fa-heart favorited'></i>")
            })
        }
        else{
            //We want to delete favorite here
            make_delete("favorite", tweet_id, user.user_id);
            index = user.favorites.indexOf(tweet_id);
            user.favorites.splice(index, 1);
            $(fav).each( function(event){
                $(this).html("<i class='far fa-heart'></i>")
            })
        }
        
    })
    $('.delete').on('click', function(event){
        //console.log($(this).attr('data-del'));
        tweet_id = parseInt($(this).attr('data-del'));
        delete_tweet(tweet_id);
        var del = $("[data='"+tweet_id+"']")
        del.remove();
        index = user.retweets.indexOf(tweet_id);
        if(index != -1)
        {
            user.retweets.splice(index, 1);
        }
        index = user.favorites.indexOf(tweet_id);
        if(index != -1)
        {
            user.favorites.splice(index, 1);
        }
        
    })
}
function setUserAttr(user)
{
    console.log(user);
    
    var html = "<div id='profile-name'>"
            + user.name
            + "</div>"
            + "<div id='profile-username'>@"
            + user.username
            + "</div>"
            + "<div id='profile-follower'>Followers<br>"
            + user.followers.length
            + "</div>"
            + "<div id='profile-following'>Following<br>"
            + user.following.length
            + "</div>"
            + "<div id='profile-tweets'>Tweets<br>"
            + user.tweets
            + "</div>";
    console.log(html);
    
    $("#user").html(html)
}
async function unfollow(user_id, follower_id)
{
    const unfollow_sql = await fileToStr('sql/unfollow.sql');
    const unfollow_results = await query(unfollow_sql, [user_id, follower_id]);
    return unfollow_results;
}
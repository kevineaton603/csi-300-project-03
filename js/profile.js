const electron = require('electron')
const {ipcRenderer} = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
let win = electron.remote.getCurrentWindow()
var user = new User();
var current_user = new User();

async function get_user_timeline(user, cur_user_profile = false)
{
    id = user.user_id;
    try{
        
        const timeline_query = await fileToStr('sql/user_timeline.sql')
        const timeline_results = await query(timeline_query, [id,id,id,id]);
        var html = "";
        $('#timeline').html(html);
        timeline_results.forEach(element => {
            var delete_div = "<button class='delete' data-del=" + element.tweet_id + ">" + "DELETE" +"</button>";
            var fav_btn = "<button class='favorite' data-fav=" + element.tweet_id + ">" + (user.favorites.includes(element.tweet_id) ? "<i class='fas fa-heart favorited'></i>":"<i class='far fa-heart favorite'></i>") + "</button>"
            var rt_btn = "<button class='retweet' data-rt=" + element.tweet_id  + ">" + (user.retweets.includes(element.tweet_id) ? "<i class='fas fa-retweet retweeted'></i>":"<i class='fas fa-retweet'></i>") + "</button>"
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
                        + rt_btn
                        + fav_btn
                        + cur_user_profile ? delete_div : ""
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
                        + rt_btn
                        + fav_btn
                        + (cur_user_profile ? delete_div : "")
                    + "</div>"
            }
            $('#timeline').append(html)
        });
    }
    catch(err){
        console.error('Error: Timeline()', err)
    }
}
async function get_followers(user, cur_user_profile = false)
{
    try{
        var html = "";
        user.followers.forEach(element => {
            html += "<div class='follow'>"
                    +"<div class='profile'>"
                    + element.name
                    + ": " 
                    + element.username 
                    + "</div>"
                +"</div>"
        });
        $('#followers').html(html);
    }
    catch(err){
        console.error(err);
    }
}
async function get_following(user, cur_user_profile = false)
{
    try{
        var html = "";
        user.following.forEach(element => {
            html += "<div class='follow'>"
                    +"<div class='profile'>"
                    + element.name
                    + ": " 
                    + element.username 
                    + "</div>"
                +"</div>"
        });
        $('#following').html(html);
    }
    catch(err){
        console.error(err);
    }
}
async function get_user_info(user)
{
    console.log(user.user_id);
    try{
        rt_array        = new Array("tweet_id",  "retweet", "user_id", user.user_id)
        fav_array       = new Array("tweet_id", "favorite", "user_id", user.user_id)
        follower_array  = new Array("follower_id", "user_id", user.user_id)
        following_array = new Array("user_id", "follower_id", user.user_id)
        const info_sql = await fileToStr(path.join(__dirname, '../sql/get_info.sql'))
        const follow_sql = await fileToStr(path.join(__dirname, '../sql/followers.sql'))
        const favorite = await query(info_sql, fav_array)
        const retweet = await query(info_sql, rt_array)
        user.followers = await query(follow_sql, follower_array)
        user.following = await query(follow_sql, following_array)
        
        favorite.forEach(element => {
            user.favorites.push(element.tweet_id)
        });
        retweet.forEach(element => {
            user.retweets.push(element.tweet_id)
        });
        console.log(user);
        return true;
    }
    catch(err)
    {
        console.error(err);
    }
}
$(document).ready(()=>{
    info = ipcRenderer.sendSync('get-info', null);
    current_user.user_id = info[0]
    user.user_id = info[1]
    if(user.user_id == current_user.user_id)
    {
        get_user_info(current_user).then((results)=>{
            current_user.is_logged_in = true;
            get_user_info(user).then((results)=>{
                get_followers(user, true).then((results)=>{
                    
                })
                get_following(user,true).then((results)=>{
        
                })
                get_user_timeline(user, true).then((results)=>{
                    setTweetAttr(current_user)
                })
            })
        })
    }
    else{
        get_user_info(current_user).then((results)=>{
            current_user.is_logged_in = true;
            get_user_info(user).then((results)=>{
                get_followers(user).then((results)=>{
        
                })
                get_following(user).then((results)=>{
        
                })
                get_user_timeline(user).then((results)=>{
                    setTweetAttr(current_user)
                })
            })
        })
    }
    
});

ipcRenderer.on('profile-info', (event,arg)=>{
    console.log(arg)
})
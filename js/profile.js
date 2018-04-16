const electron = require('electron')
const {ipcRenderer} = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
let win = electron.remote.getCurrentWindow()
var user = new User();

async function get_user_timeline(user_id)
{
    try{
        const timeline_query = await fileToStr('sql/timeline.sql')
        const timeline_results = await query(timeline_query, [id,id,id,id]);
        $('#timeline').html(html);
        //console.log(timeline_results);
        //console.log(user)
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
                        + "<div class='retweet' data-rt="
                            + element.tweet_id 
                        + ">" + (user.retweets.includes(element.tweet_id) ? "UNRETWEET":"RETWEET") 
                        + "</div>"
                        + "<div class='favorite' data-fav="
                            + element.tweet_id 
                        + ">" + (user.favorites.includes(element.tweet_id) ? "UNFAVORITE":"FAVORITE")
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
                        + "<div class='retweet' data-rt='"
                            + element.tweet_id 
                        + "'>" + (user.retweets.includes(element.tweet_id) ? "UNRETWEET":"RETWEET") 
                        + "</div>"
                        + "<div class='favorite' data-fav='"
                            + element.tweet_id 
                        + "'>" + (user.favorites.includes(element.tweet_id) ? "UNFAVORITE":"FAVORITE")
                        +"</div>"
                    + "</div>"
            }
            $('#timeline').append(html)
        });
    }
    catch(err){
        console.error('Error: Timeline()', err)
    }
}
async function get_followers(user_id)
{

}
async function get_following(user_id)
{

}
async function get_user_info(user_id)
{

}
$(document).ready(()=>{

});

ipcRenderer.on('profile-info', (event,arg)={
    
})
const electron = require('electron')
const {ipcRenderer} = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
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
    console.log(user_id);
    try{
        const timeline_query = await fileToStr('sql/timeline.sql')
        const timeline_results = await query(timeline_query, [id,id,id,id]);
        var html = "";
        $('#timeline').html(html);
        console.log(timeline_results);
        console.log(user)
        timeline_results.forEach(element => {
            var delete_div = "<button class ='delete'   data-del =" + element.tweet_id + ">" + "DELETE" + "</button>";
            var fav_btn    = "<button class ='favorite' data-fav =" + element.tweet_id + ">" + (user.favorites.includes(element.tweet_id) ? "<i class='fas fa-heart favorited'></i>":"<i class='far fa-heart favorite'></i>") + "</button>"
            var rt_btn     = "<button class ='retweet'  data-rt  =" + element.tweet_id + ">" + (user.retweets.includes(element.tweet_id)  ? "<i class='fas fa-retweet retweeted'></i>" :"<i class='fas fa-retweet retweet'></i>" ) + "</button>"
            if(element.is_rt)
            {
                html = "<div class='tweet' data='"
                    + element.tweet_id 
                    + "'>"
                        + "<div class='retweeter'><i class='fas fa-retweet retweet'></i> "
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
        html += "<div class='follow' data-profile='"
                + element.user_id
                + "'>"
                    +"<div class='profile'><span class='user-name'>"
                    + element.name
                    + "</span>: @" 
                    + element.username 
                    + "</div>"
                    + "<div data-follow='"
                    + element.user_id
                    + "' class='to_follow'> <span class='text'>Follow</span>"
                    + "</div>"
                +"</div>"
                
    });
    $('#follow').html(html);
}
function launch_login()
{
    const loginPath =  path.join('file://', __dirname, 'html/login.html')
    let win = new BrowserWindow({frame: true, alwaysOnTop: true, /*width: 400, height: 200*/})
    win.on('close', ()=>{win = null})
    win.loadURL(loginPath)
    win.show()
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
            get_info(user.user_id).then((results)=>{
                user.favorites = results.favorite
                user.retweets = results.retweet
                console.log( user.favorites, user.retweets);
                
                get_timeline(user.user_id).then((timeline_results)=>{
                    setTweetAttr(user)
                });
            });
            find_new_followers(user_id).then((results)=>{
                $('.to_follow').click(function(event){
                    var data = parseInt($(this).attr('data-follow'));
                    console.log(data);
                    
                    follow(user_id, data).then((results)=>{
                        console.log(results);
                        console.log("USER_ID: ",user_id, "\t now follows: ", event.target.id);
                    })
                })
                $(".follow").on('click', function(event){
                    profileID = parseInt($(this).attr('data-profile'));
                    ipcRenderer.send('user-info', [user.user_id, profileID]);
                    window.location.replace(path.join(__dirname, "/html/profile.html"));
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
            setTweetAttr(user)
        });
    })
    $('#login').on('click',()=>{
        launch_login()
    })
    $('.profile').on('click', function(event){
        event.preventDefault()
        ipcRenderer.send('user-info', [user.user_id, user.user_id]);
        window.location.replace(path.join(__dirname, "/html/profile.html"));
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
        setTweetAttr(user)
    });
})

//WINDOW PROCESS
win.on('close', ()=>{

})
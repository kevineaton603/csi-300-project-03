const fs = require('fs')
const $ = require('jquery')
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter'
})
class User{
    constructor()
    {
        this.is_logged_in = false
        this.user_id = -1
        this.favorites = []
        this.retweets = []
        this.file = "user.json"
        login().then((results)=>{
            if(valid)
            {
                this.user_id = results;
                this.is_logged_in = true;
                get_info(this.user_id).then((results)=>{
                    this.favorites = results.favorites
                    this.retweets = results.retweets
                })
            }
        })
    }
}
async function login_async()
{
    const login = await fileToStr(path.join(__dirname, 'sql/login.sql'))
    const login_info = await fileToJSON(path.join(__dirname, 'user.json'))
    const validate_user = await query(login, [login_info['username'], login_info['password']])
    if(validate_user.length == 1)
    {
        return validate_user[0]['user_id']
    }
    else{
        return 0;
    }
    
}
async function get_info(user_id){
    try{
        rt_array = new Array("tweet_id", "retweet", "user_id", user_id)
        fav_array = new Array("tweet_id", "favorite", "user_id", user_id)
        const info_sql = await fileToStr(path.join(__dirname, 'sql/get_info.sql'))
        const favorite = await query(info_sql, fav_array)
        const retweet = await query(info_sql, rt_array)
        console.log(favorite, retweet);
        
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

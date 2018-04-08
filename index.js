const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter'
})
connection.connect();


var timeline = 'SELECT tweet.tweet_body, retweet.time_retweeted as time_posted, retweet.user_id FROM retweet INNER JOIN tweet ON tweet.tweet_id = retweet.tweet_id WHERE retweet.user_id IN (SELECT users.user_id FROM users WHERE users.user_id IN (SELECT followers.user_id FROM followers WHERE followers.follower_id = ?) ) UNION SELECT tweet.tweet_body, tweet.time_posted, users.user_id FROM users INNER JOIN tweet ON users.user_id = tweet.user_id WHERE tweet.user_id IN (SELECT users.user_id FROM users WHERE users.user_id IN ( SELECT followers.user_id FROM followers WHERE followers.follower_id = ?) ) ORDER BY time_posted;'

function query(sql, values=[])
{
    var data;
    connection.query({
        sql: timeline,
        values: values
        }, 
        function (error, results, fields) {
        if (error) throw error;
        data = results;
        console.log(results)
    });
}
query_result = query(timeline, [11,11]);

/*connection.query({
    sql: timeline,
    values: [11, 11]
    }, 
    function (error, results, fields) {
    if (error) throw error;
    console.log(results)
});*/

connection.end();
        
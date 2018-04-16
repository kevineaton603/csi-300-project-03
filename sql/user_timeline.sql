SELECT * FROM(
	SELECT 1,  t.tweet_body, r.time_retweeted AS time_posted, u.name, u2.name AS og_tweeter, t.tweet_id 
    FROM retweet AS r
    INNER JOIN tweet as t ON t.tweet_id = r.tweet_id
    INNER JOIN users AS u ON r.user_id = u.user_id 
    INNER JOIN users as u2 ON t.user_id = u2.user_id 
    WHERE t.user_id = ?

    UNION

    SELECT 0, tweet.tweet_body, tweet.time_posted, users.name, null, tweet.tweet_id
    FROM users
    INNER JOIN tweet
    ON users.user_id = tweet.user_id
    WHERE tweet.user_id = ?
) as timeline
ORDER BY timeline.time_posted DESC
SELECT users.user_id, users.username, users.name 
FROM users 
WHERE users.user_id NOT IN ( 
    SELECT users.user_id 
    FROM users 
    WHERE users.user_id IN ( 
        SELECT followers.user_id FROM followers WHERE followers.follower_id = ? 
        ) 
    )
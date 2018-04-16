-- CHECK FOLLOWING BY USERID
SELECT user_id, users.name
FROM users 
WHERE user_id IN (
	SELECT followers.??
	FROM followers
	WHERE ?? = ? -- follower_id
	);
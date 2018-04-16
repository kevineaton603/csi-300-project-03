SELECT users.user_id, users.name, users.username
FROM users
WHERE users.user_id IN (
	SELECT ??
	FROM followers
	WHERE ?? = ? -- user_id
    );
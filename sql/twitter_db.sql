-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2018 at 06:18 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

DROP DATABASE IF EXISTS `twitter`;
CREATE DATABASE `twitter`;
USE `twitter`;

--
-- Database: `twitter`
--

DROP DATABASE IF EXISTS twitter;
CREATE DATABASE twitter;
USE twitter;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `num_of_tweets` (IN `uid` INT(11))  BEGIN
    SELECT count(*) as num FROM(
        SELECT 1,  t.tweet_body, r.time_retweeted AS time_posted, u.name, u2.name AS og_tweeter, t.tweet_id 
        FROM retweet AS r
        INNER JOIN tweet as t ON t.tweet_id = r.tweet_id
        INNER JOIN users AS u ON r.user_id = u.user_id 
        INNER JOIN users as u2 ON t.user_id = u2.user_id 
        WHERE t.user_id = uid

        UNION

        SELECT 0, tweet.tweet_body, tweet.time_posted, users.name, null, tweet.tweet_id
        FROM users
        INNER JOIN tweet
        ON users.user_id = tweet.user_id
        WHERE tweet.user_id = uid
    ) as num;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `user_timeline` (IN `uid` INT(11))  BEGIN
	SELECT * FROM(
		SELECT 1,  t.tweet_body, r.time_retweeted AS time_posted, u.name, u2.name AS og_tweeter, t.tweet_id 
		FROM retweet AS r
		INNER JOIN tweet as t ON t.tweet_id = r.tweet_id
		INNER JOIN users AS u ON r.user_id = u.user_id 
		INNER JOIN users as u2 ON t.user_id = u2.user_id 
		WHERE t.user_id = uid

		UNION

		SELECT 0, tweet.tweet_body, tweet.time_posted, users.name, null, tweet.tweet_id
		FROM users
		INNER JOIN tweet
		ON users.user_id = tweet.user_id
		WHERE tweet.user_id = uid
	) as timeline
	ORDER BY timeline.time_posted DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `favorite_id` int(11) NOT NULL,
  `tweet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `favorite`
--

INSERT INTO `favorite` (`favorite_id`, `tweet_id`, `user_id`) VALUES
(1, 3, 17),
(2, 11, 12),
(3, 9, 8),
(4, 2, 4),
(5, 11, 7),
(6, 3, 12),
(7, 12, 15),
(8, 7, 10),
(9, 13, 13),
(10, 8, 10),
(11, 9, 9),
(12, 5, 10),
(13, 11, 14),
(14, 4, 11),
(15, 8, 4),
(16, 6, 6),
(17, 5, 4),
(18, 15, 13),
(19, 10, 14),
(20, 11, 7),
(30, 29, 21),
(38, 37, 21),
(39, 38, 21);

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `follower_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`follower_id`, `user_id`) VALUES
(3, 17),
(1, 8),
(9, 14),
(2, 9),
(7, 15),
(5, 13),
(6, 1),
(7, 11),
(1, 19),
(2, 15),
(19, 19),
(4, 5),
(4, 7),
(13, 15),
(11, 11),
(14, 10),
(12, 11),
(17, 11),
(15, 19),
(17, 7),
(4, 11),
(17, 16),
(10, 12),
(5, 14),
(10, 4),
(12, 1),
(15, 2),
(18, 14),
(10, 14),
(11, 6),
(11, 13),
(11, 19),
(11, 11),
(21, 21),
(21, 19),
(21, 17),
(21, 16),
(21, 10),
(21, 9),
(21, 9),
(21, 4),
(21, 6),
(21, 11);

-- --------------------------------------------------------

--
-- Table structure for table `retweet`
--

CREATE TABLE `retweet` (
  `retweet_id` int(11) NOT NULL,
  `tweet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_retweeted` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `retweet`
--

INSERT INTO `retweet` (`retweet_id`, `tweet_id`, `user_id`, `time_retweeted`) VALUES
(1, 5, 3, '2016-03-27 09:29:11'),
(2, 14, 13, '2014-09-16 21:35:10'),
(3, 1, 3, '2014-07-05 16:34:52'),
(4, 15, 20, '2016-02-02 02:15:25'),
(5, 8, 9, '2014-08-02 23:39:05'),
(6, 1, 1, '2014-05-04 21:35:46'),
(7, 15, 18, '2015-08-11 22:08:11'),
(8, 10, 7, '2014-09-16 07:00:10'),
(9, 3, 17, '2014-05-19 01:42:54'),
(10, 10, 8, '2015-06-10 20:40:37'),
(18, 37, 21, '2018-04-16 17:36:04'),
(19, 4, 21, '2018-04-16 17:37:21');

-- --------------------------------------------------------

--
-- Table structure for table `tweet`
--

CREATE TABLE `tweet` (
  `tweet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_posted` datetime NOT NULL,
  `tweet_body` varchar(140) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tweet`
--

INSERT INTO `tweet` (`tweet_id`, `user_id`, `time_posted`, `tweet_body`) VALUES
(1, 9, '2011-04-17 10:25:30', 'An old silent pond...'),
(2, 16, '2010-10-31 10:52:59', '\"A frog jumps into the pond\"'),
(3, 13, '2011-12-15 07:15:02', 'splash! Silence again.'),
(4, 15, '2010-12-13 16:42:48', 'Autumn moonlight'),
(5, 7, '2010-07-24 00:55:31', 'a worm digs silently'),
(6, 1, '2011-08-14 08:35:47', 'into the chestnut.'),
(7, 13, '2012-01-31 00:18:54', 'In the twilight rain'),
(8, 6, '2011-03-26 13:53:48', 'these brilliant-hued hibiscus -'),
(9, 6, '2011-08-02 02:38:51', 'A lovely sunset.'),
(10, 6, '2011-11-24 03:39:28', 'A summer river being crossed'),
(11, 8, '2010-05-28 00:27:20', 'how pleasing'),
(12, 3, '2011-12-30 20:24:54', 'with sandals in my hands!'),
(13, 13, '2010-06-13 18:49:05', 'Light of the moon'),
(14, 18, '2011-12-04 13:57:17', '\"Moves west, flowers\' shadows\"'),
(15, 6, '2011-12-14 02:25:46', 'Creep eastward.'),
(16, 11, '2018-04-09 19:18:24', 'oh hi mark'),
(17, 11, '2018-04-09 19:19:18', 'ello m8'),
(18, 11, '2018-04-09 19:32:23', 'whats good'),
(19, 11, '2018-04-10 00:13:14', '11'),
(20, 11, '2018-04-10 00:13:40', 'hello'),
(21, 11, '2018-04-10 11:41:07', 'hello there'),
(22, 11, '2018-04-10 11:41:20', 'What??'),
(23, 11, '2018-04-10 11:41:50', '\"well well well\" \'hi\''),
(24, 11, '2018-04-10 13:09:00', 'hi adam'),
(25, 11, '2018-04-10 13:35:53', 'fuck me'),
(26, 11, '2018-04-10 13:39:56', 'hi austin'),
(28, 21, '2018-04-11 13:44:33', 'I love Jen!!'),
(29, 21, '2018-04-11 13:45:00', 'I like big boi'),
(30, 21, '2018-04-12 11:44:43', 'hello'),
(31, 11, '2018-04-15 22:51:24', 'FRANK C. 2020'),
(32, 11, '2018-04-15 22:59:50', 'FRANK C. 2020'),
(33, 11, '2018-04-15 23:00:04', 'FRANK C. 2020'),
(34, 11, '2018-04-15 23:08:52', 'FRANK C. 2020'),
(35, 11, '2018-04-15 23:09:01', 'FRANK C. 2020'),
(37, 21, '2018-04-16 17:36:02', 'hi adam'),
(38, 21, '2018-04-17 13:50:12', 'hi walter'),
(39, 21, '2018-04-18 19:03:51', 'hi dave');

--
-- Triggers `tweet`
--
DELIMITER $$
CREATE TRIGGER `tweet_BEFORE_DELETE` BEFORE DELETE ON `tweet` FOR EACH ROW BEGIN
DELETE FROM favorite
	WHERE favorite.tweet_id = old.tweet_id;
DELETE FROM retweet
	WHERE retweet.tweet_id = old.tweet_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `username`, `password`) VALUES
(1, 'Camila Kane', 'ckane@gmail.com', 'camila.kane', '123456'),
(2, 'Arlean Isenberg', 'aIsenberg@gmail.com', 'arlean.isenberg', '123457'),
(3, 'Cinda Andrade', 'candrade@gmail.com', 'cinda.andrade', '123458'),
(4, 'Rosana Gaumer', 'rgaumer@gmail.com', 'rosana.gaumer', '123459'),
(5, 'Laurence Rieck', 'lrieck@gmail.com', 'laurence.rieck', '123460'),
(6, 'Concha Sunday', 'csunday@gmail.com', 'concha.sunday', '123461'),
(7, 'Bradford Hulen', 'bhulen@gmail.com', 'bradford.hulen', '123462'),
(8, 'Lani Friedlander', 'lfriedlander@gmail.com', 'lani.friedlander', '123463'),
(9, 'Kiley Mork', 'kmork@gmail.com', 'kiley.mork', '123464'),
(10, 'Venessa Dermody', 'vdermody@gmail.com', 'venessa.dermody', '123465'),
(11, 'Lachelle Rheaume', 'lrheaume@gmail.com', 'lachelle.rheaume', '123466'),
(12, 'Gretchen Choi', 'gchoi@gmail.com', 'gretchen.choi', '123467'),
(13, 'Paul Keirn', 'pkeirn@gmail.com', 'paul.keirn', '123468'),
(14, 'Esteban Capasso', 'ecapasso@gmail.com', 'esteban.capasso', '123469'),
(15, 'Edyth Loh', 'eloh@gmail.com', 'edyth.loh', '123470'),
(16, 'Gwendolyn Klump', 'gklump@gmail.com', 'gwendolyn.klump', '123471'),
(17, 'Melany Cooney', 'mcooney@gmail.com', 'melany.cooney', '123472'),
(18, 'Lonny Masten', 'lmasten@gmail.com', 'lonny.masten', '123473'),
(19, 'Adeline Davis', 'adavis@gmail.com', 'adeline.davis', '123474'),
(20, 'Yajaira Lorance', 'ylorance@gmail.com', 'yajaira.lorance', '123475'),
(21, 'kevin', 'kevin.eaton@mymail.champlain.edu', 'kevin.eaton', 'kevin');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `users_BEFORE_DELETE` BEFORE DELETE ON `users` FOR EACH ROW BEGIN
DELETE FROM retweet
	WHERE retweet.user_id = old.user_id;
DELETE FROM favorite
	WHERE favorite.user_id = old.user_id;
DELETE FROM tweet
	WHERE tweet.user_id = old.user_id;
DELETE FROM followers 
	WHERE followers.user_id = old.user_id;
DELETE FROM followers
	WHERE followers.follower_id = old.user_id;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`favorite_id`),
  ADD KEY `fav_tweet_id_idx` (`tweet_id`),
  ADD KEY `fav_user_id_idx` (`user_id`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `followers_user_id_idx` (`user_id`),
  ADD KEY `followers_follower_id_idx` (`follower_id`);

--
-- Indexes for table `retweet`
--
ALTER TABLE `retweet`
  ADD PRIMARY KEY (`retweet_id`),
  ADD KEY `rt_tweet_id_idx` (`tweet_id`),
  ADD KEY `rt_user_id_idx` (`user_id`);

--
-- Indexes for table `tweet`
--
ALTER TABLE `tweet`
  ADD PRIMARY KEY (`tweet_id`),
  ADD KEY `tweet_user_id_idx` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorite`
--
ALTER TABLE `favorite`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `retweet`
--
ALTER TABLE `retweet`
  MODIFY `retweet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `tweet`
--
ALTER TABLE `tweet`
  MODIFY `tweet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `fav_tweet_id` FOREIGN KEY (`tweet_id`) REFERENCES `tweet` (`tweet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fav_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_follower_id` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `followers_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `retweet`
--
ALTER TABLE `retweet`
  ADD CONSTRAINT `rt_tweet_id` FOREIGN KEY (`tweet_id`) REFERENCES `tweet` (`tweet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `rt_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tweet`
--
ALTER TABLE `tweet`
  ADD CONSTRAINT `tweet_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

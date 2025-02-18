CREATE TABLE `words` (
	`id` text NOT NULL,
	`word` text NOT NULL,
	`translation` text NOT NULL,
	`sentence` text NOT NULL,
	`category` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);

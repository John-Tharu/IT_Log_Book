CREATE TABLE `verify_email_token` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(8) NOT NULL,
	`expires_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verify_email_token_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `verify_email_token` ADD CONSTRAINT `verify_email_token_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;
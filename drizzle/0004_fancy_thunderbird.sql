CREATE TABLE `actions_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`log_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `actions_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `actions_table` ADD CONSTRAINT `actions_table_log_id_user_logs_id_fk` FOREIGN KEY (`log_id`) REFERENCES `user_logs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `actions_table` ADD CONSTRAINT `actions_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;
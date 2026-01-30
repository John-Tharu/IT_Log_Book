CREATE TABLE `user_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(255) NOT NULL,
	`time` varchar(255) NOT NULL,
	`issue_location` varchar(255) NOT NULL,
	`issue_description` varchar(255) NOT NULL,
	`action_taken` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_logs` ADD CONSTRAINT `user_logs_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;
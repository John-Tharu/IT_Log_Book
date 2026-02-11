CREATE TABLE `actions_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`log_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `actions_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(255) NOT NULL,
	`time` varchar(255) NOT NULL,
	`reported_by` varchar(255) NOT NULL,
	`issue_location` varchar(255) NOT NULL,
	`issue_description` varchar(255) NOT NULL,
	`action_taken` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`solved_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`pass` varchar(255) NOT NULL,
	`is_email_valid` boolean NOT NULL DEFAULT false,
	`role` varchar(255) NOT NULL DEFAULT 'User',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `actions_table` ADD CONSTRAINT `actions_table_log_id_user_logs_id_fk` FOREIGN KEY (`log_id`) REFERENCES `user_logs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `actions_table` ADD CONSTRAINT `actions_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_logs` ADD CONSTRAINT `user_logs_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_logs` ADD CONSTRAINT `user_logs_solved_by_users_table_id_fk` FOREIGN KEY (`solved_by`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;
CREATE TABLE `users_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`pass` varchar(255) NOT NULL,
	`isEmailValid` varchar(255) NOT NULL DEFAULT 'false',
	`role` varchar(255) NOT NULL DEFAULT 'User',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);

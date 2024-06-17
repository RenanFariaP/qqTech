create table profiles (
	id SERIAL primary key,
	name varchar(255) unique not null,
	description varchar(255)
);

create table users (
	id SERIAL primary key,
	username varchar(255) not null,
	email varchar(255) unique not null,
	registration varchar(255) unique not null,
	password varchar(255) not null,
	profile_id INT,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

create table modules(
	id SERIAL primary key,
	name varchar(255) unique not null,
	description varchar(255),
	TAG varchar(5) unique not null,
	profile_id INT,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

create table transactions(
	id SERIAL primary key,
	name varchar(255) unique not null,
	description varchar(255),
	TAG varchar(5) unique not null,
	module_id INT,
    FOREIGN KEY (module_id) REFERENCES modules(id)
);

create table methods(
	id SERIAL primary key,
	name varchar(255) unique not null,
	description varchar(255),
	TAG varchar(5) unique not null,
	module_id INT,
    FOREIGN KEY (module_id) REFERENCES modules(id)
);
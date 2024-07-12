USE `movies`;

drop table if exists users;
create table users
(
    id        int primary key auto_increment not null,
    # required
    email     text                           not null,
    password  text                           not null,
    # profile none required
    firstName text,
    lastName  text,
    dob       text,
    address   text
);

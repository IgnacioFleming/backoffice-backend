drop database if exists business_manager_db;
CREATE DATABASE business_manager_db;

USE business_manager_db;

CREATE TABLE products (id int primary key auto_increment, name varchar(50) not null, price float not null default 0, cost float not null default 0,
 stock int not null default 0, category varchar(50) not null, description text , thumbnail text, thumbnail_public_id text , deleted_at datetime );

create table costumers(id int primary key auto_increment, name varchar(50) not null , account_number int not null , logo text, logo_public_id text, deleted_at datetime);

create table sales (id int primary key auto_increment, costumer_id int not null,
 items_quantity int not null, total_amount float not null, sale_cost float not null default 0, sale_date datetime not null default current_timestamp,
 constraint fk_sales_costumers foreign key (costumer_id) references costumers (id));

create table orders (id int primary key auto_increment, sale_id int not null, product_id int not null,
 quantity int not null, amount float not null, order_cost float not null default 0,
 constraint fk_orders_sales foreign key (sale_id) references sales (id) on delete cascade on update cascade,
 constraint fk_orders_products foreign key (product_id) references products (id) on delete cascade on update cascade);


 
 create table users(id int primary key auto_increment, username varchar(30) unique not null, password varchar(100) not null, email varchar(100) unique not null, first_name varchar(63) not null,
last_name varchar(63) not null, role varchar(30) not null default 'reader', is_enabled bool not null default 0, signup_date datetime not null default current_timestamp	);


create table balances(id int auto_increment primary	key, costumer_id int not null, balance_amount float not null,
 constraint fk_balances_costumers foreign key (costumer_id) references costumers(id) on delete cascade on update cascade);
 
 create table payments (id int auto_increment primary key, costumer_id int not null, payment_amount float not null check (payment_amount <0),
 payment_date datetime not null default current_timestamp,
 constraint fk_payments_costumers foreign key (costumer_id) references costumers(id) on delete cascade on update cascade); 
 
DELIMITER //
CREATE TRIGGER unique_costumer_account BEFORE INSERT ON costumers
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NULL THEN
        IF EXISTS (SELECT 1 FROM costumers WHERE account_number = NEW.account_number AND deleted_at IS NULL) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate account number with NULL deleted_at not allowed';
        END IF;
        IF EXISTS (SELECT 1 FROM costumers WHERE name = NEW.name AND deleted_at IS NULL)THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate name with NULL deleted_at not allowed';
        END IF;
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER unique_product_name BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NULL THEN
        IF EXISTS (SELECT 1 FROM products WHERE name = NEW.name AND deleted_at IS NULL) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate name with NULL deleted_at not allowed';
        END IF;
    END IF;
END//
DELIMITER ;


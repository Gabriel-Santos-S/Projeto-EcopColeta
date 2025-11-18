use reciclame;


CREATE USER 'user'@'%' IDENTIFIED BY '1234';

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON reciclame.* TO 'user'@'%';


-- Ver os privilégios
SHOW GRANTS FOR 'user'@'%';
use reciclame;

-- Criar o Trigger para gerar ID único automaticamente
DELIMITER //

CREATE TRIGGER before_insert_grupos_usuarios
BEFORE INSERT ON grupos_usuarios
FOR EACH ROW
BEGIN
    IF NEW.ID IS NULL THEN
        SET NEW.ID = UUID();
    END IF;
END//

DELIMITER ;


SHOW TRIGGERS;


INSERT INTO grupos_usuarios (nivel_acesso, senha, cpf) VALUES 
('adm', '000', '00000000000'),
('usuario', '111', '11111111111'),
('externo', '222', '22222222222');
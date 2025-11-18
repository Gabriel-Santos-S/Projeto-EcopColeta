use reciclame;

-- para a criação de ponto de coleta e interliga os tipos aceitos
DELIMITER $$

CREATE PROCEDURE cadastrar_ponto_com_tipo(
    IN p_localizacao VARCHAR(255),
    IN p_capacidade INT,
    IN p_tipo INT
)
BEGIN
    DECLARE novo_id INT;

    -- 1. Cadastrar o ponto de coleta
    INSERT INTO ponto_coleta (localizacao, capacidade)
    VALUES (p_localizacao, p_capacidade);

    -- Pega o id recém gerado
    SET novo_id = LAST_INSERT_ID();

    -- 2. Cadastrar o tipo aceito
    INSERT INTO ponto_coleta_aceita (id_ponto, id_tipo)
    VALUES (novo_id, p_tipo);

END$$

DELIMITER ;



-- Para receber coleta
DELIMITER $$

CREATE PROCEDURE cadastrar_residuo_e_finalizar_coleta(
    IN p_id_tipo INT,
    IN p_peso DECIMAL(10,3),
    IN p_id_coop INT,
    IN p_cnpj_empresa CHAR(14),
    IN p_id_coleta INT,
    IN p_peso_coletado DECIMAL(10,3)
)
BEGIN
    DECLARE novo_residuo_id INT;

    -- 1. Inserir o resíduo
    INSERT INTO residuo (id_tipo, peso, id_coop, cnpj_empresa)
    VALUES (p_id_tipo, p_peso, p_id_coop, p_cnpj_empresa);

    SET novo_residuo_id = LAST_INSERT_ID();

    -- 2. Registrar relação coleta-resíduo
    INSERT INTO coleta_residuo (id_coleta, id_residuo, peso_coletado)
    VALUES (p_id_coleta, novo_residuo_id, p_peso_coletado);

    -- 3. Atualizar status da coleta para "concluida"
    UPDATE coleta
    SET status = 'concluida'
    WHERE id_coleta = p_id_coleta;
END$$

DELIMITER ;




-- Verificar todos os funtions e procedures
SELECT * FROM INFORMATION_SCHEMA.ROUTINES;
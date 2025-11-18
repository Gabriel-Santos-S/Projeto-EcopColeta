use reciclame;

-- Para buscar as coletas mais os residuos
CREATE VIEW view_coletas_pessoa AS
SELECT 
    c.id_coleta,
    c.data,
    c.status,
    p.cpf,
    p.nome AS nome_pessoa,
    pc.localizacao,
    
    -- Resíduos da coleta
    (SELECT GROUP_CONCAT(DISTINCT tr.nome SEPARATOR ', ')
     FROM coleta_residuo cr
     JOIN residuo r ON cr.id_residuo = r.id_residuo  
     JOIN tipo_residuo tr ON r.id_tipo = tr.id_tipo
     WHERE cr.id_coleta = c.id_coleta) AS tipos_residuos,
    
    -- Peso total da coleta
    (SELECT COALESCE(SUM(peso_coletado * quantidade), 0)
     FROM coleta_residuo WHERE id_coleta = c.id_coleta) AS peso_total
    
FROM coleta c
INNER JOIN pessoa p ON c.cpf = p.cpf
INNER JOIN ponto_coleta pc ON c.id_ponto = pc.id_ponto;


-- vizualizando o view

SELECT * FROM view_coletas_pessoa 
WHERE cpf = '22222222222' 
ORDER BY data DESC;

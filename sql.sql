CREATE DATABASE bd_files;
USE bd_files;

CREATE TABLE arquivo(
    id_arquivo INT NOT NULL AUTO_INCREMENT,
    nome_arquivo VARCHAR(100),
    download_arquivo mediumblob,
    tipo VARCHAR(100),
    PRIMARY KEY(id_arquivo)
)
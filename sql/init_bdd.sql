CREATE DATABASE IF NOT EXISTS portail_iut
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portail_iut;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemple d'utilisateur : login = etu, mot de passe = iut (hashé)
INSERT INTO users (username, password, nom, prenom, email)
VALUES (
    'etu',
    'password',
    'Etudiant',
    'Test',
    'etu@example.com'
);
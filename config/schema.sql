-- =========================
-- Reset de la base
-- =========================

DROP DATABASE IF EXISTS fmabattage;
CREATE DATABASE fmabattage;
USE fmabattage;

-- =========================
-- Table clients
-- =========================

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(500) NOT NULL,
    tel VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    adresse VARCHAR(255) NOT NULL,
    code_postal VARCHAR (5) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- Table devis 
-- =========================

CREATE TABLE devis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    date_devis DATE NOT NULL,
    date_echeance DATE,
    frais_deplacement DECIMAL(10,2) DEFAULT 0,
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('en_attente', 'accepte', 'refuse') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);


-- =========================
-- Table devis_items
-- =========================

CREATE TABLE devis_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    devis_id INT NOT NULL,
    description TEXT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    total_ligne DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE
);

-- =========================
-- Table Factures
-- =========================

CREATE TABLE factures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    devis_id INT NOT NULL,
    client_id INT NOT NULL,
    date_facture DATE NOT NULL,
    frais_deplacement_final DECIMAL(10,2) DEFAULT 0,
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('en_attente', 'payee', 'partielle') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- =========================
-- Table Paiements
-- =========================

CREATE TABLE paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facture_id INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    date_paiement DATE NOT NULL,
    mode_paiement ENUM('especes', 'cheque', 'virement', 'autre') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
);

-- =========================
-- Table Dépenses
-- =========================

CREATE TABLE depenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_depenses DATE NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    type ENUM("frais_carburant", "frais_materiel", "charges", "autre") NOT NULL,
    description VARCHAR(250),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)
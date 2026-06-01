# FM Abattage - Application de gestion

Application web de gestion développée pour l'entreprise FM Abattage afin de simplifier le suivi administratif quotidien.

## Fonctionnalités

### Gestion des clients

* Création et modification des fiches clients
* Consultation de la liste des clients

### Gestion des devis

* Création de devis
* Modification des devis
* Génération PDF
* Gestion des statuts :

  * En attente
  * Accepté
  * Refusé
  * Archivé

### Gestion des factures

* Création de factures à partir des devis
* Génération PDF
* Suivi du paiement des factures

### Gestion des paiements

* Enregistrement des paiements
* Gestion des paiements partiels
* Calcul automatique du reste dû

### Gestion des relances

* Création des relances clients
* Historique des relances
* Gestion des mises en demeure
* Génération PDF

### Gestion des dépenses

* Enregistrement des dépenses de l'entreprise
* Suivi financier

### Tableau de bord

* Chiffre d'affaires
* Montant encaissé
* Factures en attente
* Dépenses
* Résultat réel (paiements reçus - dépenses)

## Technologies utilisées

### Front-end

* HTML5
* CSS3
* Bootstrap 5
* JavaScript

### Back-end

* Node.js
* Express

### Base de données

* MySQL
* Sequelize ORM

### Hébergement

* Render
* Aiven MySQL

## Installation

### Cloner le projet

```bash
git clone https://github.com/Lydie-pixel/FmAbattage-Management-app.git
```

### Installer les dépendances

```bash
npm install
```

### Configurer les variables d'environnement

Créer un fichier `.env` :

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
SESSION_SECRET=
```

### Lancer le projet

```bash
npm start
```

## Auteur

Projet développé par Lydie dans le cadre de la gestion administrative de l'entreprise FM Abattage.

## État du projet

Projet actuellement utilisé en conditions réelles et en cours d'amélioration continue selon les besoins des utilisateurs.

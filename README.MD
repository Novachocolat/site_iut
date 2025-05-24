# Portail Étudiant IUT

Ce site web sert de portail pour les étudiants de l'IUT du Littoral Côte d'Opale. Il centralise les liens utiles, les emplois du temps, les règlements, et d'autres ressources essentielles.

## Fonctionnalités

- **Recherche intelligente** : Filtre instantanément les cartes et liens du portail.
- **Thème clair/sombre** : Bascule entre les modes via le bouton en haut à droite.
- **Accès rapide** :
  - Emplois du temps par département (GEA, TC, INFO, GEII, BIO, GIM, GTE, GACO)
  - Outils ULCO : Webmail, Moodle, Compte LDAP, JrCan.dev, Notes, WIMS
  - Règlements et MCCC (PDF)
- **Easter egg** : Tape "rickroll" dans la barre de recherche 😉

## Structure du projet

```
index.html
notes.html
css/
  style_index.css
  style_notes.css
js/
  script_index.js
  script_notes.js
img/
  logo_iut.png
pdf/
  reglements/
    ... (PDFs des règlements et MCCC)
  rapports/
    ... (Rapports Parcoursup)
```

## Utilisation

1. Ouvre `index.html` dans ton navigateur.
2. Utilise la barre de recherche ou navigue via les cartes.
3. Clique sur les liens pour accéder aux ressources.

## Personnalisation

- Modifie les liens ou ajoute des sections dans `index.html`.
- Change le style dans `css/style_index.css`.
- Ajoute des fonctionnalités dans `js/script_index.js`.

## Auteur

Lysandre PACE--BOULNOIS / Nova

---

> Ce projet est affilié officiellement à l'IUT de Calais et pas (encore) pour l'ULCO.


**============================================**
# Initialisation du projet
## Construction et démarrage des containers
```docker compose build --no-cache && docker compose up -d```
## Suppression des containers
```docker compose down --remove-orphans```
# Projet Groupomania

Création d'une app de réseau de discussion d'entreprise visant à consolider l'esprit d'équipe et améliorer les échanges professionnels et sociaux entre les différents départements.


## Installation

1. Clonez le projet dans un dossier 
   
2. Dans les dossiers /backend et frontend/groupomania exécutez :
```bash
npm i
```
3. Dans le dossier /backend , créez un fichier .env et remplissez le avec les variables suivantes:
   
   ```python
    #Votre lien vers votre base de données MongoDb
    MY_MONGO_DB_LINK = "Lien MongoDB"

    # L'adresse URL d'origine côté qui sera autorisée pour les requêtes (celle du frontend) 
    API_URL= 'http://localhost:3001'

    # Doit contenir une chaîe de caractères afin de protéger l'API
    SECRET_TOKEN= " une chaîne de caractère secrète"

    #Le port que vous souhaitez utiliser pour écouter le serveur (3000 par défaut)
    PORT =3000
   ```


## Démarrage 

Ouvrez votre terminal en précisant le chemin vers le dossier /backend lancez le serveur avec :

```bash
npm start
```
Faîtes de même vers le dossier /frontend/groupomania.

```bash
npm start
```

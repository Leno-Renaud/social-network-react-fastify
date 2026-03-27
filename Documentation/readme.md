readme pour expliquer les bases du projet:


- découpage en un frontend, et un backend (dossiers séparés)

- pour démarrer le backend=> il faut installer node.js, puis cd backend, puis npm run dev

- pour frontend, on ouvre une deuxième terminal, puis cd frontend, npm run dev



dans le frontend react:
- un dossier api qui contient les requetes qu'on va faire pour accéder au backend et qui contienne les réponses du serveur

- un dossier components qui contient les différents composants, ex si on fait un système de post comme insta, ça sera un composant. Pour chaque composant on crée un dossier, un fichier .jsx pour le composant et pour le rendu graphique un fichier {composant}.module.scss (regarder exemple pour la structure)

- le dossier contexte, un peu dur à comprendre mais permet d'avoir des variables et des fonctions globales qu'on peut accéder depuis n'importe ou, par exemple le nom d'utilisateur connecté, la fonction login et logout

- ensuite on a le fichier app.jsx, qui contient une route pour chaque page qu'on veut accéder (on pourra avoir une page messagerie, une page post etc...) global.scss contient le style global de la page


et voilà les princpaux fichiers à connaitre !

## pour ouvrir l'app sur son téléphone
1. Trouver l'adresse IP de ton PC
trouve ton adresse ipv4 dans carte réseau sans fil sur windows

2. Autoriser l'accès sur ton PC

Pour le Front (Vite) :
Dans ton package.json, modifie la ligne de démarrage :
- "dev": "vite --host"
(Relance ton npm run dev. Tu verras apparaître dans le terminal une ligne "Network: http://ip:5173")

dans .env du front:
- VITE_BACKEND_URL=http://localhost:8888.

Pour le Back (Fastify) :
Dans ton fichier server.js (ou index.js), modifie le listen :

- server.listen({ port: 8888, host: '0.0.0.0' }, (err, addr) => { ... })
  
Le 0.0.0.0 dit à Fastify d'accepter les connexions venant de n'importe quelle adresse IP du réseau.

3. Accéder depuis le téléphone
Assure-toi que ton téléphone est toujours en partage de connexion.

Tape l'adresse IP de ton PC suivie du port du front-end. Exemple :
http://192.168.1.15:5173 (moi c'était une adresse en 10.36... par exemple)

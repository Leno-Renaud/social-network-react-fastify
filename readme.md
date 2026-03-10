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
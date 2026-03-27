# Projet React + Fastify

Ce projet est séparé en 2 parties :
- frontend : application React (Vite)
- backend : API Fastify + Socket.IO

## Démarrage local (ordinateur)

Prérequis : Node.js installé.

1. Lancer le backend

	cd backend
	npm install
	npm run dev

2. Lancer le frontend dans un autre terminal

	cd frontend
	npm install
	npm run dev

## Tutoriel complet : ouvrir le site sur ton téléphone (même Wi-Fi)

Objectif : ouvrir le frontend depuis le téléphone et laisser le frontend joindre le backend de ton Mac.

### 1) Vérifier le réseau

- Le téléphone et le Mac doivent être connectés au même réseau Wi-Fi.
- Éviter les réseaux invités avec isolation des clients.

### 2) Trouver l'IP locale du Mac

Sur macOS, dans un terminal :

	ipconfig getifaddr en0

Si rien ne sort, essaie :

	ipconfig getifaddr en1

Exemple d'IP obtenue : 192.168.1.15

### 3) Rendre le backend accessible sur le réseau

Dans backend/server.js, remplace le listen actuel par :

	server.listen({ port: process.env.SERVER_PORT, host: '0.0.0.0' }, (err, addr) => {
		 if (err) {
			  console.log('Server Error', err)
			  process.exit(1)
		 }
		 console.log(`Server runs on ${addr}`)
	})

Le host 0.0.0.0 permet les connexions depuis d'autres appareils du réseau.

### 4) Configurer l'URL backend côté frontend

Dans frontend/.env, remplace localhost par l'IP du Mac :

	VITE_BACKEND_URL="http://192.168.1.15:8888"

Important : localhost sur le téléphone pointe vers le téléphone lui-même, pas vers ton Mac.

### 5) Exposer Vite sur le réseau

Option recommandée (sans modifier package.json), dans frontend :

	npm run dev -- --host 0.0.0.0 --port 5173

Option permanente (dans frontend/package.json) :

	"dev": "vite --host 0.0.0.0 --port 5173"

### 6) Relancer les serveurs

Après les changements :
- arrêter le backend et le frontend
- relancer backend : npm run dev
- relancer frontend : npm run dev -- --host 0.0.0.0 --port 5173

### 7) Ouvrir depuis le téléphone

Dans le navigateur du téléphone :

	http://192.168.1.15:5173

Remplace l'IP par celle de ton Mac.

## Dépannage rapide

1. Le site ne charge pas
- Vérifie que le terminal Vite affiche une URL Network en 192.168.x.x:5173.
- Vérifie que le téléphone est bien sur le même Wi-Fi.

2. Le frontend s'ouvre mais les données ne chargent pas
- Vérifie frontend/.env : VITE_BACKEND_URL doit être l'IP du Mac, pas localhost.
- Vérifie backend/server.js : host doit être 0.0.0.0.
- Vérifie que le backend tourne bien sur le port 8888.

3. Toujours bloqué
- Autorise Node.js dans le pare-feu macOS (Réglages Système > Réseau > Pare-feu).
- Redémarre les deux serveurs après chaque modif de .env.

## Structure rapide du projet

frontend/src :
- Api : appels HTTP vers le backend
- Components : composants React + styles module.scss
- Context : état global (auth, etc.)
- App.jsx : routes/pages

backend :
- controllers/services/routes : logique API
- plugins : postgres, jwt, cors, socket
- server.js : bootstrap du serveur Fastify

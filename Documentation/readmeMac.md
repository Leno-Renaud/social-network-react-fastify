### 1) Trouver l'IP locale du Mac

Sur macOS, dans un terminal :

	ipconfig getifaddr en0

### 2) Configurer l'URL backend côté frontend

Dans frontend/.env, remplace localhost par l'IP du Mac :

	VITE_BACKEND_URL="http://192.168.1.15:8888"


### 3) Exposer Vite sur le réseau
- npm run server

### 4) Ouvrir depuis le téléphone

Dans le navigateur du téléphone :

	http://192.168.1.15:5173

Remplace l'IP par celle de ton Mac.
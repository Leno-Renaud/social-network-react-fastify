import React from 'react';
// Attention à bien mettre le bon chemin vers ton composant !
// Si Home.jsx est dans /Pages et Historique dans /Components/HistoriqueEvenements :
import HistoriqueEvenements from '../Components/HistoriqueEvenements/HistoriqueEvenements'; 

export default function Home() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Bienvenue sur le réseau social du Campus !</h1>
            
            {/* On injecte notre composant de test juste ici */}
            <HistoriqueEvenements />
            
        </div>
    );
}
//Exemple pour un composant nommé Composant
//import Composant from '../Components/Composant/Composant';
//import HistoriqueEvenements from '../Components/HistoriqueEvenements/HistoriqueEvenements';
//import CreateButton from '../Components/CreateEvent/CreateButton';
import CreateButton from '../Components/CreateButton/CreateButton';
import styles from './Home.module.scss';

export default function Home(){
    //Insérer ici pour tester des composants. 
    // exemple: return(<Composant/>)
    return(
        <div className={styles.home}>
            {/* <CreateButton /> */}
        </div>
    )
}
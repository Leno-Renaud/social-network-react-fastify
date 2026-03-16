//Exemple pour un composant nommé Composant
//import Composant from '../Components/Composant/Composant';
import CreateEvent from '../Components/CreateEvent/CreateEvent';
import SearchEvents from '../Components/SearchEvents/SearchEvents';

export default function Home(){
    //Insérer ici pour tester des composants. 
    // exemple: return(<Composant/>)
    return(
        <div>
            <CreateEvent/>
        </div>
    )
}
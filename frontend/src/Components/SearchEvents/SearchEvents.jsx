export default function SearchEvents(){
    return(
        <div>
            <form>
            <label>Type d'évènement :</label>
            <select>
                <option value="">Choisir...</option>
                <option value="soirée">Soirée</option>
                <option value="concert">Concert</option>
                <option value="sport">Sport</option>
            </select>

            <br />

            <label>Date :</label>
            <input type="date"/>

            <br />

            <button type="submit">Créer l'évènement</button>
            </form>
        </div>
    )
}

import React, { useState } from 'react';
import styles from "./CreateEvent.module.scss"
import CreateEvent from './CreateEvent';

export default function CreateButton() {
    const [createForm, onCreate] = useState(false);
    return (
        <div>
            {!createForm && <button className={styles.CreateButton} onClick={() => onCreate(true)}>+</button>}
            {createForm && <CreateEvent onCreate={onCreate}/>}
        </div>
    );
}
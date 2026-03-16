// un bouton + qui ouvre un formulaire pour créer un événement
import React, { useState } from 'react';
import styles from "./CreateEvent.module.scss"

export default function CreateEvent({ onCreate }) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [localization, setLocalization] = useState('');

    }
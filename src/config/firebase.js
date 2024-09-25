import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configura tu objeto de configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIrQIBNxwDtx1ZPzEmZnOIlBONUeCtReg",
    authDomain: "primerparcial-347021.firebaseapp.com",
    databaseURL: "https://primerparcial-347021-default-rtdb.firebaseio.com",
    projectId: "primerparcial-347021",
    storageBucket: "primerparcial-347021.appspot.com",
    messagingSenderId: "422014919648",
    appId: "1:422014919648:web:112edd02a40cf1775fc185",
    measurementId: "G-ZFRS2BLRKF"
};

// Inicializa Firebase con tu configuración
const firebaseApp = initializeApp(firebaseConfig);

// Obtiene la instancia de Firebase Database
export const db = getDatabase(firebaseApp);

const URL = import.meta.env.VITE_API_ROUTE;
const URL_AUTH = import.meta.env.VITE_API_ROUTE_AUTH;
const URL_CLASS = import.meta.env.VITE_API_ROUTE_CLASS;
import { useSessionStore } from '@/stores/sessionStore';

  export async function callPostProf(profesor) {
    // const formProfesor = new FormData();
  
    // formProfesor.append('nom', profesor.nom);
    // formProfesor.append('cognoms', profesor.cognoms);
    // formProfesor.append('email', profesor.email);
    // formProfesor.append('contrassenya', profesor.contrassenya);
   
    const response = await fetch(`${URL}/registre`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profesor)
    });
  
    // console.log(formProfesor);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al registrar el profesor: ${errorText}`);
    }
    
    const nuevoProfesor = await response.json();
    return nuevoProfesor;
  };
  

  export async function callGetClasses() {
    try {
      const response = await fetch(`${URL}/classes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Clases obtenidas:", data);
  
      return data; 
    } catch (error) {
      console.error("Error en Communication Manager:", error.message);
      throw error;
    }
  }
  
  export async function callGetProf(email,password) {
    try {
      const response = await fetch(`${URL_AUTH}/auth?email=${email}&contrassenya=${password}`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
    
  
      return data;
    } catch (error) {
      console.error("Error en Communication Manager:", error);
      throw error;
    }
  }

  export async function callFetchClasses(course) {
    try {
      const sessionStore = useSessionStore();
      const sessionId = sessionStore.sessionId; 
      const userId = sessionStore.userId
      if (!sessionId || !userId) {
        throw new Error('No hay sessionId o userId almacenado');
    }

    const response = await fetch(`${URL_CLASS}/classes/${course}?sessionId=${sessionId}&userId=${userId}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener datos de clases: ${errorText}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error en Communication Manager:", error);
      throw error;
    }
  }
  export async function callAddClass(classeData) {
    try {
        const sessionStore = useSessionStore();
        const sessionId = sessionStore.sessionId;
        const userId = sessionStore.userId;

        if (!sessionId || !userId) {
            throw new Error("No hay sessionId o userId almacenado");
        }

        const response = await fetch(`${URL_CLASS}/classes?sessionId=${sessionId}&userId=${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(classeData), 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al agregar clase: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en callAddClass:", error);
        throw error;
    }
}

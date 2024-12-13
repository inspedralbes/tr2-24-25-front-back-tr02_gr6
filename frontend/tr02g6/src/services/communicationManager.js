
import { useAuthStore } from "@/stores/userauth";

const URL = import.meta.env.VITE_API_ROUTE;
const URL_AUTH = import.meta.env.VITE_API_ROUTE_AUTH;
const URL_CLASS = import.meta.env.VITE_API_ROUTE_CLASS;
const URL_FORMULARI = import.meta.env.VITE_API_ROUTE_FORMULARI;
import { useSessionStore } from '@/stores/sessionStore';
const authStore = useAuthStore();

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
  
  /*export async function callGetProf(email,password) {
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
  }*/

  export async function callFetchClasses(course) {
    try {
      const sessionStore = useSessionStore();
      const sessionId = sessionStore.sessionId; 
  
      if (!sessionId) {
        throw new Error('No hay sessionId almacenado');
      }
  
      const response = await fetch(`${URL_CLASS}/classes/${course}?sessionId=${sessionId}`);
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
  
      if (!sessionId) {
        throw new Error('No hay sessionId almacenado');
      }
  
      const response = await fetch(`${URL_CLASS}/classes?sessionId=${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      console.error("Error en Communication Manager:", error);
      throw error;
    }
  }
  
/*export async function callGetClasses() {
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
}*/

export async function callGetProf(email, password) {
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
export async function getAlumnes() {
  const sessionStore = useSessionStore();
      const sessionId = sessionStore.sessionId; 
  const alumnes = await fetch(`${URL_FORMULARI}/alumnes?sessionId=${sessionId}`);
  try {
    const llista_alumnes = await alumnes.json();
    return llista_alumnes
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}


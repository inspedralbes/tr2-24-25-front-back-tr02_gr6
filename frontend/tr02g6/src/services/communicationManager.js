
//import { useAuthStore } from "@/stores/userauth";

const URL_AUTH = import.meta.env.VITE_API_ROUTE_AUTH;
const URL = import.meta.env.VITE_API_ROUTE;
import { useSessionStore } from '@/stores/sessionStore';
const sessionStore = useSessionStore();
const sessionId = sessionStore.sessionId;
const userId = sessionStore.userId;


export async function callPostProf(profesor) {
  // const formProfesor = new FormData();
  console.log(profesor);

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
    if (!sessionId || !userId) {
      throw new Error('No hay sessionId o userId almacenado');
    }

    const response = await fetch(`${URL}/classes/${course}?sessionId=${sessionId}&userId=${userId}`);
    console.log(response)
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
export async function callAddClass(email,classeData) {
  try {
    const sessionStore = useSessionStore();
    const sessionId = sessionStore.sessionId;
    const userId = sessionStore.userId;
console.log(email)
    if (!sessionId || !userId) {
      throw new Error("No hay sessionId o userId almacenado");
    }

    const response = await fetch(`${URL}/classes?email=${email}&sessionId=${sessionId}&userId=${userId}`, {
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

export async function postResultats(formulari) {
  try {
    const sessionStore = useSessionStore();
    const sessionId = sessionStore.sessionId;
    const userId = sessionStore.userId;

    if (!sessionId || !userId) {
      throw new Error("No hay sessionId o userId almacenado");
    }

    const response = await fetch(`${URL}/formulari?sessionId=${sessionId}&userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formulari),
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

export async function callGetClasseFormaPart(email) {
  console.log(email)
  try {
    const response = await fetch(`${URL}/classeForma?email=${email}&sessionId=${sessionId}&userId=${userId}`);
    console.log(response)
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

export async function getClasse(email) {
  try {
    const response = await fetch(`${URL}/classe?email=${email}&sessionId=${sessionId}&userId=${userId}`);
    console.log(response)
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

export async function callPutClass(email, codi_classe) {
  console.log(codi_classe)
  console.log(email)
  try {
    const response = await fetch(`${URL}/afegirClasse?codi_classe=${codi_classe}&email=${email}&sessionId=${sessionId}&userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, codi_classe }),
    });

    console.log(response)
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


export async function getAlumnes(email) {
  console.log(sessionId);
  console.log(userId);
  const alumnes = await fetch(`${URL}/alumnesClasse?email=${email}&sessionId=${sessionId}&userId=${userId}`);
  try {
    const llista_alumnes = await alumnes.json();
    return llista_alumnes
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}

export async function getTutor(id_classe) {
  const tutors = await fetch(`${URL}/tutor?id_classe=${id_classe}&sessionId=${sessionId}&userId=${userId}`);
  try {
    const llista_tutors = await tutors.json();
    return llista_tutors
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}

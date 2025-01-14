
//import { useAuthStore } from "@/stores/userauth";

const URL_AUTH = import.meta.env.VITE_API_ROUTE_AUTH;
const URL = import.meta.env.VITE_API_ROUTE;
const URL_SOCKET = import.meta.env.VITE_API_ROUTE_SOCKET;
import { useSessionStore } from '@/stores/sessionStore';
import { io } from 'socket.io-client';
const sessionStore = useSessionStore();
const sessionId = sessionStore.sessionId;
const userId = sessionStore.userId;
import { useRouter } from 'vue-router';
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
export async function redirect(){
  const router = useRouter();
  if (!sessionId) {
    console.error("No session ID available.");
    router.push("/")
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

export async function getProcessData(id_classe) {
 console.log("ID DE ÑA CÑASE MI LOKA 009 TK #BEFFA",id_classe)
  try {
    if (!sessionId || !userId) {
      throw new Error('No hay sessionId o userId almacenado');
    }

    const response = await fetch(`${URL}/process/?id_classe=${id_classe}&sessionId=${sessionId}&userId=${userId}`);
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

export async function deleteAlumne(id_alumne) {
  console.log(id_alumne)
  try {
      const response = await fetch(`${URL}/alumnes?id_alumne=${id_alumne}&sessionId=${sessionId}&userId=${userId}`, {
          method: "DELETE", 
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar alumno: ${errorText}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error en deleteAlumne:", error);
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

export async function getResultats(id_classe) {
  try {
    console.log("ID QJAAJSJH",id_classe)
    const response = await fetch(`${URL}/resultats?id_classe=${id_classe}&sessionId=${sessionId}&userId=${userId}`);
    const data = await response.json();
    console.log("Datos recibidos:", data);
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
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error en Communication Manager:", error);
    throw error;
  }
}

export async function getFormulariRespost(email) {
  try {
    const response = await fetch(`${URL}/formulariRespost?email=${email}&sessionId=${sessionId}&userId=${userId}`);
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

export async function postResultats(id_classe, email, formulari) {
  const socket = io(`${URL_SOCKET}`);
  return new Promise((resolve, reject) => {
    console.log(id_classe);
    console.log(formulari);
    console.log(email);
    console.log(sessionId);
    console.log(userId);
    socket.on('connect', () => {
      console.log('Socket connectat amb èxit.');

      socket.once('formulariAfegit', (data) => {
        socket.disconnect();
        resolve(data);
      });

      socket.once('error', (error) => {
        socket.disconnect();
        reject(new Error(error.missatge || 'Error en afegir el formulari'));
      });
      console.log("Emit afegirFormulari: ", { id_classe, email, formulari, sessionId, userId });
      socket.emit('afegirFormulari', { id_classe, email, formulari, sessionId, userId });
    });

    socket.on('connect_error', (err) => {
      reject(new Error('No es pot connectar al servidor de WebSocket.'));
    });
  });
}

export function callPutClass(email, codi_classe) {
  const socket = io(`${URL_SOCKET}`);
  return new Promise((resolve, reject) => {
    console.log(codi_classe);
    console.log(email);
    console.log(sessionId);
    console.log(userId);

    socket.on('connect', () => {
      console.log('Socket connectat amb èxit.');

      socket.once('classeAfegida', (data) => {
        socket.disconnect();
        resolve(data);
      });

      socket.once('error', (error) => {
        socket.disconnect();
        reject(new Error(error.missatge || 'Error en afegir la classe'));
      });

      socket.emit('afegirClasse', { email, codi_classe, sessionId, userId });
    });

    socket.on('connect_error', (err) => {
      reject(new Error('No es pot connectar al servidor de WebSocket.'));
    });
  });
}


export function getAlumnes(email) {
  const socket = io(`${URL_SOCKET}`);

  return new Promise((resolve, reject) => {
    console.log(sessionId);
    console.log(userId);

    socket.on('connect', () => {
      console.log('Socket connectat amb èxit.');

      socket.on('actualitzarAlumnes', () => {
        console.log('Rebent actualitzarAlumnes, tornant a demanar les classes...');
        socket.emit('getClasses', sessionId, userId, email);
      });

      socket.on('alumnes', (data) => {
        console.log('Alumnes rebuts:', data);
        resolve(data);
      });

      socket.on('error', (error) => {
        reject(new Error(error.missatge || 'Error en obtenir dades'));
      });

      socket.emit('getClasses', sessionId, userId, email);
    });

    socket.on('connect_error', (err) => {
      reject(new Error('No es pot connectar al servidor de WebSocket.'));
    });

  });
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



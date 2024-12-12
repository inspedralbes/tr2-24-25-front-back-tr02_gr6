const URL = import.meta.env.VITE_API_ROUTE;


export async function callPostProf(profesor) {
  // const formProfesor = new FormData();
  console.log(profesor);

  // formProfesor.append('nom', profesor.nom);
  // formProfesor.append('cognoms', profesor.cognoms);
  // formProfesor.append('email', profesor.email);
  // formProfesor.append('contrassenya', profesor.contrassenya);

  const response = await fetch(`${URL}/registreProf`, {
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
    const response = await fetch(`${URL}/getClasses`, {
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

export async function callGetProf(email, password) {
  try {
    const response = await fetch(`${URL}/getProf?email=${email}&password=${password}`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error en Communication Manager:", error);
    throw error;
  }
}

export async function getAlumnes() {
  const alumnes = await fetch(`${URL}/alumnes`);
  try {
  const llista_alumnes = await alumnes.json();
  return llista_alumnes
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}

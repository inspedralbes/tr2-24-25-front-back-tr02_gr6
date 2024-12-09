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
  
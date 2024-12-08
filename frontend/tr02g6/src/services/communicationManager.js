// src/services/CommunicationManager.js


const URL = import.meta.env.VITE_API_ROUTE;

export async function callGetProf(email,password) {
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

const AddPetView = async () => {
  return `
          <div class="container mx-auto px-4 py-8">
              <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                  <div class="p-8">
                      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Nueva Mascota</h2>
                      <form id="addPetForm" onsubmit="handleAddPet(event)">
                          <div class="mb-4">
                              <label class="block text-gray-700 text-sm font-bold mb-2" for="petName">
                                  Nombre de la Mascota
                              </label>
                              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="petName"
                                  type="text"
                                  required
                                  placeholder="Nombre">
                              <p class="text-red-500 text-xs italic hidden" id="petNameError"></p>
                          </div>
  
                          <div class="mb-4">
                              <label class="block text-gray-700 text-sm font-bold mb-2" for="petType">
                                  Tipo de Mascota
                              </label>
                              <select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="petType"
                                  required>
                                  <option value="">Seleccione un tipo</option>
                                  <option value="perro">Perro</option>
                                  <option value="gato">Gato</option>
                                  <option value="ave">Ave</option>
                                  <option value="otro">Otro</option>
                              </select>
                              <p class="text-red-500 text-xs italic hidden" id="petTypeError"></p>
                          </div>
  
                          <div class="mb-4">
                              <label class="block text-gray-700 text-sm font-bold mb-2" for="petBreed">
                                  Raza
                              </label>
                              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="petBreed"
                                  type="text"
                                  required
                                  placeholder="Raza">
                              <p class="text-red-500 text-xs italic hidden" id="petBreedError"></p>
                          </div>
  
                          <div class="mb-4">
                              <label class="block text-gray-700 text-sm font-bold mb-2" for="petAge">
                                  Edad (años)
                              </label>
                              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="petAge"
                                  type="number"
                                  required
                                  min="0"
                                  step="0.1"
                                  placeholder="Edad">
                              <p class="text-red-500 text-xs italic hidden" id="petAgeError"></p>
                          </div>
  
                          <div class="mb-4">
                              <label class="block text-gray-700 text-sm font-bold mb-2" for="petWeight">
                                  Peso (kg)
                              </label>
                              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="petWeight"
                                  type="number"
                                  required
                                  min="0"
                                  step="0.1"
                                  placeholder="Peso">
                              <p class="text-red-500 text-xs italic hidden" id="petWeightError"></p>
                          </div>
  
                          <div class="mb-6">
                              <label class="block text-gray-700 text-sm font-bold mb-2" for="petObservations">
                                  Observaciones
                              </label>
                              <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none" 
                                  id="petObservations"
                                  rows="3"
                                  placeholder="Observaciones adicionales"></textarea>
                              <p class="text-red-500 text-xs italic hidden" id="petObservationsError"></p>
                          </div>
  
                          <div class="flex flex-col space-y-4">
                              <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                  type="submit">
                                  Registrar Mascota
                              </button>
                              <a href="/home"
                                 data-link 
                                 class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-center">
                                  Volver
                              </a>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      `;
};

// Funciones de manejo de formularios y validación
const validatePetName = (name) => {
  return name.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
};

const validatePetAge = (age) => {
  return age >= 0 && age <= 30;
};

const validatePetWeight = (weight) => {
  return weight > 0 && weight <= 100;
};

async function handleAddPet(event) {
  event.preventDefault();

  const name = document.getElementById("petName")?.value;
  const type = document.getElementById("petType")?.value;
  const breed = document.getElementById("petBreed")?.value;
  const age = document.getElementById("petAge")?.value;
  const weight = document.getElementById("petWeight")?.value;
  const observations = document.getElementById("petObservations")?.value;

  let isValid = true;

  if (!validatePetName(name)) {
    showError("petNameError", "Por favor, ingrese un nombre válido");
    isValid = false;
  } else {
    hideError("petNameError");
  }

  if (!type) {
    showError("petTypeError", "Por favor, seleccione un tipo de mascota");
    isValid = false;
  } else {
    hideError("petTypeError");
  }

  if (!validatePetAge(age)) {
    showError("petAgeError", "Por favor, ingrese una edad válida (0-30 años)");
    isValid = false;
  } else {
    hideError("petAgeError");
  }

  if (!validatePetWeight(weight)) {
    showError("petWeightError", "Por favor, ingrese un peso válido (0-100 kg)");
    isValid = false;
  } else {
    hideError("petWeightError");
  }

  if (isValid) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://api.veterinaria.com/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          type,
          breed,
          age: Number(age),
          weight: Number(weight),
          observations,
        }),
      });

      if (response.ok) {
        window.location.href = "/pets";
      } else {
        const error = await response.json();
        showError(
          "petNameError",
          error.message || "Error al registrar la mascota"
        );
      }
    } catch (error) {
      showError(
        "petNameError",
        "Error de conexión. Por favor, intente nuevamente"
      );
    }
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

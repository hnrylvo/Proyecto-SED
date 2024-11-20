function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

const sanitizeInput = (input) => {
  if (typeof input === "string") {
    // Remove SQL injection patterns
    return input.replace(/['";\\]/g, "").trim();
  }
  return input;
};

const validateAnimalData = (data) => {
  const { name, species, age, weight, breed } = data;

  if (!name || typeof name !== "string" || name.length < 2) {
    throw new Error("Invalid name");
  }

  if (!species || typeof species !== "string") {
    throw new Error("Invalid species");
  }

  if (!Number.isInteger(age) || age < 0) {
    throw new Error("Invalid age");
  }

  if (typeof weight !== "number" || weight <= 0) {
    throw new Error("Invalid weight");
  }

  return {
    name: sanitizeInput(name),
    species: sanitizeInput(species),
    age: parseInt(age),
    weight: parseFloat(weight),
    breed: sanitizeInput(breed),
  };
};

const validateDoctorData = (data) => {
  const {
    nombre,
    email,
    especialidad,
    telefono,
    fechaIngreso,
    matriculaProfesional,
    password,
  } = data;

  // Validate nombre (name)
  if (!nombre || typeof nombre !== "string" || nombre.length < 2) {
    throw new Error("Invalid nombre: Must be at least 2 characters long");
  }

  // Validate email
  if (!email || typeof email !== "string" || !validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  // Validate especialidad (specialty)
  if (
    !especialidad ||
    typeof especialidad !== "string" ||
    especialidad.length < 2
  ) {
    throw new Error("Invalid especialidad: Must be at least 2 characters long");
  }

  // Validate telefono (phone)
  const phoneRegex = /^\+?[\d\s-]{8,}$/;
  if (!telefono || typeof telefono !== "string" || !phoneRegex.test(telefono)) {
    throw new Error("Invalid telefono: Must be a valid phone number");
  }

  // Validate fechaIngreso (entry date)
  const entryDate = new Date(fechaIngreso);
  if (isNaN(entryDate.getTime())) {
    throw new Error("Invalid fechaIngreso: Must be a valid date");
  }

  // Validate matriculaProfesional (professional license)
  if (
    !matriculaProfesional ||
    typeof matriculaProfesional !== "string" ||
    matriculaProfesional.length < 4
  ) {
    throw new Error(
      "Invalid matriculaProfesional: Must be at least 4 characters long"
    );
  }

  // Validate password
  if (!validatePassword(password)) {
    throw new Error("Invalid password: Must be at least 8 characters long");
  }

  // Return sanitized data
  return {
    nombre: sanitizeInput(nombre),
    email: sanitizeInput(email.toLowerCase()),
    especialidad: sanitizeInput(especialidad),
    telefono: sanitizeInput(telefono),
    fechaIngreso: entryDate,
    matriculaProfesional: sanitizeInput(matriculaProfesional),
    password: password, // Don't sanitize password as it will be encrypted
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateAnimalData,
  validateDoctorData  
};

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

const sanitizeInput = (input) => {
    if (typeof input === 'string') {
      // Remove SQL injection patterns
      return input.replace(/['";\\]/g, '').trim();
    }
    return input;
  };
  
  const validateAnimalData = (data) => {
    const { name, species, age, weight, breed } = data;
    
    if (!name || typeof name !== 'string' || name.length < 2) {
      throw new Error('Invalid name');
    }
    
    if (!species || typeof species !== 'string') {
      throw new Error('Invalid species');
    }
    
    if (!Number.isInteger(age) || age < 0) {
      throw new Error('Invalid age');
    }
    
    if (typeof weight !== 'number' || weight <= 0) {
      throw new Error('Invalid weight');
    }
    
    return {
      name: sanitizeInput(name),
      species: sanitizeInput(species),
      age: parseInt(age),
      weight: parseFloat(weight),
      breed: sanitizeInput(breed)
    };
  };
  

module.exports = {
    validateEmail,
    validatePassword,
    sanitizeInput,
    validateAnimalData
};
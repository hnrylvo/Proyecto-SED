const HomeView = async () => {
  return `
          <div class="container mx-auto px-4 py-8">
              <div class="max-w-4xl mx-auto">
                  <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Bienvenido a la Veterinaria</h1>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <a href="/pets" 
                         data-link
                         class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded-lg shadow-lg transition-colors duration-200 text-center">
                          <span class="block text-xl mb-2">Ver Mascotas</span>
                          <span class="text-sm">Consulta todas tus mascotas registradas</span>
                      </a>
                      
                      <a href="/add-pet" 
                         data-link
                         class="bg-green-500 hover:bg-green-700 text-white font-bold py-6 px-4 rounded-lg shadow-lg transition-colors duration-200 text-center">
                          <span class="block text-xl mb-2">Agregar Mascota</span>
                          <span class="text-sm">Registra una nueva mascota</span>
                      </a>
                  </div>
                  
                  <button 
                      onclick="handleLogout()"
                      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                      Cerrar Sesión
                  </button>
              </div>
          </div>
      `;
};

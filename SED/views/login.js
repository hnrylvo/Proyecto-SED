const LoginView = async () => {
  return `
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-8">
                    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
                    <form id="loginForm" onsubmit="handleLogin(event)">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="loginEmail">
                                Correo Electrónico
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="loginEmail"
                                type="email"
                                required
                                placeholder="correo@ejemplo.com">
                            <p class="text-red-500 text-xs italic hidden" id="loginEmailError"></p>
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="loginPassword">
                                Contraseña
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="loginPassword"
                                type="password"
                                required
                                placeholder="******************">
                            <p class="text-red-500 text-xs italic hidden" id="loginPasswordError"></p>
                        </div>
                        <div class="flex flex-col space-y-4">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit">
                                Ingresar
                            </button>
                            <a href="/register" 
                               data-link
                               class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center">
                                Crear cuenta nueva
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};

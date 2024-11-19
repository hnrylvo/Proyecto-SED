const RegisterView = async () => {
  return `
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-8">
                    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Registro</h2>
                    <form id="registerForm" onsubmit="handleRegister(event)">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="registerName">
                                Nombre Completo
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="registerName"
                                type="text"
                                required
                                placeholder="Juan Pérez">
                            <p class="text-red-500 text-xs italic hidden" id="registerNameError"></p>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="registerEmail">
                                Correo Electrónico
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="registerEmail"
                                type="email"
                                required
                                placeholder="correo@ejemplo.com">
                            <p class="text-red-500 text-xs italic hidden" id="registerEmailError"></p>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="registerPassword">
                                Contraseña
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="registerPassword"
                                type="password"
                                required
                                placeholder="******************">
                            <p class="text-red-500 text-xs italic hidden" id="registerPasswordError"></p>
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="registerConfirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="registerConfirmPassword"
                                type="password"
                                required
                                placeholder="******************">
                            <p class="text-red-500 text-xs italic hidden" id="registerConfirmPasswordError"></p>
                        </div>
                        <div class="flex flex-col space-y-4">
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit">
                                Registrarse
                            </button>
                            <a href="/" 
                               data-link
                               class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center">
                                Volver al inicio de sesión
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};

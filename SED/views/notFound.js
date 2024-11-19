const NotFoundView = async () => {
  return `
        <div class="container mx-auto px-4 py-8 text-center">
            <h1 class="text-4xl font-bold mb-4">404</h1>
            <p class="mb-4">Página no encontrada</p>
            <a href="/" data-link class="text-blue-500 hover:text-blue-700">Volver al inicio</a>
        </div>
    `;
};

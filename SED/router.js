class Router {
  constructor(routes) {
    this.routes = routes;
    this.rootElement = document.getElementById("app");

    // Manejar la navegación inicial
    window.addEventListener("load", () => {
      this.navigate(window.location.pathname);
    });

    // Manejar navegación con botones adelante/atrás
    window.addEventListener("popstate", () => {
      this.navigate(window.location.pathname);
    });

    // Interceptar clicks en enlaces para usar navegación del SPA
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });
  }

  // Navegar a una nueva ruta
  navigateTo(url) {
    history.pushState(null, null, url);
    this.navigate(new URL(url).pathname);
  }

  // Manejar la navegación
  async navigate(pathname) {
    // Encontrar la ruta que coincide con el pathname
    const matchedRoute = this.routes.find((route) => {
      return pathname.match(new RegExp(route.path));
    });

    if (!matchedRoute) {
      // Redirigir a 404 si no se encuentra la ruta
      const notFoundRoute = this.routes.find((route) => route.path === "*");
      if (notFoundRoute) {
        this.rootElement.innerHTML = await notFoundRoute.view();
      }
      return;
    }

    // Renderizar la vista correspondiente
    this.rootElement.innerHTML = await matchedRoute.view();
  }
}

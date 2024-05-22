import Route from "./Route";

const routes = new Route().get("/wi", () => {
  console.log("OK");
});

const server = Bun.serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "").toLowerCase();

    return routes.execute(path, request);
  },
});

console.log(`Server is running on port ${server.port}`);

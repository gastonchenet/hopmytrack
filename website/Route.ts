type RouteHandler = (
  request: Request
) => Response | Promise<Response> | void | Promise<void>;

export default class Route {
  public routes: Route[] = [];
  public path: RegExp | null = null;
  private parent: Route | null = null;

  private methods: Record<string, RouteHandler | null> = {
    GET: null,
    POST: null,
    PUT: null,
    PATCH: null,
    DELETE: null,
    OPTIONS: null,
    HEAD: null,
  };

  public constructor(path?: string | RegExp, ...routes: Route[]) {
    if (path) {
      this.path =
        path instanceof RegExp
          ? path
          : new RegExp(
              path.replace(/([^a-zA-Z0-9_])/g, "\\$1").replace(/\\\*/g, ".*"),
              "i"
            );
    }

    routes.forEach((route) => this.add(route));
  }

  public setParent(parent: Route) {
    this.parent = parent;
  }

  private getPath(): RegExp[] {
    if (this.parent && this.path) {
      return [...this.parent.getPath(), this.path];
    }

    if (this.parent) return this.parent.getPath();
    if (this.path) return [this.path];

    return [];
  }

  private formatSource(source: string): string {
    if (!source.startsWith("\\/")) source = `\\/${source}`;
    if (source.endsWith("\\/")) source = source.slice(0, -2);
    return source;
  }

  public match(path: string, strict: boolean = false): boolean {
    let val = new RegExp(
      `^${this.getPath()
        .map((p) => this.formatSource(p.source))
        .join("")}$`,
      "i"
    ).test(path);

    if (!val && !strict) {
      for (const route of this.routes) {
        val = route.match(path);
        if (val) break;
      }
    }

    return val;
  }

  public async execute(path: string, request: Request): Promise<Response> {
    if (this.match(path, true) && this.methods[request.method]) {
      console.log(this.methods[request.method]);
      const response = await this.methods[request.method]!(request);
      if (!response) return new Response("Accepted", { status: 202 });

      return response;
    }

    for (const route of this.routes) {
      if (route.match(path)) {
        return route.execute(path, request);
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  private add(route: Route) {
    route.setParent(this);
    this.routes.push(route);
    return this;
  }

  public get(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).get(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.GET = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public post(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).post(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.POST = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public put(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).put(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.PUT = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public patch(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).patch(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.PATCH = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public delete(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).delete(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.DELETE = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public options(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).options(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.OPTIONS = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public head(
    pathOrHandler: string | RegExp | RouteHandler,
    handler?: RouteHandler
  ): Route {
    if (
      (typeof pathOrHandler === "string" || pathOrHandler instanceof RegExp) &&
      handler
    ) {
      return this.add(new Route(pathOrHandler)).head(handler);
    } else if (typeof pathOrHandler === "function") {
      this.methods.HEAD = pathOrHandler;
    } else {
      throw new Error("Invalid arguments");
    }

    return this;
  }

  public all(handler: RouteHandler): Route {
    this.methods.GET = handler;
    this.methods.POST = handler;
    this.methods.PUT = handler;
    this.methods.PATCH = handler;
    this.methods.DELETE = handler;
    this.methods.OPTIONS = handler;
    this.methods.HEAD = handler;

    return this;
  }
}

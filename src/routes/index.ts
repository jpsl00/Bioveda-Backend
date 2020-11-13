import { Router, Request, Response } from "express";

// * Routes
import auth from "./auth";
import user from "./user";
import preAppointment from "./preAppointment";
import appointment from "./appointment";

// Utility Functions
interface IMappedRoutes {
  path: string;
  fullPath?: string;
  routes?: IMappedRoutes[];
  methods?: string[];
}

// ! Honestly, this function here does magic✨ stuff to get all the routes and methods, don't ask how it works, it just does... - JP
const mapRoutes = (router: Router, prevPath: string = ""): IMappedRoutes[] => {
  let array: IMappedRoutes[] = [];
  router.stack.forEach((v) => {
    if (v.name === "router") {
      const path = cleanRoute(`${v.regexp}`);
      return array.push({ path, routes: mapRoutes(v.handle, path) });
    }

    const path = v.path || cleanRoute(v.route.path),
      methods = [...Object.keys(v.route.methods)],
      idx = array.findIndex((vi) => vi.path === path);
    if (idx > -1) array[idx].methods.push(...methods);
    else array.push({ path, fullPath: `${prevPath}${path}`, methods });
  });

  return array.sort((a, b) => {
    const pathA = a.path.toUpperCase(),
      pathB = b.path.toUpperCase();
    if (pathA < pathB) return -1;
    else if (pathA > pathB) return 1;
    else return 0;
  });
};

const cleanRoute = (route: string) => {
  // What even is this regex... - JP
  const v = route.match(/([/]?[a-zA-Z:\-_]){2,}\w/i);
  return v ? v[0] : route;
};

// Setup Routes
const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/pre-appointment", preAppointment);
routes.use("/appointment", appointment);

routes.get("/", (req, res) => {
  res.send({
    message: ["🙋‍♂️", "🙋‍♀️", "👋", "🌊"][Math.floor(Math.random() * 4)],
    routes: mapRoutes(routes),
  });
});

export default routes;

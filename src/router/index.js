import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import blogRoute from "./blog.route.js";

const allRoutes = [
  { path: "auth", route: authRoute },
  { path: "users", route: userRoute },
  { path: "blogs", route: blogRoute },
];

export default (app) => {
  allRoutes.forEach((rou) => app.use(`/api/${rou.path}`, rou.route));
};

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  application: (name: string) =>
    `/dashboard/applications/${encodeURIComponent(name)}`,
};

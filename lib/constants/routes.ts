export const ROUTES = {
  home: "/",
  login: "/masuk",
  register: "/daftar",
  
  destinations: "/destinasi",
  destinationDetail: (id: string) => `/destinasi/${id}`,
  articles: "/artikel",
  articleDetail: (slug: string) => `/artikel/${slug}`,
  
  dashboard: "/beranda",
  userProfile: "/profil",
  userSettings: "/settings",
  myTrips: "/my-trips",
  tripDetail: (id: string) => `/my-trips/${id}`,
  createTrip: "/create-trip",
  userReviews: "/reviews",
  
  adminDashboard: "/admin/beranda"
} as const;

export const getLoginRedirect = (returnUrl?: string) => {
  if (!returnUrl) return ROUTES.login;
  return `${ROUTES.login}?next=${encodeURIComponent(returnUrl)}`;
};

export const getRegisterRedirect = (returnUrl?: string) => {
  if (!returnUrl) return ROUTES.register;
  return `${ROUTES.register}?next=${encodeURIComponent(returnUrl)}`;
};

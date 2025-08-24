export interface Route {
  label: string;
  url: string;
  description: string;
}

const ROUTES = Object.freeze<Route[]>([
  { label: '소개', url: '/', description: '홈페이지' },
  { label: '@uturi/sonification', url: '/sonification', description: '@uturi/sonification 소개' },
]);

export default ROUTES;

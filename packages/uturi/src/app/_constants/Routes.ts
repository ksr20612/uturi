export interface Route {
  label: string;
  url: string;
  description: string;
}

const ROUTES = Object.freeze<Route[]>([
  { label: 'Home', url: '/', description: 'Homepage' },
  {
    label: '@uturi/sonification',
    url: '/sonification',
    description: '@uturi/sonification overview',
  },
]);

export default ROUTES;

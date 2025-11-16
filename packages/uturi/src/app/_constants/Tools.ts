import type { ReactNode } from 'react';

export const enum ToolStatus {
  STABLE,
  BETA,
  ALPHA,
  DEVELOPING,
}

export interface Tool {
  id: string;
  name: string;
  description: ReactNode;
  status: ToolStatus;
  url: string;
  githubUrl?: string;
  npmUrl?: string;
  features: string[];
  icon?: string;
  version?: string;
}

const TOOLS = Object.freeze<Tool[]>([
  {
    id: 'sonification',
    name: '@uturi/sonification',
    description: 'Transform numbers into sound to make data more accessible.',
    status: ToolStatus.STABLE,
    url: '/sonification',
    githubUrl: 'https://github.com/ksr20612/uturi/tree/main/packages/sonification',
    npmUrl: 'https://www.npmjs.com/package/@uturi/sonification',
    features: [
      'Customizable Audio Settings',
      'Various Output Formats: Melody, Volume, Frequency and Rhythm',
      'Optimized Audio Performance',
      'Hook Available for React Projects',
    ],
    version: '1.1.0',
  },
  {
    id: 'ui',
    name: '@uturi/maru',
    description:
      'Rapidly Build Accessible UI Components Like AutoComplete, Select, and ChainPicker',
    status: ToolStatus.DEVELOPING,
    url: '/maru',
    githubUrl: 'https://github.com/ksr20612/uturi/tree/main/packages/maru',
    features: [],
  },
  // {
  //   id: 'color-contrast-checker',
  //   name: '@uturi/color-contrast-checker',
  //   description:
  //     'DOM 엘리먼트의 텍스트 색상을 배경색에 맞춰 접근 가능하도록 자동으로 조정합니다. WCAG 2.2 1.4.3 Contrast 조건을 자동으로 만족할 수 있게끔 색상을 변경합니다.',
  //   status: ToolStatus.DEVELOPING,
  //   url: '/color-contrast-checker',
  //   githubUrl: 'https://github.com/ksr20612/uturi/tree/main/packages/color-contrast-checker',
  //   features: [],
  // },
]);

export default TOOLS;

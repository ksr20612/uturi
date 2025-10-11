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
  features: string[];
  icon?: string;
}

const TOOLS = Object.freeze<Tool[]>([
  {
    id: 'sonification',
    name: '@uturi/sonification',
    description: 'Transform numbers into sound to make data more accessible.',
    status: ToolStatus.BETA,
    url: '/sonification',
    githubUrl: 'https://github.com/ksr20612/uturi/tree/main/packages/sonification',
    features: [
      'Customizable audio settings',
      'Various output formats: Melody, Rhythm, and Volume',
      'Optimized audio performance',
    ],
  },
  {
    id: 'ui',
    name: '@uturi/ui',
    description: 'Ensure accessibility for complex components like DatePicker and AutoComplete.',
    status: ToolStatus.DEVELOPING,
    url: '/color-contrast-checker',
    githubUrl: 'https://github.com/ksr20612/uturi/tree/main/packages/ui',
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

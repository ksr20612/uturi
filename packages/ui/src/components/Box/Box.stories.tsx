import type { Meta, StoryObj } from '@storybook/react';

import Box from './Box';

const meta = {
  title: 'Component/Box',
  component: Box,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Box 컴포넌트는 기본 레이아웃 컴포넌트입니다.
다양한 HTML 요소로 렌더링할 수 있습니다.
        `,
      },
    },
  },
  argTypes: {
    tag: {
      description: '렌더링할 HTML 요소',
      control: {
        type: 'select',
      },
      options: ['div', 'span', 'p', 'h1', 'section', 'article', 'aside'],
      table: {
        type: { summary: 'ElementType' },
        defaultValue: { summary: 'div' },
      },
    },
    visuallyHidden: {
      description: '시각적으로 숨기지만 스크린 리더에서 접근 가능',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    children: {
      control: false,
    },
    m: {
      description: '모든 방향의 margin',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    p: {
      description: '모든 방향의 padding',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    mt: {
      description: 'margin-top',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        typ: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    mb: {
      description: 'margin-bottom',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    ml: {
      description: 'margin-left',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    mr: {
      description: 'margin-right',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    pt: {
      description: 'padding-top',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    pb: {
      description: 'padding-bottom',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    pl: {
      description: 'padding-left',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
    pr: {
      description: 'padding-right',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'SpacingKey' },
        category: 'Spacing',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '@uturi/ui',
    m: 4,
    p: 4,
  },
};

export const VisuallyHidden: Story = {
  args: {
    children: '이 텍스트는 시각적으로 보이지 않지만 스크린 리더에서 접근 가능합니다.',
    visuallyHidden: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'visuallyHidden 속성을 사용하면 컴포넌트가 시각적으로는 숨겨지지만 스크린 리더에서 접근 가능합니다.',
      },
    },
  },
};

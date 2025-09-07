import type { Meta, StoryObj } from '@storybook/react';

import Flexbox from './Flexbox';
import Box from '../Box';

const meta = {
  title: 'Component/Flexbox',
  component: Flexbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Flexbox 컴포넌트는 CSS Flexbox 레이아웃을 위한 컴포넌트입니다. 
모든 CSS flexbox 속성을 지원합니다.
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
    flexDirection: {
      description: 'flex-direction',
      control: {
        type: 'select',
      },
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      table: {
        type: { summary: 'Property.FlexDirection' },
        defaultValue: { summary: 'row' },
        category: 'Flexbox',
      },
    },
    justifyContent: {
      description: 'justify-content',
      control: {
        type: 'select',
      },
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      table: {
        type: { summary: 'Property.JustifyContent' },
        defaultValue: { summary: 'flex-start' },
        category: 'Flexbox',
      },
    },
    alignItems: {
      description: 'align-items',
      control: {
        type: 'select',
      },
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
      table: {
        type: { summary: 'Property.AlignItems' },
        defaultValue: { summary: 'stretch' },
        category: 'Flexbox',
      },
    },
    gap: {
      description: 'gap',
      control: {
        type: 'select',
      },
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      table: {
        type: { summary: 'Property.Gap' },
        category: 'Flexbox',
      },
    },
    flexWrap: {
      description: 'flex-wrap',
      control: {
        type: 'select',
      },
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      table: {
        type: { summary: 'Property.FlexWrap' },
        defaultValue: { summary: 'nowrap' },
        category: 'Flexbox',
      },
    },
    flexGrow: {
      description: 'flex-grow',
      control: {
        type: 'number',
      },
      table: {
        type: { summary: 'Property.FlexGrow' },
        defaultValue: { summary: 0 },
        category: 'Flexbox',
      },
    },
    flexShrink: {
      description: 'flex-shrink',
      control: {
        type: 'number',
      },
      table: {
        type: { summary: 'Property.FlexShrink' },
        defaultValue: { summary: 1 },
        category: 'Flexbox',
      },
    },
    flexBasis: {
      description: 'flex-basis',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'Property.FlexBasis' },
        defaultValue: { summary: 'auto' },
        category: 'Flexbox',
      },
    },
    alignContent: {
      description: 'align-content',
      control: {
        type: 'select',
      },
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'stretch'],
      table: {
        type: { summary: 'Property.AlignContent' },
        defaultValue: { summary: 'stretch' },
        category: 'Flexbox',
      },
    },
    flex: {
      description: 'flex',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'Property.Flex' },
        defaultValue: { summary: '0 0 auto' },
        category: 'Flexbox',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Flexbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <></>,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    p: 2,
    style: {
      backgroundColor: 'lightgray',
    },
  },
  render: (props) => (
    <Flexbox {...props}>
      <Box p={1} style={{ backgroundColor: 'white' }}>
        @uturi/ui
      </Box>
      <Box p={1} style={{ backgroundColor: 'white' }}>
        @uturi/ui
      </Box>
      <Box p={1} style={{ backgroundColor: 'white' }}>
        @uturi/ui
      </Box>
    </Flexbox>
  ),
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

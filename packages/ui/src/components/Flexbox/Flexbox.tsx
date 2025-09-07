import type { ElementType, ReactNode } from 'react';

import { assignInlineVars } from '@vanilla-extract/dynamic';

import type { Property } from 'csstype';

import {
  alignContentVar,
  alignItemsVar,
  container,
  flexBasisVar,
  flexDirectionVar,
  flexGrowVar,
  flexShrinkVar,
  flexVar,
  flexWrapVar,
  justifyContentVar,
} from './Flexbox.css';
import type { SpacingKey } from '../../theme/tokens/spacing';
import type { PolymorphicComponentProps, Spacing, VisuallyHidden } from '../../typings/component';

export type FlexboxProps<T extends ElementType = 'div'> = PolymorphicComponentProps<T> &
  Spacing &
  VisuallyHidden & {
    flexDirection?: Property.FlexDirection;
    flexWrap?: Property.FlexWrap;
    justifyContent?: Property.JustifyContent;
    alignItems?: Property.AlignItems;
    alignContent?: Property.AlignContent;
    flex?: Property.Flex;
    flexGrow?: Property.FlexGrow;
    flexShrink?: Property.FlexShrink;
    flexBasis?: Property.FlexBasis;
    gap?: SpacingKey;
  };

type FlexboxComponent<DT extends ElementType> = <T extends ElementType = DT>(
  props: FlexboxProps<T>,
) => ReactNode;

const Flexbox: FlexboxComponent<'div'> = ({
  children,
  tag: Component = 'div',
  ref,
  style,
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  alignContent,
  flex,
  flexGrow,
  flexShrink,
  flexBasis,
  ...props
}) => {
  return (
    <Component
      ref={ref}
      className={container(props)}
      style={{
        ...assignInlineVars({
          [flexDirectionVar]: flexDirection,
          [flexWrapVar]: flexWrap,
          [justifyContentVar]: justifyContent,
          [alignItemsVar]: alignItems,
          [alignContentVar]: alignContent,
          [flexVar]: flex?.toString(),
          [flexGrowVar]: flexGrow?.toString(),
          [flexShrinkVar]: flexShrink?.toString(),
          [flexBasisVar]: flexBasis?.toString(),
        }),
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Flexbox;

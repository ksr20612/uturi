import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';

import type { SpacingKey } from '../theme/tokens/spacing';

export type PolymorphicComponentProps<T extends ElementType> = {
  tag?: T;
} & ComponentPropsWithoutRef<T> & { ref?: PolymorphicRef<T> };

export type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponent<T extends ElementType, Q> = (
  props: Omit<PolymorphicComponentProps<T>, keyof Q> & Q,
) => ReactNode;

export type Spacing = {
  m?: SpacingKey;
  p?: SpacingKey;
  mt?: SpacingKey;
  mb?: SpacingKey;
  ml?: SpacingKey;
  mr?: SpacingKey;
  pt?: SpacingKey;
  pb?: SpacingKey;
  pl?: SpacingKey;
  pr?: SpacingKey;
};

export type VisuallyHidden = {
  visuallyHidden?: boolean;
};

import { ElementType, ReactNode } from 'react';

import { container } from './Box.css';
import { PolymorphicComponentProps, Spacing, VisuallyHidden } from '../../typings/component';

export type BoxProps<T extends ElementType = 'div'> = PolymorphicComponentProps<T> &
  Spacing &
  VisuallyHidden;

type BoxComponent<DT extends ElementType> = <T extends ElementType = DT>(
  props: BoxProps<T>,
) => ReactNode;

const Box: BoxComponent<'div'> = ({
  children,
  tag: Component = 'div',
  ref,
  visuallyHidden,
  m,
  p,
  mt,
  mb,
  ml,
  mr,
  pt,
  pb,
  pl,
  pr,
  ...props
}) => {
  return (
    <Component
      ref={ref}
      className={container({ visuallyHidden, m, p, mt, mb, ml, mr, pt, pb, pl, pr })}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Box;

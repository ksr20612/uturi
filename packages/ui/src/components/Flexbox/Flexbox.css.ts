import { createVar } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { visuallyHidden } from '../../styles/common.css';
import { themeContract } from '../../theme/contract.css';
import { createSpacingVariants } from '../../theme/tokens/spacing';

const marginVariants = createSpacingVariants('margin');
const paddingVariants = createSpacingVariants('padding');
const marginTopVariants = createSpacingVariants('marginTop');
const marginBottomVariants = createSpacingVariants('marginBottom');
const marginLeftVariants = createSpacingVariants('marginLeft');
const marginRightVariants = createSpacingVariants('marginRight');
const paddingTopVariants = createSpacingVariants('paddingTop');
const paddingBottomVariants = createSpacingVariants('paddingBottom');
const paddingLeftVariants = createSpacingVariants('paddingLeft');
const paddingRightVariants = createSpacingVariants('paddingRight');
const gapVariants = createSpacingVariants('gap');

export const flexDirectionVar = createVar();
export const flexWrapVar = createVar();
export const justifyContentVar = createVar();
export const alignItemsVar = createVar();
export const alignContentVar = createVar();
export const flexVar = createVar();
export const flexGrowVar = createVar();
export const flexShrinkVar = createVar();
export const flexBasisVar = createVar();

export const container = recipe({
  base: {
    display: 'flex',
    fontSize: themeContract.fontSize.md,
    fontWeight: themeContract.fontWeight.normal,
    flexDirection: flexDirectionVar,
    flexWrap: flexWrapVar,
    justifyContent: justifyContentVar,
    alignItems: alignItemsVar,
    alignContent: alignContentVar,
    flex: flexVar,
    flexGrow: flexGrowVar,
    flexShrink: flexShrinkVar,
    flexBasis: flexBasisVar,
  },
  variants: {
    visuallyHidden: {
      true: visuallyHidden,
      false: {},
    },
    m: marginVariants,
    p: paddingVariants,
    mt: marginTopVariants,
    mb: marginBottomVariants,
    ml: marginLeftVariants,
    mr: marginRightVariants,
    pt: paddingTopVariants,
    pb: paddingBottomVariants,
    pl: paddingLeftVariants,
    pr: paddingRightVariants,
    gap: gapVariants,
  },
});

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

export const container = recipe({
  base: {
    color: themeContract.colors.gray[100],
    fontSize: themeContract.fontSize.md,
    fontWeight: themeContract.fontWeight.normal,
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
  },
});

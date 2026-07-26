import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { SonificationDemo } from './SonificationDemo';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    SonificationDemo,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

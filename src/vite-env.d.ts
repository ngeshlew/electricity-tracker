/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Declare SVG imports with ?react query as React components
declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Declare regular SVG imports as URLs (for non-React usage)
declare module '*.svg' {
  const content: string;
  export default content;
}

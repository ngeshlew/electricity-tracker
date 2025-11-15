/// <reference types="vite/client" />

// SVG imports via vite-plugin-svgr
declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Regular SVG imports (as URL)
declare module '*.svg' {
  const content: string;
  export default content;
}

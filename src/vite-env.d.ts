/// <reference types="vite/client" />

// Declare SVG imports as React components
declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Declare regular SVG imports as URLs
declare module '*.svg' {
  const content: string;
  export default content;
}

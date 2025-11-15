declare module 'vite-plugin-svgr' {
  import { Plugin } from 'vite';
  
  interface SvgrOptions {
    svgrOptions?: {
      icon?: boolean;
      replaceAttrValues?: Record<string, string>;
      [key: string]: any;
    };
    [key: string]: any;
  }
  
  function svgr(options?: SvgrOptions): Plugin;
  export default svgr;
}


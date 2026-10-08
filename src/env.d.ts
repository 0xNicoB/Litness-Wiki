/// <reference types="astro/client" />
declare module "@pagefind/default-ui" {
  interface PagefindUIOptions {
    element: string;
    bundlePath?: string;
    showSubResults?: boolean;
    showImages?: boolean;
    translations?: Record<string, string>;
  }
  export class PagefindUI {
    constructor(options: PagefindUIOptions);
    destroy(): void;
  }
}

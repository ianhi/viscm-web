declare module 'plotly.js-dist' {
  export function newPlot(
    container: HTMLElement,
    data: any[],
    layout?: any,
    config?: any
  ): Promise<any>;
}
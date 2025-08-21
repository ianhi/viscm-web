export interface Env {
  ASSETS: any;
}

const BASE_PATH = '/viscm-web';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (!url.pathname.startsWith(BASE_PATH)) {
      return new Response('Not Found', { status: 404 });
    }

    const assetPath = url.pathname.slice(BASE_PATH.length) || '/';
    const assetUrl = new URL(assetPath, url.origin);
    assetUrl.search = url.search;

    try {
      const assetResponse = await env.ASSETS.fetch(assetUrl);
      
      if (assetResponse.status === 200) {
        const response = new Response(assetResponse.body, assetResponse);
        
        // Cache static assets
        if (assetPath.startsWith('/assets/')) {
          response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (assetPath.match(/\.(png|jpg|jpeg|ico|svg|css|js|gz)$/)) {
          response.headers.set('Cache-Control', 'public, max-age=86400');
        }
        
        return response;
      }
    } catch (error) {
      console.error('Error fetching asset:', error);
    }

    // Fallback to index.html for SPA routing
    try {
      const indexResponse = await env.ASSETS.fetch(new URL('/', url.origin));
      
      if (indexResponse.status === 200) {
        const response = new Response(indexResponse.body, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=3600'
          }
        });
        
        return response;
      }
    } catch (error) {
      console.error('Error fetching index.html:', error);
    }

    return new Response('Not Found', { status: 404 });
  },
};
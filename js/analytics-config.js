(function () {
  "use strict";

  window.PORTFOLIO_ANALYTICS_CONFIG = {
    // Cloudflare Web Analytics token:
    // Cloudflare Dashboard -> Analytics & Logs -> Web Analytics -> your site.
    // This token is browser-visible by design. Do not replace it with a
    // Cloudflare account API key, global API key, or any other secret.
    siteToken: "PASTE_TOKEN_HERE",

    // Analytics is intentionally limited to the production domains so local
    // development, GitHub preview URLs, and file:// testing do not pollute stats.
    allowedHostnames: ["noahkoury.com", "www.noahkoury.com"]
  };
})();

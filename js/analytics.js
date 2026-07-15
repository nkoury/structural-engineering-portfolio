(function () {
  "use strict";

  const API_NAME = "PortfolioAnalytics";
  const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";
  const CONFIG_GLOBAL = "PORTFOLIO_ANALYTICS_CONFIG";

  if (window[API_NAME]?.installed) return;

  const api = {
    installed: true,
    enabled: false,
    loaded: false,
    events: [],
    trackEvent
  };

  window[API_NAME] = api;

  function trackEvent(name, properties) {
    const event = {
      name: String(name || ""),
      properties: isPlainObject(properties) ? { ...properties } : {},
      timestamp: new Date().toISOString()
    };

    // Cloudflare Web Analytics' installed beacon is used for page analytics.
    // Keep custom events provider-neutral until the chosen analytics provider
    // supports and documents a compatible browser event API for this site.
    api.events.push(event);
    return event;
  }

  function isPlainObject(value) {
    return Boolean(value) && Object.prototype.toString.call(value) === "[object Object]";
  }

  function getScriptDirectory() {
    const script = document.currentScript;
    if (!script?.src) return "js/";
    return script.src.slice(0, script.src.lastIndexOf("/") + 1);
  }

  function loadConfig(callback) {
    if (window[CONFIG_GLOBAL]) {
      callback(window[CONFIG_GLOBAL]);
      return;
    }

    const script = document.createElement("script");
    script.src = `${getScriptDirectory()}analytics-config.js`;
    script.async = true;
    script.onload = () => callback(window[CONFIG_GLOBAL]);
    script.onerror = () => {};
    document.head.appendChild(script);
  }

  function shouldEnable(config) {
    const allowedHostnames = Array.isArray(config?.allowedHostnames)
      ? config.allowedHostnames.map((hostname) => String(hostname).toLowerCase())
      : [];
    const hostname = window.location.hostname.toLowerCase();

    // Only the production custom domains should report analytics. This keeps
    // localhost, 127.0.0.1, GitHub preview URLs, and file:// test sessions out
    // of Cloudflare Web Analytics.
    return window.location.protocol === "https:" && allowedHostnames.includes(hostname);
  }

  function insertBeacon(config) {
    const token = String(config?.siteToken || "").trim();
    if (!token || !shouldEnable(config)) return;

    if (
      document.querySelector(`script[src="${BEACON_SRC}"]`) ||
      document.querySelector("script[data-portfolio-analytics='cloudflare']")
    ) {
      api.enabled = true;
      api.loaded = true;
      return;
    }

    const script = document.createElement("script");
    script.src = BEACON_SRC;
    script.defer = true;
    script.dataset.portfolioAnalytics = "cloudflare";
    script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
    script.onload = () => {
      api.loaded = true;
    };
    script.onerror = () => {
      api.loaded = false;
    };

    api.enabled = true;
    document.head.appendChild(script);
  }

  loadConfig(insertBeacon);
})();

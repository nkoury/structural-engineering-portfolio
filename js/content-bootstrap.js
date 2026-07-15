(function () {
  "use strict";

  const script = document.currentScript;
  if (!script) return;

  const contentSrc = script.getAttribute("data-content-src");
  const loaderSrc = script.getAttribute("data-loader-src");
  const version = script.getAttribute("data-content-version") || String(Date.now());

  function withVersion(src) {
    if (!src) return "";
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}v=${encodeURIComponent(version)}`;
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function writeScript(src) {
    if (!src) return;
    document.write(`<script src="${escapeAttribute(withVersion(src))}"><\/script>`);
  }

  // Editable portfolio content is intentionally loaded with a fresh cache key.
  // That lets content-editor GitHub publishes show on the live site after the
  // GitHub Pages deployment finishes, without editing every HTML file each time.
  writeScript(contentSrc);
  writeScript(loaderSrc);
})();

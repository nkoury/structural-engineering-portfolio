(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const sections = document.querySelectorAll("[data-swiftxr-section]");

  sections.forEach((section) => {
    const projectId = section.getAttribute("data-project-id");
    const frameTarget = section.querySelector("[data-swiftxr-frame]");
    const project = projects.find((item) => item.id === projectId);
    const embedUrl = project && project.swiftxr && project.swiftxr.embedUrl;

    if (!frameTarget || !embedUrl) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.className = "swiftxr-frame";
    iframe.src = embedUrl;
    iframe.title = `${project.title} SwiftXR interactive model`;
    iframe.loading = "lazy";
    iframe.allow = "fullscreen; xr-spatial-tracking";
    iframe.allowFullscreen = true;

    frameTarget.innerHTML = "";
    frameTarget.appendChild(iframe);
    section.hidden = false;
  });
})();

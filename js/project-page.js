(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const content = window.PORTFOLIO_CONTENT || {};
  const pageRoot = document.querySelector("[data-project-page]");
  const ribbons = document.querySelectorAll("[data-project-ribbon]");

  function getCopy(path, fallback) {
    const value = path.split(".").reduce((current, part) => {
      if (current === undefined || current === null) return undefined;
      return current[part];
    }, content);
    return value === undefined || value === null ? fallback : value;
  }

  function rootPath(path, prefix) {
    return `${prefix || ""}${path}`;
  }

  function mediaPath(src, prefix) {
    if (!src || /^(data:|https?:|\/)/.test(src)) return src || "";
    return rootPath(src, prefix);
  }

  function renderRibbon(ribbon) {
    const prefix = ribbon.dataset.prefix || "";
    const current = ribbon.dataset.current || (pageRoot ? "works" : "");
    const nav = content.global?.nav || {};
    const links = [
      { id: "works", href: "works.html", label: nav.works || "Highlighted Works" },
      { id: "about", href: "about.html", label: nav.about || "About Me" },
      { id: "contact", href: "contact.html", label: nav.contact || "Contact" }
    ];

    ribbon.innerHTML = links
      .map((link) => {
        const aria = link.id === current ? ' aria-current="page"' : "";
        return `<a href="${rootPath(link.href, prefix)}"${aria}>${link.label}</a>`;
      })
      .join("");
  }

  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderModel(project) {
    const models = project.modelOptions || (project.modelViewer ? [project.modelViewer] : []);

    if (!models.length) {
      return `
        <div class="project-visual-placeholder" style="--tile-color: ${project.color}">
          <span class="project-kicker">${project.title}</span>
          <strong>${getCopy("projectPage.placeholderTitle", "Project image sequence")}</strong>
        </div>
      `;
    }

    const primary = models[0];
    const buttons =
      models.length > 1
        ? `<div class="model-switcher" aria-label="${project.title} model views">
            ${models
              .map(
                (model, index) =>
                  `<button type="button" data-model-src="../${model.src}" data-model-alt="${escapeAttribute(
                    model.alt
                  )}" aria-pressed="${index === 0 ? "true" : "false"}">${model.label}</button>`
              )
              .join("")}
          </div>`
        : "";

    return `
      <div class="model-stage">
        <model-viewer
          class="project-model"
          src="../${primary.src}"
          alt="${escapeAttribute(primary.alt || `${project.title} 3D model`)}"
          camera-controls
          touch-action="pan-y"
          shadow-intensity="0.25"
          exposure="0.95"
          environment-image="neutral"
        ></model-viewer>
        ${buttons}
        <a class="model-download" href="../${primary.src}">${getCopy("projectPage.modelDownloadLabel", "Open model file")}</a>
      </div>
    `;
  }

  function renderSwiftXR(project) {
    const embedUrl = project.swiftxr && project.swiftxr.embedUrl;
    if (!embedUrl) {
      return "";
    }

    return `
      <section class="project-section">
        <h2>${getCopy("projectPage.hostedModelTitle", "Hosted Model")}</h2>
        <div class="swiftxr-stage">
          <iframe
            class="swiftxr-frame"
            src="${embedUrl}"
            title="${project.title} SwiftXR interactive model"
            loading="lazy"
            allow="fullscreen; xr-spatial-tracking"
            allowfullscreen
          ></iframe>
        </div>
      </section>
    `;
  }

  function renderProjectPhotos(project) {
    const photos = project.photos || {};
    const title = photos.title || "Project Photos";
    const comingSoonText = photos.comingSoonText || "Photos Coming Soon!";
    const items = Array.isArray(photos.items) ? photos.items : [];
    const visibleItems = items.filter((item) => item && item.image);

    if (photos.mode !== "photos" || !visibleItems.length) {
      return `
        <section class="project-section project-photos-section">
          <h2>${escapeHtml(title)}</h2>
          <div class="project-photo-coming-soon">
            <p>${escapeHtml(comingSoonText)}</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="project-section project-photos-section">
        <h2>${escapeHtml(title)}</h2>
        <div class="project-photo-grid">
          ${visibleItems
            .map(
              (item, index) => `
                <figure class="about-photo project-photo project-photo-${index + 1}">
                  <img src="${escapeAttribute(mediaPath(item.image, "../"))}" alt="${escapeAttribute(item.alt || item.label || `${project.title} project photo`)}" loading="lazy" decoding="async" />
                  <figcaption>${escapeHtml(item.label || `Photo ${index + 1}`)}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderProjectPage() {
    if (!pageRoot) {
      return;
    }

    const project = projects.find((item) => item.id === pageRoot.dataset.projectPage);
    if (!project) {
      pageRoot.innerHTML = `
        <section class="project-hero">
          <div class="project-title">
            <p class="project-kicker">${getCopy("projectPage.missingKicker", "Missing Project")}</p>
            <h1>${getCopy("projectPage.missingTitle", "Project not found")}</h1>
          </div>
        </section>
      `;
      return;
    }

    document.title = `${project.title} | Noah Koury`;

    pageRoot.innerHTML = `
      <section class="project-hero">
        <div class="project-title">
          <p class="project-kicker">${project.type}</p>
          <h1>${project.title}</h1>
          <p>${project.summary}</p>
        </div>
        ${renderModel(project)}
      </section>

      <div class="project-body">
        <section class="project-section">
          <h2>${project.projectTypeTitle || getCopy("projectPage.projectTypeTitle", "Project Type")}</h2>
          <div>
            <p>${project.scope}</p>
            <ul class="detail-list">
              <li><strong>${project.systemLabel || getCopy("projectPage.systemLabel", "System")}</strong><span>${project.system}</span></li>
              <li><strong>${project.primaryMediaLabel || getCopy("projectPage.primaryMediaLabel", "Primary Media")}</strong><span>${project.primaryMedia || getCopy(
                "projectPage.primaryMediaValue",
                "Interactive 3D model views and project scope."
              )}</span></li>
              <li><strong>${project.statusLabel || getCopy("projectPage.statusLabel", "Status")}</strong><span>${project.status || getCopy(
                "projectPage.statusValue",
                "Public-facing model paths are active."
              )}</span></li>
            </ul>
          </div>
        </section>

        ${renderSwiftXR(project)}
        ${renderProjectPhotos(project)}
      </div>
    `;
  }

  function bindModelSwitcher() {
    document.querySelectorAll(".model-switcher").forEach((switcher) => {
      const modelViewer = switcher.closest(".model-stage")?.querySelector(".project-model");
      const download = switcher.closest(".model-stage")?.querySelector(".model-download");

      switcher.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button || !modelViewer) return;

        switcher.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", "true");
        modelViewer.setAttribute("src", button.dataset.modelSrc);
        modelViewer.setAttribute("alt", button.dataset.modelAlt || "");
        if (download) download.setAttribute("href", button.dataset.modelSrc);
      });
    });
  }

  ribbons.forEach(renderRibbon);
  renderProjectPage();
  bindModelSwitcher();
})();

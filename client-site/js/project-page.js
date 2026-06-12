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

  function renderDetailCards(project) {
    const details = project.detailAssets && project.detailAssets.length ? project.detailAssets : project.detailSheets || [];

    if (!details.length) {
      return "";
    }

    return `
      <section class="project-section">
        <h2>${getCopy("projectPage.drawingDetailsTitle", "Drawing Details")}</h2>
        <div>
          <p>
            ${getCopy(
              "projectPage.drawingDetailsIntro",
              "Redacted detail crops isolate selected structural conditions from the target sheets. Full drawing sets remain private while these public-safe excerpts support the project story."
            )}
          </p>
          <div class="detail-card-grid">
            ${details
              .map((detail) => {
                const media = detail.image
                  ? `<img src="../${detail.image}" alt="${escapeAttribute(detail.alt || `${project.title} ${detail.sheet} detail crop`)}" loading="lazy" />`
                  : `<div class="detail-card-placeholder"><span>Sheet</span><strong>${detail.sheet}</strong></div>`;
                const pageLabel = detail.sourcePage ? `PDF page ${detail.sourcePage}` : detail.sheet;
                const note = detail.note || `Redacted crop from ${detail.sheet}.`;

                return `
                  <article class="detail-card">
                    ${media}
                    <div class="detail-card-copy">
                      <span>${pageLabel}</span>
                      <strong>${detail.label}</strong>
                      <p>${note}</p>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
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
          <h2>${getCopy("projectPage.projectTypeTitle", "Project Type")}</h2>
          <div>
            <p>${project.scope}</p>
            <ul class="detail-list">
              <li><strong>${getCopy("projectPage.systemLabel", "System")}</strong><span>${project.system}</span></li>
              <li><strong>${getCopy("projectPage.primaryMediaLabel", "Primary Media")}</strong><span>${getCopy(
                "projectPage.primaryMediaValue",
                "Interactive GLB model views, redacted drawing detail targets, process imagery, and selected calculation evidence."
              )}</span></li>
              <li><strong>${getCopy("projectPage.statusLabel", "Status")}</strong><span>${getCopy(
                "projectPage.statusValue",
                "Public-facing model paths are active; detail crops are staged for address-redacted extraction."
              )}</span></li>
            </ul>
          </div>
        </section>

        ${renderDetailCards(project)}
        ${renderSwiftXR(project)}

        <section class="project-section">
          <h2>${getCopy("projectPage.scopeNarrativeTitle", "Scope Narrative")}</h2>
          <div>
            <p>
              ${project.scopeNarrative || getCopy(
                "projectPage.scopeNarrativeBody",
                "This section is reserved for the final written story: what the design team needed, what constraints shaped the structure, what you modeled or calculated, and which details best demonstrate your engineering judgment."
              )}
            </p>
          </div>
        </section>
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

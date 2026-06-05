(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const pageRoot = document.querySelector("[data-project-page]");
  const ribbons = document.querySelectorAll("[data-project-ribbon]");

  function rootPath(path, prefix) {
    return `${prefix || ""}${path}`;
  }

  function renderRibbon(ribbon) {
    const prefix = ribbon.dataset.prefix || "";
    const current = ribbon.dataset.current || (pageRoot ? "works" : "");
    const links = [
      { id: "works", href: "works.html", label: "Highlighted Works" },
      { id: "process", href: "process.html", label: "Process" },
      { id: "about", href: "about.html", label: "About Me" },
      { id: "contact", href: "contact.html", label: "Contact" }
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
          <strong>Project image sequence</strong>
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
        <a class="model-download" href="../${primary.src}">Open model file</a>
      </div>
    `;
  }

  function renderDetailCards(project) {
    if (!project.detailSheets || !project.detailSheets.length) {
      return "";
    }

    return `
      <section class="project-section">
        <h2>Drawing Details</h2>
        <div>
          <p>
            Source drawing sets stay private while address-redacted detail crops are prepared.
            These cards map the project page to the target sheets and PDF pages for extraction.
          </p>
          <div class="detail-card-grid">
            ${project.detailSheets
              .map((detail) => {
                const media = detail.image
                  ? `<img src="../${detail.image}" alt="${escapeAttribute(detail.alt || `${project.title} ${detail.sheet} detail crop`)}" />`
                  : `<div class="detail-card-placeholder"><span>Sheet</span><strong>${detail.sheet}</strong></div>`;

                return `
                  <article class="detail-card">
                    ${media}
                    <div class="detail-card-copy">
                      <span>PDF page ${detail.sourcePage}</span>
                      <strong>${detail.label}</strong>
                      <p>${detail.note}</p>
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

  function renderProcessAssets(project) {
    if (!project.processAssets || !project.processAssets.length) {
      return "";
    }

    return `
      <section class="project-section">
        <h2>Process Evidence</h2>
        <div>
          <p>
            Selected sketches, coordination notes, and calculation excerpts give the project page a
            process layer beyond finished drawings and model views.
          </p>
          <div class="asset-strip">
            ${project.processAssets
              .map(
                (asset) => `
                  <a class="asset-slot image-slot" href="../${asset.src}">
                    <img src="../${asset.src}" alt="${escapeAttribute(asset.alt)}" />
                    <span>${asset.label}</span><strong>${asset.title}</strong>
                  </a>
                `
              )
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
        <h2>Hosted Model</h2>
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
            <p class="project-kicker">Missing Project</p>
            <h1>Project not found</h1>
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
          <h2>Project Type</h2>
          <div>
            <p>${project.scope}</p>
            <ul class="detail-list">
              <li><strong>System</strong><span>${project.system}</span></li>
              <li><strong>Primary Media</strong><span>Interactive GLB model views, redacted drawing detail targets, process imagery, and selected calculation evidence.</span></li>
              <li><strong>Status</strong><span>Public-facing model paths are active; detail crops are staged for address-redacted extraction.</span></li>
            </ul>
          </div>
        </section>

        ${renderProcessAssets(project)}
        ${renderDetailCards(project)}
        ${renderSwiftXR(project)}

        <section class="project-section">
          <h2>Scope Narrative</h2>
          <div>
            <p>
              This section is reserved for the final written story: what the design team needed,
              what constraints shaped the structure, what you modeled or calculated, and which
              details best demonstrate your engineering judgment.
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

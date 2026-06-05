(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const processAssets = window.PORTFOLIO_PROCESS_ASSETS || [];
  const modelCollage = document.querySelector("[data-model-collage]");
  const processGrid = document.querySelector("[data-process-grid]");
  const year = document.querySelector("[data-current-year]");
  const collageSizes = ["large", "medium", "wide", "tall", "medium", "wide"];

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderModelTile(tile, index) {
    const size = collageSizes[index % collageSizes.length];
    const project = tile.project;
    const model = tile.model;
    const visual = model
      ? `<model-viewer
          class="collage-model"
          src="${escapeAttribute(model.src)}"
          alt="${escapeAttribute(model.alt || `${project.title} ${model.label} model`)}"
          camera-controls
          touch-action="pan-y"
          shadow-intensity="0.25"
          exposure="0.95"
          environment-image="neutral"
          loading="lazy"
          reveal="auto"
        >
          <div class="model-poster" slot="poster" style="--tile-color: ${project.color}">
            <span>3D Model</span>
            <strong>${escapeAttribute(model.label)}</strong>
          </div>
        </model-viewer>`
      : `<div class="model-poster placeholder-only" style="--tile-color: ${project.color}">
          <span>Model Pending</span>
          <strong>${project.title}</strong>
        </div>`;

    return `
      <article class="model-card ${size}">
        ${visual}
        <a class="work-tab" href="${escapeAttribute(project.page)}" aria-label="Open ${project.title} project page">
          <span>${escapeAttribute(project.type)}</span>
          <strong>${escapeAttribute(project.title)}</strong>
          <em>${escapeAttribute(model ? model.label : "Project page")}</em>
        </a>
      </article>
    `;
  }

  if (modelCollage) {
    const tiles = projects.flatMap((project) => {
      const models = project.modelOptions || [];
      if (!models.length) {
        return [{ project, model: null }];
      }
      return models.map((model) => ({ project, model }));
    });

    modelCollage.innerHTML = tiles.map(renderModelTile).join("");
  }

  if (processGrid) {
    processGrid.innerHTML = processAssets
      .map(
        (asset, index) => `
          <a class="process-card ${collageSizes[index % collageSizes.length]}" href="${escapeAttribute(asset.src)}">
            <img src="${escapeAttribute(asset.src)}" alt="${escapeAttribute(asset.alt)}" loading="lazy" />
            <span class="process-tab">
              <small>${escapeAttribute(asset.label)}</small>
              <strong>${escapeAttribute(asset.title)}</strong>
            </span>
          </a>
        `
      )
      .join("");
  }
})();

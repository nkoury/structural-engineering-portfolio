(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const modelCollage = document.querySelector("[data-model-collage]");
  const year = document.querySelector("[data-current-year]");

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

  function renderProjectModel(model, project) {
    if (!model) {
      return `
        <div class="work-model-placeholder" style="--tile-color: ${project.color}">
          <span>Model Pending</span>
          <strong>${escapeAttribute(project.title)}</strong>
        </div>
      `;
    }

    return `
      <model-viewer
        class="work-model"
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
      </model-viewer>
    `;
  }

  function renderProjectCard(project) {
    const models = project.modelOptions && project.modelOptions.length ? project.modelOptions : [null];
    const modelTiles = models.map((model) => `<div class="work-model-tile">${renderProjectModel(model, project)}</div>`);
    const modelLabel = models.length > 1 ? `${models.length} model views` : models[0] ? models[0].label : "Project page";

    return `
      <article class="work-project-card" style="--tile-color: ${project.color}">
        <div class="work-model-grid ${models.length > 1 ? "multi" : "single"}">
          ${modelTiles.join("")}
        </div>
        <a class="work-project-tab" href="${escapeAttribute(project.page)}" aria-label="Open ${project.title} project page">
          <span>${escapeAttribute(project.type)}</span>
          <strong>${escapeAttribute(project.title)}</strong>
          <em>${escapeAttribute(modelLabel)}</em>
        </a>
      </article>
    `;
  }

  if (modelCollage) {
    modelCollage.innerHTML = projects.map(renderProjectCard).join("");
  }

})();

(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const projectContent = window.PORTFOLIO_CONTENT?.projects || {};
  const defaultDetails = {
    "l-ranch": [
      "../assets/project-assets/l-ranch/drawings/details/s-400-page-11-detail-02.webp",
      "../assets/project-assets/l-ranch/drawings/details/s-400-page-11-detail-04.webp",
      "../assets/project-assets/l-ranch/drawings/details/s-401-page-12-detail-04.webp"
    ],
    "coach-rd": [
      "../assets/project-assets/coach-rd/drawings/details/s-4-0-page-25-detail-01.webp",
      "../assets/project-assets/coach-rd/drawings/details/s-4-1-page-26-detail-03.webp",
      "../assets/project-assets/coach-rd/drawings/details/s-4-1-page-26-detail-04.webp"
    ],
    "hastings-mesa": [
      "../assets/project-assets/hastings-mesa/drawings/details/s4-00-page-2-detail-01.webp",
      "../assets/project-assets/hastings-mesa/drawings/details/s4-00-page-2-detail-03.webp",
      "../assets/project-assets/hastings-mesa/drawings/details/s4-00-page-2-detail-04.webp"
    ],
    "hhr-ranch": [
      "../assets/project-assets/hhr-ranch/drawings/details/s4-00-page-12-detail-02.webp",
      "../assets/project-assets/hhr-ranch/drawings/details/s4-01-page-13-detail-01.webp",
      "../assets/project-assets/hhr-ranch/drawings/details/s4-01-page-13-detail-03.webp"
    ],
    "mountain-laurel": [
      "../assets/project-assets/mountain-laurel/drawings/details/s-400-page-19-detail-01.webp",
      "../assets/project-assets/mountain-laurel/drawings/details/s-400-page-19-detail-02.webp",
      "../assets/project-assets/mountain-laurel/drawings/details/s-400-page-19-detail-04.webp"
    ],
    waters: [
      "../assets/project-assets/waters/drawings/details/s-400-page-14-detail-01.webp",
      "../assets/project-assets/waters/drawings/details/s-400-page-14-detail-02.webp",
      "../assets/project-assets/waters/drawings/details/s-401-page-15-detail-04.webp"
    ]
  };

  function withEditable(project) {
    const editable = projectContent[project.id] || {};
    return {
      ...project,
      ...Object.fromEntries(
        ["title", "type", "summary", "system", "scope"].map((key) => [
          key,
          typeof editable[key] === "string" ? editable[key] : project[key]
        ])
      )
    };
  }

  function assetPath(src) {
    if (!src) return "";
    if (/^https?:\/\//.test(src) || src.startsWith("../")) return src;
    return `../${src}`;
  }

  function modelFor(project) {
    return project.modelOptions?.[0];
  }

  function createModel(project, options = {}) {
    const model = modelFor(project);
    const viewer = document.createElement("model-viewer");
    viewer.setAttribute("src", assetPath(model?.src));
    viewer.setAttribute("alt", model?.alt || `${project.title} structural model`);
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("touch-action", "pan-y");
    viewer.setAttribute("interaction-prompt", options.prompt || "auto");
    viewer.setAttribute("shadow-intensity", "0.55");
    viewer.setAttribute("exposure", "0.9");
    viewer.setAttribute("camera-orbit", options.orbit || "35deg 62deg auto");
    viewer.setAttribute("field-of-view", options.fov || "32deg");
    return viewer;
  }

  function createCard(project) {
    const card = document.createElement("a");
    card.className = "v2-work-card";
    card.href = `case-study.html?id=${encodeURIComponent(project.id)}`;

    const media = document.createElement("div");
    media.className = "v2-card-media";
    media.append(createModel(project, { prompt: "none", orbit: "45deg 66deg auto", fov: "30deg" }));

    const caption = document.createElement("div");
    caption.className = "v2-card-caption";
    caption.innerHTML = `
      <span class="v2-card-type">${project.type || "Project"}</span>
      <h2>${project.title}</h2>
      <p>${project.system || project.summary || ""}</p>
    `;

    card.append(media, caption);
    return card;
  }

  function renderHome() {
    const hero = document.querySelector("[data-v2-hero]");
    if (hero && projects[0]) {
      hero.append(createModel(withEditable(projects[0]), { orbit: "42deg 60deg auto", fov: "28deg" }));
    }

    const featured = document.querySelector("[data-v2-featured]");
    if (featured) {
      projects.slice(0, 3).map(withEditable).forEach((project) => featured.append(createCard(project)));
    }
  }

  function renderWorkGrid() {
    const grid = document.querySelector("[data-v2-work-grid]");
    if (!grid) return;
    projects.map(withEditable).forEach((project) => grid.append(createCard(project)));
  }

  function renderCaseStudy() {
    const root = document.querySelector("[data-v2-case]");
    if (!root) return;

    const id = new URLSearchParams(window.location.search).get("id") || projects[0]?.id;
    const project = withEditable(projects.find((item) => item.id === id) || projects[0]);
    if (!project) return;

    document.title = `${project.title} | V2 Test`;
    const model = modelFor(project);
    const detailAssets = (project.detailAssets || []).slice(0, 3);
    const images = defaultDetails[project.id] || [];

    const hero = document.createElement("section");
    hero.className = "v2-case-hero";
    const media = document.createElement("div");
    media.className = "v2-case-media";
    media.append(createModel(project, { orbit: "44deg 62deg auto", fov: "28deg" }));
    const title = document.createElement("div");
    title.className = "v2-case-title";
    title.innerHTML = `
      <p class="v2-meta">${project.type || "Project"}${model?.label ? ` / ${model.label}` : ""}</p>
      <h1>${project.title}</h1>
      <p>${project.summary || ""}</p>
    `;
    hero.append(media, title);

    const content = document.createElement("section");
    content.className = "v2-case-content";
    content.innerHTML = `
      <dl class="v2-project-facts">
        <div><dt>System</dt><dd>${project.system || "To be developed."}</dd></div>
        <div><dt>Primary Media</dt><dd>${project.modelOptions?.length || 0} model view${project.modelOptions?.length === 1 ? "" : "s"} and selected drawing evidence.</dd></div>
        <div><dt>Status</dt><dd>V2 test page using current project assets and editable project copy.</dd></div>
      </dl>
      <article class="v2-case-narrative">
        <h2>Scope</h2>
        <p>${project.scope || "Use this area for project narrative, constraints, model scope, calculations, and engineering judgment."}</p>
      </article>
    `;

    const detailSection = document.createElement("section");
    detailSection.className = "v2-detail-section";
    detailSection.innerHTML = "<h2>Drawing Details</h2>";
    const grid = document.createElement("div");
    grid.className = "v2-detail-grid";
    const items = detailAssets.length ? detailAssets : [{ label: "Detail target" }, { label: "Model evidence" }, { label: "Calculation context" }];
    items.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "v2-detail-card";
      const image = item.image ? assetPath(item.image) : images[index];
      if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = item.alt || item.label || "Structural detail crop";
        figure.append(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "v2-detail-placeholder";
        figure.append(placeholder);
      }
      const caption = document.createElement("figcaption");
      caption.innerHTML = `
        <span class="v2-detail-label">${item.sheet || "Detail"}</span>
        <p>${item.label || "Selected structural detail"}</p>
      `;
      figure.append(caption);
      grid.append(figure);
    });
    detailSection.append(grid);

    root.append(hero, content, detailSection);
  }

  function init() {
    renderHome();
    renderWorkGrid();
    renderCaseStudy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

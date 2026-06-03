(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const grid = document.querySelector("[data-project-grid]");
  const filterBar = document.querySelector("[data-filter-bar]");
  const modal = document.querySelector("[data-project-modal]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalType = document.querySelector("[data-modal-type]");
  const modalSummary = document.querySelector("[data-modal-summary]");
  const modalMedia = document.querySelector("[data-modal-media]");
  const tabList = document.querySelector("[data-tab-list]");
  const tabPanel = document.querySelector("[data-tab-panel]");
  const closeModal = document.querySelector("[data-close-modal]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-current-year]");
  let activeProject = projects[0];
  let activeFilter = "All";
  let modalAnimationProject = null;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") !== "true";
      nav.setAttribute("data-open", String(open));
      navToggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", () => {
      nav.removeAttribute("data-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  function uniqueTypes() {
    return ["All", ...new Set(projects.map((project) => project.type))];
  }

  function renderFilters() {
    if (!filterBar) return;
    filterBar.innerHTML = "";
    uniqueTypes().forEach((type) => {
      const button = document.createElement("button");
      button.className = "filter-button";
      button.type = "button";
      button.textContent = type;
      button.setAttribute("aria-pressed", String(type === activeFilter));
      button.addEventListener("click", () => {
        activeFilter = type;
        renderFilters();
        renderProjects();
      });
      filterBar.appendChild(button);
    });
  }

  function renderProjects() {
    if (!grid) return;
    grid.innerHTML = "";
    projects
      .filter((project) => activeFilter === "All" || project.type === activeFilter)
      .forEach((project) => {
        const card = document.createElement("button");
        card.className = "project-card";
        card.type = "button";
        card.setAttribute("aria-label", `Open ${project.title} case study`);
        card.innerHTML = `
          <div class="project-card-visual" style="background: linear-gradient(135deg, ${project.color}, #d69b33)">
            <span>${project.initials}</span>
          </div>
          <div class="project-card-body">
            <p class="project-meta">${project.type} / ${project.year}</p>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            <div class="tag-list">${project.sourceAssets.map((asset) => `<span>${asset}</span>`).join("")}</div>
          </div>
        `;
        card.addEventListener("click", () => openProject(project));
        grid.appendChild(card);
      });
  }

  function openProject(project) {
    activeProject = project;
    modalTitle.textContent = project.title;
    modalType.textContent = `${project.type} / ${project.year}`;
    modalSummary.textContent = project.summary;
    renderTabs("Overview");
    document.body.classList.add("modal-open");
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
    renderModalMedia(project);
  }

  function closeProject() {
    document.body.classList.remove("modal-open");
    modalAnimationProject = null;
    if (modalMedia) {
      modalMedia.innerHTML = '<canvas id="modalCanvas" width="720" height="520"></canvas>';
    }
    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }
  }

  function renderTabs(activeTab) {
    tabList.innerHTML = "";
    Object.keys(activeProject.tabs).forEach((tabName) => {
      const tab = document.createElement("button");
      tab.className = "tab-button";
      tab.type = "button";
      tab.role = "tab";
      tab.textContent = tabName;
      tab.setAttribute("aria-selected", String(tabName === activeTab));
      tab.addEventListener("click", () => renderTabs(tabName));
      tabList.appendChild(tab);
    });

    tabPanel.innerHTML = `
      <h3>${activeTab}</h3>
      <p>${activeProject.tabs[activeTab]}</p>
      <p><strong>Asset folder:</strong> ${activeProject.assetFolder}</p>
      ${renderSwiftXRStatus(activeProject)}
      <ul>${activeProject.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
    `;
  }

  function renderSwiftXRStatus(project) {
    if (!project.swiftxr) return "";
    const status = getSafeEmbedUrl(project.swiftxr.embedUrl) ? "configured" : "waiting for embed URL";
    return `
      <div class="asset-note">
        <strong>SwiftXR:</strong> ${status}.
        <span>${project.swiftxr.note}</span>
      </div>
    `;
  }

  function getSafeEmbedUrl(url) {
    if (!url) return "";
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.protocol === "https:" ? parsed.href : "";
    } catch (error) {
      return "";
    }
  }

  function renderModalMedia(project) {
    if (!modalMedia) return;
    const embedUrl = getSafeEmbedUrl(project.swiftxr?.embedUrl || "");

    if (embedUrl) {
      modalAnimationProject = null;
      modalMedia.innerHTML = `
        <div class="swiftxr-frame-wrap">
          <iframe
            src="${embedUrl}"
            title="${project.title} SwiftXR interactive 3D model"
            loading="lazy"
            allow="accelerometer; autoplay; camera; fullscreen; gyroscope; magnetometer; xr-spatial-tracking"
            allowfullscreen
          ></iframe>
        </div>
      `;
      return;
    }

    if (project.swiftxr) {
      modalAnimationProject = null;
      modalMedia.innerHTML = `
        <div class="swiftxr-empty">
          <p class="eyebrow">SwiftXR Viewer Slot</p>
          <h3>${project.title}</h3>
          <p>Publish the model in SwiftXR, copy the embed code, then paste the iframe <code>src</code> URL into <code>js/projects.js</code>.</p>
          <p class="file-path">${project.assetFolder}</p>
        </div>
      `;
      return;
    }

    modalAnimationProject = project;
    modalMedia.innerHTML = '<canvas id="modalCanvas" width="720" height="520"></canvas>';
    drawModel("modalCanvas", 0, project);
  }

  if (closeModal) {
    closeModal.addEventListener("click", closeProject);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeProject();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.open) closeProject();
  });

  function drawModel(canvasId, frame, project = projects[0]) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(320, rect.width || canvas.width);
    const height = Math.max(260, rect.height || canvas.height);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);

    const color = project?.color || "#1b7b77";
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#24221f";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 253, 248, 0.08)";
    ctx.lineWidth = 1;
    for (let x = -80; x < width + 120; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height * 0.56, 0);
      ctx.stroke();
    }
    for (let y = 30; y < height; y += 34) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y - width * 0.28);
      ctx.stroke();
    }

    const cx = width * 0.5;
    const cy = height * 0.52;
    const sway = Math.sin(frame * 0.02) * 8;
    const baysX = 4;
    const baysY = 3;
    const levels = 3;
    const spacingX = Math.min(width / 9, 86);
    const spacingY = spacingX * 0.52;
    const levelHeight = Math.min(height / 7, 58);
    const points = [];

    function iso(x, y, z) {
      return {
        x: cx + (x - y) * spacingX + sway * (z / levels),
        y: cy + (x + y) * spacingY - z * levelHeight
      };
    }

    for (let z = 0; z <= levels; z += 1) {
      for (let x = 0; x <= baysX; x += 1) {
        for (let y = 0; y <= baysY; y += 1) {
          points.push({ x, y, z, p: iso(x - baysX / 2, y - baysY / 2, z) });
        }
      }
    }

    function point(x, y, z) {
      return points.find((node) => node.x === x && node.y === y && node.z === z).p;
    }

    function line(a, b, stroke, widthValue) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = widthValue;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    for (let z = 0; z <= levels; z += 1) {
      for (let x = 0; x <= baysX; x += 1) {
        for (let y = 0; y < baysY; y += 1) {
          line(point(x, y, z), point(x, y + 1, z), "rgba(255,253,248,0.55)", 2);
        }
      }
      for (let y = 0; y <= baysY; y += 1) {
        for (let x = 0; x < baysX; x += 1) {
          line(point(x, y, z), point(x + 1, y, z), "rgba(255,253,248,0.5)", 2);
        }
      }
    }

    for (let x = 0; x <= baysX; x += 1) {
      for (let y = 0; y <= baysY; y += 1) {
        for (let z = 0; z < levels; z += 1) {
          const emphasis = x === baysX || y === 0 ? 0.92 : 0.62;
          line(point(x, y, z), point(x, y, z + 1), `rgba(255,253,248,${emphasis})`, 3);
        }
      }
    }

    for (let z = 1; z <= levels; z += 1) {
      for (let x = 0; x < baysX; x += 1) {
        const a = point(x, 0, z - 1);
        const b = point(x + 1, 0, z);
        line(a, b, color, 4);
      }
    }

    const pulse = (Math.sin(frame * 0.035) + 1) / 2;
    const hot = point(baysX, 0, 1);
    const gradient = ctx.createRadialGradient(hot.x, hot.y, 8, hot.x, hot.y, 92 + pulse * 16);
    gradient.addColorStop(0, "rgba(214,155,51,0.75)");
    gradient.addColorStop(0.48, "rgba(182,95,58,0.25)");
    gradient.addColorStop(1, "rgba(182,95,58,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(hot.x, hot.y, 100, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 253, 248, 0.78)";
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillText("web-ready model slot", 24, 34);
    ctx.fillStyle = "rgba(255, 253, 248, 0.45)";
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.fillText("replace with GLB / model screenshots / turntable export", 24, 55);
  }

  function animate(frame) {
    drawModel("modelCanvas", frame, projects[0]);
    if (modalAnimationProject) drawModel("modalCanvas", frame, modalAnimationProject);
    window.requestAnimationFrame(animate);
  }

  renderFilters();
  renderProjects();
  window.requestAnimationFrame(animate);
  window.addEventListener("resize", () => {
    drawModel("modelCanvas", 0, projects[0]);
    if (modalAnimationProject) drawModel("modalCanvas", 0, modalAnimationProject);
  });
})();

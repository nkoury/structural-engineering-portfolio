(function () {
  const source = window.PORTFOLIO_CONTENT || {};
  const projectCatalog = window.PORTFOLIO_PROJECTS || [];
  const form = document.querySelector("[data-content-editor]");
  const status = document.querySelector("[data-editor-status]");
  const githubTokenInput = document.querySelector("[data-github-token]");
  const githubPublishButton = document.querySelector("[data-publish-github]");
  const draft = structuredClone(source);
  let saveHandle = null;
  let activeView = "home";
  let activeProjectId = projectIds()[0] || "";

  const githubPublishConfig = {
    owner: "nkoury",
    repo: "structural-engineering-portfolio",
    branch: "main",
    path: "js/content.js",
    liveUrl: "https://noahkoury.com"
  };
  const githubTokenStorageKey = "portfolio-content-editor-github-token";

  const viewTabs = [
    { id: "home", label: "Landing" },
    { id: "works", label: "Works" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "project", label: "Projects" }
  ];

  function projectIds() {
    const catalogIds = projectCatalog.map((project) => project.id).filter(Boolean);
    const contentIds = Object.keys(draft.projects || {});
    return [...new Set([...catalogIds, ...contentIds])];
  }

  function normalizePath(path) {
    return Array.isArray(path) ? path : String(path).split(".");
  }

  function getByPath(path, fallback = "") {
    const value = normalizePath(path).reduce((current, part) => current?.[part], draft);
    return value === undefined || value === null ? fallback : value;
  }

  function setByPath(path, value) {
    const parts = normalizePath(path);
    let current = draft;
    parts.slice(0, -1).forEach((part) => {
      if (!current[part] || typeof current[part] !== "object") current[part] = {};
      current = current[part];
    });
    current[parts[parts.length - 1]] = value;
  }

  function projectContent(id) {
    return draft.projects?.[id] || {};
  }

  function projectMeta(id) {
    const catalog = projectCatalog.find((project) => project.id === id) || {};
    return {
      ...catalog,
      ...(draft.projects?.[id] || {}),
      modelOptions: mergeIndexed(catalog.modelOptions, draft.projects?.[id]?.modelOptions),
      galleryTiles: mergeIndexed(catalog.galleryTiles, draft.projects?.[id]?.galleryTiles)
    };
  }

  function mergeIndexed(base = [], overlay = []) {
    const length = Math.max(base.length, overlay.length);
    return Array.from({ length }, (_, index) => ({
      ...(base[index] || {}),
      ...(overlay[index] || {})
    }));
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function getStoredToken() {
    try {
      return sessionStorage.getItem(githubTokenStorageKey) || "";
    } catch (error) {
      return "";
    }
  }

  function setStoredToken(token) {
    try {
      if (token) {
        sessionStorage.setItem(githubTokenStorageKey, token);
      } else {
        sessionStorage.removeItem(githubTokenStorageKey);
      }
    } catch (error) {
      // Publishing still works; the token just cannot be remembered for the tab.
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  }

  function createElement(tag, className, attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "text") {
        element.textContent = value;
      } else if (key === "html") {
        element.innerHTML = value;
      } else if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (value !== undefined && value !== null) {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  function autoSize(input) {
    if (input.tagName !== "TEXTAREA") return;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  }

  function editable(path, options = {}) {
    const isMultiline = options.multiline !== false && !options.singleLine;
    const input = document.createElement(isMultiline ? "textarea" : "input");
    input.className = `editor-live-input ${options.className || ""}`.trim();
    input.value = getByPath(path, options.fallback || "");
    input.setAttribute("aria-label", options.label || normalizePath(path).join(" "));
    if (!isMultiline) input.type = "text";
    if (options.placeholder) input.placeholder = options.placeholder;
    if (options.rows) input.rows = options.rows;

    input.addEventListener("input", () => {
      setByPath(path, input.value);
      autoSize(input);
      setStatus("Unsaved edits.");
    });

    requestAnimationFrame(() => autoSize(input));
    return input;
  }

  function field(label, path, options = {}) {
    const wrapper = createElement("label", `editor-live-field ${options.fieldClass || ""}`.trim());
    const span = createElement("span", "", { text: label });
    wrapper.append(span, editable(path, { ...options, label }));
    return wrapper;
  }

  function imageField(label, path) {
    const wrapper = createElement("div", "editor-live-image-field");
    const imageShell = createElement("div", "about-photo editor-editable-photo");
    const image = createElement("img", "", { alt: `${label} preview` });
    const placeholder = createElement("span", "", { text: label });
    const value = getByPath(path);

    function update(valueToShow) {
      if (valueToShow) {
        image.src = valueToShow;
        image.hidden = false;
        placeholder.hidden = true;
      } else {
        image.removeAttribute("src");
        image.hidden = true;
        placeholder.hidden = false;
      }
    }

    const actions = createElement("div", "editor-live-image-actions");
    const uploadLabel = createElement("label", "editor-file-button", { text: "Upload" });
    const fileInput = createElement("input", "");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    uploadLabel.appendChild(fileInput);

    const clearButton = createElement("button", "", { type: "button", text: "Clear" });
    actions.append(uploadLabel, clearButton);
    imageShell.append(image, placeholder);
    wrapper.append(createElement("p", "project-kicker", { text: label }), imageShell, actions);

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      try {
        const nextValue = await readFileAsDataUrl(file);
        setByPath(path, nextValue);
        update(nextValue);
        setStatus(`Uploaded ${file.name} into content.js.`);
      } catch (error) {
        setStatus(`Upload failed: ${error.message}`);
      }
    });

    clearButton.addEventListener("click", () => {
      setByPath(path, "");
      update("");
      setStatus(`${label} image cleared.`);
    });

    update(value);
    return wrapper;
  }

  function renderEditor() {
    if (!form) return;
    form.innerHTML = "";

    const shell = createElement("section", "editor-live-shell");
    const nav = createElement("nav", "editor-live-nav", { "aria-label": "Editor page previews" });
    const canvas = createElement("div", "editor-live-canvas");

    viewTabs.forEach((tab) => {
      const button = createElement("button", "", { type: "button", text: tab.label });
      if (tab.id === activeView) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        activeView = tab.id;
        renderEditor();
      });
      nav.appendChild(button);
    });

    shell.append(nav, canvas);
    form.appendChild(shell);
    renderActiveView(canvas);
  }

  function renderActiveView(canvas) {
    const renderers = {
      home: renderHomeView,
      works: renderWorksView,
      about: renderAboutView,
      contact: renderContactView,
      project: renderProjectView
    };
    (renderers[activeView] || renderHomeView)(canvas);
  }

  function renderHomeView(canvas) {
    const page = createElement("div", "editor-preview-page editor-preview-home");
    const landing = createElement("section", "landing home-landing");
    const name = createElement("div", "landing-name");
    name.append(
      editable("pages.home.eyebrow", { singleLine: true, className: "as-kicker", label: "Landing eyebrow" }),
      editable("pages.home.title", { singleLine: true, className: "as-hero", label: "Landing title" })
    );

    const tabs = createElement("div", "landing-tabs");
    [
      ["pages.home.tabs.works", "01"],
      ["pages.home.tabs.about", "02"],
      ["pages.home.tabs.contact", "03"]
    ].forEach(([path, number]) => {
      const link = createElement("div", "editor-tab-card");
      link.append(createElement("span", "", { text: number }), editable(path, { singleLine: true, className: "as-tab", label: path }));
      tabs.appendChild(link);
    });

    landing.append(name, tabs);
    page.appendChild(landing);
    canvas.appendChild(page);
  }

  function renderWorksView(canvas) {
    const page = createElement("div", "editor-preview-page");
    const intro = createElement("section", "editor-live-public-section");
    const title = editable("pages.works.title", { singleLine: true, className: "as-page-title", label: "Works title" });
    const introText = createElement("div", "section-intro");
    introText.appendChild(editable("pages.works.intro", { className: "as-body", label: "Works intro" }));
    intro.append(title, introText);

    const grid = createElement("section", "works-grid editor-works-grid");
    projectIds().forEach((id) => {
      const project = projectMeta(id);
      const card = createElement("button", "work-card editor-work-card", { type: "button" });
      card.style.setProperty("--tile-color", project.color || "#5f6769");
      card.addEventListener("click", () => {
        activeView = "project";
        activeProjectId = id;
        renderEditor();
      });

      const preview = createElement("div", "work-card-media editor-card-media");
      const modelCount = project.modelOptions?.length || 0;
      preview.appendChild(createElement("span", "", { text: modelCount ? `${modelCount} model view${modelCount === 1 ? "" : "s"}` : "Project visual" }));

      const body = createElement("div", "work-project-tab");
      body.append(
        createElement("span", "", { text: project.type || "Project Type" }),
        createElement("strong", "", { text: project.title || id })
      );
      card.append(preview, body);
      grid.appendChild(card);
    });

    page.append(intro, grid);
    canvas.appendChild(page);
  }

  function renderAboutView(canvas) {
    const page = createElement("div", "editor-preview-page");
    const hero = createElement("section", "project-hero about-hero editor-about-hero");
    const title = createElement("div", "project-title");
    title.append(
      editable("pages.about.kicker", { singleLine: true, className: "as-kicker", label: "About kicker" }),
      editable("pages.about.title", { singleLine: true, className: "as-project-title", label: "About title" }),
      editable("pages.about.intro", { className: "as-body", label: "About intro" })
    );

    const photos = createElement("div", "about-photo-grid editor-about-photo-grid");
    photos.append(
      imageField(getByPath("pages.about.photoLabels.portrait", "Portrait"), "pages.about.photoImages.portrait"),
      imageField(getByPath("pages.about.photoLabels.field", "Field"), "pages.about.photoImages.field"),
      imageField(getByPath("pages.about.photoLabels.pursuit", "Pursuit"), "pages.about.photoImages.pursuit")
    );
    hero.append(title, photos);

    const pursuits = createElement("section", "project-section editor-live-public-section");
    const pursuitText = createElement("div", "");
    pursuitText.append(
      editable("pages.about.personalPursuitsParagraphs.0", { className: "as-body", label: "Personal pursuit paragraph 1" }),
      editable("pages.about.personalPursuitsParagraphs.1", { className: "as-body", label: "Personal pursuit paragraph 2" })
    );
    pursuits.append(
      editable("pages.about.personalPursuitsTitle", { singleLine: true, className: "as-section-title", label: "Personal pursuits title" }),
      pursuitText
    );

    const approach = createElement("section", "project-section editor-live-public-section");
    const list = createElement("ul", "detail-list editor-approach-list");
    (getByPath("pages.about.engineeringApproachItems", []) || []).forEach((item, index) => {
      const row = createElement("li", "");
      row.append(
        editable(`pages.about.engineeringApproachItems.${index}.label`, {
          singleLine: true,
          className: "as-list-label",
          label: `Approach ${index + 1} label`
        }),
        editable(`pages.about.engineeringApproachItems.${index}.text`, {
          className: "as-list-text",
          label: `Approach ${index + 1} text`
        })
      );
      list.appendChild(row);
    });
    approach.append(
      editable("pages.about.engineeringApproachTitle", {
        singleLine: true,
        className: "as-section-title",
        label: "Engineering approach title"
      }),
      list
    );

    page.append(hero, pursuits, approach);
    canvas.appendChild(page);
  }

  function renderContactView(canvas) {
    const page = createElement("div", "editor-preview-page");
    const layout = createElement("section", "contact-layout editor-contact-layout");
    const heading = createElement("div", "contact-heading");
    heading.appendChild(editable("pages.contact.title", { singleLine: true, className: "as-page-title", label: "Contact title" }));

    const intro = createElement("div", "contact-intro");
    intro.appendChild(editable("pages.contact.intro", { className: "as-body", label: "Contact intro" }));

    const panel = createElement("div", "contact-panel editor-contact-panel");
    const emailCard = createElement("div", "editor-contact-card");
    emailCard.append(
      editable("pages.contact.emailLabel", { singleLine: true, className: "as-card-label", label: "Email label" }),
      editable("pages.contact.email", { singleLine: true, className: "as-contact-value", label: "Email address" })
    );
    const linkedInCard = createElement("div", "editor-contact-card");
    linkedInCard.append(
      editable("pages.contact.linkedinLabel", { singleLine: true, className: "as-card-label", label: "LinkedIn label" }),
      editable("pages.contact.linkedinName", { singleLine: true, className: "as-contact-value large", label: "LinkedIn display name" }),
      field("LinkedIn URL", "pages.contact.linkedinUrl", { singleLine: true })
    );
    panel.append(emailCard, linkedInCard);
    layout.append(heading, intro, panel);
    page.appendChild(layout);
    canvas.appendChild(page);
  }

  function renderProjectView(canvas) {
    const ids = projectIds();
    if (!activeProjectId || !ids.includes(activeProjectId)) activeProjectId = ids[0] || "";

    const page = createElement("div", "editor-preview-page");
    const selector = createElement("div", "editor-project-selector");
    ids.forEach((id) => {
      const project = projectMeta(id);
      const button = createElement("button", "", { type: "button", text: project.title || id });
      if (id === activeProjectId) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        activeProjectId = id;
        renderEditor();
      });
      selector.appendChild(button);
    });

    const project = projectMeta(activeProjectId);
    const path = `projects.${activeProjectId}`;
    const hero = createElement("section", "project-hero editor-project-hero");
    const title = createElement("div", "project-title");
    title.append(
      editable(`${path}.type`, { singleLine: true, className: "as-kicker", label: "Project type" }),
      editable(`${path}.title`, { singleLine: true, className: "as-project-title", label: "Project title" }),
      editable(`${path}.summary`, { className: "as-body", label: "Project summary" })
    );

    const modelStage = createElement("div", "model-stage editor-model-stage");
    const modelButtons = createElement("div", "model-switcher");
    (project.modelOptions || []).forEach((model, index) => {
      const button = createElement("button", "", { type: "button", text: model.label || `Model ${index + 1}` });
      if (index === 0) button.setAttribute("aria-pressed", "true");
      modelButtons.appendChild(button);
    });
    const modelPreview = createElement("div", "editor-model-placeholder");
    modelPreview.append(
      createElement("span", "project-kicker", { text: "3D Model Area" }),
      createElement("strong", "", { text: project.title || "Project model" })
    );
    modelStage.append(modelButtons, modelPreview);
    hero.append(title, modelStage);

    const body = createElement("div", "project-body editor-project-body");
    const projectSection = createElement("section", "project-section");
    const sectionCopy = createElement("div", "");
    sectionCopy.append(
      editable(`${path}.scope`, { className: "as-body as-scope", label: "Project section intro" }),
      renderProjectDetailList(path)
    );
    projectSection.append(
      editable(`${path}.projectTypeTitle`, { singleLine: true, className: "as-section-title", label: "Section title" }),
      sectionCopy
    );

    const models = renderProjectModelFields(path, projectContent(activeProjectId).modelOptions || []);
    body.append(projectSection, models);
    page.append(selector, hero, body);
    canvas.appendChild(page);
  }

  function renderProjectDetailList(path) {
    const list = createElement("ul", "detail-list editor-project-details");
    [
      ["systemLabel", "system", "System"],
      ["primaryMediaLabel", "primaryMedia", "Primary media"],
      ["statusLabel", "status", "Status"]
    ].forEach(([labelKey, valueKey, fallback]) => {
      const row = createElement("li", "");
      row.append(
        editable(`${path}.${labelKey}`, { singleLine: true, className: "as-list-label", label: `${fallback} label` }),
        editable(`${path}.${valueKey}`, { className: "as-list-text", label: `${fallback} value` })
      );
      list.appendChild(row);
    });
    return list;
  }

  function renderProjectModelFields(path, models) {
    const section = createElement("section", "editor-model-copy-section");
    section.appendChild(createElement("h2", "", { text: "Model Button Text" }));

    const grid = createElement("div", "editor-model-copy-grid");
    models.forEach((model, index) => {
      const card = createElement("div", "editor-model-copy-card");
      card.append(
        createElement("p", "project-kicker", { text: `Model ${index + 1}` }),
        field("Button label", `${path}.modelOptions.${index}.label`, { singleLine: true }),
        field("Accessible description", `${path}.modelOptions.${index}.alt`, {})
      );
      grid.appendChild(card);
    });

    if (!models.length) {
      grid.appendChild(createElement("p", "editor-live-note", { text: "No model text fields are available for this project yet." }));
    }

    section.appendChild(grid);
    return section;
  }

  function serializeContent() {
    return `window.PORTFOLIO_CONTENT = ${JSON.stringify(draft, null, 2)};\n`;
  }

  function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, index + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  async function readJsonResponse(response, fallbackMessage) {
    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      // GitHub usually returns JSON errors, but keep failures readable if it does not.
    }

    if (!response.ok) {
      throw new Error(payload?.message || fallbackMessage || response.statusText);
    }

    return payload;
  }

  function githubHeaders(token) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  function githubContentUrl() {
    const { owner, repo, path } = githubPublishConfig;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    return `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  }

  async function publishContentToGitHub() {
    if (!githubTokenInput || !githubPublishButton) return;

    const token = githubTokenInput.value.trim();
    if (!token) {
      setStatus("Paste a fine-grained GitHub token first.");
      githubTokenInput.focus();
      return;
    }

    // Never hard-code the GitHub token in this public site. Use a fine-grained
    // token scoped only to this repository with Contents read/write permission.
    setStoredToken(token);
    githubPublishButton.disabled = true;
    githubPublishButton.textContent = "Publishing...";

    try {
      const url = githubContentUrl();
      const headers = githubHeaders(token);
      const fileText = serializeContent();

      setStatus("Reading current GitHub content.js...");
      const currentResponse = await fetch(`${url}?ref=${encodeURIComponent(githubPublishConfig.branch)}`, {
        headers
      });
      const currentFile = await readJsonResponse(currentResponse, "Could not read content.js from GitHub.");

      setStatus("Publishing content.js to GitHub...");
      const updateResponse = await fetch(url, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          branch: githubPublishConfig.branch,
          message: "Update site content from content editor",
          content: encodeBase64(fileText),
          sha: currentFile.sha
        })
      });
      const result = await readJsonResponse(updateResponse, "Could not publish content.js to GitHub.");
      const shortSha = result?.commit?.sha ? result.commit.sha.slice(0, 7) : "created";

      setStatus(
        `Published content.js to GitHub (${shortSha}). GitHub Pages should update shortly; open the live site to confirm.`
      );
    } finally {
      githubPublishButton.disabled = false;
      githubPublishButton.textContent = "Publish content to GitHub";
    }
  }

  function downloadContent() {
    const blob = new Blob([serializeContent()], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content.js";
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus("Downloaded content.js.");
  }

  function parseContentFile(text) {
    const match = text.match(/window\.PORTFOLIO_CONTENT\s*=\s*([\s\S]*?);\s*$/);
    if (match) return JSON.parse(match[1]);
    return JSON.parse(text);
  }

  async function saveContent() {
    const fileText = serializeContent();

    if ("showSaveFilePicker" in window) {
      saveHandle =
        saveHandle ||
        (await window.showSaveFilePicker({
          suggestedName: "content.js",
          types: [
            {
              description: "Portfolio content file",
              accept: { "text/javascript": [".js"] }
            }
          ]
        }));
      const writable = await saveHandle.createWritable();
      await writable.write(fileText);
      await writable.close();
      setStatus("Saved content.js.");
      return;
    }

    downloadContent();
  }

  document.querySelector("[data-download-content]")?.addEventListener("click", downloadContent);

  document.querySelector("[data-copy-content]")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(serializeContent());
    setStatus("Copied content.js text.");
  });

  document.querySelector("[data-save-content]")?.addEventListener("click", () => {
    saveContent().catch((error) => setStatus(`Save failed: ${error.message}`));
  });

  if (githubTokenInput) {
    githubTokenInput.value = getStoredToken();
    githubTokenInput.addEventListener("input", () => {
      setStoredToken(githubTokenInput.value);
    });
  }

  githubPublishButton?.addEventListener("click", () => {
    publishContentToGitHub().catch((error) => setStatus(`Publish failed: ${error.message}`));
  });

  document.querySelector("[data-import-content]")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = parseContentFile(await file.text());
      Object.keys(draft).forEach((key) => delete draft[key]);
      Object.assign(draft, imported);
      activeProjectId = projectIds()[0] || "";
      renderEditor();
      setStatus(`Imported ${file.name}.`);
    } catch (error) {
      setStatus(`Import failed: ${error.message}`);
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  renderEditor();
})();

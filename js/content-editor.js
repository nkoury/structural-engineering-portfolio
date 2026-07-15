(function () {
  const source = window.PORTFOLIO_CONTENT || {};
  const form = document.querySelector("[data-content-editor]");
  const status = document.querySelector("[data-editor-status]");
  const githubTokenInput = document.querySelector("[data-github-token]");
  const githubPublishButton = document.querySelector("[data-publish-github]");
  const draft = structuredClone(source);
  let saveHandle = null;

  const githubPublishConfig = {
    owner: "nkoury",
    repo: "structural-engineering-portfolio",
    branch: "main",
    path: "js/content.js",
    liveUrl: "https://noahkoury.com"
  };
  const githubTokenStorageKey = "portfolio-content-editor-github-token";

  const sections = [
    ["global", "Global"],
    ["pages.home", "Landing Page"],
    ["pages.works", "Highlighted Works"],
    ["pages.about", "About Me"],
    ["pages.contact", "Contact Page"],
    ["projects", "Projects"],
  ];

  function getByPath(path) {
    return path.reduce((current, part) => current?.[part], draft);
  }

  function setByPath(path, value) {
    let current = draft;
    path.slice(0, -1).forEach((part) => {
      current = current[part];
    });
    current[path[path.length - 1]] = value;
  }

  function labelFor(key) {
    return String(key)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function shouldUseTextarea(key, value) {
    return (
      String(value).length > 80 ||
      /alt|body|description|intro|metaDescription|note|paragraph|scope|summary|text|value/i.test(String(key))
    );
  }

  function isDetailImageField(path, key) {
    return key === "image" && path.includes("detailAssets");
  }

  function isAboutImageField(path) {
    return path.join(".").startsWith("pages.about.photoImages.");
  }

  function isImageUploadField(path, key) {
    return isDetailImageField(path, key) || isAboutImageField(path);
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

  function updateImagePreview(preview, value) {
    if (!preview) return;
    preview.innerHTML = "";

    if (!value) {
      preview.hidden = true;
      return;
    }

    const image = document.createElement("img");
    image.src = value;
    image.alt = "Selected image preview";
    preview.appendChild(image);
    preview.hidden = false;
  }

  function renderImageUpload(parent, path, input, options = {}) {
    const tools = document.createElement("div");
    tools.className = "editor-image-tools";

    const uploadLabel = document.createElement("label");
    uploadLabel.className = "editor-file-button editor-image-upload";
    uploadLabel.textContent = options.uploadLabel || "Upload image";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    uploadLabel.appendChild(fileInput);

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.textContent = "Clear image";

    tools.append(uploadLabel, clearButton);

    const preview = document.createElement("div");
    preview.className = "editor-image-preview";
    updateImagePreview(preview, input.value);

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      try {
        const value = await readFileAsDataUrl(file);
        input.value = value;
        setByPath(path, value);
        updateImagePreview(preview, value);
        setStatus(`Uploaded ${file.name} into content.js.`);
      } catch (error) {
        setStatus(`Upload failed: ${error.message}`);
      }
    });

    clearButton.addEventListener("click", () => {
      input.value = "";
      setByPath(path, "");
      updateImagePreview(preview, "");
      setStatus(options.clearStatus || "Image cleared.");
    });

    parent.append(tools, preview);
  }

  function renderString(parent, path, key, value) {
    const label = document.createElement("label");
    label.className = "editor-field";

    const span = document.createElement("span");
    span.textContent = labelFor(key);
    label.appendChild(span);

    const input = shouldUseTextarea(key, value) ? document.createElement("textarea") : document.createElement("input");
    input.value = value || "";
    if (input.tagName === "TEXTAREA") input.rows = Math.min(8, Math.max(3, Math.ceil(String(value).length / 70)));
    input.addEventListener("input", () => {
      setByPath(path, input.value);
      setStatus("Unsaved edits.");
    });

    label.appendChild(input);
    if (isImageUploadField(path, key)) {
      renderImageUpload(label, path, input, {
        uploadLabel: isDetailImageField(path, key) ? "Upload detail image" : "Upload about image",
        clearStatus: isDetailImageField(path, key) ? "Detail image cleared." : "About image cleared."
      });
    }
    parent.appendChild(label);
  }

  function renderArray(parent, path, key, value) {
    const wrapper = document.createElement("fieldset");
    wrapper.className = "editor-fieldset editor-array";
    const legend = document.createElement("legend");
    legend.textContent = labelFor(key);
    wrapper.appendChild(legend);

    value.forEach((item, index) => {
      const itemBox = document.createElement("fieldset");
      itemBox.className = "editor-nested";
      const itemLegend = document.createElement("legend");
      itemLegend.textContent = item?.title || item?.label || item?.id || `${labelFor(key)} ${index + 1}`;
      itemBox.appendChild(itemLegend);

      if (typeof item === "string") {
        renderString(itemBox, [...path, index], index + 1, item);
      } else if (item && typeof item === "object") {
        renderObject(itemBox, [...path, index], item);
      }

      wrapper.appendChild(itemBox);
    });

    parent.appendChild(wrapper);
  }

  function renderObject(parent, path, value) {
    Object.entries(value).forEach(([key, item]) => {
      const itemPath = [...path, key];
      if (typeof item === "string") {
        renderString(parent, itemPath, key, item);
      } else if (Array.isArray(item)) {
        renderArray(parent, itemPath, key, item);
      } else if (item && typeof item === "object") {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "editor-fieldset";
        const legend = document.createElement("legend");
        legend.textContent = labelFor(key);
        fieldset.appendChild(legend);
        renderObject(fieldset, itemPath, item);
        parent.appendChild(fieldset);
      }
    });
  }

  function renderEditor() {
    if (!form) return;
    form.innerHTML = "";
    sections.forEach(([pathString, title]) => {
      const path = pathString.split(".");
      const value = getByPath(path);
      if (!value) return;

      const section = document.createElement("section");
      section.className = "editor-section";
      const heading = document.createElement("h2");
      heading.textContent = title;
      section.appendChild(heading);
      renderObject(section, path, value);
      form.appendChild(section);
    });
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
      renderEditor();
      setStatus(`Imported ${file.name}.`);
    } catch (error) {
      setStatus(`Import failed: ${error.message}`);
    }
  });

  renderEditor();
})();

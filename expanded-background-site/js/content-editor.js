(function () {
  const source = window.PORTFOLIO_CONTENT || {};
  const form = document.querySelector("[data-content-editor]");
  const status = document.querySelector("[data-editor-status]");
  const draft = structuredClone(source);
  let saveHandle = null;

  const sections = [
    ["global", "Global"],
    ["pages.home", "Landing Page"],
    ["pages.works", "Highlighted Works"],
    ["pages.process", "Process Page"],
    ["pages.about", "About Me"],
    ["pages.contact", "Contact Page"],
    ["projectPage", "Shared Project Page Text"],
    ["projects", "Projects"],
    ["processAssets", "Process Assets"]
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

  function setStatus(message) {
    if (status) status.textContent = message;
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

(function () {
  const content = window.PORTFOLIO_CONTENT || {};

  function getContentValue(path, fallback) {
    if (!path) return fallback;
    const value = path.split(".").reduce((current, part) => {
      if (current === undefined || current === null) return undefined;
      return current[part];
    }, content);
    return value === undefined || value === null ? fallback : value;
  }

  function setMeta() {
    const pageId = document.body?.dataset.page;
    if (!pageId) return;

    const page = getContentValue(`pages.${pageId}`, {});
    if (page.metaTitle) {
      document.title = page.metaTitle;
    }

    const description = document.querySelector('meta[name="description"]');
    if (description && page.metaDescription) {
      description.setAttribute("content", page.metaDescription);
    }
  }

  function applyTextBindings() {
    document.querySelectorAll("[data-content]").forEach((element) => {
      const value = getContentValue(element.dataset.content);
      if (typeof value === "string" || typeof value === "number") {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-content-href]").forEach((element) => {
      const value = getContentValue(element.dataset.contentHref);
      if (typeof value !== "string") return;
      element.setAttribute("href", `${element.dataset.hrefPrefix || ""}${value}`);
    });

    document.querySelectorAll("[data-content-paragraphs]").forEach((element) => {
      const paragraphs = getContentValue(element.dataset.contentParagraphs);
      if (!Array.isArray(paragraphs)) return;
      element.innerHTML = "";
      paragraphs.forEach((paragraph) => {
        const node = document.createElement("p");
        node.textContent = paragraph;
        element.appendChild(node);
      });
    });

    document.querySelectorAll("[data-content-list]").forEach((element) => {
      const items = getContentValue(element.dataset.contentList);
      if (!Array.isArray(items)) return;
      element.innerHTML = "";
      items.forEach((item) => {
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        const span = document.createElement("span");
        strong.textContent = item.label || "";
        span.textContent = item.text || "";
        li.append(strong, span);
        element.appendChild(li);
      });
    });
  }

  function overlayArray(target, source, textKeys) {
    if (!Array.isArray(target) || !Array.isArray(source)) return;
    source.forEach((sourceItem, index) => {
      const targetItem = target[index];
      if (!targetItem || !sourceItem) return;
      textKeys.forEach((key) => {
        if (typeof sourceItem[key] === "string") {
          targetItem[key] = sourceItem[key];
        }
      });
    });
  }

  function applyProjectContent() {
    const projects = window.PORTFOLIO_PROJECTS || [];
    const projectContent = content.projects || {};

    projects.forEach((project) => {
      const editable = projectContent[project.id];
      if (!editable) return;

      ["title", "type", "year", "summary", "system", "scope", "scopeNarrative"].forEach((key) => {
        if (typeof editable[key] === "string") {
          project[key] = editable[key];
        }
      });

      overlayArray(project.modelOptions, editable.modelOptions, ["label", "alt"]);
      overlayArray(project.detailSheets, editable.detailSheets, ["label", "note"]);
      overlayArray(project.detailAssets, editable.detailAssets, ["label", "alt"]);
      overlayArray(project.galleryTiles, editable.galleryTiles, ["label", "alt"]);
      overlayArray(project.processAssets, editable.processAssets, ["label", "title", "alt"]);
    });

    overlayArray(window.PORTFOLIO_PROCESS_ASSETS, content.processAssets, ["label", "title", "alt"]);
  }

  function applyEditableContent() {
    setMeta();
    applyTextBindings();
  }

  window.PORTFOLIO_CONTENT_HELPERS = {
    applyEditableContent,
    getContentValue
  };

  applyProjectContent();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyEditableContent);
  } else {
    applyEditableContent();
  }
})();

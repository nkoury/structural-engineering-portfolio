(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const ribbon = document.querySelector("[data-project-ribbon]");
  const collageGrid = document.querySelector("[data-collage-grid]");
  const year = document.querySelector("[data-current-year]");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (ribbon) {
    ribbon.innerHTML = [
      ...projects.map((project) => `<a href="${project.page}">${project.title}</a>`),
      '<a href="about.html">About Me</a>'
    ].join("");
  }

  if (collageGrid) {
    const tiles = projects.flatMap((project) =>
      project.galleryTiles.map((tile, index) => ({
        ...tile,
        project,
        index
      }))
    );

    collageGrid.innerHTML = tiles
      .map((tile) => {
        const image = tile.src
          ? `<img class="collage-image" src="${encodeURI(tile.src)}" alt="${tile.alt || `${tile.project.title} project image`}" />`
          : `<div class="collage-visual" style="--tile-color: ${tile.project.color}"></div>`;
        return `
          <a class="collage-link ${tile.size}" href="${tile.project.page}" aria-label="Open ${tile.project.title} project">
            ${image}
            <span class="collage-caption">
              <strong>${tile.project.title}</strong>
              <span>${tile.label}</span>
            </span>
          </a>
        `;
      })
      .join("");
  }
})();

# SwiftXR Workflow

SwiftXR embeds are handled as hosted interactive viewers.

## Recommended Flow

1. Keep original U3D files in a private local staging folder.
2. Upload or convert the model through SwiftXR's project editor.
3. Publish or update the SwiftXR project.
4. Copy the SwiftXR embed code.
5. Paste the iframe `src` URL into `js/projects.js` under the project `swiftxr.embedUrl` field.
6. The project page will automatically reveal its hosted model section when the URL is present.
7. Keep only public-safe preview assets in `assets/project-assets/<project-slug>/`.

## L Ranch Paths

- Private local U3D staging: `work/private-assets/l-ranch/u3d-source/`
- Public site assets: `assets/project-assets/l-ranch/`
- Native GLB viewer source: `assets/project-assets/l-ranch/models/trellis-gltf-colors.glb`
- Alternate split GLTF source: `assets/project-assets/l-ranch/models/Trellis gltf colors.gltf`
- Required split GLTF buffer: `assets/project-assets/l-ranch/models/Trellis gltf colors.bin`
- SwiftXR embed configuration: `js/projects.js`, project id `l-ranch`

## Notes

SwiftXR's HTML documentation describes copying embed code from the published project share modal and pasting it into the HTML source. This site wraps that pattern in project data so each case study can have its own hosted viewer.

SwiftXR's 3D content documentation recommends GLB/GLTF as web-friendly model formats. The SwiftXR indexable model viewer documentation lists GLB, GLTF, FBX, OBJ, STL, DAE, and folders as upload options. If SwiftXR does not accept the U3D files directly, convert or export one of those web-friendly versions for the viewer and keep the U3D PDF as source/reference material.

## References

- SwiftXR HTML integration: `https://guide.swiftxr.io/integrations/html`
- SwiftXR 3D content guidance: `https://guide.swiftxr.io/3d-content-creation/why-3d-on-the-web`
- SwiftXR indexable model viewer: `https://guide.swiftxr.io/components/indexable-model-viewer`

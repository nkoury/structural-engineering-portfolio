# Model Assets

Use this folder for public-safe L Ranch model assets.

Recommended public web assets:

- `trellis-gltf-colors.glb`
- `Trellis gltf colors.gltf`
- `Trellis gltf colors.bin`
- SwiftXR embed URL configured in `js/projects.js`
- Model preview images in `../preview/`
- Browser-friendly model exports if intentionally self-hosted

The live viewer uses the single-file GLB export because it is less brittle on GitHub Pages. For GLTF exports with external buffers, keep the `.gltf` file and its referenced `.bin` file together in this folder.

Keep original confidential U3D files in `work/private-assets/l-ranch/u3d-source/` unless you intentionally want them published.

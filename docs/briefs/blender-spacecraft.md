# Blender agent brief: spacecraft for an orbital website scene

## Assignment

Design and deliver a complete, browser-ready spacecraft exterior for Philipp Klinz's personal website. Supply the editable Blender source, static GLB exports, preview images and a concise asset manifest. The owner will pass this brief to you; the website integration is handled separately.

The creative direction is **Modern Objectivity merged with a Weyland-Yutani-style corporate environment around the year 2300**. Make a convincing industrial spacecraft with a readable silhouette, coherent construction and restrained surface detail. The exact hull design has not been approved yet: treat your first design as a proposal, not as a reproduction of a particular film ship. Share an early blockout preview when possible and continue through the deliverables below, incorporating any feedback received.

## Confirmed project context

- Repository: https://github.com/philippklinz/philippklinz.github.io
- Development branch: **`weyland-yutani`**. `main` preserves the existing website.
- Runtime: **Babylon.js**, with HTML/CSS content displayed as a HUD above the canvas.
- Hosting: static GitHub Pages, canonical domain `philipp-klinz.net`.
- Existing personal content and English, German and Polish editions are retained by the website agent.
- Initial scene: an orbital view looking down toward a planet, with storms and lightning below. A spacecraft enters slowly from approximately the lower left and passes through the foreground.
- The final camera, trajectory and lighting will be tuned in the browser. Build an asset that can be positioned freely.
- The planet, its weather, the terminal loading screen, HUD, scene management and rendering controls belong to the website agent's work.
- Later possibilities include switching scenes and entering part of the ship. This assignment prepares attachment points; a furnished interior is a later task.

## Static by design: mandatory delivery constraint

The website must run directly from checked-in HTML, CSS, JavaScript and asset files. Opening it through a static HTTP server and deploying the repository must require **no npm install, bundler, transpiler, runtime asset conversion, application server or build pipeline**.

Blender modelling, texture baking and exporting are asset-authoring steps. Deliver their finished outputs. The browser must never need Blender or a modelling script to reconstruct the ship.

For this handoff:

- Export **glTF 2.0 binary `.glb`** with geometry and PNG/JPEG textures embedded.
- Deliver standard, uncompressed GLBs first. Do not require Draco, Meshopt, KTX2/Basis or a custom decoder for this version.
- Use standard metallic/roughness PBR materials and emissive maps. List any required glTF extensions in the manifest; prefer a baseline export without required extensions.
- Include all files locally. No remote textures, fonts, environments, scripts, services or CDN dependencies.
- A `.blend` file or a beauty render alone is not the runtime deliverable.

Babylon and its loader will also be served locally by the website agent. Compression can be evaluated separately later, with any decoder files hosted locally as well.

## Art direction and viewing conditions

Aim for a substantial working vessel: hull sections, machinery, engine housings, service structures and a believable sense of scale. Prioritise the primary silhouette, then a few strong secondary forms, then fine detail.

Use these as **starting design choices**, not owner-approved specifications:

- A medium-to-large industrial vessel; use approximately **150 metres in length** as a working scale, and report the final dimensions.
- A controlled palette of warm off-white or grey hull panels, dark structural elements and sparse industrial markings.
- Restrained wear, panel variation and repair details; readable surfaces at website viewing distances.
- Distinct main thrusters and a few purposeful small features that make the silhouette recognisable.
- Small emissive engine or navigation elements that the runtime can adjust independently.

The ship will appear against both dark space and a brighter planet. It should read under one directional light with modest ambient/environment fill, and remain recognisable without bloom. Supply at least one preview under simple lighting that does not hide the underlying materials.

Show the upper three-quarter view, side, underside and rear. The closest pass may reveal the underside, so avoid a model that only works from above. Frame previews with room around the ship; the final HUD layout is not part of your task.

Modern Objectivity reference: https://philippklinz.github.io/modern-objectivity-style/

## Geometry, scale and coordinate contract

- Use metric scale. **One exported unit equals one metre.**
- Deliver glTF's right-handed coordinate system with **+Y up and the ship's bow facing +Z**. The ship's length therefore lies along the Z axis.
- Blender can remain Z-up while authoring. Verify the exported axes after the exporter performs its conversion; do not add a second compensating rotation without checking the result.
- Create one authored root named **`ship_root`**, centred approximately on the ship's overall volume, with identity location/rotation/scale in the exported asset.
- Apply unintended object scaling and avoid negative-scale mirroring in the final export. Preserve intentional child pivots.
- All parts and anchors must be descendants of `ship_root`. Both quality variants must share the same scale, root, orientation and anchor transforms.
- Use clean normals and UVs. Bake fine panel relief and small mechanical detail into textures where appropriate.
- Resolve export-affecting modifiers in an export collection while preserving an editable modelling collection in the source file.

The website integration can use a right-handed Babylon scene to preserve these conventions. Do not pre-flip the model for Babylon's default scene handedness.

## Parts and future entry point

Keep meaningful components separate, but merge fixed detail that shares a material. Avoid hundreds of tiny meshes.

| Required name or prefix | Purpose |
| --- | --- |
| `ship_root` | Stable parent for positioning and rotation |
| `hull_*` | Main exterior sections |
| `engine_*` | Engine housings and emissive exhaust surfaces |
| `airlock_outer_door` | Separate closed exterior door with a sensible future movement pivot |
| `anchor_entry_approach` | Point outside the chosen entrance for a future camera approach |
| `anchor_entry_threshold` | Point at the entrance plane |
| `anchor_entry_inside` | Proposed connection point for a future interior asset |
| `anchor_engine_01`, `anchor_engine_02`, etc. | Positions for optional runtime engine effects |

Export anchors as named empty nodes. At each entry anchor, local **+Z points in the direction of travel into the ship**, and local +Y points up. At each engine anchor, local +Z points outward along the exhaust direction. These local directions may differ from the ship's forward axis.

Choose one plausible entrance with human-scale proportions and reserve room behind it for a later connection. Keep the exterior door closed in the delivered model. The inside anchor is an integration marker, not a claim that an interior already exists. Do not build rooms, corridors, a cockpit or walking/navigation logic for this assignment.

The website will animate the flight path and engine intensity. Deliver the ship in a neutral, stationary pose without a baked orbital trajectory, camera animation, planet or lighting rig in the GLB. Preview cameras and lights may remain in a clearly separated Blender collection excluded from export.

## Materials and textures

- Build materials that survive the actual GLB export and re-import. Bake procedural surface detail into image textures where necessary.
- Use base colour, metallic/roughness, normal and emission maps as needed. Keep directional light and cast shadows out of the base colour textures.
- Prefer opaque materials. Use restrained emissive window surfaces for this distant exterior rather than expensive layered glass.
- Keep emissive surfaces identifiable through names such as `mat_engine_emission` and `mat_navigation_emission`.
- Keep text and decals sparse. Record any labels you invent as part of the proposed design; do not invent biographical or professional information about Philipp.
- Pack required images into the Blender source, and retain editable image files in the handoff.
- Record the source and licence of any third-party material. Prefer self-created geometry and textures that can be distributed with the website.

## Initial performance budgets

These are working budgets for the first model, not a promise of a particular frame rate. Report actual exported counts and explain any deviation.

| Item | Standard asset | Low-detail asset |
| --- | --- | --- |
| Triangles | Target 50,000–100,000; keep below 150,000 | Target 10,000–25,000 |
| Materials | Target 4; keep at or below 6 | Target 2–4 |
| Exported mesh primitives | Target at or below 12; keep below 20 | Target at or below 8 |
| Texture dimensions | Normally at or below 2048 px per side | Normally at or below 1024 px per side |
| Complete GLB file size | Target at or below 10 MB | Target at or below 4 MB |

Count the exported triangles, vertices, materials and primitives, not just Blender objects. Reduce hidden detail and small bevel geometry before sacrificing the silhouette. The low-detail asset should retain the same overall shape and entry location. The site will load the appropriate asset; both variants need not be downloaded at startup.

## Deliverables

Provide a self-contained folder or ZIP with the following files:

| File | Contents |
| --- | --- |
| `spacecraft.blend` | Editable source, packed dependencies, separate modelling/export/preview collections |
| `ship.glb` | Standard runtime asset |
| `ship-low.glb` | Lower-cost runtime asset |
| `textures/` | Editable source/baked texture files used by the model |
| `previews/` | Upper three-quarter, side, underside, rear, and a labelled axes/scale view |
| `asset-manifest.json` | Integration data and measured asset statistics |
| `README.md` | Design choices, export procedure, validation performed, known limitations and asset provenance |

The manifest must state: Blender version, export settings, model dimensions in metres, root name, coordinate convention, filenames and byte sizes, exported counts per variant, material names and purposes, texture dimensions, glTF extensions used/required, and every anchor's name and position/rotation relative to `ship_root` in **exported glTF coordinates**. Represent rotations consistently as XYZW quaternions and state that convention. Include the entrance size and any future door-motion direction.

If you have repository write access, work only on **`weyland-yutani`**, pull its latest state before writing, and confine asset changes to:

- `assets/models/spacecraft/` — runtime GLBs;
- `art-source/spacecraft/` — Blender and texture sources;
- `docs/spacecraft/` — previews, manifest and handoff notes.

Preserve concurrent changes by the website agent. Do not reset the branch, edit the site/HUD/engine code, modify `main`, merge branches or change Pages settings. If you do not have repository access, simply return the deliverable folder/ZIP to the owner. Return oversized source files separately rather than introducing a Git LFS dependency.

## Validation and completion

1. Open the saved `.blend` in a fresh session and confirm that its dependencies are present.
2. Re-import both delivered GLBs into a fresh scene. Inspect materials, UVs, normals, emissive surfaces, scale, orientation, hierarchy and anchor names.
3. Inspect the silhouette and shading from the required views, including the underside. Check for missing faces, flickering overlapping surfaces and broken texture seams.
4. Confirm that every resource required by each GLB is embedded, and that it needs no compression decoder or remote resource.
5. Validate with the Khronos glTF Validator if available and include its result. A validation report complements visual inspection; it does not replace it.
6. If a Babylon runtime preview is available, check the exported model there. Otherwise explicitly mark browser rendering as pending; do not claim a successful runtime test or measured FPS.
7. Deliver the actual files, previews and measured manifest together. Keep the work reproducible from the source file without a website build process.

## Technical references

- [glTF 2.0 specification: coordinate system, units and asset format](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
- [Blender glTF import/export documentation](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html)
- [Babylon glTF loader: embedded resources, local codecs and coordinate conversion](https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/)
- [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator)

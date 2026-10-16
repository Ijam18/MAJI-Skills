---
name: maji-blender
description: "Headless Blender (bpy) pipeline that turns an AI-generated, scanned or traced mesh into a web-ready GLB: keep the source as high-poly, voxel remesh plus decimate to a clean low-poly, Smart UV with a coverage check, bake PBR maps (normal, AO, roughness, base colour, packed ORM), wire the glTF Material Output, compress with gltf-transform, then hand over review renders and a local viewer. Free and local. Use when someone says \"optimise this GLB\", \"clean up the AI 3D model\", \"better UVs and textures\", \"bake the textures\", \"make a 3D logo for the website\", \"the model is too heavy for the web\", \"the bake came out black\". Not for generating the model or its reference images (use maji-image-gen, owner approval per paid spend) or for three.js scene and motion work (use maji-motion)."
metadata:
  tier: workflow
  category: content
  version: "1.0.0-lite"
---

# maji-blender: Headless Blender to Web GLB

Script-driven Blender, no clicking and no live Blender server. Final output: a GLB under budget (usually 10-30k triangles, at most 1.5-2 MB), its texture maps, review renders (turntable plus UV checker) and a localhost viewer page the owner approves before anything ships.

## Step 0: your context

Read `me/profile.md` if it exists (Stack, Tools and credits, Folders). If `me/overrides/maji-blender.md` exists, follow it wherever it differs from this file. If something this skill needs is missing, ask once, use the answer, and offer to save it to the profile.

## When to use / when not

- Use for a hero object, logo or product model on a website, an AI-generated mesh that is too dense or has muddy textures, or a model that needs proper UVs and baked PBR.
- Not for modelling from scratch by hand, rigging or animation, or three.js lighting and post effects.
- Gates that never bend: never spend paid 3D generation or AI image credits on your own decision; free and local first, ask per spend, approve a preview before any refine or upscale. List every install (Blender add-on, npm or brew tool) with purpose, command and licence, and install only after approval. Read the owner's source files; never move, rename or delete them.

## Steps

1. **Run headless, always.** `blender -b -P pipeline.py -- --in model.glb --out build/` (on macOS the binary is `/Applications/Blender.app/Contents/MacOS/Blender`).
2. **Keep the source as the high-poly.** Import, join meshes, clear parents, `transform_apply(location=True, rotation=True, scale=True)`.
3. **Build a clean low-poly copy.** Duplicate, set `remesh_voxel_size = largest_dimension / 450`, run `voxel_remesh()` for a watertight mesh, then a Decimate modifier to about 18k triangles and apply.
4. **UVs.** Rounded or organic shapes and anything voxel-remeshed: `uv.smart_project(angle_limit=66 degrees, island_margin=0.003)`.
5. **Bake in Cycles (CPU is fine).** `bake.margin=16`, `margin_type='EXTEND'`.
6. **Procedural looks get baked.** Noise, Wave and Color Ramp nodes do not survive glTF export.
7. **Pack ORM with numpy:** R = AO, G = roughness, B = metallic.
8. **Export the low-poly only.** `export_scene.gltf(export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_image_format='AUTO')`, Draco off here.
9. **Compress with a pinned gltf-transform, one command at a time:** `inspect`, `resize --width 2048 --height 2048`, `webp --quality 90` (or `uastc` for normal and ORM plus `etc1s` for base colour when `ktx` is installed), then `meshopt` or `draco` last and once.
10. **Review pack, then wait.** Six-angle turntable and a UV-checker render, the texture maps, and a `<model-viewer>` page served on localhost (GLB will not load from `file://`) with studio and soft light, front view, wireframe toggle, triangle count and file size.

## Composes with

- **maji-image-gen**: reference images for the model, under the same credit gate.
- **maji-ui-review**: judge the model in the real page, not only in the viewer.
- **maji-motion**: turntable or scroll motion for the hero object.
- **maji-dev-up**: serve the viewer page and the app on localhost.
- **maji-mode**: confirm budget and look before any paid generation.

## Free edition

This is the free edition: the method in order, enough to run it. The full edition (MAJI Skills Pro, on [Agensi](https://agensi.io)) adds the detailed sub-steps, variants, pitfalls from real incidents with their guards, and the done-when checklist.

---

*`maji-blender` is part of [MAJI Skills](https://github.com/Ijam18/MAJI-Skills) · By MAJI · No Codes, Only Vibes.*

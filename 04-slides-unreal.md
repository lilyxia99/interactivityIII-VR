---
# You can also start simply with 'default'
theme: ./leilei-custom1
title: Unreal Crash Course
info: |
  ## Crash Course to Unreal Engine 5.6
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Unreal Crash Course
### A Beginner's Guide to UE 5.6

---
layout: two-cols
---

# Unreal Terminology

## Project
The "Container" for everything.

* Contains all content and code for your game.
* Represented by a folder on your hard drive or on your desktop.

![project](./images/unreal/project.png)

::right::

## Level

Think of a Level (often called a Map) as a specific "Scene" in a movie or a "Room" in a building.
* Everything you see during gameplay exists inside a Level.
* The "World" is usually just the currently loaded Level.

![level](./images/unreal/level.png)

---
layout: two-cols
---

## Actor
Anything that can be placed in a Level.

* **Analogy:** A prop or character on a stage.
* If it has a **Location**, **Rotation**, or **Scale**, it is an Actor.
* Examples: Static Mesh Actor, Camera, Light, Player Start.

![actor](./images/unreal/actors.png)


::right::

## Component
Sub-objects within an Actor.

* **Analogy:** The organs or tools an Actor carries.
* Actors are just empty containers; **Components** give them function.
* Examples:
    * `StaticMeshComponent` (The visual look)
    * `PointLightComponent` (Emits light)
    * `MovementComponent` (Logic for moving)

![component](./images/unreal/component.png)

---
layout: two-cols
---

## Content Drawer
Your File Explorer.

* **Shortcut:** `Ctrl + Space`
* Where all your assets live (Textures, Sounds, Blueprints).
* **Tip:** It mirrors the folder structure on your computer.

![content Drawer](./images/unreal/contentDrawer.png)

::right::

## Blueprint
Visual Scripting (No Code required).

It specify the behaviour or the interaction that happens with different component, or specify the material

---
layout: two-cols
---

## Mesh
The 3D Geometry shape. 

::right::

## Material
The "Paint" on the Mesh.

* Determines the color, shininess, roughness, and transparency.
* Uses a graph-based shader editor.
* **PBR (Physically Based Rendering):** Unreal uses real-world logic for light interaction.

---
layout: two-cols
---

## Level (Map)
The World itself.

* A collection of Actors.
* You load and unload Levels to change environments.
* Saved as `.umap` files.

::right::

## Viewport
Your Window into the World.

* **RMB + WASD:** Fly around like a spectator.
* **G:** Toggle Game View (hides icons).
* **F:** Focus on selected object.

---

# Sunlight Position

<iframe width="560" height="315" src="https://www.youtube.com/embed/NY1Ag2As9gs?si=BI2XVdr2hcvPYQJ9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
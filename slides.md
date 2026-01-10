---
# You can also start simply with 'default'
theme: zhozhoba
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: intro to Virtual Reality
info: |
  ## Intro to Virtual Reality
  Presentation slides for UNCG interactivity Variable Topics

# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

# Intro to Virtual Reality

an introduction to the history of virtual reality

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <button @click="$slidev.nav.openInEditor" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
transition: fade-out
level: 2
---

# Navigation

Hover on the bottom-left corner to see the navigation's controls panel, [learn more](https://sli.dev/guide/ui#navigation-bar)

## Keyboard Shortcuts

|                                                     |                             |
| --------------------------------------------------- | --------------------------- |
| <kbd>right</kbd> / <kbd>space</kbd>                 | next animation or slide     |
| <kbd>left</kbd>  / <kbd>shift</kbd><kbd>space</kbd> | previous animation or slide |
| <kbd>up</kbd>                                       | previous slide              |
| <kbd>down</kbd>                                     | next slide                  |

<!-- https://sli.dev/guide/animations.html#click-animation -->
<img
  v-click
  class="absolute -bottom-9 -left-7 w-80 opacity-50"
  src="https://sli.dev/assets/arrow-bottom-left.svg"
  alt=""
/>
<p v-after class="absolute bottom-23 left-45 opacity-30 transform -rotate-10">Here!</p>

---
layout: two-cols
layoutClass: gap-16
---

# Table of contents


::right::

<Toc text-sm minDepth="1" maxDepth="2" />

---
transition: slide-up
---


# What is Virtual Reality?

Virtual Reality (VR) is a computer-generated environment with scenes and objects that appear to be real, making the user feel they are immersed in their surroundings.

<iframe width="560" height="315" src="https://www.youtube.com/embed/wyOqOjSwdVs?si=QZ-BwzA781l2BXPe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<br>
<br>

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/features/slide-scope-style
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Here is another comment.
-->


---
layout: two-cols
---

# The "Reality" Spectrum

It is important to distinguish VR from its "cousins":

Virtual Reality (VR): 100% digital. You cannot see the real world.

Augmented Reality (AR): Digital overlays on the real world (e.g., Pokémon GO or IKEA furniture app).

Mixed Reality (MR): Digital objects that interact with the physical environment.

::right::
<div class="flex flex-col justify-center h-full">
<img src="https://www.banuba.com/hubfs/img-Blog-Hero-What%20is%20AR.jpg" class="h-60 mx-auto">
</div>

---
level: 2
---

# Current Industry Potential
VR is moving far beyond just "gaming." It is transforming professional industries:

- Healthcare

- Education

- Training/Sim

- Real Estate

- Shopping



---

# Challenges and Limitations
Despite the excitement, VR still faces hurdles:

- Motion Sickness: The "vergence-accommodation" conflict where your eyes and inner ear disagree.

- Cost: High-end VR still requires powerful computers and expensive hardware.

- Social Isolation: The "goggle effect" can disconnect users from the people physically around them.

- Form Factor: Headsets need to become lighter, smaller, and more comfortable for long-term use.



---
class: px-20
---

# Themes


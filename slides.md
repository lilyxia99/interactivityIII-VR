---
# You can also start simply with 'default'
theme: ./leilei-custom1
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
---

# Navigation of this slide

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

Virtual Reality (VR) <span class="grey"> 100% digital. You cannot see the real world.</span>

Augmented Reality (AR) <span class="grey">Digital overlays on the real world (e.g., Pokémon GO or the "view in your house" in Amazon app).</span>

Mixed Reality (MR)<span class="grey"> Digital objects that interact with the physical environment.</span>

::right::
<div class="flex flex-col justify-center h-full">
<img src="https://www.banuba.com/hubfs/img-Blog-Hero-What%20is%20AR.jpg" class="h-60 mx-auto">
</div>

<style>

.grey {
  color:#85807f;
  font-style:normal;
}
  </style>

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
Despite the excitement, VR still faces hurdles, and 

- Motion Sickness
>Some of you might experience that during the class...it's ok if you really have that you don't need to stay in VR the whole time!

- Cost
>High-end VR still requires powerful computers and expensive hardware. For example the crazy expensive (*and no one uses*) Apple Vision Pro...

- Accessibility
>VR's design is hard for people with diffrent body abilities to put on. For example a person who can't use their arms in a mobile way would find it difficult to put on a headset by themselves

<style>

blockquote p {
  color:#85807f;
  font-style:normal;
}
  </style>

---

# Set up your headset

1. Divide into groups with the 5 headsets

2. put on headset, adjust your headset tightness

3. Adjust the lens distence (wheel located on the left side of the headset)

4. Adjust the Depth(Use the eye-relief buttons on the side of the facial interface)

5. set your boundary (follow prompt in the headset)

---
layout: two-cols
---

put your <span class="text-red-500">index finger</span> on the <span class="text-red-500">trigger button</span>

your <span class="text-red-500">thumb</span> on the surface of the controller 

your <span class="text-red-500">other fingers</span> on the <span class="text-red-500">grip button</span>

::right::

![the difference between trigger button and grip button](https://allvirtualreality.com/Image/TutorialsImg/20241231-TouchControllerQuest3/Right-Touch-Plus-Controller-01.jpg)


---
layout: two-cols
---

there is one flat button and two pop up button. For the flat one you would need to press it longer to initiate it. 

![left controller](https://allvirtualreality.com/Image/TutorialsImg/20241231-TouchControllerQuest3/Left-Touch-Plus-Controller-02.jpg){size=50%}



::right::

![right controller](https://allvirtualreality.com/Image/TutorialsImg/20241231-TouchControllerQuest3/Right-Touch-Plus-Controller-02a.jpg){size=70%}

---
layout: two-cols
---

1. go to "Library"

2. search "Open Brush" and "Google Earth"

3. hit Get, if prompt question just hit "yes" or "allow"

4. wait for it to download, and you can play with it!

![Open Brush Logo](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1634870/capsule_616x353.jpg?t=1767286335)

::right::

![Google Earth VR](https://evolvevr.ca/wp-content/uploads/2018/08/GOOGLEEARTH.png)

---
layout: fact
---

# Set up

---
level: 2
---

# Set up your accounts

1. go to [Steam](https://store.steampowered.com/app/3798230/Idol_Party_2__Love_Vibe/?gad_source=1&gad_campaignid=23283281746&gbraid=0AAAABB49gyIj9AoDtvwHZHl3FUidGq-WH&gclid=CjwKCAiAjojLBhAlEiwAcjhrDnNXqU1DNX9rll2AocqD6XG1KDPwxF1lajL0-dfPD9eGP6oquCiIThoC2doQAvD_BwE) and [Meta](https://auth.meta.com/) and [Unreal Engine](https://www.unrealengine.com/account/personal) register your account
2. log in your meta account through <span class="red">Meta Horizon Link</span>, login to <span class="red">Steam</span>
3. Download <span class="red">Oculus First contact</span> from Meta Horizon Link, try it!

![Oculus first contact](https://howlongtobeat.com/games/86315_Oculus_First_Contact.jpg){size=60%}


---
layout: image-right
image: https://cdn.wccftech.com/wp-content/uploads/2023/02/WCCFunrealengine59-1456x819.jpg
---

# Unreal Engine (UE)

- Real-time Rendering -> virtual production, video games...
- C++ and Blueprint coding system
- ecosystem (built in templates)
- photorealism


---
level: 2
---
# Set up your unreal

1. Open Epic Launcher (you would need to either sign up or log in)
2. Unreal Engine -> Library -> 5.6.1 (Launch)
3. After Open, Choose "Simulation Tab", choose "VR Template"

---

# 

1. 

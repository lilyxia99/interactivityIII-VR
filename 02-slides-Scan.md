---
# You can also start simply with 'default'
theme: ./leilei-custom1
title: Blender & Scan
info: |
  ## Use Blender to clean up your 3D scan

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

# Blender Crush Course and Scan clean up

---
layout: two-cols
---

# Scan items


1. Scan item

![scan mesh](./images/blender-scan/1-mesh.jpg)

::right::
select one that fits you
![choose option](./images/blender-scan/2-choose.jpg)

---
layout: two-cols
---

![scan range](./images/blender-scan/3-scan-range.PNG){size=50%}

::right::

![scan](./images/blender-scan/4-scan.PNG){size=50%}

---
layout: two-cols
---

![chooseOption](./images/blender-scan/5-chooseOption.jpg){size=50%}

::right::

![save](./images/blender-scan/6-save.jpg){size=50%}

---
layout: two-cols
---

![share](./images/blender-scan/7-share.jpg){size=50%}

::right::

![export](./images/blender-scan/8-export.jpg){size=50%}

---

# Remesh and bake textuer to low poly items

---

Reference youtube video, step by step text tutorial in the following page

<iframe width="560" height="315" src="https://www.youtube.com/embed/gDYuxWd1b5k?si=9nZW7pL26kRnEanl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---
layout: two-cols
---

1. Open Blender, Drag the fbx into blender

2. select the item (will be small), click "s", move your mouse to scale it bigger

3. hold and move the middle key of your mouse to rotate the view point, hold shift + middle key + move mouse to pan

4. select the object, hit tab key, enter edit mode. With your selection tool, brush through the points you don't want. You can long press and change tools.

![select circle](./images/blender-scan/select-circle.png)

::right::

![select points](./images/blender-scan/selectPoints.png)

---
layout: two-cols
---

5. press X , delete vertice
![delete points](./images/blender-scan/delete.png)

::right::

There will be left overs, you might need to delete multiple times
![leftOver](./images/blender-scan/leftOver.png)

---

6. Once you delete enough that you are happy with, select the item, control + C & control + V duplicate the object, rename one as "low-poly" and one as "high-poly"
![duplicate](./images/blender-scan/duplicate.png)

---

7. Select the low-poly one, (you can hide the high poly one temporarily) go to shading view <br> go to the modifier tab <br> click add modifier, search for decimate, and then change the ratio to a lower number
![decimate](./images/blender-scan/decimate3.png)

---

8. Hit apply

![apply](./images/blender-scan/apply.png)

---

10. `[optional]` you can choose to weld and apply too, this will close up some broken faces. Apply

![weld](./images/blender-scan/weld.png)

---

11. add remesh modifier, choose "smooth" and adjust the Octree depth to adjust the level of detail. This will also help close up major gap, but will make you loose the texture. So we will add that back in a bit. Apply. 

![remesh](./images/blender-scan/remesh.png)

---

12. go to shader editor
![shader editor](./images/blender-scan/shader-editor.png)

---

13. disconnect the image texture, and then **Shift + A** and type in "**image texture**" to create a new image texture. Select **"New"** and create a 1024*1024 image, name it as "low-poly-tex" (or other ones you want, object specific one is fine too)
<br> make sure the **new image texture** is being **selected**. 

![disconnect](./images/blender-scan/disconnect.png)

---

14. Go to "Render" -> Select Cycles as render engine, and then go to Bake Section on the bottom, make sure the setting is same as image

![bake setting](./images/blender-scan/bake%20Setting.png)

---

15. select the low poly object, hit **tab** to go into edit mode. Hit U and then select UV Unwrap, Smart Projection. Just follow the default setting.

![UV unwrap](./images/blender-scan/uv.png)

---

16. in the outliner, select the high-poly object first, and then hold control, select low-poly object, make sure the new image texture node is being select. Click "Bake"

![two selection](./images/blender-scan/two-select.png)

---

17. After the baking is donw, on the bottom of the software will have a notification. connect the new image node to the principled BSDF Base color, under the shading view you will see the texture being transferred. 

![connect](./images/blender-scan/connect.png)

---

18. go to File -> export -> fbx, and then follow the following export setting, choose the location you want to save to. After saving, you can import it into Unreal Engine. 

![export Setting](./images/blender-scan/exportSetting.png)

---

# Set up Grab Component

1. add an actor from create button

![create actor](./images/blender-scan/actor.png)

---

2. drag mesh under the actor 

![drag mesh under the actor](./images/blender-scan/actorSelected.png)


---

In the Details, Add a Grab conponent under the mesh component
![scanned item](./images/blender-scan/addGrabComponent.png)

![grab component in place](./images/blender-scan/grabInPlace.png)

With this you should be able to grab and interact with the object of your choice. 

---
layout: two-cols
---

# Change Lighting in the scene

1. find directional light in the scene

![directional Light](./images/blender-scan/directionalLight.png)

::right::

2. hold Control + L, move your mouse around

<video width="320" height="240" controls><source src="./images/blender-scan/controlL.mp4" type="video/mp4"></video>

---

press find the skySpherePC2, under details, search "Refresh Material", hit the checker. It's not going to be checked, but the skylight will change. It's kind of a button faked as a checker.

<div style="width:300px">

![change sky sphere update](./images/blender-scan/skysphere.png)

</div>
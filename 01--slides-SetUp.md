---
# You can also start simply with 'default'
theme: ./leilei-custom1
title: intro to Virtual Reality
info: |
  ## Set up and Unreal Crash Course
  Setting up your Unreal and Crash Course for Unreal Engine

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

# Set up and Unreal Crash Sourse

---
level: 2
---

## Advice of the course process

---

# Set up Unreal

[Set Up Android SDK for 5.6](https://dev.epicgames.com/documentation/en-us/unreal-engine/set-up-android-sdk-ndk-and-android-studio-using-turnkey-for-unreal-engine?application_version=5.6)

---

1. In "search", type in "cmd and open"
2. copy the following code and hit enter
```shell
cd "C:\Program Files\Epic Games\UE_5.6\Engine\Build\BatchFiles"
```
3. copy the following code and hit enter
```shell
.\RunUAT.bat Turnkey -Command=InstallSDK Platform=Android
```
yesterday's issue was due to the small difference between powershell and command prompt, which are both commandline tools, but one can take a command without the ".\" and the other one doesn't quite in this case. The lesson is always have ".\" in the line, which stands for "in this folder"

---

4. You will see:
```shell
PS C:\Program Files\Epic Games\UE_5.6\Engine\Build\BatchFiles> .\RunUAT.bat Turnkey -Command=InstallSDK Platform=Android

Running AutomationTool...
Using bundled DotNet SDK version: 8.0.300 win-x64
Starting AutomationTool...
Parsing command line: Turnkey -Command=InstallSDK Platform=Android
Initializing script modules...
Total script module initialization time: 0.19 s.
Using C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\Current\Bin\MSBuild.exe
Executing commands...



Choose a type of Sdk to install:
  0) Cancel
 [1] Full or Auto Sdk
  2) Full Sdk
  3) AutoSdk
  4) Device Software / Flash
[Default: 1]
```

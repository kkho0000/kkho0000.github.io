## Overview

A team project in Metaverse Technology at The Hong Kong Polytechnic University, exploring Wuzhen’s water-town heritage and the culture of the Grand Canal. It brings together site capture, 3D reconstruction, digital guides and a shared VR experience, making cultural stories accessible through exploration and participation.

The team researched Wuzhen’s history, spent eight days scanning on site and visited the Hangzhou Grand Canal Museum. We reconstructed seven locations and designed seven interactive scenes, with an ancient bridge and a plant-dyeing workshop as the two main settings.

## Experience and interaction

Two digital guides connect the journey. Participants travel by boat, hear local history on an ancient bridge, watch opera and take part in a dyeing workshop.

- **Handprint dyeing:** Unity XR Hands tracks the participant’s hands. Bringing a hand close to the fabric triggers a dyeing event, leaving a virtual handprint through a physical gesture.
- **Digital guidance:** Unity Timeline coordinates NPC animation, dialogue and scene events. Actions such as rowing, unfolding a map and holding a fan connect the narration to the surrounding activity.
- **AI photo souvenirs:** Participants provide a half-body photograph before entering VR and take part in a virtual photo-taking scene on the bridge. After the experience, a ComfyUI workflow using InstantID and SAM combines their identity with the visual style of the scene.

![Hand interaction in the dyeing scene](/img/project/vr-wuzhen-lbe/hand-interaction.jpg)

## Reconstruction and digital characters

The environment combines **3D Gaussian Splatting (3DGS) with manual modeling**. UAVs, phones and cameras were used for site capture. Tools including Luma AI and PlayCanvas helped refine reconstruction results and reduce flickering. Missing buildings and details were modeled in Blender, then combined with the captured environments in Unity.

Water shaders provide reflections and movement. Floating lotus flowers, procedural birds, breathing lantern lights, falling leaves and petals, and fireworks add environmental activity to the riverside journey.

The team created digital characters with Character Creator 4, Blender and iClone. AccuLip handles lip synchronization; Face Puppet and Motion Puppet support expressions and basic movement. More complex actions use keyframe adjustments and motion captured with ThreeDPoseTracker.

## My contribution: multiplayer LBE deployment

My focus was bringing the virtual experience into a physical venue: planning the route, aligning tracking spaces, synchronizing players, and validating interaction and performance.

- **Space and visitor flow:** The route was planned for two groups of four participants, with an S0 tutorial area. Boundaries, visual cues and interaction feedback support onboarding and movement through the venue.
- **Tracking and interaction:** HTC VIVE Focus Vision and the LBSS toolkit provide venue positioning. Virtual and physical spaces are aligned in Unity, with AR markers anchoring content and colliders triggering hand interactions and scene events.
- **Multiplayer synchronization:** Separate server and client applications use Unity Netcode for GameObjects. NetworkBehaviour and NetworkVariable synchronize player movement and state. The host, clients and headsets connect over the local network, with SteamVR streaming supporting the deployment.

![The physical space used for the LBE experience](/img/project/vr-wuzhen-lbe/lbe.jpg)

## Validation and next steps

We tested onboarding instructions, interaction responses and collision detection. Gaussian asset compression, removal of unused Gaussian volumes and clipping-plane adjustments reduced memory use and improved rendering efficiency.

Future directions include reusing modular scenes, adapting the experience for touring or permanent venues, and printing participants’ virtual fabric designs as physical souvenirs. These are extensions of the project, separate from the completed VR experience.

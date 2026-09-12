![The Dream of Starry Nights game cover](/img/project/vangogh-messenger/cover.JPEG)

## Overview

*The Dream of Starry Nights* is a 2D side-scrolling puzzle game built in Unity. Players control a small, translucent messenger wearing a hat, carrying a letter from Vincent van Gogh to his brother Theo through worlds drawn from his paintings. The goal is to deliver it to a mailbox.

The messenger exists within Van Gogh’s imagination. Letters connect the scenes and story, while painting becomes a way to solve puzzles: players create climbable paths with paint and explore the emotions behind the artwork.

## Narrative and scene design

The journey begins in *The Starry Night*. Storyboards and an opening animation introduce the artist’s experiences and the letter’s origins. An ending animation follows the letter through his paintings, bringing the delivery motif back into focus.

The visuals draw on Van Gogh’s paintings and sketches, with ComfyUI-based image generation supporting a consistent style. For *The Starry Night* scene, the team split the artwork into **five layers**. Unity scripts move them at different speeds as the player walks, giving the flat painting a sense of depth.

Excerpts from Van Gogh’s letters accompany exploration. Narration read by Benedict Cumberbatch, sourced from a BBC documentary, works alongside the paintings and animation to tell the story.

![Layered scenery and parallax in the game](/img/project/vangogh-messenger/parallax.png)

## Mechanics and controls

**Painting paths** is the core mechanic. Players shoot paint at sunflowers to create a climbable route, then hold **Shift** to reach platforms beyond a normal jump. Paint can be erased to revise the route, making drawing a tool for observation, experimentation and puzzle-solving.

- **Dark clouds:** The first collision removes color from the screen for two seconds. A second collision during that window kills the character. The full-screen effect communicates the player’s vulnerable state.
- **Crows and wind:** Crows act as springboards across gaps, while wind lifts the messenger to higher areas. Together with painted paths, they provide different ways to navigate each level.
- **Letters and mailboxes:** Carrying the letter through the level and posting it gives exploration and puzzles a shared objective.

| Action | Control |
| --- | --- |
| Move left / right | A / D |
| Jump | Space |
| Apply / erase paint on a sunflower | Left / right mouse button |
| Climb a painted path | Hold Shift |

![Sunflower interaction and a painted climbing path](/img/project/vangogh-messenger/sunflower.png)

## My contribution: stylized rendering

My focus was using shaders to integrate the character with the painted environments and create full-screen effects at specific moments in the game.

- **A 2D look for a 3D character:** Starting with a 3D model from Mixamo, I combined a base color, brush-noise texture and canvas texture in a shader. This gives the character a painted appearance while retaining smooth 3D animation and keeping animation production costs low.
- **Visual feedback tied to gameplay:** I implemented the grayscale effect triggered by obstacles and the transition at the end of the level, using changes in the image to communicate game state and connect narrative moments.

The team used GitHub for version control and collaborative development.

![The mailbox at the end of the level](/img/project/vangogh-messenger/mail.png)

## Next steps

Planned work includes expanding the existing map and routes to add puzzle complexity and play time, then developing levels based on more of Van Gogh’s paintings to strengthen the narrative connections between scenes. These remain directions for future iterations.

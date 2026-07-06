---
name: mazes-rules
description: Use when building or reasoning about anything touching the Mazes TTRPG game mechanics — character stats (BOOKS/BOOTS/BLADES/BONES), the dice system (d4/d6/d8/d10, exploding dice), roles, powers, or character creation. Consult before modeling character data or the creation flow.
---

# Mazes Rules

Mechanical reference for the **Mazes** tabletop RPG by 9th Level Games, used to
build the character-sheet app. Keep this file accurate: it is the source of
truth for game mechanics in this project.

> **Provenance:** The "Verified" section below is confirmed from the official
> itch.io store page. The "Pending the rulebook" section lists mechanics that
> are NOT yet confirmed — do not invent values for them. When the user provides
> rulebook content, fill those in and move them up to "Verified" with a note.
>
> Store page: https://9thlevelgames.itch.io/mazes-zero-prep-introduction-to-fantasy-roleplaying

## Verified core mechanic — the RESOLVER

A character has **four stats**, each governed by **one polyhedral die**. To act,
the player explains what they want to do; the MC (Maze Controller) says which
stat to roll against.

| Stat   | Used for                                  |
|--------|-------------------------------------------|
| BOOKS  | Using senses and knowledge                |
| BOOTS  | Physical activity                         |
| BLADES | Attacking and defending                   |
| BONES  | Resisting, being brave, testing strength  |

- The four dice in play are **d4, d6, d8, and d10**. Each character assigns
  these four dice across the four stats (one die per stat, each die used once).
- The die arrangement is **role-specific**: a character's role determines which
  die goes on which stat, plus a special power.
- **Exploding dice:** when you roll the highest number on a die, it "explodes"
  (roll again and add). The explosion threshold is the die's max face
  (4 on a d4, 6 on a d6, 8 on a d8, 10 on a d10).

## Pending the rulebook (do NOT invent these)

These are needed to fully model a character but are not on the store page:

- **Roles / classes:** the full list, and each role's exact die-to-stat
  arrangement.
- **Powers:** each role's special power(s) and how they work.
- **Hit points / health:** whether HP exists, starting values, damage rules.
- **Equipment / inventory:** what a character carries and any rules.
- **Advancement:** whether/how characters improve.
- **Roll resolution details:** target numbers / difficulty, success criteria,
  how the MC sets what you "roll against".

## How to use this in the app

- Model stats as the fixed set `BOOKS | BOOTS | BLADES | BONES`.
- Model dice as the fixed set `d4 | d6 | d8 | d10`; a character maps each stat
  to exactly one die (a permutation of the four dice).
- Treat "role" as the thing that produces a valid stat→die mapping plus a power.
  Keep roles data-driven so they can be added once the rulebook is available.

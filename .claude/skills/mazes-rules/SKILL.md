---
name: mazes-rules
description: Use when building or reasoning about anything touching the Mazes TTRPG game mechanics — roles/dice (Paragon d4, Vanguard d6, Fighter d8, Sentinel d10), the resolutions (Books/Boots/Blades/Bones/Key/Crown), Hearts & Stars, aspects (Sword/Shadow/Sorcery), classes, and the edge list. Consult before modeling character data or the creation flow.
---

# Mazes Rules

Mechanical reference for the **Mazes** tabletop RPG by 9th Level Games, used to
build the character-sheet app. This is the source of truth for game mechanics
in this project. It intentionally covers **rules only** (no setting/lore).

> **Source:** the official *Mazes — Corebook* PDF (rules extracted, verified).
> Page numbers below refer to the printed book.

## Character creation, in three choices

A character is defined by three choices, then a set of edges:

1. **Role** — pick based on *what you want to do in the game*. The role IS a
   single die (d4/d6/d8/d10) and sets your Hearts, Stars, and how likely you
   are to hit each resolution.
2. **Aspect** — pick based on *how you solve problems* (Sword / Shadow /
   Sorcery). Aspect is the fiction/flavor of your gear and what a Star spend
   looks like; it also determines which classes are available.
3. **Class** — a descriptive name (Adjective + Noun) that is itself an Edge,
   plus **3 Edges** (some are fixed, some are player choices). Based on aspect.

The role/aspect combo is free: a Sword Paragon, Sorcery Fighter, or Shadow
Sentinel are all valid. Choose the role that matches what you want to do.

## Roles (the dice)

Only players roll dice; the MC never rolls. **You only ever roll YOUR die** —
for every Action, Save, and Effect.

| Role     | Die | Hearts | Stars | Shines at        |
|----------|-----|--------|-------|------------------|
| Paragon  | d4  | 4      | 4     | BOOKS            |
| Vanguard | d6  | 6      | 3     | BOOKS & BOOTS    |
| Fighter  | d8  | 8      | 2     | BLADES           |
| Sentinel | d10 | 10     | 1     | BONES            |

- **Hearts** = the die's crown (max face). They are hit points; you refill by
  taking a Condition when you go down.
- **Stars** = special-power resource (magic, class abilities, narrative
  control). Fewer Stars on bigger dice.
- Smaller dice explode more often (better Key/Crown); bigger dice have larger
  effect/damage.

## The seven resolutions (target numbers)

On an **Action** or **Save** you roll your die and succeed if you roll one of
the fixed target numbers for the resolution the MC called. Target numbers are
the same for every die — the die size just changes how often you hit them.

| Resolution | Succeed on | Used for                                             |
|------------|------------|------------------------------------------------------|
| KEY        | 1          | Bonus: a 1 succeeds *if the action fits your class/aspect*. Not rolled for directly. |
| BOOKS      | 2, 3       | Knowledge, perception, senses, mental powers         |
| BOOTS      | 3, 4, 5    | Physical movement/athletics: run, jump, dodge, sneak |
| BLADES     | 4, 5, 6, 7 | Any violent action — attack or avoid being hurt      |
| BONES      | 5, 6, 7, 8, 9 | Resolve, strength, endurance, resist poison/disease |
| CROWN      | die max    | Highest face; outcome depends on Darkness (below)    |

- A **Paragon (d4) cannot roll BONES** naturally (needs 5+); it leans on Key/Crown.
- **Count success before Crown:** if a rolled number is a success for the
  resolution, it succeeds even if it's also the die's crown.

### Crown & Darkness

The **Crown** (max face) resolves by the party's current Darkness level:
- **Bright** → success
- **Torchlit** → success, but pay a cost
- **Bleak** → failure

### Effect rolls

The third roll type. Not against a target number — you want **high numbers**.
Rolling your **Crown explodes** the die: roll again and add. Most common effect
roll is damage. Damage = your die's result.

### Vantage (Advantage / Disadvantage)

Roll your die twice when vantaged:
- **Advantage** — succeed if *either* roll succeeds. Both succeed = **Critical**.
- **Disadvantage** — succeed only if *both* succeed. Both fail = **Fumble**.
- On **effect** rolls: Advantage = take the highest; Disadvantage = the lowest.
- Vantage does **not stack** (one source is enough). Advantage + Disadvantage
  cancel → roll one die.

### Chaos roll

When an outcome is pure chance (not tied to a character's strength): success on
**even** (2,4,6,8,10), failure on **odd** (1,3,5,7,9).

## Aspects

Chosen by answering "How do you solve your problems?" There are three core
aspects. Each defines gear fiction and what spending a Star looks like.

- **SWORD** — "…by the edge of my SWORD." Martial: warriors, mercenaries,
  soldiers. Weapons & armor. Star = combat maneuvers.
- **SHADOW** — "…from the embrace of the SHADOWS." Stealth, subterfuge,
  skills & tools. Light weapons, leather. Star = preparedness/technique.
- **SORCERY** — "…with my eldritch SORCERY." Magic. Spells, items, magical
  lineage. Star = casting spells / using powerful items (Stars are core here).

## Example classes (from the corebook)

A class is a name (Adjective + Noun) that acts as an Edge and grants 3 edges.
Eight example classes per aspect:

- **Sword:** Dangerous Bravo, Jaded Sellsword, Knockabout Ranger, Monster
  Slayer, Outcast Bugbear, Reluctant Hero, Savage Barbarian, Valiant Dragoon.
- **Shadow:** Adventurous Smallfolk, Cursed Tomb Robber, Excellent Vagabond,
  Filthy Urchin, Nighthawk Assassin, Puzzling Locksmith, Talented Thief,
  Zealous Cultist.
- **Sorcery:** Blazing Magician, Guild Mage, Haunted Librarian, Infernal
  Summoner, Last Ilf, Quack Alchemist, Underground Druid, Wise Witch.

Classes are not exhaustive — players may invent one (name + 3 edges).

### Class structure

A stock class defines its 3 edges as **one "always" statement + two questions**:
- The **always** edge — every member of the class has it.
- **Question 1** — a style split (e.g. internal vs external), each option an edge.
- **Question 2** — a core attribute (e.g. Cunning / Dexterous / Strong).

Example — **The Monster Slayer**:
- Always **Well-Armed**.
- Are you **Mazewise**, or do you have Loyal Hounds (**Retainers**)?
- Are you **Cunning**, **Dexterous**, or **Strong**?

Some edges need a sub-choice, shown in parentheses (e.g. `Magic (Domain)`,
`Retainers (Loyal Hounds)`). Classes also carry non-mechanical flavor:
Recruiting, Drives, Names, Kit.

## Edges

An Edge is an adjective-like descriptor. Invoking ("calling") an edge usually
grants **Advantage** on an Action/Save, or yields information. Edges are
specific but not too specific (WELL ARMED good; TWO-HEADED AXES too specific).
Classes and Conditions can be invoked like edges too. The list is not
comprehensive — new edges can be agreed with the MC.

Edges are grouped into **7 types**. (`*` = the edge requires an extra choice.)

### Attributes — intrinsic abilities
Ardent, Agile, Beautiful, Charming, Cunning, Dexterous, Fast, Hale,
Intimidating, Keen, Lucky, Old, Quiet, Strong, Young.
*(Old and Young carry both advantages and disadvantages.)*

### Combat — fighting, weapons, armor
Accurate, Armored, Deadly, Precise, Tough, Well-Armed.

### Magic — magical power (choose a **Domain**: Night, Forge, Sea, Sky, Earth)
Familiar, Magic\* (choose Domain or School), Magic Item, Magic Weapon, Shapeshift.

### Society — standing, wealth, connections
Friends\* (High / Low / Wild / Dark Places), Rank, Retainers, Tools, Wealth.

### 'Wises — skills & knowledge beyond class
Animalwise, Gearwise, Learned, Lorewise, Mazewise, Naturewise, Streetwise, Travelled.

### Lineages — culture / bloodline / race (acts like a second class)
Bugbear, Ilf, Smallfolk.

### Advances — improvement over time (generally NOT for starting characters)
Advance\* (choose any edge from the advance list), Mastery, Veteran.

## Domains (for Magic edges and Ilf lineage)

Night, Forge, Sea, Sky, Earth.

## Modeling notes for the app

- **Role** → enum `Paragon | Vanguard | Fighter | Sentinel`, each maps to a die
  and fixed Hearts/Stars. Derive Hearts/Stars/die from the role, don't store
  them loosely.
- **Resolutions** have **fixed** target-number sets — model them as constants,
  not per-character data.
- **Aspect** → enum `Sword | Shadow | Sorcery`; gates the class list.
- **Class** → name + up to 3 edges; keep classes **data-driven** so the stock
  classes (and their always-edge + two questions) can be encoded and custom
  classes added.
- **Edge** → id + type (`Attribute | Combat | Magic | Society | Wise | Lineage
  | Advance`) + optional sub-choice (Domain, Friends place, Retainer type,
  Magic school). A character holds a set of edges.
- **Domain** → enum `Night | Forge | Sea | Sky | Earth`.

## Still worth pulling from the book when needed (not yet captured here)

- Each stock class's exact 3-edge definition (always-edge + the two questions'
  options) and its flavor (Recruiting/Drives/Names/Kit).
- Conditions list and how going down / refilling works in detail.
- Treasure, Lifestyle tiers, Moments/turn structure, and Darkness track detail.
- Sorcery schools (Schools of Sorcery) and mundane/minor magic rules.

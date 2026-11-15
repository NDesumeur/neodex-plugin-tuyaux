# Tuyaux (Pipes)

A puzzle game: the neighbourhood's pipes have been turned every which way. Rotate them so the water flows from the water tower, in the centre, to every house.

*Version française : [README.md](README.md)*

## Controls

- **Click** a pipe: a quarter turn clockwise.
- **Right-click**: a quarter turn the other way.
- Once the level is won: a click to go to the next one.

## Rules

- Water leaves the water tower and follows joints that meet on both sides. Filled pipes change colour, and a house lights up when the water reaches it.
- The level is won when every house has water. The top of the board shows how many houses are supplied and how many moves you have made.
- The network never has a loop: each house has only one path to the water tower, and every level always has a solution.

## Levels and stars

- The grid starts at 5 × 5 and grows by one cell per side every 3 levels, up to 8 × 8.
- Each level counts the minimum number of quarter turns needed. **3 stars** if you match it, **2** up to one and a half times that number, **1** beyond.
- Levels are always the same, so you can replay them. The **Random networks** option gives a new network every game.

## Records

The furthest level reached, the total stars and the number of levels finished are shown next to the game.

## Data and sync

Level reached, stars and levels finished are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Tuyaux → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## Full screen and big grids

- **Full screen**: "FULL SCREEN" button.
- **The grid fills the frame**: the board takes all the room, whatever the size of the grid and of the window.
- **Bigger grids**: the grid grows every three levels, from 5 × 5 up to 10 × 10 (level 16) then 12 × 12 (level 22). The size of the current level is shown in the records frame.

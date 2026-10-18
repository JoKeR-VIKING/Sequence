# Sequence — Table Companion

A responsive scorekeeper for a physical Sequence board game. Track player order, chip placements, wild moves, cuts, undo, and winning lines.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The app is a companion to a physical game; it does not deal cards or enforce every official rule. The board uses a consistent generated layout, so verify the layout against your physical board before relying on positional matching.
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

The app is a companion to a physical game; it does not deal cards or enforce every official rule. The board uses a fixed classic 10×10 card layout intended to match a standard physical Sequence board. Board editions can vary, so compare the displayed card positions with your board before a game. Game setup, chip placements, turn order, and undo history are saved in this browser using local storage.
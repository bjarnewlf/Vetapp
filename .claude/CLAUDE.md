# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                  # Start Expo dev server
npm run android            # Run on Android emulator
npm run ios                # Run on iOS simulator
npm run web                # Run in web browser (port 8081)
npx tsc --noEmit           # Type-check without emitting files
```

There is no test runner or linting configured. TypeScript is the primary correctness tool (`tsconfig.json` has strict mode enabled).

## Architecture

**VetApp** is a React Native / Expo app (TypeScript, strict mode) for pet health management. UI language is German.

Detailed rules are split into `.claude/rules/` — see individual files for state management, navigation, backend, notifications, design system, and premium features.

# Desktop apps and shell UI

Covers Tauri and Electron apps, OS-level or shell interfaces, and terminal-style UIs. Fundamentals in [../fundamentals.md](../fundamentals.md), tokens in [../tokens.md](../tokens.md), type in [../typography.md](../typography.md). Much of [web-app.md](web-app.md) applies too (density, tables, states, keyboard). This file covers what a window on a desktop adds.

## Window chrome and title bars

The title bar is the first thing that gives a web view away as a web view.

- **macOS.** Keep the traffic lights at their native position and size. With a custom title bar (Electron `titleBarStyle: "hidden"` with `trafficLightPosition`, or Tauri's overlay title bar), reserve about 70px on the left so content never collides with them. Never draw fake traffic lights.
- **Windows and Linux.** Window controls sit on the right on Windows, and vary by desktop on Linux. Use the platform's overlay controls where the framework offers them (Electron `titleBarOverlay`) instead of hand-drawing buttons. Match caption button hover and press states.
- **Drag regions.** Mark the empty part of the bar as draggable (`-webkit-app-region: drag`, or `data-tauri-drag-region`) and every interactive child inside it as `no-drag`. Double-click on the bar should maximise or zoom as native does. Test dragging with a full-width title, with a search field, and after resizing.
- **Custom bars done right.** Keep them to 28 to 40px, put the app title or current context in them, and hold controls that belong to the window (back, sidebar toggle, search). Do not stuff a full toolbar in and lose drag space.
- If the brand does not need a custom bar, use the native one. It is free, correct and accessible.

## Menus and shortcuts

Real desktop apps have a menu bar on macOS and often on Windows. Build it with the native menu API (Electron `Menu`, Tauri menu) so it integrates with the system, the Help search and the accessibility tree.

- Follow platform conventions. Cmd on macOS, Ctrl elsewhere. Standard items (Undo, Copy, Paste, Select All) wired to real roles. Preferences on Cmd+, on macOS. Quit and Close behave as the platform expects.
- Every meaningful action reachable from the menu, with its shortcut shown. The menu is the documentation of the app.
- Keep an in-app command palette in addition if the app is deep.
- Register global shortcuts sparingly. They can collide with other apps and users notice.

## Keyboard-first flows

A desktop user has a keyboard under their hand. Design the primary loop so it can be done without the mouse: create, navigate, act, confirm. Arrow keys move within lists and trees, Enter opens, Escape backs out, Tab order is logical. Show focus at all times with a strong ring, never remove it. Shortcut hints appear in tooltips and menus. Inputs must not swallow shortcuts they do not need.

## Density, hover and context

Desktop means a precise pointer and a large screen. Controls can be smaller than on mobile (28 to 32px rows are normal) and information denser. Do not carry touch-sized padding over from a web or mobile design.

Hover is a real affordance here. Rows reveal actions, buttons lighten, toolbars show tooltips after about 400ms. Give every hover a matching keyboard focus state. Cursor changes when it helps (`pointer` on links only, resize cursors on splitters, `default` on buttons in a native-feeling app).

Context menus on right-click for objects, offering the same actions as the row menu, with shortcuts shown. Use the native menu where the framework allows it, so it inherits platform look and accessibility.

## Panes, windows and focus

- **Resizable panes.** Splitters with a generous hit area (8px) and a thin visible line. Remember sizes across launches. Support double-click to reset and drag-to-collapse for sidebars.
- **Minimum sizes.** Set a minimum window size below which the layout would break (often 800 by 560 for a tool with a sidebar). Below it, collapse the sidebar first, then secondary panels. Do not let the window shrink to a state you have not designed.
- **Multi-window.** If the app opens more than one window, each must restore its own state, share preferences, and route focus properly. Cmd+N or Ctrl+N is expected. Popovers and secondary windows return focus to their origin when closed.
- **Focus.** Window blur should dim the title bar and selection colour, as native windows do. Refocusing should restore the previously focused control.

## System integration

- Follow system light and dark live with `prefers-color-scheme`, and update without restart. Offer an override only if there is a reason.
- Read the system accent colour (`AccentColor` keyword in CSS on supporting webviews, or the native API in Tauri and Electron) for selection and focus. Allow the brand colour to lead in primary actions.
- **Vibrancy.** macOS vibrancy and Windows Mica or Acrylic make sidebars feel like they belong to the OS. Apply them to the sidebar or the window background, not to every panel. Content areas stay opaque for legibility and performance. Provide a solid fallback when the material is unavailable or the user has reduced transparency on.
- Respect reduced motion and reduced transparency.
- Native file dialogs, notifications and drag-and-drop over custom equivalents.

## Terminal and shell interfaces

These are a legitimate premium surface when done with discipline. The trap is retro-by-default: green on black, scanlines, faux CRT glow. That is a costume. Aim for the precision of a good terminal, not the nostalgia.

- **Grid.** Design on a monospace grid. Every element aligns to character cells horizontally and to a consistent line height vertically. Box drawing and borders snap to the grid. This alignment is where the calm comes from.
- **Type.** One family, a strict scale within it. Use weight, size steps and colour for hierarchy, not extra faces. Pick a well-drawn mono with real weights and proper italics (for example JetBrains Mono, Berkeley Mono, Commit Mono or Geist Mono; check the licence). Use ligatures deliberately. Keep sizes to three or four steps.
- **Colour is meaning.** A restrained palette in which every hue carries a job: success, warning, error, selection, dimmed metadata. Most text stays in two or three neutrals. Verify contrast on your background for each meaning colour, in both a dark and a light theme, and never rely on colour alone (add a glyph or a word).
- **Keyboard everywhere.** There is no mouse fallback to lean on. Arrows and vim keys for movement, Enter to act, Escape to leave, `/` to filter, `?` for help. A visible footer bar lists the current keys.
- **Focus always visible.** A selected row is a solid or inverted band, not a subtle tint. The cursor position is never in doubt. Focus moves predictably between panes and is shown on the pane border or title.
- **Make it premium.** Generous padding inside panes, consistent gutters, one accent, dimmed secondary text, meaningful empty states, smooth but minimal motion (a cursor blink, a short fade), and correct behaviour on resize. Avoid decorative ASCII art, rainbow output and constant animation.

## Verification

The screenshot flow in [../verify.md](../verify.md) covers layout, contrast and states in a browser. It does not exercise native title bars, drag regions, menus, vibrancy, multi-window behaviour or system theme switching. Say so, and ask the user to check those in the running app on each target OS, listing what to look at.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pancadamon is a Pokémon-like game in isometric 3D where the animals are active ragdolls (Gang Beasts style). The whole game is one file, `index.html` (HTML + CSS + JS, ~2.5k lines). It loads three.js r128 and cannon.js 0.6.2 as UMD globals (`THREE`/`T`, `CANNON`/`C`) from cdnjs.

There is no build, no package manager, no linter and no test suite.

All player-facing text and code comments are Brazilian Portuguese; keep them that way.

## Running and testing

- Run the local server: `powershell -ExecutionPolicy Bypass -File dev/serve.ps1`.
  - `http://localhost:8765/` serves the single-player game.
  - `http://localhost:8765/mp` injects `dev/mock-room.js`, a BroadcastChannel fake of the claude.ai `room`/`user` capabilities. Open it in two tabs to test multiplayer.
  - In Claude Code, `.claude/launch.json` defines this server as `pancadamon`, so `preview_start` works.
- Node and Python are not installed on this machine. Verify behavior in the browser pane with `javascript_tool`.
- **Drive the simulation by hand.** A hidden pane throttles `requestAnimationFrame`, so call `step(1/60)` in loops and then `render()` instead of waiting. Everything is a top-level global:

  ```js
  // e.g. force a wild battle next to the trainer and win it
  const w = wilds()[0];
  trainer.pos.set(w.torso.position.x - 2.4, 0, w.torso.position.z - 2.4);
  showTeleport(follower, trainer.pos.x - 0.8, trainer.pos.z - 0.8);
  w.cool = 0;
  for (let i = 0; i < 5; i++) step(1/60);          // battle starts
  battle.wild.member.hp = 0; battle.wild.fainted = true;
  for (let i = 0; i < 200 && battle; i++) step(1/60);
  ```

- **Simulate input** by setting `keys.KeyX = true` (held) or `pressed.KeyX = true` (one frame) before a `step`.
- **Watch for stale console errors.** The console keeps old errors across reloads; check line numbers and stack frames before trusting one.
- **Floating damage texts** only advance inside `render()`, so remove `floats` before taking screenshots after a fast simulation.

## Shipping (two targets)

1. **claude.ai artifact (the main link, the only place multiplayer works):** https://claude.ai/artifact/96RbpF5LTTkYbGMrGLcBNY
   - The Artifact tool wraps content in its own doctype/head/body, so publish a **body-only** copy: strip the 7-line wrapper at the top of `index.html` and the 2 closing lines at the end, write the result to the scratchpad, and publish that file with the `url` above.
   - Capabilities `{room: {}, user: {scopes: ["profile"]}}` are stored on the artifact. Omit `capabilities` on republish to keep them.
2. **GitHub:** `git@github.com:ReiDoBrasfooty/Pancadamon.git`, branch `main`. GitHub Pages serves `index.html` at https://reidobrasfooty.github.io/Pancadamon/ (single-player only).
   - The repo-local git identity is already set (ReiDoBrasfooty).
   - `gh` is not installed. Push over SSH: `GIT_SSH_COMMAND="ssh -o BatchMode=yes" git push`.

## Architecture (sections of `index.html`, in order)

**Data:**
- `ATTR` and `BEATS` define the class triangle: Força > Agilidade > Inteligência > Força, applied via `adv()` (×1.3 / ×0.8).
- `SPECIES` has 22 wild animals (the 10 of Campos Pancada plus 3 per new map, marked with `region`, one per class) and 5 mythological bosses (`myth`). Patches in the new maps spawn mostly their region's animals. Optional fields: `bird` (beak/feet color; birds get wings and no mouth), `rock` (color of what `throw` launches). Each has `plan` (`biped` | `quad`), `feat` (the visual builder key), `base`/`grow` for [FOR, AGI, INT], and `special`.
- **Evolutions** depend only on level (`stageOf(m)`: 0, 1 at `EVO_LV[0]`, 2 at `EVO_LV[1]`), so saves, wilds, remote pets and duels need no extra field.
  - `formOf(member)` returns the effective species for that stage (cached in `FORMS`): every evolved form is `plan: 'biped'` (quadrupeds stand up), with `stage`, `fromQuad`, bigger `size`/`leg`/`tall`, smaller `head`. `makeCreature` always uses `formOf`, never `SPECIES` directly.
  - `EVO_NAMES` holds the two form names per species. `levelUp` queues stage changes on `evoQueue`; `runEvolutions()` (end of `finishBattle`) renames the member and, if it's the follower, plays the cutscene in `mode === 'evo'` (`stepEvo`).
  - `addGear` dresses evolved bipeds with `EVO_KITS[species][stage - 1](P)`, one costume per form built from the `K` piece library (clothes, hats, hand items, effects). `P` carries the body groups plus `eye`/`mouth` positions so glasses, masks and beards land on the face. Biped `d` has a `tl` so quadruped decorations still fit after standing up.
- **Bosses** live in `BOSSES` (one per map, built right after the region builders, with a lair under `r.root` and a fake `patch`). Each is a mythological species (`myth: true` in `SPECIES`: unicornio, esfinge, grifo, hidra, dragao) that never spawns in grass. `updateSpawns` spawns one via `spawnBoss` while `game.bosses[region]` is unset; the creature has `c.boss` and its member has `boss` (map index, permanent: ×1.2 size, ×1.1 stats; check with `isBoss`) and `wildBoss` (×1.5 HP, removed on capture).
  - Myth species evolve differently: `formOf` keeps them quadrupeds (no `addGear`), and their `makeCreatureMeshes` cases read `sp.stage` to add wings (`mythWings`, flapped through `c.wings`), extra hydra heads (`c.sway`), halo, horns, lava. `tierName` gives Mítico/Desperto/Lendário instead of Animal/Guerreiro/Mestre.
  - `finishBattle` calls `bossReward` on win/capture: it records `game.bosses`, pushes the next map into `game.keys` (the last boss sets `game.crown`) and drops a key with `dropKey`/`keyFx`.
  - `unlocked(id)` gates hub portals; locked portals show a padlock and prompt `lockMsg`. Map 0 is always open. `load()` grants keys to pre-boss saves.
- `stats(member)` derives every combat number (HP, power, speed, dodge, special cooldown, etc.) from level. Members only store `{species, level, xp, hp, maxHp, nick}`.
- The team holds at most `TEAM_MAX` (5) members; the rest live in `game.box`, managed by `showBox()` at the terminal next to the Centro (`BOX_SPOT`).
- `ITEMS` holds cure and capture items. Capture items are a nut or seed (Bolota/Pinha/Coco/Semente), each with a `mult`.
- The save lives in `localStorage` under `pancadamon3d_v2`. `load()` migrates older shapes, so keep it backward compatible.

**Physics:**
- All creature parts share the group `G_CREATURE`. A broadphase override (`world.broadphase.needBroadphaseCollision`) skips pairs with the same `owner`, so a creature's parts never collide with each other; a projectile skips its `body.ignore` creature (capture item → your fighter, rock → its thrower).
- `ALL = 0x3FFFFFFF`. Fixed groups are `G_GROUND`, `G_STATIC`, `G_BALL`, `G_TRAINER` and `G_CREATURE`.
- There is no hard creature limit. `MAX_CREATURES` (60) is a soft cap for physics cost; `spawnWild` and remote pets check `creatures.length` against it.

**Active ragdoll:**
- `makeCreature` builds cannon bodies and `PointToPointConstraint` joints. Its meshes are separate scene objects in the **same order as `parts`**, with the head always last.
- `updateCreature` keeps the animal standing and moving:
  - a hover spring holds the torso at height `H` while grounded;
  - `drive()` turns each part toward a target orientation (built with `yawLocal`), which produces walk gait, punches and arm poses;
  - KO and fainted states simply skip control, so the body goes limp.
- `fixJoints()` runs right after `world.step`: it snaps any part that drifted more than `JOINT_SLACK` from its joint back onto it, so limbs never visibly detach.
- Bipeds strike and grab with their arms; quadrupeds bite and grab with their head. The code uses `c.strikers` / `c.grabbers` and each part's `body.tip` for this.

**Hits and grabs:**
- cannon `collide` events only push onto `hitQueue`. `processHits()` handles them **after** `world.step`. Never add or remove bodies or constraints inside a cannon event.
- Grabs are detected from `world.contacts` in `processContacts()`.

**Visuals:**
- `makeCreatureMeshes` switches on `feat`.
- `add(parent, geo, mat, pos, scale, rot, shadow=true)` automatically adds an inverted-hull outline.
- Googly eyes use `updatePupils()`, a spring per pupil driven by the head's world acceleration and gravity. The same function animates the trainer and NPC eyes.
- **Art style (post-processing):** `render()` calls `drawFrame()`, which draws the scene into a render target (color + depth) and runs the fullscreen shader `POST_FS` on it.
  - `STYLES` holds the presets (`anime` is the default; `diorama`, `gibi`, `atual`, `aquarela`, `pixel`, `massinha` and `cordel` are alternatives). Each sets the shader `mode`, the toon gradient (`grad`), the outline color (`line`, `null` hides the hull outline) and the rim light strength (`rim`, applied to every `toon()` material by `rimify`). `setStyle(name)` switches at runtime; `?estilo=<name>` in the URL picks one.
  - `diorama` and `anime` grade colors per map from `GRADES` (indexed by region id): `sh` tints shadows, `hi` tints highlights, `fog` is the distance haze. A new map needs a `GRADES` entry.
  - Text faces must use `signFace(lines)`: it writes alpha 0, and the shader leaves those pixels unfiltered so the letters stay legible.
- `syncCreature` copies body transforms to meshes. It skips this for `role === 'puppet'`, whose meshes are driven directly from network snapshots.

**Game flow:**
- `mode` is `title` | `world` | `battle` | `menu` | `evo`. `menu` pauses `step()`, even mid-battle; `evo` freezes the trainer while the evolution cutscene runs.
- `battle` holds the current fight:
  - wild fights end through `endBattle` → `finishBattle`;
  - XP goes to alive team members, full for the ones in `battle.fought` and half for the rest.
- Each entry of `PATCHES` keeps `PER_PATCH` wild animals; `updateSpawns` refills them.

**Map:**
- There are 5 maps (`REGIONS`), laid side by side along x every `MAP_GAP` (150) units. Each is a square of half-size `MAP` centered at `(r.cx, 0)`. Map 0 (Campos Pancada) is the hub; `PORTALS` connects it to the others.
  - Each map's meshes live under `r.root` and its static bodies in `r.bodies`. Map 0 is captured between `regionMark()` and `regionClaim()`; the others are built by `buildRegion(r, fn)` (`buildSertao`, `buildPico`, `buildBrejo`, `buildCratera`). Anything a builder adds to `scene`/`world` is claimed automatically.
  - `applyRegion` shows only the current map, removes the other maps' bodies from the world, swaps sky/light/weather (`ambFx`) and despawns other maps' wilds. `step()` calls it whenever `regionAt(trainer.pos.x)` changes, so every teleport (portal, blackout, duel) just works.
  - Every `PATCHES` entry has `region`; `updateSpawns` only fills the current map. `game.map` saves which map the player was in.
  - Tall landmarks go in the corners away from the camera side (`-x/-z`, `+x/-z`, `-x/+z`), never in `+x/+z`, or they hide the player.
- The trainer and NPCs collide using `colliders` (circles) and `rects` (AABBs) through `resolveCollision`. Creatures use static cannon bodies instead, so solid scenery needs both (`solidRect` / `solidCircle` do this).
- Repeated small scenery (grass tufts, flowers, pebbles) goes through `instanced()` to keep draw calls low. `paths` records every `pathStrip` so decoration can avoid them.
- `ZONES` drive the area-name banner and keep random decoration out of named places. `buildPlaces` must run before `buildNature`, because `blocked()` reads `ZONES`, `rects` and `colliders`.
- Towns are data in `TOWNS`: buildings (`center` | `shop` | `box` | `house`, each `{x, z, ry}` with `ry` a multiple of 90°), plaza, well, lamps and NPCs. `buildTown` runs inside `buildPlaces`; town NPCs are created next to the other `makeNpc` calls. Every town also becomes a `ZONES` entry.
- Interactive mats live in `SPOTS` (`{kind, x, z, r, b, lz}`); `step()` picks the one under the trainer and `SPOT_TEXT` gives its prompt. `blackout()` sends the trainer to the nearest `heal` spot. Use `rotPt`, `solidLocal` and `colliderLocal` for anything placed relative to a rotated building.

**Multiplayer (`net`):**
- It uses only `room` presence, never `emit`, because viewers without edit rights cannot emit on topics.
- **Lobby:** each player's presence carries position, lead animal and challenge/accept/decline fields. Other players render as trainer models with a locally simulated pet.
- **Duels:** they run in the named room `duel-<code>`, with the challenger as host.
  - The host simulates both fighters and publishes `snap` (packed part transforms, HP, events) in its presence.
  - The guest publishes `inp`, with press counters so a dropped message can't lose a button press.
  - The guest renders the fight with puppets.
- `window.claude.use('room')` resolves `null` outside claude.ai. Every net path must degrade to single-player.
- **Online outside claude.ai (`pnet`, GitHub Pages):** when `IN_CLAUDE` is false, the **Online** menu (`showOnline`) lets one player host and others join with a 5-character code (`?sala=CODE` opens it prefilled).
  - It lazy-loads PeerJS from cdnjs. The host relays every message, and `peerView(room).api` imitates the `room` capability (`presence`, `peers`, `onPeers`, `join`, `leave`). `goOnline` sets `net.room`/`net.user` to these shims, so the lobby and duel code above runs unchanged.
  - Peer ids are `h` (host) and `p1`, `p2`… The host keeps the authoritative `pnet.rooms`. Each tab mirrors the rooms it is in through `pnet.views`, updated by `up`/`gone` messages.
  - Saves are keyed by character name: the host stores everyone's in `localStorage` under `pancadamon_online_saves`, and each browser keeps a per-name copy under `pancadamon_char_<name>`. `pickSave` takes the newer copy using `game.at`, which `save()` stamps.
  - Every save from another machine goes through `fixSave`/`cleanMember`, which validate species and numbers and strip HTML from nicknames. `load()` uses the same path. Check species with `isSpecies`, never `SPECIES[x]`, because remote strings like `constructor` hit `Object.prototype`.
  - Test it locally with two tabs on `http://localhost:8765/` (not `/mp`, which sets `window.claude`). It needs internet for the PeerJS server.

## Conventions

- **Controls stay around WASD:**
  - Battle: Q / click attack, E (hold) grab, Space jump/lift, F special, R / right-click throw capture item, C cycle capture item, X flee/forfeit.
  - Menus and map: Z bag, Tab team, 1–5 switch animal, E interact.
  - Duels: F challenge, E accept, X decline.
  - When you change a key, update the help text in `setHud`, the title screen list, the touch buttons (`data-k`) and the README.
- **Theming:** CSS colors go through the `:root` tokens, which have light and dark variants.
- **Untrusted data:** other players' data (names, presence, snapshot text) is untrusted. Set it with `textContent` and clamp numbers.

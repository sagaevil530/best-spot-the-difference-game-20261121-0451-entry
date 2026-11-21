// main.ts — the entrypoint (Node 22, standard library only). It hands the game
// in: it copies this repository's game/ and screenshots/ into the output
// directory (MAKEFUN_OUTPUT_DIR outside the grader, /output inside it) and
// writes /output/dossier.json with the vendored make.fun library, so the
// scorer can check the game, the screenshots and the dossier byte for byte.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The same caps the scorer's gate uses, so this program fails locally where
// the scorer would refuse the entry (too many screenshots or one over 256 KiB;
// game/ over 993 entries or 48 MiB, or a path over 1000 bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

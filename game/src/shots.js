// shots.js — the four staged frames behind ?shot=cover|play|title|win.
// Each one sets the game to a real state a player could reach (a level mid-hunt
// with some differences found and some still hidden, or a finished level), so
// the screenshots are honest renders of the game's own code, and the same shot
// always shows the same frame.

import { startLevel } from './game.js';

/**
 * Stage `game` for the named shot and return nothing. Unknown names stage the
 * title screen. `found` indexes are taken in order, so the markers and the
 * counter always agree.
 */
export function stageShot(name, game) {
  if (name === 'cover') {
    // Level 1, Lantern Garden, three of five found, two still hiding.
    startLevel(game, 0);
    game.found = [0, 1, 2];
    game.combo = 3;
    game.score = 330;
    game.levelScore = 330;
    game.timeLeft = 107;
    return;
  }
  if (name === 'play') {
    // Level 3, The Old Bookshop, four of seven found, three still hiding.
    startLevel(game, 2);
    game.found = [0, 1, 3, 6];
    game.combo = 2;
    game.score = 940;
    game.levelScore = 460;
    game.timeLeft = 74;
    return;
  }
  if (name === 'win') {
    // Level 2 cleared with a healthy time bonus: the level-complete card.
    startLevel(game, 1);
    game.found = [0, 1, 2, 3, 4, 5];
    game.timeLeft = 68;
    game.levelScore = 640;
    game.levelBonus = 340;
    game.score = 1280;
    game.stars.harbour = 3;
    game.screen = 'levelComplete';
    return;
  }
  if (name === 'picnic' || name === 'attic') {
    // Mid-hunt frames for checking the last two scenes render well.
    const index = name === 'picnic' ? 3 : 4;
    startLevel(game, index);
    game.found = [0, 2, 4];
    game.combo = 1;
    game.score = 1520;
    game.levelScore = 320;
    game.timeLeft = name === 'picnic' ? 83 : 71;
    return;
  }
  // title (and anything else): the level cards over the garden scene.
  game.screen = 'title';
  game.stars = { garden: 3, harbour: 2 };
  game.score = 1280;
}

# news-image-20261123-v3

[![make.fun · news-image-20261123](https://make.fun/badge/news-image-20261123.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![rank](https://make.fun/badge/news-image-20261123/mohamad824/news-image-20261123-v3/rank.svg)](https://make.fun/bounty/news-image-20261123/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![reward](https://make.fun/badge/news-image-20261123/mohamad824/news-image-20261123-v3/reward.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)

Monday 23 November 2026 — Readable Edition: a broadsheet front page that sums up 23 November's world news in one image. 36 stories across 7 regions — COP31 collapses in Antalya, a Russian warship sunk off Libya, strikes kill 11 in the Kyiv region — with a numbers strip, a UTC timeline, 15 code-drawn illustrated panels, a numbered world map, and a DATE CHECK naming what was deliberately left out. Built to be read: a fresh bold vector font drawn in code, larger minimum type, shorter stories with generous line spacing and panel padding, no overlapping or clipped words. Every illustration is drawn in code; the whole page is rendered by `main.ts` (Node 22, standard library only, no network) into a deterministic 1024×1024 PNG.

## Run it

```sh
node main.ts
```

This writes `/output/entry.png` (1024×1024, deterministic — two runs produce identical bytes).

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123) · AI agents build software for cash rewards</sub>

# Architecture

## Repository layout

```
/
├── index.html                  national landing page → links to the 4 city/event sites
├── karachi/                    UG Karachi + Community Day Karachi 2025
├── lahore/                     UG Lahore + Community Day Lahore 2025
│   ├── aws-community-day-lahore-2022/     archive (1 Oct 2022, UET Lahore)
│   │   └── 2018/                          nested earlier template site
│   └── aws-community-day-lahore-2024/     archive (25 Feb 2024, FAST NUCES)
├── islamabad/                  UG Islamabad — currently the 2024 event page
│   └── community-day-2024/     archive (24 Aug 2024, NIC Islamabad)
├── kirothon/                   Kirothon 2026
├── old-website/                earlier national event site (folder year unreliable)
├── content/                    ← structured community data (the contributor surface)
│   ├── user-groups/
│   ├── student-builder-groups/
│   └── events/
├── docs/                       this documentation
├── scripts/validate_content.py content validator (Python 3, no dependencies)
└── .github/workflows/          CI
```

### Asset directories

These names are historical and not self-explanatory. Recorded here because nothing
else documents them:

| Directory | What it actually holds |
| --- | --- |
| `images/` | shared/national images, favicons, galleries, and speaker photos used by the 2022 and 2018 archive pages |
| `img/` | six photos used by the Lahore 2024 archive page |
| `simages/` | Community Day **2023** speaker images (Sessionize exports) and 2023/2025 logos |
| `vimages/` | **volunteer** photos, used by the Lahore 2024 archive page |
| `global_assets/` | a vendored Bootstrap admin theme ("Limitless"), 583 files |
| `assets/` | two files (`css/all.min.css`, `js/app.js`) belonging to that theme |
| `stylesheets/` | the live committed CSS |
| `sass/` | Compass/SASS sources; nothing compiles them in CI |
| `<city>/images/` | per-city photos, including `team/` organizer portraits |

`global_assets/` and `assets/` are referenced by nothing that renders — the only
file pointing into `global_assets/` is `assets/css/all.min.css`, which is itself
referenced by no page. They are retained deliberately; see
`docs/restructure-plan.md`.

## Pages are the filesystem

There is no router. A URL maps directly to a file: `/karachi/` serves
`karachi/index.html`. Adding a page means adding a directory with an `index.html`.

Five files are **not documents** — they are bare `<script>` tags with no HTML
wrapper, loading Sessionize widgets:

- `karachi/session.html`, `karachi/speaker.html`
- `lahore/session.html`, `lahore/sessions.html`, `lahore/speaker.html`

### Sessionize widget IDs

Speaker and session data is not stored in this repository.

| Event | Widget ID |
| --- | --- |
| Community Day Karachi 2025 | `q3gfsob1` |
| Community Day Lahore 2025 | `aeseyim7` |
| Community Day Lahore 2024 | `od6gjdhn` |

`lahore/index.html` embeds **both** `aeseyim7` and `od6gjdhn`. Whether showing the
2024 grid on the 2025 page is intentional has not been confirmed.

## Theme tokens

**The colour scheme is load-bearing and must be preserved.** These values were
measured by frequency across the current pages, not chosen:

| Token | Hex | Uses | Role |
| --- | --- | --- | --- |
| AWS orange | `#ff9900` | 53 | primary accent, headings, links, organizer names |
| AWS squid ink | `#232f3f` | 31 | primary dark background and body text |
| Orange variant | `#fc9701` | 10 | secondary accent — a near-duplicate of `#ff9900` |
| White | `#ffffff` / `#fff` | 44 | surfaces and inverted text |
| Grey scale | `#dddddd` `#ccc` `#eee` `#f3f3f3` `#333` `#6f6f6f` `#5d6c7c` | — | borders, muted text |

Kirothon 2026 uses a separate, deliberately different palette:

| Token | Hex | Role |
| --- | --- | --- |
| Blue | `#3b82f6` | primary |
| Violet | `#7c3aed` | Kiro brand accent |
| Amber | `#fbbf24` / `#f59e0b` | highlights |

Status colours in use: `#28a745` success, `#dc3545` danger, `#e32` / `#eb3a44` alert.

Rules for any future change:

1. `#ff9900` and `#232f3f` are the AWS brand pair. Do not substitute approximations.
2. `#fc9701` is almost certainly an accidental duplicate of `#ff9900`. It can be
   consolidated, but that is a visible change and needs sign-off.
3. Archived event pages keep their own styling. Do not normalise them to the
   current palette.

## Content model

`content/` holds the data a contributor edits. It is plain YAML, validated by
`scripts/validate_content.py`. **There is no renderer yet** — the pages still carry
their data inline as HTML. These files are the normalised source of truth that a
later change will render from, and they let contributors propose data corrections
today without touching markup.

```
content/
├── user-groups/<slug>.yml              one file per AWS User Group
├── student-builder-groups/<slug>.yml   one file per Student Builder Group
└── events/<year>-<city>.yml            one file per Community Day
```

Every file carries `last_updated`, which is what stops leadership data from
silently rotting. The validator enforces structure, URL shapes, cross-references
between a Student Builder Group and its parent User Group, and that any referenced
image path exists on disk.

### Known data-quality issues recorded in the content files

- **Islamabad** has no social links anywhere on its page.
- **Lahore's** page carries only the *national* handles
  (`aws-community-pakistan`), not a Lahore-specific group account.
- **Faisalabad, Peshawar and WiT Lahore** exist only as logo images with alt text
  in `kirothon/index.html`. No URLs, leaders or status are recorded anywhere, so
  their files carry `needs_verification: true` and empty leader lists rather than
  invented data.
- **AWS User Group Lahore** is absent from that logo strip, which lists WiT Lahore
  instead. Not resolvable from the repository.
- Both Lahore pages contain **unrendered Laravel/Blade template placeholders**
  (`{{$advisorPerson->name}}`, `{{$speakerPerson->picture}}`) left in the static
  HTML. The `background-image: url({{$advisorPerson->picture}})` will 404.
- Both the Lahore 2024 and 2025 pages still show leftover text from the Indian
  AWS Community Day template the site descends from ("27th July 2019",
  "Karnataka 560008").
- `islamabad/images/team/Ahmed Anis.jpg` has no card on the page.

# Field guide — authored functional design

## The synthesis

The useful question is not “does this look AI-made?” It is “which decisions were
made for this person, this content and this task?” A model can generate either
thoughtful or generic work. Humans can too. Review the artifact, not its presumed
author.

### Bauhaus without the costume

Droste's account describes an institution with competing teachers, workshop
methods and changing aims. Its early craft emphasis and later production work
are not interchangeable periods. Read geometry alongside making, material
experiments, teaching, theatre and collaboration. The printing/advertising
workshop joins design and execution; typographic position follows meaning rather
than compulsory symmetry (Italian edition, printed pp. 148–150).

Dr Non's tenets translate that into: prototypes before finish, content before
geometry, truthful materials, unified communication, economy and iterative
development. These are contemporary interface rules, not ten quotations from
Gropius. “Form follows function” is not attributed here as a Gropius quotation.
Minimalism is not a warrant to erase art, warmth or cultural specificity.

### Ten working commitments

The user supplied ten Bauhaus-inspired tenets as the design brief. The following
is our contemporary operational interpretation, not authentication of that list
as a historical manifesto or a claim that Bauhaus had one unchanging style.

| Commitment | Interface consequence | Evidence to ask for |
|---|---|---|
| Join art and craft | The person choosing the composition also checks the built result | A working prototype, not only a moodboard |
| Master the material | Understand semantic HTML, script type and browser behaviour | The task works without a mouse and when fonts fail |
| Let purpose shape form | Importance determines prominence; function determines the control | Explain why the arrangement serves this task |
| Make one coherent work | Page, navigation, errors, exports and README explain the same system | Follow a complete path, including its downloaded artifact |
| Be truthful about materials | Text remains text; links go somewhere; simulations are labelled | Select/copy/read the content; inspect what a control actually does |
| Reduce without flattening | Remove competing signals, not earned meaning or personality | A conservation comparison plus a clearer reading order |
| Use technology deliberately | Choose a native capability before adding a dependency | Show the smallest implementation that meets the task |
| Spend resources intentionally | Budget bytes, rendering work and human attention | Check the slow/failed-loading path; justify an expensive element |
| Make the action effective | Clear wording, current state, feedback and recovery | An uninstructed person completes and recovers from the task |
| Develop through evidence | Revise the observed failure rather than defend the first design | Record what changed after a test and what remains unverified |

Typography and colour are governed by the project's tokens and semantics. An
exhibition may use expressive colour fields; a control room's closed grammar
remains closed. None of these commitments permits a decorative “Bauhaus” skin.

### Standards as a foundation

Zeldman and Marcotte make accessible, semantic structure central, not a stripped
down second edition for disabled readers (ch. 14). A page should retain meaning
when its presentational layer changes. Current implementation authority is the
[HTML Living Standard](https://html.spec.whatwg.org/multipage/) and
[WCAG 2.2](https://www.w3.org/TR/WCAG22/), not the book's 2009 browser landscape.
Do not carry forward Flash advice, XHTML as a compulsory default, obsolete IE
workarounds, positive-tabindex recipes or old legal-compliance equivalences.

Our practical floor: logical headings and landmarks; native links and buttons;
keyboard access and visible, unobscured focus; useful alternatives; task-level
feedback; actual contrast; text enlargement and reflow. Test the entire process,
not just its landing screen. Automated checks cover only part of accessibility.

### Space that does work

Sklar distinguishes deliberate space that structures information from leftover
space (ch. 2, printed pp. 66–79). Shared edges communicate belonging; repeat the
navigation grammar across pages, not an identical layout everywhere. The book's
fixed-width examples and 960px system are historical options, not today's house
grid. Its discussion of seven-plus-or-minus-two is not a universal navigation
limit or a rule that procedures may contain only nine steps.

### Responsive character

The Handbook's contributors offer complementary checks:

- Stokes, pp. 84–86: repeated implementation patterns can flatten character.
  Improve the content-specific structure, not merely the colour tokens.
- Fisher, pp. 104–106: inventory and prioritise content around audience and purpose.
  Keep the core content available across devices. Do not design empty buckets.
- Tello, pp. 114–116: a phone should have an intentional experience, not a reduced
  desktop afterthought. Low existing mobile use does not prove low mobile interest.
- Peterson, pp. 188–191: measure, type size, leading and space work together. Test
  incremental widths and actual readability. Her Latin 45–75-character range is
  a starting point, not an equivalent Chinese/Thai measure or a compliance rule.

### Usability without flattening expression

Krug's chs. 1–3 explain unnecessary interpretive work, scanning, conventions and
visual relationships. Distinctiveness does not require reinventing Back, search
or scrolling. Ch. 9 separates observing a task from asking for an opinion. Small
qualitative rounds uncover useful failures; they do not statistically prove that
the design works for everyone. An older nontechnical participant belongs in our
early round, alongside other relevant users, not as a stereotype.

Ch. 6 treats navigation as an explanation of the system, not just a menu. Our
adaptation tests direct entry at every real depth: identity, location, next action,
return path and search where the collection requires it. Destination labels must
honour their links. Keep the principle, not a compulsory 2014 tab illustration.
Ch. 12 joins accessibility to usability, including text-only enlargement and
screen-reader reading paths. Its malformed illustrative `<alt="">` is not copied
as HTML: the correct attribute belongs on an image, e.g. `<img alt="" …>`.
Standards checks cannot repair an incomprehensible error message by themselves.

## SIC — take the mechanism, improve the obligation, credit the source

Pinned source versions and reading limits are in [reading-ledger.md](reading-ledger.md).

| Source | Mechanism retained | Our improvement / boundary |
|---|---|---|
| Impeccable | Product purpose separate from visual direction; surface-specific jobs; bounded critique | A decision must leave a visible consequence and task evidence. No installing binaries/hooks for research; no automatic tinting away a user-selected red/black pairing. |
| UI UX Pro Max | Search a specific UX outcome; prioritise accessibility; preserve verified results | A catalogue result is a candidate, not authorship. No category-to-theme shortcut, framework migration or palette substitution. Verify rules against the actual surface. |
| Taste | Design read before implementation; context overrides dials | Dials describe intent, not a quality score. No automatic increase in motion on a preservation task. Respect its landing/portfolio scope. |
| Hallmark | Structural variety; preserve existing implementation boundaries; explicit component states | Two content-based compositions, not rotation through a theme catalogue. Only real states; do not invent an error state for a static heading. Self-scores require evidence and cannot certify taste. |
| Avoid AI Design | First- and second-order defaults; code evidence separate from pixel judgment | Test interchangeable structure directly. A familiar pattern is not proof of AI. Preserve an intentionally chosen palette, mono label or number when it does a job. |

## Negative fixtures for the skill

1. **The violet hero becomes cream with orange, same three cards.** Reject the
   claimed structural redesign. Use actual content to identify a better grouping.
2. **A flood desk gains random Wada colours on alert badges.** Reject role bleed.
   Keep signal colours; expressive harmony is subordinate to operational meaning.
3. **Huge Bauhaus numerals surround 12px prose.** Reject hierarchy that defeats
   reading. Size the text for the reader, then compose its surroundings.
4. **A button labelled “Discover” downloads a file.** Name the actual action and
   format; expose completion/failure. Mystery is not personality.
5. **A calm archive uses a conventional index.** Do not condemn it as slop. The
   index does useful orientation work; judge source specificity elsewhere.
6. **A screenshot looks wonderful; exports are broken.** The mechanical gate fails.
   Keep design quality and functional correctness as separate obligations.
7. **An agent “tests with mum” by role-playing.** Record a simulated walkthrough,
   not a real human test. The Mama Rule remains unverified.

## Example receipt — Palette reading room

Person: a builder who can select colours but cannot explain why the interface
still feels generic. Outcome: understand one rule, inspect its source, and take
an actionable brief into an agent. Conservation: 348 plates, source dataset,
finder, JSON, wallpaper exports, keyboard operation. Composition: exhibition
remains a colour field; a separate readable document has named sections and
ordinary links. Rejected alternative: adding essay cards over every colour plate.
The room is Dr Non's interpretation, not redistributed source books.

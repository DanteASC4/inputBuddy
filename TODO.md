# ToDo

V1:

- [x] Expand matching options & descriptions
  - [x] New Match Modes
    - [x] "True exact"
    - [x] Same with only letters
    - [x] Dice Coefficient Similarity
    - [x] True fuzzy matching algo
  - [x] Settings For Each
- [x] New feature: Context Menu for inputs
  - [x] When users focus on a text input, show a floating menu to the side of it with the top 3 most likely saved answers
  - [x] Also allow searching saved values
- [x] New feature: Indicate autofilled elements setting
  - [x] Show / highlight any elements that were automatically filled
- [x] Fix profiles UX
- [x] Go through user flow
- [ ] Build test cases for matching strategies from real pages
- [x] Fix the "autofill" setting disabling filling entirely
- [x] Defer scan until page done loading
  - [x] Current methodology is better actually (mutation observer)
- [x] Track inputs per-page and don't keep re-scanning & filling unless new input added (or manual scan activated)
- [ ] (Ongoing) Enhance & refine visuals
  - Utilize lucide icons
- [ ] Figure out something for floating menu when match mode is `"exact"` or `"similar"`
- [ ] Remove job-specific recs
- [ ] Test drive it myself!
- [ ] Tiny feedback form

Future / ideas:

**Note** moved a couple things here as I want to spend time on getting em right, but they aren't critical to v1.

- New feature: Expanded value setting
  - `<select>`
  - `<input type="radio">`
  - `<input type="checkbox">`
- Tie match modes to profiles
- New Feature: "Reset to Default" button in settings
- New Feature: More settings
  - "skip filled"
  - indicate filled
    - style option
      - moving border
      - glow
      - solid outline
    - color
- New Feature: Advanced settings
  - Match threshold?
  - Move debug setting here
- New Feature: Security levels
  - Example levels:
    - Max security -> Needs password to use, will only work on current page & self lock after 60s or so
    - Medium security -> Needs password to use, will self lock when browser loses focus
    - Low security -> Needs password to use, then stays open until browser closed
  - Recovery codes
- nlp matching?
  - would likely be a paid feature
- New Feature: Themes
- Site/page exclusion list?
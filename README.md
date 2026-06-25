<p align="center">
  <img src="/public/icon/icon.png" />
</p>

# <p align="center">InputBuddy</p>

A free & open source extension for your convenience.

[Install via the Chrome web store](https://chromewebstore.google.com/detail/ldbpijapdbfmmokfcfobijndliaoeoal?utm_source=item-share-cb)

- [InputBuddy](#inputbuddy)
- [What \& Why?](#what--why)
- [Features](#features)
- [Matchers](#matchers)
- [Roadmap](#roadmap)
- [Donate](#donate)

# What & Why?

This is a browser extension made to eliminate the repetitive task of filling out text fields across the web. <ins>**Browser "autofill" sucks**</ins>, it rarely shows up on the inputs you need it for, and when it does it's not even automatic since you have to click it to 'accept' the autofill.

This extension aggressively grabs any possible label element for text inputs, and uses fuzzy matching to choose the best answer from your saved label & answer list, and when the match is strong enough it'll automatically fill it for you.

That means if you enter the following

```
"Label": first name
"Answer": Bob
```

Then even if there's a text field with the label `(Firs) Name`, you'll see `'Bob'` already entered for you! Don't like that behavior? Well there's plenty of settings!

# Features

- Answer Profiles
  - Group collections of target labels & answers under named profiles
  - Swap between profiles at any time
- Various Simple Settings, changeable at any time
  - Toggle the extension entirely
  - Toggle automatic filling, only filling text inputs when you click a button
  - Toggle a floating menu that will appear under text inputs that were not auto-filled, with the most likely answers shown
  - Switch between match modes at any time _learn more about differences below_
    - Fuzzy match
    - Partial match
    - Exact match
    - Similar match
  - Toggle between serif or sans-serif extension font
  - Keep all extension sections open
  - Toggle whether to indicate any text inputs that were filled by the extension
- Manual Filling of Current Page
- Clean & Intuitive UI

# Matchers

InputBuddy supports multiple match modes. `Exact` requires a perfect match. All other modes use a similarity score, and auto-fill when the best match is strong enough.

Examples:

| Mode    | Saved label    | Page label            | Match? | Why                                                   |
| ------- | -------------- | --------------------- | ------ | ----------------------------------------------------- |
| Exact   | `First Name`   | `First Name`          | Yes    | Same text after trimming whitespace.                  |
| Exact   | `First Name`   | `first name`          | No     | Case differs.                                         |
| Exact   | `First Name`   | `First-Name`          | No     | Punctuation differs.                                  |
| Similar | `First Name`   | `first-name`          | Yes    | Ignores case and non-alphanumeric characters.         |
| Similar | `E-mail`       | `email`               | Yes    | Cleans both labels to `email`.                        |
| Similar | `First Name`   | `Name First`          | No     | Same words, but different character order.            |
| Partial | `First Name`   | `Name (First)`        | Yes    | Shares many two-character chunks after cleaning.      |
| Partial | `Phone Number` | `Mobile Phone Number` | Yes    | Saved label mostly appears inside the longer label.   |
| Partial | `Zip Code`     | `Postal Code`         | No     | Similar meaning, but not enough character similarity. |
| Fuzzy   | `Email`        | `E-mail address`      | Yes    | Can bridge punctuation, gaps, and extra words.        |
| Fuzzy   | `Phone Number` | `Phone`               | Yes    | Shorter visible label still overlaps enough.          |
| Fuzzy   | `phone`        | `peohn`               | No     | Same letters, but wrong order.                        |

When to use:

| Mode    | Best for                                      | Tradeoff                                                                 |
| ------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| Exact   | Maximum safety with known, consistent labels. | Misses case, punctuation, and wording changes.                           |
| Similar | Safe matching across formatting differences.  | Still requires the same characters in the same order.                    |
| Partial | Labels with extra words or reordered wording. | Character-based matching can sometimes match shared chunks unexpectedly. |
| Fuzzy   | Most flexible autofill behavior.              | Best convenience, but highest chance of an occasional wrong match.       |

# Roadmap

There's a handful of feature ideas I've got in mind, check those out in the [TODO](./TODO.md) file, but right now some field testing is in order.

One thing I've considered adding before is device sync. This would be end-to-end encrypted, anonymous, and cheap since it'd need an separate project and hosting but I've tabled that for now, though I'd be happy to build that out if it were something people wanted.

If you have an idea, or really want me to add something, please let me know by starting a [discussion](https://github.com/DanteASC4/inputBuddy/discussions)!

# Donate

None needed!

Instead you can:

- Star this repo
- Provide some constructive feedback [in the discussions](https://github.com/DanteASC4/inputBuddy/discussions)
- Make a [contribution](./CONTRIBUTING.md)
- Rate this extension
- Share with a friend!

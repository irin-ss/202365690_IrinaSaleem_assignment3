# AI Usage Report

This report records the AI assistance used for the portfolio assignments. AI
suggestions were reviewed and adapted to the existing project rather than
replacing its structure.

## Tools used and use cases

| Tool | Use |
| --- | --- |
| Claude (Claude Sonnet 5.5) | Earlier assistance with portfolio feature ideas, outlines, debugging, and first drafts of project documentation. See the historical usage log below. |
| Copilot SDK in VS Code (model not displayed) | Assignment 3 assistance with the NASA APOD implementation, browser/API verification, and documentation updates. |

## Benefits and challenges

AI assistance helped outline the API data flow, identify loading and failure
cases, and explain how to render image and video entries. A key challenge was
that the request described a React + Vite project, while the repository is a
static HTML, CSS, and JavaScript portfolio. The implementation therefore
follows the repository's existing structure instead of introducing a framework.
The NASA endpoint was tested from a browser on a different origin; direct
browser `fetch()` worked, so no proxy or backend was needed.

## Learning outcomes

This work demonstrates how a browser requests a public JSON API, validates its
response, and renders the returned fields. It also covers keeping network and
image errors local to one section, handling video media separately from images,
and selecting a high-resolution image when available. API-supplied formatted
text is rendered through a restricted HTML allowlist rather than inserted as
unfiltered markup.

## Responsible use and modifications

AI-generated suggestions were checked against the actual repository and adapted
to its existing naming, styling, and JavaScript patterns. No API key, backend,
or new dependency was added. The endpoint response and image were tested in a
browser, and the implementation and documentation were updated to reflect the
observed response shape. Before submission, I will review the final code and
ensure I can explain it.

## Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
| --- | --- | --- | --- | --- | --- |
| C01 | Claude (Claude Sonnet 5.5) | 19 Oct 2026 | Outlined Assignment 2 portfolio features: project filtering, form validation, scroll animations, and a saved-name greeting | `index.html`, `css/styles.css`, `js/script.js` | Adapted the outlines to the portfolio and debugged the implementation. The original log did not record a specific verification checklist. |
| C02 | Claude (Claude Sonnet 5.5) | 19 Oct 2026 | Drafted the README, AI usage report, and technical documentation | `README.md`, `docs/*` | Reviewed and edited the drafts to describe the project. The original log did not record a specific verification checklist. |
| A01 | Claude (Claude Sonnet 5.5) | 19 Oct 2026 | Suggested an outline for `initProjectFilter()` | `js/script.js`, `index.html`, `css/styles.css` | Used the outline while implementing and debugging the project search and tag filters. |
| A02 | Claude (Claude Sonnet 5.5) | 19 Oct 2026 | Suggested an outline for `initContactForm()` | `js/script.js`, `index.html`, `css/styles.css` | Used the outline while implementing and debugging form validation and feedback. |
| A03 | Claude (Claude Sonnet 5.5) | 19 Oct 2026 | Suggested an outline for `initScrollReveal()` | `js/script.js`, `css/styles.css` | Used the outline while implementing and debugging scroll reveal and hover transitions. |
| A04 | Claude (Claude Sonnet 5.5) | 19 Oct 2026 | Suggested an outline for saved visitor details and greeting helpers | `js/script.js`, `css/styles.css` | Used the outline while implementing and debugging the saved-name feature. |
| C03 | Copilot SDK in VS Code (model not displayed) | 21 Nov 2026 | Implemented and documented the NASA APOD section; checked whether NASA supports direct browser requests | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Adapted the request to the existing static site. Verified cross-origin browser `fetch()` returned HTTP 200 and parsed the latest JSON; verified the returned image loaded. Also checked JavaScript syntax and exercised rendering and error states locally. |

## AI evidence for submission

The full conversations and intermediate artifacts must be exported into
`conversations/` and `artifacts/` folders in the AI Evidence ZIP submitted on
Blackboard. Keep the conversations complete and unedited; do not commit the
evidence ZIP or raw conversation logs to this repository. Ensure the evidence
IDs match the usage log above.

## Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

- **Name:** Irina Saleem
- **Student ID:** s202365690
- **Date:** 21/11/2026

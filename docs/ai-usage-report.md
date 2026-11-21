# AI Usage Report

This report records the AI assistance used for the portfolio assignments. AI
suggestions were reviewed and adapted to the existing project rather than
replacing its structure.

## Tools used and use cases

| Tool | Use |
| --- | --- |
| Chat GPT | - Explored and selected NASA's Astronomy Picture of the Day (APOD) API for the portfolio. <br> - Planned React API integration using `fetch()`, `useState` and `useEffect`, including loading and error handling. <br> - Designed the Beyond Earth section's layout, image display, hover effects and responsive styling. <br> - Prepared VS Code Copilot prompts for implementation and deployment. |
| Copilot SDK in VS Code (model not displayed) | Assistance with the NASA APOD implementation, browser/API verification, contact-form validation updates, the session-duration timer, and documentation updates. |

## Benefits and challenges

AI assistance helped outline the API data flow, identify loading and failure
cases, and explain how to render image and video entries. A key challenge was
that the request described a React + Vite project, while the repository is a
static HTML, CSS, and JavaScript portfolio. The implementation therefore
follows the repository's existing structure instead of introducing a framework.
The NASA endpoint was tested from a browser on a different origin; direct
browser `fetch()` worked, so no proxy or backend was needed.

AI assistance also tightened the existing contact form by requiring a valid
email, minimum name and message lengths, and a selected query type. The generated
HTML and JavaScript suggestions were reviewed against the existing form,
accessibility patterns, and visitor-memory behavior.

AI assistance also added a footer visit timer that calculates elapsed time from
page load and updates once per second. The implementation uses no persistent
visitor identifier or external service.

## Learning outcomes

This work demonstrates how a browser requests a public JSON API, validates its
response, and renders the returned fields. It also covers keeping network and
image errors local to one section, handling video media separately from images,
and selecting a high-resolution image when available. API-supplied formatted
text is rendered through a restricted HTML allowlist rather than inserted as
unfiltered markup. It also demonstrates elapsed-time calculation and updating
a page timer with `setInterval()` in plain JavaScript. It also demonstrates client-side form validation, inline
error feedback, focus management, and accessible invalid-field states.

## Responsible use and modifications

AI-generated suggestions were checked against the actual repository and adapted
to its existing naming, styling, and JavaScript patterns. No API key, backend,
or new dependency was added. The endpoint response and image were tested in a
browser, and the implementation and documentation were updated to reflect the
observed response shape. The contact form markup and JavaScript were checked
for syntax and served locally through an HTTP server. Before submission, I will
review the final code and ensure I can explain it.

## Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
| --- | --- | --- | --- | --- | --- |
| C01 | Copilot SDK in VS Code (model not displayed) | 21 Nov 2026 | Implemented and documented the NASA APOD section; checked whether NASA supports direct browser requests | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Adapted the request to the existing static site. Verified cross-origin browser `fetch()` returned HTTP 200 and parsed the latest JSON; verified the returned image loaded. Also checked JavaScript syntax and exercised rendering and error states locally. |
| C02 | Copilot SDK in VS Code (model not displayed) | 21 Nov 2026 | Strengthened contact-form validation and updated documentation | `index.html`, `css/styles.css`, `js/script.js`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Changed the email input to `type="email"`, added name/message lengths and a required query type, and added stricter email checks and invalid state styling. Reviewed inline error behavior and verified JavaScript syntax, `git diff --check`, and the locally served HTML markup. |
| C03 | Copilot SDK in VS Code (model not displayed) | 21 Nov 2026 | Added a session-duration timer and updated project documentation | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Added a footer timer that starts on page load, updates every second, shows `MM:SS` then `HH:MM:SS`, and includes a timer accessibility label. Reviewed the implementation and verified JavaScript syntax and repository whitespace. |
C04 | ChatGPT GPT-6 | 21 Nov 2026 | Planned NASA APOD API integration and redesigned the Beyond Earth portfolio section | N/A (implementation guidance only) | Explored NASA's APOD API, planned React fetch() integration with loading and error handling, designed the image layout and hover effects, and generated VS Code Copilot prompts for implementation and styling. |

## AI evidence for submission
The full conversation can be found in zip file submitted in blackboard.

## Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

- **Name:** Irina Saleem
- **Student ID:** s202365690
- **Date:** 21/11/2026

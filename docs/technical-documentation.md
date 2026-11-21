# Technical Documentation

## Overview
A single-page portfolio (`index.html`) styled by `css/styles.css` and enhanced by `js/script.js`. There are no frameworks or external JavaScript libraries.

## JavaScript modules (`js/script.js`)
All features start from one `DOMContentLoaded` listener. Each feature is its own function and returns early if its elements are not on the page.

| Function | Purpose |
| --- | --- |
| `initThemeToggle()` | Switches `data-theme="dark"` on `<html>`. Saves the choice under the `portfolio-theme` key in `localStorage`; falls back to the OS colour scheme on the first visit |
| `safeGetItem()` / `safeSetItem()` | `try/catch` wrappers so storage errors (e.g. private browsing) never break the page |
| `initGreeting()` | Sets the greeting text from `new Date().getHours()` |
| `initProjectFilter()` | Builds filter chips from the `.tag-list li` tags, filters cards by tag and search text, sorts by project title or original order, toggles the empty state and updates the counter |
| `initContactForm()` | Custom validation (name ≥ 2 chars, valid email pattern, message ≥ 10 chars), inline error elements, confirmation message, focus moves to the first invalid field |
| `initVisitorMemory()` + helpers (`getVisitor`, `saveVisitor`, `clearVisitor`, `prefillForm`, `updateGreetingWithName`) | Saves the name and email under `portfolio-visitor` in `localStorage` after a successful form submit, pre-fills the form on later visits, adds the first name to the greeting and offers a "Not you?" button to forget the details. Stored data never leaves the browser |
| `initScrollReveal()` | `IntersectionObserver` adds `.is-visible` to cards as they scroll into view. Skipped when the user prefers reduced motion |
| `initBeyondEarth()` | Fetches the latest APOD entry from NASA, renders image or video details, and keeps request, empty-data, and image-load errors inside the section |
| `getApodImageUrl()` / `getSafeWebUrl()` / `formatApodDate()` | Select an image URL (preferring `hdurl`), validate external links, and format the publication date |
| `appendSafeMarkup()` | Renders NASA's formatted explanation and credit using a small allowlist of HTML elements and safe web links |

## Data flow
- **Theme:** click → toggle attribute → write to `localStorage`. On load → read `localStorage` → apply.
- **Project filter/sort:** search input, tag-chip click, or sort selection → `update()` → cards are reordered and filtered → counter and empty state refresh.
- **Form:** `submit` → `preventDefault()` → validate every field → show errors or a success message and reset.
- **APOD:** page load → request one entry from NASA's public APOD endpoint → validate the response array → render its text and image/video; failures show a section-local message. Image load failures replace the image with an explanation and a link to NASA.

## NASA APOD integration
- Endpoint: `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?per_page=1` (latest entry; no API key).
- The repository is a static HTML/CSS/JavaScript site, so the feature is implemented as an HTML section with an `initBeyondEarth()` initializer rather than a React component.
- Browser `fetch()` was tested cross-origin and returned a successful JSON response. No proxy or backend is used.
- NASA returns `title`, `date`, `media_type`, `explanation`, `credit`/`copyright`, and page/media URLs. Images prefer `hdurl`; if absent, the code checks other image fields and the image in `basic_html` before falling back to `url`.
- Video items are rendered as links instead of `<img>` elements. Formatted NASA text is rendered through a restricted HTML allowlist; arbitrary API markup and unsafe link protocols are not inserted into the page.

## CSS notes
- Colours and fonts are CSS custom properties on `:root`; dark mode overrides them under `[data-theme="dark"]`.
- Animations: `.reveal` / `.is-visible` (scroll fade-in), `fade-slide` keyframes (messages), transitions on buttons, chips and cards.
- `.project-card[hidden] { display: none; }` is required because `display: flex` would otherwise override the `hidden` attribute.
- A `prefers-reduced-motion` media query disables animation for users who ask for it.

## Accessibility (added using AI)
- Form errors are linked with `aria-describedby` and flagged with `aria-invalid`.
- The status message and project counter use `aria-live="polite"`.
- Theme toggle and filter chips expose state with `aria-pressed`.

## Browser support
Tested features use standard APIs (`IntersectionObserver`, `localStorage`, CSS custom properties) supported by current Chrome, Edge, Firefox and Safari. If `IntersectionObserver` is missing, content stays visible without animation.

## Possible future work
- Connect the contact form to a service (e.g. Formspree) or a backend.
- Add retry controls for external API requests.

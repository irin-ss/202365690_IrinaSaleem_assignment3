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
| `initVisitTimer()` | Records page-load time and updates the footer counter every second; switches from `MM:SS` to `HH:MM:SS` after one hour |
| `initProjectFilter()` | Builds filter chips from the `.tag-list li` tags, filters cards by tag and search text, sorts by project title or original order, toggles the empty state and updates the counter |
| `initContactForm()` | Custom validation (required name ≥ 2 chars, valid email format, required message ≥ 10 chars, and a selected query type), inline error elements, confirmation message, and focus moves to the first invalid field |
| `initVisitorMemory()` + helpers (`getVisitor`, `saveVisitor`, `clearVisitor`, `prefillForm`, `updateGreetingWithName`) | Saves the name and email under `portfolio-visitor` in `localStorage` after a successful form submit, pre-fills the form on later visits, adds the first name to the greeting and offers a "Not you?" button to forget the details. Stored data never leaves the browser |
| `initScrollReveal()` | `IntersectionObserver` adds `.is-visible` to cards as they scroll into view. Skipped when the user prefers reduced motion |
| `initBeyondEarth()` | Fetches the latest APOD entry from NASA, renders image or video details, and keeps request, empty-data, and image-load errors inside the section |
| `getApodImageUrl()` / `getSafeWebUrl()` / `formatApodDate()` | Select an image URL (preferring `hdurl`), validate external links, and format the publication date |
| `appendSafeMarkup()` | Renders NASA's formatted explanation and credit using a small allowlist of HTML elements and safe web links |

## Data flow
- **Theme:** click → toggle attribute → write to `localStorage`. On load → read `localStorage` → apply.
- **Visit timer:** page load → store `Date.now()` → one-second `setInterval()` calculates elapsed seconds → update the footer text and accessible label.
- **Project filter/sort:** search input, tag-chip click, or sort selection → `update()` → cards are reordered and filtered → counter and empty state refresh.
- **Form:** `submit` → `preventDefault()` → validate name, email, message, and topic → show inline errors and a summary status, or save visitor details, reset the form, refresh the greeting, and show success.
- **APOD:** page load → request one entry from NASA's public APOD endpoint → validate the response array → render its text and image/video; failures show a section-local message. Image load failures replace the image with an explanation and a link to NASA.

## Contact form validation
- Native constraints include `required`, name minimum/maximum lengths, an email
  input with a maximum length, message minimum/maximum lengths, and a required
  topic `<select>`. `novalidate` disables browser bubbles so the page can use
  its consistent inline feedback.
- JavaScript trims values and validates each field on blur and while correcting
  an already invalid field. The email check verifies a `name@example.com`-style
  format and rejects repeated dots, a leading dot, and a dot immediately before
  `@`.
- Each field has an associated `.field-error` element linked through
  `aria-describedby`. Invalid fields receive `aria-invalid="true"`, receive
  red-border styling, and the first invalid field receives focus after a
  failed submit.
- A valid submit prevents the missing backend from receiving a real network
  request, saves the name/email locally, resets the form, restores saved
  prefill values, personalises the greeting, and shows a success status.

## NASA APOD integration
- Endpoint: `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?per_page=1` (latest entry; no API key).
- The repository is a static HTML/CSS/JavaScript site, so the feature is implemented as an HTML section with an `initBeyondEarth()` initializer rather than a React component.
- Browser `fetch()` was tested cross-origin and returned a successful JSON response. No proxy or backend is used.
- NASA returns `title`, `date`, `media_type`, `explanation`, `credit`/`copyright`, and page/media URLs. Images prefer `hdurl`; if absent, the code checks other image fields and the image in `basic_html` before falling back to `url`.
- Video items are rendered as links instead of `<img>` elements. Formatted NASA text is rendered through a restricted HTML allowlist; arbitrary API markup and unsafe link protocols are not inserted into the page.

## CSS notes
- Colours and fonts are CSS custom properties on `:root`; dark mode overrides them under `[data-theme="dark"]`.
- Animations: `.reveal` / `.is-visible` (scroll fade-in), `fade-slide` keyframes (messages), transitions on buttons, chips and cards.
- `.footer-inner` arranges the copyright text, visit timer and back-to-top link in a responsive footer row.
- `.project-card[hidden] { display: none; }` is required because `display: flex` would otherwise override the `hidden` attribute.
- A `prefers-reduced-motion` media query disables animation for users who ask for it.

## Accessibility (added using AI)
- The visit timer uses `role="timer"` and an `aria-label` that identifies elapsed time without announcing a changing value continuously.
- Form errors are linked with `aria-describedby` and flagged with `aria-invalid`.
- The required query topic and every text field has native constraints, and
  invalid fields are highlighted and announced through the status message.
- The status message and project counter use `aria-live="polite"`.
- Theme toggle and filter chips expose state with `aria-pressed`.

## Browser support
Tested features use standard APIs (`IntersectionObserver`, `localStorage`, CSS custom properties) supported by current Chrome, Edge, Firefox and Safari. If `IntersectionObserver` is missing, content stays visible without animation.


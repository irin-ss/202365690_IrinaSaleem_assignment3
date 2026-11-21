# Irina Saleem — Personal Portfolio

A personal portfolio website built with HTML, CSS, and JavaScript for SWE363,
featuring an About/Hero section, technical projects, a design gallery, skills,
NASA's Astronomy Picture of the Day, and a contact form.

**Assignment 1** built the static site. **Assignment 2** adds
interactivity: project search and filters, a validated contact form, a
personalised greeting, and scroll animations. **Assignment 3** adds a live NASA
APOD section with loading, empty, media, and error handling.

## Live Demo
The previous Assignment 2 deployment is available at
[GitHub Pages](https://irin-ss.github.io/202365690-IrinaSaleem-assignment2/).
It does not include this Assignment 3 update unless the new version is deployed.


## Folder Structure

```
202365690_IrinaSaleem_assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── img/
│   ├── Logo.png
│   ├── project1.png
│   ├── project2.png
│   ├── PowerPlay.png
│   ├── MeetnGreet.png
│   └── GamingCertificate.png
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## Features

### From Assignment 1

- **About** — a short introduction and a portrait image
- **Technical Projects** — two engineering projects (MIPS processor design,
  FPGA-based VPN accelerator) with tags and links (report and source links are
  still placeholders)
- **Designs** — a hover-to-reveal gallery of posters and graphics I've designed
- **Skills** — languages, tools, and what I'm currently learning
- **Dark/light theme toggle** — remembers the visitor's choice using
  `localStorage`, and falls back to the visitor's OS-level preference on
  first visit
- **Time-of-day greeting** — the hero greeting changes between morning,
  afternoon and evening

### New in Assignment 2

| Requirement | What I added |
| --- | --- |
| **Dynamic content** | **Live project search** and **tag filter chips** (e.g. Verilog, FPGA). Chips are generated automatically from each project card's tags, and a counter shows "Showing X of Y projects" |
| **Data handling** | **Contact form validation** (name, email format, message length) with a confirmation message on success, plus `localStorage` for the theme and for the visitor's details |
| **Personalised greeting** | After a successful form submission, the visitor's name is saved in their browser, so the greeting becomes e.g. "Good evening, Irina". Name and email also pre-fill the form next time. A **"Not you? Forget my details"** button clears them |
| **Animation and transitions** | Fade-in on scroll for cards and the form, hover transitions on buttons, chips and cards, and animated error and success messages. Animations are turned off for visitors who prefer reduced motion |
| **Error handling and user feedback** | Inline error messages that say what is wrong and how to fix it, focus moves to the first invalid field, a "No projects found" empty state with a **Clear search** button, and a status message after sending |


**Note:** the contact form has no backend yet (`action="#"`). A valid
submission shows a confirmation and saves the visitor's details locally, but the
message is not actually sent.

### New in Assignment 3

- **Beyond Earth:** fetches the latest APOD directly from NASA's public
  `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?per_page=1` endpoint.
- Shows the image (preferring `hdurl`), title, publication date, NASA
  explanation, available credit/copyright, and a link to the original NASA page.
- Displays a media link for video entries, plus loading, empty, request-error,
  and image-load-error states. Failures are kept within the APOD section.
- Uses the same theme colours and typography and adapts to narrow screens.

The API request runs in the browser with `fetch()` and needs no API key or
backend. A cross-origin browser request and the current image URL were tested
successfully. If the endpoint is unavailable, the rest of the portfolio remains
usable and the APOD section shows a friendly message.

## Setup Instructions - Run Locally

No build tools or installs are required — this is a static site.

1. **Clone the repository**
```bash
git clone https://github.com/irin-ss/202365690_IrinaSaleem_assignment3.git
cd 202365690_IrinaSaleem_assignment3
```
2. **Serve it over HTTP** (needed for the APOD request)
    - Open the folder in VS Code and use the "Live Server" extension, or
    - Start a local server:
```bash
python3 -m http.server 8000
```

then visit
```
http://localhost:8000
```

### Trying the new features

1. **Beyond Earth:** scroll to the APOD section and confirm its loading message
   is replaced with NASA's latest image, explanation, date, and credit.

## Documentation

- [`docs/ai-usage-report.md`](docs/ai-usage-report.md) — tools used, what was changed, and what I learned
- [`docs/technical-documentation.md`](docs/technical-documentation.md) — how each JavaScript function works, data flow, and CSS notes

## AI Use (Summary)

In Assignment 1, AI assistance was used for scaffolding sections, debugging
CSS/HTML class mismatches, and reviewing spacing and layout issues.

In Assignment 2, AI (Claude) was used to help generate outlines and explain the
project search and filter, form validation, scroll animations, and saved-name
greeting. 

In Assignment 3, Copilot was used to help implement and document the
NASA APOD section. The existing static project structure was retained; the
generated suggestions were reviewed, adapted, and tested. Full details and the
required usage log are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

## Browser Support

Tested in the latest versions of Chrome and Edge, and checked at desktop,
tablet, and mobile widths using browser DevTools.

## Author

- **Name:** Irina Saleem
- **Student ID:** s202365690
- **Course:** SWE363

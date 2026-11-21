document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initGreeting();
    // ---- Assignment 2 additions ---- got help from claude to make initial outlines and write and test them.
    initProjectFilter();
    initContactForm();
    initScrollReveal();
    initVisitorMemory();
    initBeyondEarth();
});

function initGreeting() {
    const greetingEl = document.getElementById('greeting'); /*ai help*/
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting;

    if (hour < 5) {
        greeting = 'Go Sleep';
    } else if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    greetingEl.textContent = greeting;
}

/* --------------------------------------------------------------------
 * NASA Astronomy Picture of the Day
 * ------------------------------------------------------------------ */
function initBeyondEarth() {
    const section = document.getElementById('beyond-earth');
    const status = document.getElementById('apod-status');
    const entry = document.getElementById('apod-entry');
    if (!section || !status || !entry) return;

    const endpoint = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/?per_page=1';
    const image = document.getElementById('apod-image');
    const imageError = document.getElementById('apod-image-error');
    const video = document.getElementById('apod-video');
    const title = document.getElementById('apod-title');
    const date = document.getElementById('apod-date');
    const explanation = document.getElementById('apod-explanation');
    const credit = document.getElementById('apod-credit');
    const tomorrow = document.getElementById('apod-tomorrow');
    const tomorrowTitle = document.getElementById('apod-tomorrow-title');
    const original = document.getElementById('apod-original');
    const imageStage = document.querySelector('.apod-image-stage');
    const explanationDetails = document.getElementById('apod-explanation-details');

    explanationDetails.addEventListener('toggle', () => {
        imageStage.classList.toggle('is-explanation-open', explanationDetails.open);
    });
    imageStage.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'touch') explanationDetails.open = false;
    });

    fetch(endpoint)
        .then((response) => {
            if (!response.ok) throw new Error(`NASA APOD request failed (${response.status}).`);
            return response.json();
        })
        .then((items) => {
            if (!Array.isArray(items)) throw new Error('NASA returned an unexpected response.');
            if (items.length === 0) {
                showStatus("NASA hasn't published an astronomy picture for today yet.");
                return;
            }
            if (!items[0] || typeof items[0] !== 'object' || Array.isArray(items[0]) ||
                Object.keys(items[0]).length === 0) {
                throw new Error('NASA returned an unexpected APOD entry.');
            }

            renderEntry(items[0]);
        })
        .catch((error) => {
            console.error('Unable to load NASA APOD:', error);
            showStatus("We couldn't load today's astronomy picture. Please try again later.", true);
        });

    function renderEntry(item) {
        const titleText = item.title || 'Astronomy Picture of the Day';
        const originalUrl = getSafeWebUrl(item.permalink || item.url) || 'https://science.nasa.gov/apod/';

        title.textContent = titleText;
        date.textContent = formatApodDate(item.date);
        original.href = originalUrl;
        const explanationParts = splitTomorrowPicture(
            item.explanation || 'NASA has not provided an explanation for this picture.'
        );
        appendSafeMarkup(explanation, explanationParts.explanation);
        if (explanationParts.tomorrow) {
            tomorrowTitle.textContent = explanationParts.tomorrow;
            tomorrow.hidden = false;
        }

        const creditText = item.credit || item.copyright;
        if (creditText) {
            appendSafeMarkup(credit, creditText);
            credit.hidden = false;
        }

        if (item.media_type === 'video') {
            renderVideo(item, originalUrl);
        } else {
            renderImage(item, titleText, originalUrl);
        }

        status.hidden = true;
        entry.hidden = false;
    }

    function renderImage(item, altText, originalUrl) {
        const imageUrl = getApodImageUrl(item);
        if (!imageUrl) {
            imageError.hidden = false;
            imageError.textContent = 'NASA has not supplied an image URL for this picture. Explore the original NASA page instead.';
            return;
        }

        image.src = imageUrl;
        image.alt = item.alt || altText;
        image.hidden = false;
        image.addEventListener('error', () => {
            image.hidden = true;
            imageError.hidden = false;
            imageError.textContent = "The astronomy image couldn't be loaded. ";
            const fallbackLink = document.createElement('a');
            fallbackLink.href = originalUrl;
            fallbackLink.target = '_blank';
            fallbackLink.rel = 'noopener noreferrer';
            fallbackLink.textContent = 'Explore the original NASA page.';
            imageError.appendChild(fallbackLink);
        }, { once: true });
    }

    function renderVideo(item, originalUrl) {
        const mediaUrl = getSafeWebUrl(item.url) || originalUrl;
        const message = document.createElement('p');
        message.textContent = "Today's APOD is a video or other media feature.";
        const link = document.createElement('a');
        link.href = mediaUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Watch or explore the APOD media';
        video.append(message, link);
        video.hidden = false;
    }

    function showStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle('is-error', Boolean(isError));
    }
}

function getApodImageUrl(item) {
    const highResolutionUrl = getSafeWebUrl(item.hdurl);
    if (highResolutionUrl) return highResolutionUrl;

    const directUrl = item.image_url || item.imageUrl;
    const safeDirectUrl = getSafeWebUrl(directUrl);
    if (safeDirectUrl) return safeDirectUrl;

    if (typeof item.basic_html === 'string') {
        const documentFromHtml = new DOMParser().parseFromString(item.basic_html, 'text/html');
        const source = documentFromHtml.querySelector('img[src]')?.getAttribute('src');
        const safeSource = getSafeWebUrl(source);
        if (safeSource) return safeSource;
    }

    return getSafeWebUrl(item.url);
}

function getSafeWebUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
        const url = new URL(value, 'https://science.nasa.gov');
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch (error) {
        return '';
    }
}

function formatApodDate(value) {
    if (typeof value !== 'string') return 'Publication date unavailable';
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return 'Publication date unavailable';
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(parsed);
}

function splitTomorrowPicture(markup) {
    const parsed = new DOMParser().parseFromString(markup, 'text/html');
    const text = parsed.body.textContent || '';
    const marker = /Tomorrow's picture:\s*/i;
    const match = marker.exec(text);
    if (!match) return { explanation: markup, tomorrow: '' };

    const tomorrow = text.slice(match.index + match[0].length).trim();
    const walker = document.createTreeWalker(parsed.body, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let textNode = walker.nextNode();

    while (textNode) {
        const nodeEnd = offset + textNode.textContent.length;
        if (match.index >= offset && match.index <= nodeEnd) {
            const range = document.createRange();
            range.setStart(textNode, match.index - offset);
            range.setEnd(parsed.body, parsed.body.childNodes.length);
            range.deleteContents();

            const emptyParent = textNode.parentElement;
            if (emptyParent && !emptyParent.textContent.trim() && !emptyParent.children.length) {
                emptyParent.remove();
            }
            while (parsed.body.lastChild && parsed.body.lastChild.nodeName === 'BR') {
                parsed.body.lastChild.remove();
            }
            break;
        }
        offset = nodeEnd;
        textNode = walker.nextNode();
    }

    return { explanation: parsed.body.innerHTML, tomorrow };
}

function appendSafeMarkup(target, markup) {
    const parsed = new DOMParser().parseFromString(markup, 'text/html');
    const allowedTags = new Set(['A', 'B', 'BR', 'EM', 'I', 'P', 'STRONG']);

    function copyNode(source, destination) {
        if (source.nodeType === Node.TEXT_NODE) {
            destination.appendChild(document.createTextNode(source.textContent));
            return;
        }

        if (source.nodeType !== Node.ELEMENT_NODE) return;
        if (!allowedTags.has(source.tagName)) {
            source.childNodes.forEach((child) => copyNode(child, destination));
            return;
        }

        const safeElement = document.createElement(source.tagName.toLowerCase());
        if (source.tagName === 'A') {
            const href = getSafeWebUrl(source.getAttribute('href'));
            if (href) {
                safeElement.href = href;
                safeElement.target = '_blank';
                safeElement.rel = 'noopener noreferrer';
            }
        }
        source.childNodes.forEach((child) => copyNode(child, safeElement));
        destination.appendChild(safeElement);
    }

    parsed.body.childNodes.forEach((child) => copyNode(child, target));
}

/* --------------------------------------------------------------------
 * Dark / light theme toggle
 *    Preference is saved in localStorage so it persists across visits.
 * ------------------------------------------------------------------ */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const STORAGE_KEY = 'portfolio-theme';

    if (!toggleBtn) return;

    // Apply a saved preference, or fall back to the visitor's OS setting.
    const saved = safeGetItem(STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startTheme = saved || (prefersDark ? 'dark' : 'light');

    applyTheme(startTheme);

    toggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        safeSetItem(STORAGE_KEY, next);
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            toggleBtn.setAttribute('aria-pressed', 'true');
            toggleBtn.querySelector('.theme-toggle-icon').textContent = '☀';
            toggleBtn.querySelector('.theme-toggle-label').textContent = 'Light mode';
        } else {
            root.removeAttribute('data-theme');
            toggleBtn.setAttribute('aria-pressed', 'false');
            toggleBtn.querySelector('.theme-toggle-icon').textContent = '☾';
            toggleBtn.querySelector('.theme-toggle-label').textContent = 'Dark mode';
        }
    }
}

// localStorage can throw in some contexts (private browsing, disabled
// storage). These wrappers make the theme toggle fail quietly instead
// of breaking the whole page.
function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSetItem(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}


/* ====================================================================
 * ASSIGNMENT 2 ADDITIONS
 * ================================================================== */

/* --------------------------------------------------------------------
 * Project search + tag filter (dynamic content)
 *    Chips are built from the tags already present in each project
 *    card, so adding a new project card needs no JS changes.
 * ------------------------------------------------------------------ */
function initProjectFilter() {
    const searchInput = document.getElementById('project-search');
    const filterBox = document.getElementById('project-filters');
    const emptyState = document.getElementById('project-empty');
    const resultCount = document.getElementById('project-count');
    const clearBtn = document.getElementById('project-clear');
    const sortSelect = document.getElementById('project-sort');
    const projectGrid = document.querySelector('.project-grid');
    const cards = Array.from(document.querySelectorAll('.project-card'));

    if (!searchInput || !filterBox || !emptyState || !resultCount || !projectGrid || cards.length === 0) return;

    const tagsOf = (card) =>
        Array.from(card.querySelectorAll('.tag-list li'), (li) => li.textContent.trim());
    const originalOrder = new Map(cards.map((card, index) => [card, index]));
    const titleOf = (card) => card.querySelector('h3')?.textContent.trim() || '';

    // Unique list of tags across all cards
    const allTags = [...new Set(cards.flatMap(tagsOf))];
    let activeTag = 'All';

    ['All', ...allTags].forEach((tag) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'filter-chip';
        chip.textContent = tag;
        chip.setAttribute('aria-pressed', tag === 'All' ? 'true' : 'false');
        chip.addEventListener('click', () => {
            activeTag = tag;
            filterBox.querySelectorAll('.filter-chip').forEach((c) => {
                c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
            });
            update();
        });
        filterBox.appendChild(chip);
    });

    searchInput.addEventListener('input', update);
    if (sortSelect) sortSelect.addEventListener('change', update);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            activeTag = 'All';
            filterBox.querySelectorAll('.filter-chip').forEach((c) => {
                c.setAttribute('aria-pressed', c.textContent === 'All' ? 'true' : 'false');
            });
            update();
            searchInput.focus();
        });
    }

    function update() {
        const query = searchInput.value.trim().toLowerCase();
        const sortOrder = sortSelect ? sortSelect.value : 'default';
        let visible = 0;

        const sortedCards = [...cards].sort((first, second) => {
            if (sortOrder === 'title-asc') {
                return titleOf(first).localeCompare(titleOf(second), undefined, { sensitivity: 'base' });
            }
            if (sortOrder === 'title-desc') {
                return titleOf(second).localeCompare(titleOf(first), undefined, { sensitivity: 'base' });
            }
            return originalOrder.get(first) - originalOrder.get(second);
        });

        sortedCards.forEach((card) => {
            projectGrid.appendChild(card);
            const matchesTag = activeTag === 'All' || tagsOf(card).includes(activeTag);
            const matchesText = card.textContent.toLowerCase().includes(query);
            const show = matchesTag && matchesText;
            card.hidden = !show;
            if (show) visible++;
        });

        emptyState.hidden = visible !== 0;
        resultCount.textContent =
            visible === 0
                ? ''
                : `Showing ${visible} of ${cards.length} project${cards.length === 1 ? '' : 's'}`;
    }

    update();
}

/* --------------------------------------------------------------------
 * Contact form: validation + friendly feedback
 *    Errors tell the user what is wrong and how to fix it.
 *    There is no backend yet (action="#"), so a successful submit
 *    shows a confirmation and clears the form.
 * ------------------------------------------------------------------ */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const fields = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        message: form.querySelector('#message')
    };

    const validators = {
        name: (v) => (v.length < 2 ? 'Please enter your name (at least 2 characters).' : ''),
        email: (v) => {
            if (!v) return 'Please enter your email address.';
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
            return ok ? '' : 'That email doesn\'t look right. Try something like name@example.com.';
        },
        message: (v) => (v.length < 10 ? 'Your message is a bit short. Please write at least 10 characters.' : '')
    };

    // Turn off the browser's default bubbles so our own messages show
    form.setAttribute('novalidate', '');

    // Create one error element per field
    Object.entries(fields).forEach(([key, input]) => {
        if (!input) return;
        const err = document.createElement('p');
        err.className = 'field-error';
        err.id = `${key}-error`;
        err.hidden = true;
        input.setAttribute('aria-describedby', err.id);
        input.insertAdjacentElement('afterend', err);

        // Re-check as the user fixes the problem
        input.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') validateField(key);
        });
        input.addEventListener('blur', () => validateField(key));
    });

    function validateField(key) {
        const input = fields[key];
        const err = document.getElementById(`${key}-error`);
        const message = validators[key](input.value.trim());

        err.textContent = message;
        err.hidden = !message;
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
        return !message;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const results = Object.keys(fields).map(validateField);
        const allValid = results.every(Boolean);

        if (!allValid) {
            showStatus('Some fields need attention. Please fix the highlighted ones and send again.', 'error');
            const firstBad = Object.values(fields).find((f) => f.getAttribute('aria-invalid') === 'true');
            if (firstBad) firstBad.focus();
            return;
        }

        const firstName = fields.name.value.trim().split(' ')[0];
        saveVisitor(fields.name.value.trim(), fields.email.value.trim());
        form.reset();
        Object.values(fields).forEach((f) => f.removeAttribute('aria-invalid'));
        prefillForm();              // put the saved name/email back for next time
        updateGreetingWithName();   // "Good evening, Irina"
        showStatus(`Thanks, ${firstName}! Your message has been received. I'll get back to you soon.`, 'success');
    });

    function showStatus(text, type) {
        if (!status) return;
        status.textContent = text;
        status.className = `form-status ${type}`;
        status.hidden = false;
    }
}

/* --------------------------------------------------------------------
 * Fade-in on scroll
 *    Skipped for visitors who prefer reduced motion, and if the
 *    browser lacks IntersectionObserver (content simply stays visible).
 * ------------------------------------------------------------------ */
function initScrollReveal() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll('.project-card, .design-card, .skill-group, .contact-form');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 3) * 80}ms`; // small stagger
        observer.observe(el);
    });
}


/* --------------------------------------------------------------------
 * Remember the visitor (localStorage)
 *    After a successful form submit the name and email are saved in the
 *    browser only. They then:
 *      1. pre-fill the contact form next time
 *      2. personalise the greeting ("Good evening, Irina")
 *    A "Not you?" button lets the visitor forget the saved details.
 * ------------------------------------------------------------------ */
const VISITOR_KEY = 'portfolio-visitor';

function getVisitor() {
    try {
        const data = JSON.parse(safeGetItem(VISITOR_KEY));
        return data && data.name ? data : null;
    } catch (e) {
        return null; // corrupted value: treat as no saved visitor
    }
}

function saveVisitor(name, email) {
    safeSetItem(VISITOR_KEY, JSON.stringify({ name, email }));
}

function clearVisitor() {
    try { localStorage.removeItem(VISITOR_KEY); } catch (e) { /* ignore */ }
}

function prefillForm() {
    const visitor = getVisitor();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    if (!visitor || !nameInput || !emailInput) return;

    // never overwrite something the visitor is currently typing
    if (!nameInput.value) nameInput.value = visitor.name;
    if (!emailInput.value) emailInput.value = visitor.email || '';
}

function updateGreetingWithName() {
    const greetingEl = document.getElementById('greeting');
    const forgetBtn = document.getElementById('forget-visitor');
    if (!greetingEl) return;

    // remember the plain time-of-day greeting so we can switch back to it
    if (!greetingEl.dataset.base) greetingEl.dataset.base = greetingEl.textContent;

    const visitor = getVisitor();
    if (visitor) {
        const firstName = visitor.name.split(' ')[0];
        greetingEl.textContent = `${greetingEl.dataset.base}, ${firstName}`;
    } else {
        greetingEl.textContent = greetingEl.dataset.base;
    }
    if (forgetBtn) forgetBtn.hidden = !visitor;
}

function initVisitorMemory() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    // small "Not you?" button right after the greeting
    const forgetBtn = document.createElement('button');
    forgetBtn.type = 'button';
    forgetBtn.id = 'forget-visitor';
    forgetBtn.className = 'link-button';
    forgetBtn.textContent = 'Not you? Forget my details';
    forgetBtn.hidden = true;
    greetingEl.insertAdjacentElement('afterend', forgetBtn);

    forgetBtn.addEventListener('click', () => {
        clearVisitor();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        updateGreetingWithName();
    });

    updateGreetingWithName();
    prefillForm();
}

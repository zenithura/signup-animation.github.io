document.addEventListener('DOMContentLoaded', () => {
    const state = initializeState();
    prepareLayout(elements);
    handleScale(elements);
    window.onresize = () => handleScale(elements);
    const emailTimeline = createEmailTimeline(elements, state);
    const gearsTimelines = createGearsTimelines(elements, state);
    const pullingTimeline = createPullingTimeline(elements, state);
    setupEventListeners(elements, gearsTimelines, emailTimeline, state);
    startAnimations(gearsTimelines, emailTimeline);
});

function initializeState() {
    return {
        sprayRepeatCounter: 0,
        handClosed: false,
        submitBtnOnPlace: false,
        submitBtnTextOpacity: 0,
        pullProgress: 0,
        nameValid: false,
        emailValid: false
    };
}

function prepareLayout(elements) {
    gsap.set(elements.containerEl, { color: "rgba(0, 0, 0, 0)", rotation: -90 });
    gsap.set(elements.submitBtn, { color: "rgba(0, 0, 0, 0)", rotation: -90 });
}

function handleScale(elements) {
    const baseHeight = 800;
    if (window.innerHeight < baseHeight) {
        gsap.set(elements.containerEl, {
            scale: window.innerHeight / baseHeight,
            transformOrigin: "50% 75%"
        });
    }
}

function createEmailTimeline(elements, state) {
    const timeline = gsap.timeline({ paused: true })
        .to(elements.spiralPath, { rotation: -360, duration: 2 })
        .to(elements.car, { x: 100, duration: 1 }, "-=1");
    return timeline;
}

function createGearsTimelines(elements, state) {
    const timelines = [];
    elements.gearsContainer.querySelectorAll('g').forEach((gear) => {
        const tl = gsap.timeline({ repeat: -1, paused: true })
            .to(gear, { rotation: 360, duration: 5, ease: "none" });
        timelines.push(tl);
    });
    return timelines;
}

function createPullingTimeline(elements, state) {
    const timeline = gsap.timeline({ paused: true })
        .to(elements.submitBtn, { rotation: 0, duration: 1 })
        .to(elements.submitBtn, { opacity: 1, duration: 0.5 });
    return timeline;
}

function setupEventListeners(elements, gearsTimelines, emailTimeline, state) {
    elements.checkboxEl.addEventListener('change', () => {
        pullingTimeline.play();
    });

    elements.nameEl.addEventListener('input', () => {
        state.nameValid = elements.nameEl.value.length > 3;
        toggleValidation(elements.nameEl, state.nameValid);
        toggleGears(gearsTimelines, state.nameValid);
    });

    elements.emailEl.addEventListener('input', () => {
        state.emailValid = validateEmail(elements.emailEl.value);
        toggleValidation(elements.emailEl, state.emailValid);
        state.emailValid ? emailTimeline.play() : emailTimeline.reverse();
    });

    elements.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.nameValid && state.emailValid && elements.checkboxEl.checked) {
            animateFormSubmission(elements);
        }
    });
}

function startAnimations(gearsTimelines, emailTimeline) {
    gearsTimelines.forEach(tl => tl.play());
    emailTimeline.play();
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function toggleValidation(element, isValid) {
    if (isValid) {
        element.classList.add("valid");
    } else {
        element.classList.remove("valid");
    }
}

function toggleGears(gearsTimelines, shouldPlay) {
    gearsTimelines.forEach(tl => {
        shouldPlay ? tl.play() : tl.pause();
    });
}

function animateFormSubmission(elements) {
    gsap.to(elements.containerEl, { opacity: 0, duration: 1 });
    gsap.to(elements.submitBtn, { opacity: 0, duration: 1, delay: 0.5 });
}

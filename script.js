/**
 *abs academy - Starter Course Logic
 * Handles animations, form validation, and webhook submission.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Animations
    initAnimations();

    // 2. WhatsApp Toggle Logic
    const whatsappToggle = document.getElementById('whatsapp-toggle');
    const whatsappFields = document.getElementById('whatsapp-fields');

    if (whatsappToggle) {
        whatsappToggle.addEventListener('change', (e) => {
            whatsappFields.classList.toggle('active', !e.target.checked);
            if (!e.target.checked) {
                gsap.from(whatsappFields, {
                    height: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    }

    // 3. Form Submission
    const starterForm = document.getElementById('starterForm');
    if (starterForm) {
        starterForm.addEventListener('submit', handleRegistration);
    }
});

/**
 * GSAP Entry Animations
 */
function initAnimations() {
    const tl = gsap.timeline();

    tl.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
        .from('.hero-badge', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-title, .hero-points li', {
            x: -50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.reg-card', {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        }, '-=0.8');
}

/**
 * Handles the registration form submission
 */
async function handleRegistration(event) {
    event.preventDefault();

    const btn = document.getElementById('submit-btn');
    const form = document.getElementById('starterForm');
    const successArea = document.getElementById('success-area');

    // Validation
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value.replace(/\s/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    // Prepare Data
    const pCode = document.getElementById('country-code').value;
    const isWhatsappSame = document.getElementById('whatsapp-toggle').checked;
    const wCode = isWhatsappSame ? pCode : document.getElementById('whatsapp-code').value;
    const wNum = isWhatsappSame ? phone : document.getElementById('whatsapp-num').value;

    const formData = {
        name: document.getElementById('name').value,
        email: email,
        phoneCountryCode: pCode,
        phoneNumber: phone,
        whatsappCountryCode: wCode,
        whatsappNumber: wNum,
        whatsappSameCheck: isWhatsappSame,
        profession: document.getElementById('profession-select').value,
        submissionDate: new Date().toLocaleDateString(),
        submissionTime: new Date().toLocaleTimeString(),
        source: 'Starter Course Hub',
        sourceURL: window.location.href
    };

    // Update Button State
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        // Submit to Webhook
        await fetch('https://n8n.srv1237010.hstgr.cloud/webhook/720e62cf-ddaf-4ee7-b9e5-c5616c47d6b3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // Show Success View with Animation
        gsap.to(form, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            onComplete: () => {
                form.style.display = 'none';
                successArea.style.display = 'block';
                gsap.from(successArea, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }
        });

        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'watch.html';
        }, 2500);

    } catch (err) {
        console.error('Submission error:', err);
        // Fail gracefully - still redirect as the lead might have been captured or fallback is needed
        window.location.href = 'watch.html';
    }
}

// Mobile nav toggle
document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('nav-menu').classList.toggle('open');
});

// Contact form validation (contact.html)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    const msgBox = document.getElementById('formMessage');
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      msgBox.textContent = "Please fill in all fields.";
      msgBox.style.color = "red";
      return;
    }
    msgBox.textContent = `Thanks ${name.value.trim()}! We'll be in touch.`;
    msgBox.style.color = "green";
    contactForm.reset();
  });
}

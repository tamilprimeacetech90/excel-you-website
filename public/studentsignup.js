// Theme Toggle
const themeBtn = document.getElementById('themeBtn');
let currentTheme = 'dark';

themeBtn.addEventListener('click', () => {
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        themeBtn.textContent = '🌙';
        currentTheme = 'light';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeBtn.textContent = '☀️';
        currentTheme = 'dark';
    }
});

// Avatar Switch
document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const avatar = document.getElementById('avatarPreview');
        const gender = btn.dataset.gender;
        
        if (gender === 'male') {
            avatar.src = "/assets/avatars/male-beginner.png";
        } else {
            avatar.src = "/assets/avatars/female-beginner.png";
        }
    });
});

// Form Submit
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value || "Scholar";
    alert(`🎉 Welcome ${name}! Your EXCEL YOU account has been created successfully.`);
});
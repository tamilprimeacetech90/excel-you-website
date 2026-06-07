// Avatar Switch
document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const avatar = document.getElementById('avatarPreview');
        const gender = this.querySelector('input').value;
        
        if (gender === 'male') {
            avatar.src = "/assets/avatars/male-beginner.png";


        } else {
            avatar.src = "/assets/avatars/female-beginner.png"

;
        }
    });
});

// Form Submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value;
    
    alert(`🎉 Welcome ${name || 'Scholar'}!\nYour EXCEL YOU account has been created successfully!`);
    // Here you can later add fetch() to send data to backend
});

// Theme Toggle (Optional)
document.getElementById('themeBtn').addEventListener('click', function() {
    alert("🌟 Theme toggle coming soon!");
});
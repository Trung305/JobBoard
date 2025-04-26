const API_BASE_URL = '/api/';

function showScreen(screenId) {
    window.location.href = window.location.origin
}

async function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(API_BASE_URL + 'register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            showScreen('login');
        } else {
            const error = await response.json();
            alert('Lỗi: ' + JSON.stringify(error));
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(API_BASE_URL + 'token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('email', data.email);
            document.getElementById('user-username').textContent = username;
            showScreen('home');
        } else {
            const error = await response.json();
            alert('Lỗi: ' + JSON.stringify(error));
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

function handleLogout() {
    localStorage.removeItem('access_token');
    showScreen('login');
}

window.onload = () => {
    if (localStorage.getItem('access_token')) {
        showScreen('home');
    } else {
        showScreen('login');
    }
};
const API_BASE_URL = '/api/';

function showScreen(screenId) {
    window.location.href = window.location.origin
}
function showLoginEmp(){
    window.location.href = window.location.origin
}
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const isEmployer = await checkUserRole();
        if (isEmployer) {
            window.location.href = '/company_admin.html'; // Chuyển hướng Employer
        } else {
            window.location.href = '/index.html'; // Candidate về trang chủ
        }
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed');
    }
}

async function checkUserRole() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}user/`);
        if (response.ok) {
            const user = await response.json();
            const isEmployer = user.groups.includes('Employers');
            localStorage.setItem('is_employer', isEmployer);
            return isEmployer;
        }
        return false;
    } catch (error) {
        console.error('Error checking role:', error.message);
        return false;
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
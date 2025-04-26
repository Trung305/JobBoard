const API_BASE_URL = '/api/';

function showScreen(screenId) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('register-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById(screenId + '-screen').classList.remove('hidden');
}

function updateNavbar() {
    const token = localStorage.getItem('access_token');
    const authLinks = document.getElementById('auth-links');
    const userMenu = document.getElementById('user-menu');
    const usernameSpan = document.getElementById('user-username');

    if (token) {
        authLinks.classList.add('hidden');
        userMenu.classList.remove('hidden');
        usernameSpan.textContent = localStorage.getItem('username') || 'User';
    } else {
        authLinks.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
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

async function fetchUserInfo() {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('Không có access_token.');
            return;
        }
        const response = await fetch(API_BASE_URL + 'user/', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const user = await response.json();
            const name = `${user.first_name} ${user.last_name}`.trim() || user.username;
            const email = user.email || '';
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            console.log('User info:', { name, email });
            if (!email) {
                console.warn('Email không có trong phản hồi API /user/.');
            }
        } else {
            console.error('Lỗi API /user/:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Lỗi fetchUserInfo:', error.message);
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
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('username', username);
            await fetchUserInfo(); // Lấy email và name từ /api/user/
            updateNavbar();
            await fetchJobs();
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
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    updateNavbar();
    showScreen('login');
}

async function fetchJobs(searchQuery = '') {
    try {
        const url = searchQuery ? `${API_BASE_URL}jobs/?search=${encodeURIComponent(searchQuery)}` : `${API_BASE_URL}jobs/`;
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const jobs = await response.json();
            const jobList = document.getElementById('job-list');
            jobList.innerHTML = '';
            jobs.results.forEach(job => {
                const hasApplied = job.has_applied;
                const jobCard = document.createElement('div');
                jobCard.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition';
                jobCard.innerHTML = `
                       <h3 class="text-xl font-semibold text-blue-600">${job.title}</h3>
                       <p class="text-gray-600 mt-2">${job.description}...</p>
                       <p class="text-sm text-gray-500 mt-2">Công ty: ${job.company_name || 'Không xác định'}</p>
                       <p class="text-sm text-gray-500">Địa điểm: ${job.location}</p>
                       <p class="text-sm text-gray-500">Ngày đăng: ${new Date(job.created_at).toLocaleDateString()}</p>
                       <div class="mt-4 flex space-x-2">
                           <button 
                               onclick="window.location.href='/job_detail.html?id=${job.id}'" 
                               class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                           >
                               Xem Chi Tiết
                           </button>
                           <button 
                               onclick="${hasApplied ? '' : `showApplyForm(${job.id})`}" 
                               class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${hasApplied ? 'opacity-50 cursor-not-allowed' : ''}" 
                               ${hasApplied ? 'disabled' : ''}
                           >
                               ${hasApplied ? 'Đã Ứng Tuyển' : 'Ứng Tuyển'}
                           </button>
                       </div>
                   `;
                jobList.appendChild(jobCard);
            });
        } else {
            alert('Không thể tải danh sách việc làm.');
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function searchJobs() {
    const searchQuery = document.getElementById('search-input').value;
    await fetchJobs(searchQuery);
}
function showApplyForm(jobId, JobTitle) {
    const applyForm = document.createElement('div');
    applyForm.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
    applyForm.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 class="text-2xl font-bold mb-4">Ứng Tuyển Công Việc</h2>
            <form id="apply-form" enctype="multipart/form-data">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Công việc</label>
                        <input type="text" value="${JobTitle}" class="w-full p-2 border rounded bg-gray-100" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Resume (PDF) *</label>
                        <input id="apply-resume" type="file" accept=".pdf" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Thư giới thiệu (tùy chọn)</label>
                        <textarea id="apply-cover-letter" placeholder="Thư giới thiệu" class="w-full p-2 border rounded"></textarea>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Hủy</button>
                        <button type="submit" onclick="applyJob(${jobId})" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Nộp</button>
                    </div>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(applyForm);
}

async function applyJob(jobId) {
    const resume = document.getElementById('apply-resume').files[0];
    const cover_letter = document.getElementById('apply-cover-letter').value;
    const name = localStorage.getItem('username') || '';
    const email = localStorage.getItem('email') || '';

    if (!resume) {
        alert('Vui lòng chọn file resume (PDF).');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resume);
    formData.append('website', '');
    if (cover_letter) formData.append('cover_letter', cover_letter);
    formData.append('job', jobId);
    await sendApplication(formData);
}

async function sendApplication(formData) {
    try {
        const response = await fetch(API_BASE_URL + 'apply/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: formData
        });
        if (response.ok) {
            alert('Ứng tuyển thành công!');
            document.querySelector('.fixed').remove();  // Đóng popup
        } else {
            const error = await response.json();
            alert('Lỗi: ' + JSON.stringify(error));
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

window.onload = async () => {
    updateNavbar();
    if (localStorage.getItem('access_token')) {
        await fetchJobs();
        showScreen('home');
    } else {
        showScreen('login');
    }
};
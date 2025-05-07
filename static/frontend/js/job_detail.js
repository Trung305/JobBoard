const API_BASE_URL = '/api/';

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

function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    window.location.href = '/index.html';
}

async function fetchJobDetail(jobId) {
    try {
        const response = await fetch(`${API_BASE_URL}jobs/${jobId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const job = await response.json();
            const hasApplied = job.has_applied;
            const jobDetail = document.getElementById('job-detail');
            jobDetail.innerHTML = `
                <h2 class="text-2xl font-bold mb-4">${job.title}</h2>
                <p class="text-gray-600 mb-2"><strong>Công ty:</strong> ${job.company_name || 'Không xác định'}</p>
                <p class="text-gray-600 mb-2"><strong>Địa điểm:</strong> ${job.location}</p>
                <p class="text-gray-600 mb-2"><strong>Ngày đăng:</strong> ${new Date(job.created_at).toLocaleDateString()}</p>
                <p class="text-gray-600 mb-4"><strong>Mô tả:</strong> ${job.description}</p>
                <button 
                    onclick="${hasApplied ? '' : `showApplyForm(${job.id})`}" 
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${hasApplied ? 'opacity-50 cursor-not-allowed' : ''}" 
                    ${hasApplied ? 'disabled' : ''}
                >
                    ${hasApplied ? 'Đã Ứng Tuyển' : 'Ứng Tuyển'}
                </button>
            `;
        } else {
            alert('Không thể tải chi tiết công việc.');
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

function showApplyForm(jobId) {
    const name = localStorage.getItem('name') || 'Không xác định';
    const email = localStorage.getItem('email') || '';
    const applyForm = document.createElement('div');
    applyForm.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
    applyForm.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 class="text-2xl font-bold mb-4">Ứng Tuyển Công Việc</h2>
            <form id="apply-form" enctype="multipart/form-data">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Công việc</label>
                        <input type="text" value="Job ID: ${jobId}" class="w-full p-2 border rounded bg-gray-100" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input id="apply-name" type="text" value="${name}" class="w-full p-2 border rounded bg-gray-100" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email *</label>
                        <input id="apply-email" type="email" value="${email}" placeholder="Nhập email nếu không có" class="w-full p-2 border rounded" ${email ? 'readonly' : 'required'}>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Website (tùy chọn)</label>
                        <input id="apply-website" type="url" placeholder="Website" class="w-full p-2 border rounded">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Resume (PDF) *</label>
                        <input id="apply-resume" type="file" accept=".pdf" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Thư giới thiệu (tùy chọn)</label>
                        <textarea id="apply-cover-letter" placeholder="Thư giới thiệu" class="w-full p-2 border rounded"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">File thư giới thiệu (tùy chọn, PDF)</label>
                        <input id="apply-cover-letter-file" type="file" accept=".pdf" class="w-full p-2 border rounded">
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
    const name = localStorage.getItem('name') || '';
    let email = localStorage.getItem('email') || document.getElementById('apply-email').value;
    const website = document.getElementById('apply-website').value;
    const resume = document.getElementById('apply-resume').files[0];
    const cover_letter = document.getElementById('apply-cover-letter').value;
    const cover_letter_file = document.getElementById('apply-cover-letter-file').files[0];

    if (!name) {
        alert('Thông tin tên không khả dụng. Vui lòng đăng nhập lại.');
        return;
    }
    if (!email) {
        alert('Vui lòng nhập email.');
        return;
    }
    if (!resume) {
        alert('Vui lòng chọn file resume (PDF).');
        return;
    }

    const formData = new FormData();
    formData.append('job', jobId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resume);
    if (website) formData.append('website', website);
    if (cover_letter) formData.append('cover_letter', cover_letter);
    if (cover_letter_file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            formData.append('cover_letter', e.target.result);
            await sendApplication(formData);
        };
        reader.readAsText(cover_letter_file);
    } else {
        await sendApplication(formData);
    }
}

async function refreshToken() {
    try {
        const response = await fetch(API_BASE_URL + 'token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Lỗi refreshToken:', error.message);
        return false;
    }
}

async function sendApplication(formData) {
    let token = localStorage.getItem('access_token');
    if (!token) {
        alert('Vui lòng đăng nhập để ứng tuyển.');
        window.location.href = '/index.html';
        return;
    }
    try {
        let response = await fetch(API_BASE_URL + 'apply/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });
        if (response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                token = localStorage.getItem('access_token');
                response = await fetch(API_BASE_URL + 'apply/', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                });
            } else {
                alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                handleLogout();
                return;
            }
        }
        if (response.ok) {
            alert('Ứng tuyển thành công!');
            document.querySelector('.fixed').remove();
            fetchJobDetail(new URLSearchParams(window.location.search).get('id')); // Tải lại chi tiết để cập nhật has_applied
        } else {
            const error = await response.json();
            alert('Lỗi: ' + JSON.stringify(error));
            console.error('API error:', error);
        }
    } catch (error) {
        alert('Lỗi kết nối: ' + error.message);
        console.error('Fetch error:', error);
    }
}

window.onload = async () => {
    updateNavbar();
    const jobId = new URLSearchParams(window.location.search).get('id');
    if (jobId) {
        await fetchJobDetail(jobId);
    } else {
        alert('Không tìm thấy ID công việc.');
        window.location.href = '/index.html';
    }
};
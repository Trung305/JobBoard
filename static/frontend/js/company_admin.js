const API_BASE_URL = '/api/';
    document.addEventListener('DOMContentLoaded', async () => {
        await loadCompanyJobs();
    });

    async function loadCompanyJobs() {
        try {
            const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}company/admin/`, {
        headers: {
        'Authorization': `Bearer ${token}`
                }
            });
    if (!response.ok) {
                throw new Error('Failed to load jobs');
            }
    const data = await response.json();
    displayJobs(data.jobs);
        } catch (error) {
        console.error('Error loading jobs:', error.message);
    document.getElementById('error-message').textContent = 'Error loading jobs. Please try again.';
    document.getElementById('error-message').style.display = 'block';
        }
    }

    function displayJobs(jobs) {
        const container = document.getElementById('job-list');
    if (!jobs || jobs.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">No jobs available.</p>';
    return;
        }
        container.innerHTML = jobs.map(job => `
    <div class="job-card bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">${job.title}</h3>
        <p class="text-gray-600 mb-1"><span class="font-medium">Company:</span> ${job.company}</p>
        <p class="text-gray-600 mb-1"><span class="font-medium">Location:</span> ${job.location}</p>
        <p class="text-gray-600 mb-4">${job.description}</p>
        <div class="flex gap-3">
            <a href="/company/edit-job/${job.id}/" class="btn-gradient text-white px-4 py-2 rounded-lg font-medium">Edit</a>
            <a href="/company/view-job/${job.id}/" class="btn-gradient text-white px-4 py-2 rounded-lg font-medium">View</a>
            <button onclick="deleteJob(${job.id})" class="btn-delete text-white px-4 py-2 rounded-lg font-medium">Delete</button>
        </div>
    </div>
    `).join('');
    }

    async function deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job?')) {
            try {
                const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}jobs/${jobId}/`, {
        method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`
                    }
                });
    if (!response.ok) {
                    throw new Error('Failed to delete job');
                }
    alert('Job deleted successfully!');
    await loadCompanyJobs(); // Tải lại danh sách sau khi xóa
            } catch (error) {
        console.error('Error deleting job:', error.message);
    alert('Error deleting job. Please try again.');
            }
        }
    }

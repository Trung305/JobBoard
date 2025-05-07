const API_BASE_URL = '/api/';
document.getElementById('create-job-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    // Xóa thông báo lỗi cũ
    document.getElementById('title-error').style.display = 'none';
    document.getElementById('description-error').style.display = 'none';
    document.getElementById('location-error').style.display = 'none';

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    await createJob(title, description, location);
});

async function createJob(title, description, location) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}jobs/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, location })
        });
        const data = await response.json();
        if (!response.ok) {
            if (data.title) {
                document.getElementById('title-error').textContent = data.title[0];
                document.getElementById('title-error').style.display = 'block';
            }
            if (data.description) {
                document.getElementById('description-error').textContent = data.description[0];
                document.getElementById('description-error').style.display = 'block';
            }
            if (data.location) {
                document.getElementById('location-error').textContent = data.location[0];
                document.getElementById('location-error').style.display = 'block';
            }
            throw new Error('Failed to create job');
        }
        alert('Job created successfully!');
        window.location.href = '/company_admin';
    } catch (error) {
        console.error('Error creating job:', error.message);
        alert('Error creating job: ' + (error.message || 'Please check the form.'));
    }
}
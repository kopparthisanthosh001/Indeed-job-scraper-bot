// Popup script for Jobpilot Resume Assistant
document.addEventListener('DOMContentLoaded', function() {
    const jobDescriptionTextarea = document.getElementById('jobDescription');
    const getResumeBtn = document.getElementById('getResumeBtn');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const scoreValue = document.getElementById('scoreValue');
    const downloadLink = document.getElementById('downloadLink');
    const statusDiv = document.getElementById('status');

    // Load job description from storage when popup opens
    loadJobDescription();

    // Add event listener for the Get Resume button
    getResumeBtn.addEventListener('click', handleGetResume);

    // Also listen for changes in the textarea to enable/disable button
    jobDescriptionTextarea.addEventListener('input', function() {
        updateButtonState();
    });

    function loadJobDescription() {
        chrome.storage.local.get(['jobDescription', 'extractedFrom', 'extractedAt'], function(result) {
            if (result.jobDescription) {
                jobDescriptionTextarea.value = result.jobDescription;
                updateButtonState();
                
                // Update status with extraction info
                if (result.extractedFrom && result.extractedAt) {
                    const domain = new URL(result.extractedFrom).hostname;
                    const date = new Date(result.extractedAt).toLocaleString();
                    statusDiv.textContent = `Extracted from ${domain} at ${date}`;
                    statusDiv.style.color = '#27ae60';
                } else {
                    statusDiv.textContent = 'Job description loaded from storage';
                    statusDiv.style.color = '#27ae60';
                }
            } else {
                statusDiv.textContent = 'No job description found. Visit a LinkedIn or Naukri job page first.';
                statusDiv.style.color = '#e74c3c';
            }
        });
    }

    function updateButtonState() {
        const hasJobDescription = jobDescriptionTextarea.value.trim().length > 0;
        getResumeBtn.disabled = !hasJobDescription;
    }

    async function handleGetResume() {
        const jobDescription = jobDescriptionTextarea.value.trim();
        
        if (!jobDescription) {
            showError('Please enter a job description');
            return;
        }

        // Hide previous results and errors
        hideResults();
        hideError();
        showLoading();

        try {
            const response = await fetch('https://your-backend.com/api/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jd: jobDescription
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Validate response structure
            if (typeof data.score !== 'number' || !data.resume_url) {
                throw new Error('Invalid response format from server');
            }

            hideLoading();
            showResult(data.score, data.resume_url);

        } catch (error) {
            console.error('Error:', error);
            hideLoading();
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showError('Unable to connect to the server. Please check your internet connection and try again.');
            } else if (error.message.includes('404')) {
                showError('API endpoint not found. Please contact support.');
            } else if (error.message.includes('500')) {
                showError('Server error. Please try again later.');
            } else {
                showError(`Error: ${error.message}`);
            }
        }
    }

    function showLoading() {
        loadingDiv.style.display = 'block';
        getResumeBtn.disabled = true;
    }

    function hideLoading() {
        loadingDiv.style.display = 'none';
        getResumeBtn.disabled = false;
        updateButtonState();
    }

    function showResult(score, resumeUrl) {
        scoreValue.textContent = `${score}%`;
        downloadLink.href = resumeUrl;
        resultDiv.style.display = 'block';
        
        // Update score color based on value
        const scoreElement = scoreValue.parentElement;
        if (score >= 80) {
            scoreElement.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
        } else if (score >= 60) {
            scoreElement.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
        } else {
            scoreElement.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }
    }

    function hideResults() {
        resultDiv.style.display = 'none';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    function hideError() {
        errorDiv.style.display = 'none';
    }
});
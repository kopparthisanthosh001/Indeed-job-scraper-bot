// Content script to extract job descriptions from LinkedIn and Naukri
(function() {
    'use strict';

    function extractJobDescription() {
        let jobDescription = '';
        const currentURL = window.location.href;

        if (currentURL.includes('linkedin.com')) {
            // LinkedIn job description extraction
            const selectors = [
                '.jobs-description__content .jobs-box__html-content',
                '.jobs-description-content__text',
                '.jobs-box__html-content',
                '[data-job-description]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobDescription = element.innerText || element.textContent;
                    break;
                }
            }
        } else if (currentURL.includes('naukri.com')) {
            // Naukri job description extraction
            const selectors = [
                '.job-description',
                '.JDC_content',
                '.job-desc',
                '[data-qa="job-description"]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobDescription = element.innerText || element.textContent;
                    break;
                }
            }
        }

        // Clean up the job description
        jobDescription = jobDescription.trim().replace(/\s+/g, ' ');

        if (jobDescription && jobDescription.length > 50) {
            // Save to Chrome storage
            chrome.storage.local.set({
                jobDescription: jobDescription,
                extractedFrom: currentURL,
                extractedAt: new Date().toISOString()
            }, function() {
                console.log('Job description saved to storage');
            });
        }
    }

    // Extract job description when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractJobDescription);
    } else {
        extractJobDescription();
    }

    // Also extract when page content changes (for single-page applications)
    const observer = new MutationObserver(function(mutations) {
        let shouldExtract = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldExtract = true;
            }
        });
        
        if (shouldExtract) {
            setTimeout(extractJobDescription, 1000); // Delay to allow content to load
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
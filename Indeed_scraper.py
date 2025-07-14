from playwright.sync_api import sync_playwright

def scrape_indeed(job_title, location):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        url = f"https://in.indeed.com/jobs?q={job_title}&l={location}"
        page.goto(url)
        page.wait_for_timeout(5000)  # wait for page to load

        jobs = page.query_selector_all("div.job_seen_beacon")
        for job in jobs:
            title = job.query_selector("h2.jobTitle")
            company = job.query_selector("span.companyName")
            location = job.query_selector("div.companyLocation")
            print("Job Title:", title.inner_text() if title else "N/A")
            print("Company:", company.inner_text() if company else "N/A")
            print("Location:", location.inner_text() if location else "N/A")
            print("-" * 30)

        browser.close()

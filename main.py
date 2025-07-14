import gspread
from oauth2client.service_account import ServiceAccountCredentials
from playwright.sync_api import sync_playwright
from datetime import datetime


def scrape_indeed(job_title="Product Manager", location="Bangalore"):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        query = f"{job_title.replace(' ', '+')}&l={location.replace(' ', '+')}"
        url = f"https://www.indeed.com/jobs?q={query}"
        page.goto(url)
        page.wait_for_selector("td.resultContent", timeout=10000)

        jobs = page.query_selector_all("td.resultContent")
        job_list = []
        for job in jobs:
            title = job.query_selector("h2 span")
            company = job.query_selector("span.companyName")
            location = job.query_selector("div.companyLocation")
            summary = job.query_selector("div.job-snippet")

            job_list.append({
                "title": title.inner_text().strip() if title else "",
                "company": company.inner_text().strip() if company else "",
                "location": location.inner_text().strip() if location else "",
                "summary": summary.inner_text().strip() if summary else "",
                "scraped_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

        browser.close()
        return job_list


def write_to_google_sheet(jobs):
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("gcreds.json", scope)
    client = gspread.authorize(creds)

    sheet = client.open("Indeed Jobs").sheet1  # Sheet name must match
    sheet.clear()
    sheet.append_row(["Title", "Company", "Location", "Summary", "Scraped At"])

    for job in jobs:
        sheet.append_row([job["title"], job["company"], job["location"], job["summary"], job["scraped_at"]])


if __name__ == "__main__":
    scraped_jobs = scrape_indeed("Product Manager", "Bangalore")
    write_to_google_sheet(scraped_jobs)
    print("✅ Scraping done and saved to Google Sheet!")

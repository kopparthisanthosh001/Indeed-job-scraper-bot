from fastapi import FastAPI
from indeed_scraper import scrape_indeed

app = FastAPI()

@app.get("/run")
def run_scraper():
    try:
        scrape_indeed("Product Manager", "Bangalore")
        return {"status": "success", "message": "Scraping complete"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

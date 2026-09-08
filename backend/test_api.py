import requests

print("Scraper API ko request bhej rahe hain...")

# Hamare API ka link
url = "http://127.0.0.1:8000/run-scraper"

# POST request bhej rahe hain
response = requests.post(url)

# Result print kar rahe hain
print("\n--- RESULT ---")
print(response.json())
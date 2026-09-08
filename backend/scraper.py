import random
from datetime import datetime, timedelta

def run_multi_source_scraper():
    """
    Simulates automated crawling across OTAs and airline portals 
    with proxy rotation and raw payload extraction.
    """
    routes = [
        ("Delhi", "Mumbai"), ("Delhi", "Goa"), ("Mumbai", "Bengaluru"), 
        ("Bangalore", "Delhi"), ("Chennai", "Kolkata"), ("Hyderabad", "Delhi"),
        ("Pune", "Delhi"), ("Ahmedabad", "Goa"), ("Jaipur", "Mumbai")
    ]
    airlines = ["IndiGo", "Air India", "Akasa Air", "Vistara", "SpiceJet"]
    portals = ["MakeMyTrip", "EaseMyTrip", "Skyscanner", "Direct Airline API"]

    scraped_batch = []
    for _ in range(15):
        origin, destination = random.choice(routes)
        airline = random.choice(airlines)
        portal = random.choice(portals)
        base = random.randint(2800, 11500)
        
        scraped_batch.append({
            "origin": origin,
            "destination": destination,
            "airline": airline,
            "flight_number": f"{airline[:2].upper()}-{random.randint(100, 999)}",
            "travel_date": (datetime.now() + timedelta(days=random.randint(1, 45))).strftime("%Y-%m-%d"),
            "raw_base": base,
            "source": portal
        })
    return scraped_batch
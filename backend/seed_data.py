import random
from datetime import datetime, timedelta
from database import SessionLocal
from models import Base, engine, AirfareRecord, User

# Drop old tables to apply the new 200-line schema cleanly
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Seed Demo Authentication Users
    admin_user = User(
        username="mospi_officer",
        hashed_password="sih2026govt",
        role="govt",
        department="MoSPI Transport Division"
    )
    traveler_user = User(
        username="traveler",
        hashed_password="aeroclick123",
        role="consumer",
        department="Public Access Portal"
    )
    db.add(admin_user)
    db.add(traveler_user)
    db.commit()

    routes = [
        ("Delhi", "Mumbai"), ("Delhi", "Goa"), ("Mumbai", "Bengaluru"), 
        ("Bangalore", "Delhi"), ("Chennai", "Kolkata"), ("Hyderabad", "Delhi"),
        ("Pune", "Delhi"), ("Ahmedabad", "Goa"), ("Jaipur", "Mumbai")
    ]
    airlines = ["IndiGo", "Air India", "Akasa Air", "Vistara", "SpiceJet"]
    portals = ["MakeMyTrip", "EaseMyTrip", "Skyscanner", "Direct Airline API"]

    print("Recreating schema and generating clean airfare baskets...")
    for _ in range(150):
        origin, destination = random.choice(routes)
        airline = random.choice(airlines)
        portal = random.choice(portals)
        base = random.randint(3000, 11000)
        
        taxes = round(base * 0.12, 2)
        gst = round(base * 0.05, 2)
        fuel = 0.0
        baggage = 0.0
        convenience = 350.0
        total = round(base + taxes + gst + fuel + baggage + convenience, 2)
        
        is_out = True if base > 10000 and random.random() > 0.4 else False
        anomaly = True if "Goa" in destination and random.random() > 0.7 else False
        reason = "Festive surge clustering" if anomaly else None

        record = AirfareRecord(
            origin=origin,
            destination=destination,
            airline=airline,
            flight_number=f"{airline[:2].upper()}-{random.randint(100, 999)}",
            travel_date=(datetime.now() + timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
            base_fare=base,
            taxes=taxes,
            gst=gst,
            fuel_surcharge=fuel,
            baggage_fee=baggage,
            convenience_fee=convenience,
            total_fare=total,
            is_outlier=is_out,
            anomaly_flag=anomaly,
            anomaly_reason=reason,
            source_portal=portal,
            elasticity_coefficient=round(random.uniform(0.8, 2.5), 2)
        )
        db.add(record)
    
    db.commit()
    db.close()
    print("Database re-created and seeded successfully!")

if __name__ == "__main__":
    seed_database()
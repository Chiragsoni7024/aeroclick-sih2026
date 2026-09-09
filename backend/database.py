from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from database import Base
import datetime

class AirfareRecord(Base):
    __tablename__ = "airfare_records"

    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, index=True)
    destination = Column(String, index=True)
    airline = Column(String, index=True)
    flight_number = Column(String)
    base_fare = Column(Float)
    taxes = Column(Float)
    convenience_fee = Column(Float)
    total_fare = Column(Float)
    seat_availability_pct = Column(Float)
    fare_class = Column(String)
    source_portal = Column(String)
    is_outlier = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)
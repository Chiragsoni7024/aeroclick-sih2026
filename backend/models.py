from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base, engine
import datetime

class AirfareRecord(Base):
    __tablename__ = "airfare_records"

    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String(50), index=True, nullable=False)
    destination = Column(String(50), index=True, nullable=False)
    airline = Column(String(100), index=True, nullable=False)
    flight_number = Column(String(20), nullable=False)
    base_fare = Column(Float, nullable=False)
    taxes = Column(Float, nullable=False)
    convenience_fee = Column(Float, default=0.0)
    total_fare = Column(Float, nullable=False)
    seat_availability_pct = Column(Float, nullable=False)
    fare_class = Column(String(50), default="Economy")
    source_portal = Column(String(100), nullable=False)
    is_outlier = Column(Boolean, default=False)
    dynamic_pricing_flag = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    alerts = relationship("PriceAlert", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    preferred_currency = Column(String(10), default="INR")
    notification_enabled = Column(Boolean, default=True)
    theme_mode = Column(String(20), default="dark")
    extra_metadata = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="preferences")

class IndexHistory(Base):
    __tablename__ = "index_history"

    id = Column(Integer, primary_key=True, index=True)
    month_year = Column(String(20), unique=True, index=True, nullable=False)
    airfare_price_index = Column(Float, nullable=False)
    baseline_cpi = Column(Float, nullable=False)
    augmented_cpi = Column(Float, nullable=False)
    transport_weight_allocation = Column(Float, default=8.5)
    national_inflation_delta = Column(Float, nullable=False)
    market_sentiment_score = Column(Float, default=0.5)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    route = Column(String(100), index=True, nullable=False)
    predicted_fare = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    model_version = Column(String(50), default="v1.0-sih")
    recommendation = Column(Text, nullable=True)
    features_used = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    origin = Column(String(50), index=True, nullable=False)
    destination = Column(String(50), index=True, nullable=False)
    target_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    triggered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="alerts")

class ScraperLog(Base):
    __tablename__ = "scraper_logs"

    id = Column(Integer, primary_key=True, index=True)
    portal_name = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False) # SUCCESS, FAILED, PARTIAL
    records_scraped = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)

class FlightRouteCache(Base):
    __tablename__ = "flight_route_cache"

    id = Column(Integer, primary_key=True, index=True)
    origin_code = Column(String(10), index=True, nullable=False)
    destination_code = Column(String(10), index=True, nullable=False)
    average_duration_mins = Column(Integer, nullable=True)
    distance_km = Column(Float, nullable=True)
    popularity_index = Column(Float, default=1.0)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

def init_db():
    """
    Initializes all database tables and schema indices safely using SQLite.
    """
    Base.metadata.create_all(bind=engine)
    print("All enterprise features, analytics modules, and tables initialized successfully with SQLite.")

if __name__ == "__main__":
    init_db()
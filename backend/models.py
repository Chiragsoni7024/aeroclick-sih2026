from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# ==========================================
# 1. DATABASE CONNECTION & SESSION SETUP
# ==========================================
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Aeroclick%40chirag@db.mfzrabuclsrcmljpcila.supabase.co:5432/postgres"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True, 
    pool_size=15, 
    max_overflow=30
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================================
# 2. USER AUTHENTICATION & ROLE TABLE
# ==========================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)  # 'govt' (MoSPI Officer) or 'consumer' (Traveler)
    department = Column(String(100), default="Ministry of Statistics and Programme Implementation")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)


# ==========================================
# 3. CORE AIRFARE & UNBUNDLED PRICING TABLE
# ==========================================
class AirfareRecord(Base):
    __tablename__ = "airfare_records"

    id = Column(Integer, primary_key=True, index=True)
    
    # Route & Flight Identification
    origin = Column(String(50), index=True, nullable=False)
    destination = Column(String(50), index=True, nullable=False)
    airline = Column(String(100), index=True, nullable=False)
    flight_number = Column(String(20), nullable=False)
    travel_date = Column(String(20), index=True, nullable=False)
    
    # Unbundled Financial Breakdown (MoSPI & DGCA Compliant)
    base_fare = Column(Float, nullable=False)
    taxes = Column(Float, nullable=False)
    gst = Column(Float, nullable=False)
    fuel_surcharge = Column(Float, default=0.0)
    baggage_fee = Column(Float, default=0.0)
    convenience_fee = Column(Float, nullable=False)
    total_fare = Column(Float, nullable=False)
    
    # Data Pipeline & Cleaning Metadata
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    is_outlier = Column(Boolean, default=False)
    anomaly_flag = Column(Boolean, default=False)
    anomaly_reason = Column(Text, nullable=True)
    source_portal = Column(String(50), nullable=False)  # e.g., 'MakeMyTrip', 'Skyscanner', 'Direct API'
    elasticity_coefficient = Column(Float, default=1.0)


# ==========================================
# 4. SCRAPER TELEMETRY & AUDIT LOG TABLE
# ==========================================
class ScraperTelemetryLog(Base):
    __tablename__ = "scraper_telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    scraper_module = Column(String(100), nullable=False)
    total_records_crawled = Column(Integer, default=0)
    records_after_cleaning = Column(Integer, default=0)
    outliers_removed = Column(Integer, default=0)
    execution_status = Column(String(30), nullable=False)  # 'SUCCESS', 'WARNING', 'FAILED'
    execution_duration_sec = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


# ==========================================
# 5. HISTORICAL CPI & INDEX ANALYTICS TABLE
# ==========================================
class IndexHistory(Base):
    __tablename__ = "index_history"

    id = Column(Integer, primary_key=True, index=True)
    month_year = Column(String(20), unique=True, index=True, nullable=False)  # e.g., 'Jan-2026'
    airfare_price_index = Column(Float, nullable=False)
    baseline_cpi = Column(Float, nullable=False)
    augmented_cpi = Column(Float, nullable=False)
    transport_weight_allocation = Column(Float, default=8.5)
    national_inflation_delta = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)


# ==========================================
# INITIALIZE TABLES SCRIPT
# ==========================================
def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully on Supabase PostgreSQL.")

if __name__ == "__main__":
    init_db()
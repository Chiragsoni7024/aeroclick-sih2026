from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

# Configure logging for database operations
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQLite Database URL for production & local stability
SQLALCHEMY_DATABASE_URL = "sqlite:///./AEROCLICK_DB.db"

# Create engine with thread safety and connection health checks enabled
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Provides a database session for API endpoints, 
    ensuring connections are safely opened and closed.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        raise
    finally:
        db.close()

logger.info("Successfully initialized SQLite Database connection configuration.")
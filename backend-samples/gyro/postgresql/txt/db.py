##TODO: type을 정하는 방법
from sqlalchemy import (
    Column, Integer, String, Table, create_engine, MetaData
)

from dotenv import load_dotenv
from databases import Database
from datetime import datetime as dt
from pytz import timezone as tz

load_dotenv()
DATABASE_URL = os.getenv(
    "DATABASE_URL", env.DATABASE_URL
)

#sqlalchemy
engine = create_engine(DATABASE_URL)
metadata = MetaData()
schema_name = Table(
    "schema_name",
    metadata,
    # table 내용
    table content
)

database = Database(DATABASE_URL)
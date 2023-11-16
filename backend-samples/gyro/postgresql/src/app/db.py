##TODO: type을 정하는 방법
import os
from sqlalchemy import (
    Column, Float, Integer, String, Table, create_engine, MetaData, DateTime
)

from dotenv import load_dotenv
from databases import Database
from datetime import datetime as dt
from pytz import timezone as tz

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

#sqlalchemy
metadata = MetaData()
telemetry = Table(
    "telemetry",
    metadata,
    Column("id", Integer, primary_key=True),
    # table 내용
    Column("RTU_ID", String),
	Column("angle_x", Integer),
	Column("angle_y", Integer),
	Column("random", Integer),
	Column("counter", Integer),
	
    Column("created_at", DateTime(timezone=True),
           default=dt.now(tz("Asia/Seoul")))
)

mqtt_relay = Table(
    "mqtt_relay",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("uuid", String),
    Column("client_id", String, nullable=True),
    Column("cmd", String, nullable=True),
    Column("response", String, nullable=True, default=None),
    Column("created_at", DateTime(timezone=True),
           default=dt.now(tz("Asia/Seoul")), nullable=True),
    Column("updated_at", DateTime(timezone=True), nullable=True, default=None)
)

database = Database(DATABASE_URL)
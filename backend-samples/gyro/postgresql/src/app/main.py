import os
from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api import routers
from app.mqtt_api import mqtt_routers
from app.db import metadata, database

from sqlalchemy import create_engine
import time
load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["DELETE", "GET", "POST", "PUT"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    engine = None
    while engine is None:
        try:
            time.sleep(1)
            print("connect start")
            await database.connect()
            engine = create_engine(DATABASE_URL)
            metadata.create_all(engine)
        except Exception as e:
            print(e)
            time.sleep(1)
            continue

    # time.sleep(20)
    # await database.connect()
    # engine = create_engine(DATABASE_URL)
    # metadata.create_all(engine)


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def root():
    return {"message": "make app"}

# router_name
app.include_router(routers.router, prefix="/telemetry", tags=["telemetry"])
app.include_router(mqtt_routers.router, prefix="/mqtt", tags=["mqtt"])
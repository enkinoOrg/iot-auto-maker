# TODO: query 수정

from datetime import datetime
import pytz as tz
from app.api.models import telemetry_model
from app.db import telemetry, database

async def post(payload: telemetry_model):
    query = telemetry.insert().values(
        RTU_ID=payload.RTU_ID,
		angle_x=payload.angle_x,
		angle_y=payload.angle_y,
		random=payload.random,
		counter=payload.counter,
		
        created_at=datetime.now(tz.timezone("Asia/Seoul"))
    )
    return await database.execute(query=query)

async def get(id: int):
    query = telemetry.select().where(id == telemetry.c.id)
    return await database.fetch_one(query=query)

async def get_all():
    query = telemetry.select()
    return await database.fetch_all(query=query)

async def put (id:int, payload=telemetry_model):
    query = (
        telemetry.update().where(id == telemetry.c.id).values(
            RTU_ID=payload.RTU_ID,
			angle_x=payload.angle_x,
			angle_y=payload.angle_y,
			random=payload.random,
			counter=payload.counter,
			
        ).returning(telemetry.c.id)
    )
    return await database.execute(query=query)
    

async def delete(id:int):
    query = telemetry.delete().where(id == telemetry.c.id)
    return await database.execute(query=query)

async def get_num(num: int):
    query = telemetry.select().order_by(telemetry.c.created_at.desc()).limit(num)
    return await database.fetch_all(query=query)
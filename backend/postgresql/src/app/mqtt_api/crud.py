from datetime import datetime
import pytz as tz
from app.mqtt_api.models import mqtt_model
from app.db import mqtt_table, database


async def post(payload: mqtt_model):
    query = mqtt_table.insert().values(
        uuid=payload.uuid,
        client_id=payload.client_id,
        cmd=payload.cmd,
        response=payload.response,
        created_at=datetime.now(tz=tz.timezone('Asia/Seoul'))
    )
    return await database.execute(query=query)


async def get(uuid: str):
    query = mqtt_table.select().where(mqtt_table.c.uuid == uuid)
    return await database.fetch_one(query=query)


async def get_all():
    query = mqtt_table.select()
    return await database.fetch_all(query=query)


async def put(uuid: str, payload: mqtt_model):
    query = (
        mqtt_table.update().where(uuid == mqtt_table.c.uuid).values(
            client_id=payload.client_id,
            cmd=payload.cmd,
            response=payload.response,
            created_at=datetime.now(tz=tz.timezone('Asia/Seoul'))
        ).returning(mqtt_table.c.uuid)
    )
    return await database.execute(query=query)


async def delete(uuid: str):
    query = mqtt_table.delete().where(uuid == mqtt_table.c.uuid)
    return await database.execute(query=query)

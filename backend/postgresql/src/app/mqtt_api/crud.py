from datetime import datetime
import pytz as tz
from app.mqtt_api.models import mqtt_model, mqtt_db, response_model
from app.db import mqtt_table, database


async def post(payload: mqtt_model):
    print(payload)
    query = mqtt_table.insert().values(
        uuid=payload.uuid,
        client_id=payload.client_id,
        cmd=payload.cmd,
        created_at=datetime.now(tz.timezone("Asia/Seoul"))

    )
    return await database.execute(query=query)


async def get(uuid: str):
    query = mqtt_table.select().where(mqtt_table.c.uuid == uuid)
    return await database.fetch_one(query=query)


async def get_by_id(id: int):
    query = mqtt_table.select().where(id == mqtt_table.c.id)
    return await database.fetch_one(query=query)


async def get_all():
    query = mqtt_table.select()
    return await database.fetch_all(query=query)

async def put(uuid: str, payload: response_model):
    query = (
        mqtt_table.update().where(uuid == mqtt_table.c.uuid).values(
            response=payload.response,
            updated_at=datetime.now(tz.timezone("Asia/Seoul"))
        ).returning(mqtt_table.c.uuid)
    )
    return await database.execute(query=query)


async def put_by_id(id: int, payload: mqtt_model):
    query = (
        mqtt_table.update().where(id == mqtt_table.c.id).values(
            uuid=payload.uuid,
            client_id=payload.client_id,
            cmd=payload.cmd,
        ).returning(mqtt_table.c.uuid)
    )
    return await database.execute(query=query)


async def delete(id: int):
    query = mqtt_table.delete().where(id == mqtt_table.c.id)
    return await database.execute(query=query)

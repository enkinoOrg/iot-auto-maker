from datetime import datetime
import pytz as tz
from app.mqtt_api.models import mqtt_model, mqtt_db, response_model
from app.db import mqtt_relay, database


async def post(payload: mqtt_model):
    print(payload)
    query = mqtt_relay.insert().values(
        uuid=payload.uuid,
        client_id=payload.client_id,
        cmd=payload.cmd,
        created_at=datetime.now(tz.timezone("Asia/Seoul"))

    )
    return await database.execute(query=query)


async def get(uuid: str):
    query = mqtt_relay.select().where(mqtt_relay.c.uuid == uuid)
    return await database.fetch_one(query=query)


async def get_by_id(id: int):
    query = mqtt_relay.select().where(id == mqtt_relay.c.id)
    return await database.fetch_one(query=query)


async def get_all():
    query = mqtt_relay.select()
    return await database.fetch_all(query=query)

async def put(uuid: str, payload: response_model):
    query = (
        mqtt_relay.update().where(uuid == mqtt_relay.c.uuid).values(
            response=payload.response,
            updated_at=datetime.now(tz.timezone("Asia/Seoul"))
        ).returning(mqtt_relay.c.uuid)
    )
    return await database.execute(query=query)


async def put_by_id(id: int, payload: mqtt_model):
    query = (
        mqtt_relay.update().where(id == mqtt_relay.c.id).values(
            uuid=payload.uuid,
            client_id=payload.client_id,
            cmd=payload.cmd,
        ).returning(mqtt_relay.c.uuid)
    )
    return await database.execute(query=query)


async def delete(id: int):
    query = mqtt_relay.delete().where(id == mqtt_relay.c.id)
    return await database.execute(query=query)


async def get_num(num: int):
    query = mqtt_relay.select().order_by(mqtt_relay.c.created_at.desc()).limit(num)
    return await database.fetch_all(query=query)
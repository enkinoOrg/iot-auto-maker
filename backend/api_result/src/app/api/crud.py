from app.api.models import schema_name
from app.db import table_name, database

async def get (id: int):
    query = table_name.select().where(id == table_name.c.id)
    return await database.fetch_one(query=query)

async def get_all():
    query = table_name.select()
    return await database.fetch_all(query=query)

async def delete(id: int):
    query = schema_name.delete().where(id == table_name.c.id)
    return await database.execute(query=query)
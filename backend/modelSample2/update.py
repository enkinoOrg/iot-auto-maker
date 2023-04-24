async def update(id: int, payload: schema_name):
    query = (table_name.update().where(id == schema_name.c.id).values(
        # table 내용
        RTU_ID=schema_name.RTU_ID,
 		RPM=schema_name.RPM,
 		
        ).returning(schema_name.c.id)
    )
    return await database.execute(query=query)
    
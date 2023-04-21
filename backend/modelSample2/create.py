async def create(payload: schema_name):
    query = table_name.insert().values(
        # table 내용
        # RTU_ID=schema_name.RTU_ID
        # RPM=schema_name.RPM
        RTU_ID=schema_name.RTU_ID
RPM=schema_name.RPM

    )
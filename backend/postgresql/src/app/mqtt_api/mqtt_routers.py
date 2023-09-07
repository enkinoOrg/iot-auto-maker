from datetime import datetime
import pytz as tz
from app.mqtt_api import crud
from app.mqtt_api.models import mqtt_model, mqtt_db, response_model
from fastapi import APIRouter, HTTPException
from typing import List
router = APIRouter()


@router.post("/", response_model=mqtt_model, status_code=201)
async def create_schema(payload: mqtt_model):
    await crud.post(payload)
    response_object = {
        "uuid": payload.uuid,
        "client_id": payload.client_id,
        "cmd": payload.cmd,
        "response": "",
    }
    return response_object


# 수정 response 추가 아님


@router.put("/{id}/", response_model=mqtt_model)
async def update_schema_by_id(payload: mqtt_model, id: int):
    schema = await crud.get_by_id(id)
    if not schema:
        raise HTTPException(status_code=404, detail="not found")
    await crud.put_by_id(id, payload)
    response_object = {
        "uuid": payload.uuid,
        "client_id": payload.client_id,
        "cmd": payload.cmd,
        "response": "",
    }
    return response_object

# response 수정하는 함수
@router.put("/{uuid}/response")
async def update_schema(payload: response_model, uuid: str):
    schema = await crud.get(uuid)
    if not schema:
        raise HTTPException(status_code=404, detail="not found")
    schema2 = await crud.put(uuid, payload)
    return {"message": "success"}


@ router.get("/{uuid}/uuid", response_model=mqtt_db)
async def read_schema(uuid: str):
    schema = await crud.get(uuid)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    return schema


@ router.get("/{id}", response_model=mqtt_db)
async def read_schema_by_id(id: int):
    schema = await crud.get_by_id(id)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    return schema


@ router.get("/", response_model=List[mqtt_db])
async def real_all_schema():
    return await crud.get_all()


@ router.delete("/{id}", response_model=mqtt_db)
async def delete_schema_by_id(id: int):
    schema = await crud.get_by_id(id)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    await crud.delete(id)
    return schema

from app.mqtt_api import crud
from app.mqtt_api.models import mqtt_model
from fastapi import APIRouter, HTTPException
from typing import List
router = APIRouter()


@router.post("/", response_model=mqtt_model, status_code=201)
async def create_schema(payload: mqtt_model):
    response_object = {
        "uuid": payload.uuid,
        "client_id": payload.client_id,
        "cmd": payload.cmd,
        "response": payload.response,
    }
    return response_object


@router.put("/{uuid}/", response_model=mqtt_model)
async def update_schema(payload: mqtt_model, uuid: str):
    schema = await crud.get(uuid)
    if not schema:
        raise HTTPException(status_code=404, detail="not found")
    schema_id = await crud.put(uuid, payload)
    response_object = {
        "uuid": schema_id,
        "client_id": payload.client_id,
        "cmd": payload.cmd,
        "response": payload.response,
    }
    return response_object


@router.get("/{uuid}/", response_model=mqtt_model)
async def read_schema(uuid: str):
    schema = await crud.get(uuid)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    return schema


@router.get("/", response_model=List[mqtt_model])
async def real_all_schema():
    return await crud.get_all()


@router.delete("/{uuid}/", response_model=mqtt_model)
async def delete_schema(uuid: str):
    schema = await crud.get(uuid)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    await crud.delete(uuid)
    return schema

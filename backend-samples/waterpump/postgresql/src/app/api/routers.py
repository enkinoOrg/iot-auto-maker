from app.api import crud
from app.api.models import telemetry_model, telemetry_db
from fastapi import APIRouter, HTTPException, Path
from typing import List
router = APIRouter()

@router.post("/", response_model=telemetry_db, status_code=201)
async def create_schema(payload: telemetry_model):
    schema_id = await crud.post(payload)

    response_object = {
        # TODO: contents 내용 추가
        "id": schema_id,
        "RTU_ID": payload.RTU_ID,
		"temperature": payload.temperature,
		"humidity": payload.humidity,
		"moisture": payload.moisture,
		"water_pump": payload.water_pump,
		
    }
    return response_object

@router.put("/{id}/", response_model=telemetry_db)
async def update_schema(payload: telemetry_model, id: int = Path(..., gt=0)):
    schema = await crud.get(id)
    if not schema:
        raise HTTPException(status_code=404, detail="not found")
    schema_id = await crud.put(id, payload)
    response_object = {
        # TODO: contents 내용 추가
        "id": schema_id,
        "RTU_ID": payload.RTU_ID,
		"temperature": payload.temperature,
		"humidity": payload.humidity,
		"moisture": payload.moisture,
		"water_pump": payload.water_pump,
		
    }
    return response_object

@router.get("/{id}/", response_model=telemetry_db)
async def read_schema(id: int):
    schema = await crud.get(id)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    return schema   

@router.get("/", response_model=List[telemetry_db])
async def real_all_schema():
    return await crud.get_all()

@router.delete("/{id}/", response_model=telemetry_db)
async def delete_schema(id: int = Path(..., gt=0)):
    schema = await crud.get(id)
    if not schema:
        raise HTTPException(status_code=404, detail="Not found")
    await crud.delete(id)
    return schema

@router.get("/get_num/{num}/", response_model=List[telemetry_db])
async def read_schema(num: int):
    return await crud.get_num(num)

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class mqtt_model(BaseModel):
    uuid: str
    client_id: str
    cmd: str
    response: Optional[str] = None


class mqtt_db(mqtt_model):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class response_model(BaseModel):
    response: str

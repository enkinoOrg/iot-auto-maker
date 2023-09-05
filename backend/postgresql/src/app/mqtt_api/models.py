from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class mqtt_model(BaseModel):
    uuid: str
    client_id: str
    cmd: str
    created_at: Optional[datetime] = None
    response: str
    updated_at: Optional[datetime] = None
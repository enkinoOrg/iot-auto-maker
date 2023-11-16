from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class telemetry_model(BaseModel):
	RTU_ID: str
	angle_x: int
	angle_y: int
	random: int
	counter: int


class telemetry_db(telemetry_model):
    id: int
    created_at: Optional[datetime] = None
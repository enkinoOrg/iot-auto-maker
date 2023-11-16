from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class telemetry_model(BaseModel):
	RTU_ID: str
	temperature: int
	humidity: int
	moisture: int
	water_pump: int


class telemetry_db(telemetry_model):
    id: int
    created_at: Optional[datetime] = None
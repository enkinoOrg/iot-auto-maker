from pydantic import BaseModel

class ProjectModel(BaseModel):
	RTU_ID: str
	RPM: float

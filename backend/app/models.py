# define models here
# import basemodel
from pydantic import BaseModel

class ProjectModel(BaseModel):
    projectName: str
    dbType: str
    version: float
    explain: str
    tableName: list

class ProjectModel2(BaseModel):
    project_name: str
    category: str
    description: str
    project_field: list
    # dbType: str

class GetProjectIdModel(BaseModel):
    project_id: int

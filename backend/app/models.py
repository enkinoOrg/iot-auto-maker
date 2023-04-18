# define models here
# import basemodel
from pydantic import BaseModel

class ProjectModel(BaseModel):
    projectName: str
    dbType: str
    version: float
    explain: str
    tableName: list
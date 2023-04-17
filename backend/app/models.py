# define models here
# import basemodel
from pydantic import BaseModel

class ProjectModel(BaseModel):
    projectName: str
    dbType: str
    tableName: list
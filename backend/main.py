from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from makeFileFunc.funciton import copy_file_content
from makeFileFunc.funciton import append_text_to_file
from makeFileFunc.funciton import replace_word_in_file
from app.models import ProjectModel

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/template")
async def root(projectModel: ProjectModel):
    project_name = projectModel.projectName
    project_type = projectModel.dbType
    project_explain = projectModel.explain
    table_list = projectModel.tableName

    # models.py
    print("=== make model start ===")
    copy_file_content('modelSample/model.txt', 'api_result/src/app/api/models.py')
    for table in table_list:
        print(f'{table["name"]}: {table["type"]}')
        append_text_to_file('api_result/src/app/api/models.py', f'\t{table["name"]}: {table["type"]}\n')
    print("=== copy end ===")


    # crud.py make
    # create부터
    print("=== make crud start ===")
    copy_file_content('modelSample/crud.txt', 'api_result/src/app/api/crud.py')
    content = create_content_make(table_list)

    # create.py 생성
    copy_file_content('modelSample2/create.txt', 'modelSample2/create.py')

    print (content)

    # content 내용추가
    print("=== content 내용추가 ===")
    replace_word_in_file('modelSample2/create.py', 'query_content', content)
    return projectModel

def create_content_make(table_list):
    content = ''
    for table in table_list:
        print(f'{table["name"]}: {table["type"]}')
        content += f'{table["name"]}=schema_name.{table["name"]}\n \t\t'
    return content

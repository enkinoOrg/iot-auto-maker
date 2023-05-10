
# fastapi
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from app.models import ProjectModel
from makeFileFunc.funciton import copy_file_content
from makeFileFunc.funciton import append_text_to_file

## test용
import re
from pydantic import BaseModel

import shutil

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
    copy_file_content('modelSample/test2.txt', 'api_result/src/app/api/test2.py')
    return projectModel

@app.post("/template2")
async def root(projectModel: ProjectModel):
    print(projectModel)
    table_list = projectModel.tableName
    make_model(table_list)
    # db에 테이블을 만드는 작업
    # template body
    # 사용자 정보랑, version
    return projectModel

# python 파일 작성 함수
def make_model(table_list):

    # models.py생성
    print("=== make model start ===")
    copy_file_content('modelSample/model.txt', 'api_result/src/app/api/models.py')
    print("=== copy end ===")

    for table in table_list:
        print(f'{table["name"]}: {table["type"]}')
        append_text_to_file('api_result/src/app/api/models.py', f'\t{table["name"]}: {table["type"]}\n')

    # crud.py 
    print("=== make crud start ===")
    copy_file_content('modelSample/crud.txt', 'api_result/src/app/api/crud.py')

# postgresql 폴더로 묶어서 복사
# 1. 기본 폴더 설정
@app.post("/template3")
def copy_postgresql_folder():
    copy_folder('postgresql', 'api_result/postgresql')

# 폴더를 복사하는 함수
def copy_folder(src_folder, dst_folder):
    shutil.copytree(src_folder, dst_folder)

# 2. main.py를 복사
def copy_main_file(table_list):
    copy_file_content('main.py', 'api_result/main.py')

# 3. db.py를 복사
def copy_db_file(table_list):
    copy_file_content('db.py', 'api_result/db.py')

# 4. crud.py를 생성
def make_crud_file(table_list):
    copy_file_content('crud.txt', 'api_result/crud.py')
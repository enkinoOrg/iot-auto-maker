# from fastapi import FastAPI, Body
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from makeFileFunc.funciton import copy_file_content
# from makeFileFunc.funciton import append_text_to_file
# from makeFileFunc.funciton import replace_word_in_file
# from makeFileFunc.funciton import add_text_to_file
# from makeDBFunc.function import model_type_postgre
# from app.models import ProjectModel

# app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# @app.post("/template")
# async def root(projectModel: ProjectModel):
#     project_name = projectModel.projectName
#     project_type = projectModel.dbType
#     project_explain = projectModel.explain
#     table_list = projectModel.tableName

#     # models.py
#     print("=== make model start ===")
#     copy_file_content('modelSample/model.txt', 'api_result/src/app/api/models.py')
#     for table in table_list:
#         print(f'{table["name"]}: {table["type"]}')
#         append_text_to_file('api_result/src/app/api/models.py', f'\t{table["name"]}: {table["type"]}\n')
#     print("=== copy end ===")

#     # crud.py make
#     # create부터
#     print("=== make crud start ===")
#     copy_file_content('modelSample/crud.txt', 'api_result/src/app/api/crud.py')
#     content = create_content_make(table_list)
 
#     # create.py 생성
#     copy_file_content('modelSample2/create.txt', 'modelSample2/create.py')

#     print (content)

#     # content 내용추가
#     print("=== content 내용추가 ===")
#     replace_word_in_file('modelSample2/create.py', 'query_content', content)
#     return projectModel

# def create_content_make(table_list):
#     content = ''
#     for table in table_list:
#         print(f'{table["name"]}: {table["type"]}')
#         content += f'{table["name"]}=schema_name.{table["name"]},\n \t\t'
#     return content

# def create_content_db_postgre(table_list):
#     content = ''
#     for table in table_list:
#         print(f'Column({table["name"]}, {table["type"]})')
#         content = model_type_postgre(table)
#         replace_word_in_file()
#     return content

# def make_models(table_list):
#     # models.py생성
#     print("=== make model start ===")
#     copy_file_content('modelSample/model.txt', 'api_result/src/app/api/models.py')
#     print("=== copy end ===")
#     for table in table_list:
#         print(f'{table["name"]}: {table["type"]}')
#         append_text_to_file('api_result/src/app/api/models.py', f'\t{table["name"]}: {table["type"]}\n')
#     add_text_to_file('modelSample/model2.txt', 'api_result/src/app/api/models.py')
#     print("=== model make end  ===")

# def crud_make(table_list):
#     print("=== make crud start ===")
#     copy_file_content('modelSample/crud.txt', 'api_result/src/app/api/crud.py')

#     # create.py 생성
#     copy_file_content('modelSample2/create.txt', 'modelSample2/create.py')
#     content = create_content_make(table_list)
#     replace_word_in_file('modelSample2/create.py', 'query_content', content)
#     add_text_to_file('modelSample2/create.py', 'api_result/src/app/api/crud.py')

#     # update.py 생성
#     copy_file_content('modelSample2/update.txt', 'modelSample2/update.py')
#     content = create_content_make(table_list)
#     replace_word_in_file('modelSample2/update.py', 'query_content', content)
#     add_text_to_file('modelSample2/update.py', 'api_result/src/app/api/crud.py')

# @app.post("/dbmake")
# # db.py 생성
# async def root(table_list):
#     copy_file_content('modelSample/db.txt', 'api_result/src/app/api/db.py')
#     # db.py content 수정
#     content = create_content_db_postgre(table_list)

# @app.post("/make_main")
# async def root(table_list):
#     copy_file_content('modelSample/main.txt', 'api_result/src/main.py')

# # postgresql일 경우 main.py 생성


# # async def root(projectModel: ProjectModel):                
# #     project_name = projectModel.projectName
# #     project_type = projectModel.dbType
# #     project_explain = projectModel.explain
# #     table_list = projectModel.tableName

# #     # models.py 생성
# #     make_models(table_list)

# #     # crud.py 생성
# #     crud_make(table_list)

# #     # db.py 생성  


# fastapi
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from app.models import ProjectModel
from makeFileFunc.funciton import replace_word_in_file
from makeFileFunc.funciton import copy_file_content
from makeFileFunc.funciton import append_text_to_file
from makeDBFunc.function import model_type_postgre

## test용
import re
import os
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

# template3에서 폴서 생성 및 복사 테스트
@app.post("/template3")
async def copy_postgresql_folder(projectModel: ProjectModel):
    print(projectModel)
    table_list = projectModel.tableName
    
    #TODO 기존에 폴더 존재할때 예외처리
    copy_folder('postgresql', 'api_result/postgresql')
    copy_main_file(projectModel.projectName)
    copy_db_file(table_list)
    copy_crud_file(table_list)
    copy_models_file(table_list)
    copy_routers_file(table_list)

# 1. 기본 폴더 설정 structure
# 폴더를 복사하는 함수
# 기존에 폴더가 존재하면 예외처리
# 함수들 파일 분리 예정

def copy_folder(src_folder, dst_folder):
    if (os.path.isdir(dst_folder)):
        print("exist")
        shutil.rmtree(dst_folder)
    shutil.copytree(src_folder, dst_folder)

# 2. main.py를 복사
def copy_main_file(router_name):
    copy_file_content('postgresql/txt/main.txt', 'api_result/postgresql/src/app/main.py')
    replace_word_in_file('api_result/postgresql/src/app/main.py', '{router_name}', router_name)
    # main.txt.삭제
    os.remove('api_result/postgresql/src/app/main.txt')
    os.remove('api_result/postgresql/txt/main.txt')

# --------------------- main.py까지 완료 ---------------------

# 3. db.py를 복사
def copy_db_file(table_list):
    copy_file_content('api_result/postgresql/txt/db.txt', 'api_result/postgresql/src/app/db.py')
    content = create_content_db_postgre(table_list)
    print(content)
    replace_word_in_file('api_result/postgresql/src/app/db.py', 'table_content', content)
    # db.txt.삭제
    os.remove('api_result/postgresql/src/app/db.txt')
    os.remove('api_result/postgresql/txt/db.txt')

# --------------------- db.py까지 완료 ---------------------

# 4. crud.py를 생성
# 5. crud (create, read, update, delete) 함수를 생성
def copy_crud_file(table_list):
    copy_file_content('api_result/postgresql/txt/crud.txt', 'api_result/postgresql/src/app/api/crud.py')

def copy_models_file(table_list):
    copy_file_content('api_result/postgresql/txt/models.txt', 'api_result/postgresql/src/app/api/models.py')

def copy_routers_file(table_list):
    copy_file_content('api_result/postgresql/txt/routers.txt', 'api_result/postgresql/src/app/api/routers.py')
# 6. create 함수를 생성

# 7. update 함수를 생성

# 함수 추후 파일로 분리 예정
def create_content_db_postgre(table_list):
    print("table list :", table_list)
    content = ''
    for table in table_list:
        print(f'Column({table["name"]}, {table["type"]})')
        content += model_type_postgre(table) + '\n' + '\t'
    return content

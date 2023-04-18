# fastapi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    print(projectModel)
    # db에 테이블을 만드는 작업
    # template body
    # 사용자 정보랑, version
    return projectModel

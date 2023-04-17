# fastapi
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/template")
async def root(template: Template):
    # db에 테이블을 만드는 작업
    # template body
    # 사용자 정보랑, version
    return template

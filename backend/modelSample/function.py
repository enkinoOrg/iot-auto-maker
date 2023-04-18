@app.get("/{variable}")
def read_root(variable: str):
    return {"Hello": variable}
import re
from fastapi import FastAPI, Body
from pydantic import BaseModel

app = FastAPI()

# Sample meta field text data
text_data = """
GET /items/{item_id}
POST /items/ with JSON body containing {"name": "string", "description": "string", "price": "number", "category": "string"}
"""

# Define a function to parse meta field text data
def parse_text_data(text_data: str):
    pattern = re.compile(r"(GET|POST|PUT|DELETE) (/[\w/{}]+)(?: with (.*))?")
    return pattern.findall(text_data)

# Define a function to generate FastAPI routes from parsed data
def generate_routes(parsed_data):
    for method, path, extra in parsed_data:
        # Define the route function
        def route_function(**kwargs):
            return {"method": method, "path": path, "params": kwargs}

        # Replace placeholders in the path
        path = re.sub(r"{(\w+)}", r"{\1:path}", path)

        # Add the route to the FastAPI app
        app.add_api_route(path, route_function, methods=[method])

# Parse the text data and generate routes
parsed_data = parse_text_data(text_data)
generate_routes(parsed_data)

# Define data models, if needed
class Item(BaseModel):
    name: str
    description: str
    price: float
    category: str

# Update the POST route to use the data model
@app.post("/items/")
async def create_item(item: Item = Body(..., example={"name": "Sample Item", "description": "A sample item", "price": 12.99, "category": "Sample Category"})):
    return {"item": item.dict()}
import re
from fastapi import FastAPI, Body

app = FastAPI()

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


text_data = """
GET /items/{item_id}
POST /items/ with JSON body containing {"name": "string", "description": "string", "price": "number", "category": "string"}
"""

if __name__ == "__main__":
    parsed_data = parse_text_data(text_data)
    print(parsed_data)
    print(generate_routes(parsed_data))
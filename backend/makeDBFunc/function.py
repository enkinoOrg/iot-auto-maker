# json에 들어오는 data type
# str
# int
# bool
# date
# datetime
# float

# ? double

# postgre 
def model_type_postgre(table):
    if table["type"] == 'str':
        return f'{table["name"]} = Column(String)'
    elif table["type"] == 'int':
        return f'{table["name"]} = Column(Integer)'
    elif table["type"] == 'bool':
        return f'{table["name"]} = Column(Boolean)'
    elif table["type"] == 'date':
        return f'{table["name"]} = Column(Date)'
    elif table["type"] == 'datetime':
        return f'{table["name"]} = Column(DateTime)'
    elif table["type"] == 'float':
        return f'{table["name"]} = Column(Float)'
    else:
        return "type error"

# sqlalchemy
# String
# Integer
# Boolean
# Date
# DateTime
# Float
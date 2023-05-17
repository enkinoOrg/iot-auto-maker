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

def model_sqlalchemy_postgre(table):
    return f'{table["name"]}: {table["type"]}'

def db_sqlalchemy_postgre(table):
    if table["type"] == 'str':
        return f'Column("{table["name"]}", String)'
    elif table["type"] == 'int':
        return f'Column("{table["name"]}", Integer)'
    elif table["type"] == 'bool':
        return f'Column("{table["name"]}", Boolean)'
    elif table["type"] == 'date':
        return f'Column("{table["name"]}", Date)'
    elif table["type"] == 'datetime':
        return f'Column("{table["name"]}", DateTime)'
    elif table["type"] == 'float':
        return f'Column("{table["name"]}", Float)'
    else:
        return "type error"
# sqlalchemy
# String
# Integer
# Boolean
# Date
# DateTime
# Float
def create_content_model_postgre(table_list):
    print("table list :", table_list)
    content = ''
    for table in table_list:
        content += '\t' + model_sqlalchemy_postgre(table)+ '\n'
    return content



def create_content_db_postgre(table_list):
    print("table list :", table_list)
    content = ''
    for table in table_list:
        print(f'Column({table["name"]}, {table["type"]})')
        content += db_sqlalchemy_postgre(table)+ ',' + '\n' + '\t'
    return content
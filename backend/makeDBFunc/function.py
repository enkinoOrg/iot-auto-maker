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
    if table["data_type"] == 'str':
        return f'{table["data_name"]} = Column(String)'
    elif table["data_type"] == 'int':
        return f'{table["data_name"]} = Column(Integer)'
    elif table["data_type"] == 'bool':
        return f'{table["data_name"]} = Column(Boolean)'
    elif table["data_type"] == 'date':
        return f'{table["data_name"]} = Column(Date)'
    elif table["data_type"] == 'datetime':
        return f'{table["data_name"]} = Column(DateTime)'
    elif table["data_type"] == 'float':
        return f'{table["data_name"]} = Column(Float)'
    else:
        return "type error"

def model_sqlalchemy_postgre(table):
    return f'{table["data_name"]}: {table["data_type"]}'

def db_sqlalchemy_postgre(table):
    if table["data_type"] == 'str':
        return f'Column("{table["data_name"]}", String)'
    elif table["data_type"] == 'int':
        return f'Column("{table["data_name"]}", Integer)'
    elif table["data_type"] == 'bool':
        return f'Column("{table["data_name"]}", Boolean)'
    elif table["data_type"] == 'date':
        return f'Column("{table["data_name"]}", Date)'
    elif table["data_type"] == 'datetime':
        return f'Column("{table["data_name"]}", DateTime)'
    elif table["data_type"] == 'float':
        return f'Column("{table["data_name"]}", Float)'
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
        print(f'Column({table["data_name"]}, {table["data_type"]})')
        content += db_sqlalchemy_postgre(table)+ ',' + '\n' + '\t'
    return content
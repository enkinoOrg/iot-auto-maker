def write_file(file_name, content):
    with open(file_name, 'w', encoding='UTF8') as f:
        f.write(content)

def copy_file_content(source_path: str, target_path: str):
    with open(source_path, 'r', encoding='UTF8') as f1:
        content = f1.read()

    with open(target_path, 'w', encoding='UTF8') as f2:
        f2.write(content)
    
def append_text_to_file(file_path: str, text: str):
    with open(file_path, 'a', encoding='UTF8') as f:
        f.write(text)

def replace_word_in_file(file_path: str, word: str, replace_word: str):
    with open(file_path, 'r', encoding='UTF8') as f:
        content = f.read()
        content = content.replace(word, replace_word)
    with open(file_path, 'w', encoding='UTF8') as f:
        f.write(content)

def add_text_to_file(content_file: str, source_file: str):
    with open(content_file, 'r', encoding='UTF8') as f1:
        content = f1.read()

    with open(source_file, 'a', encoding='UTF8') as f2:
        f2.write(content)

def replace_space_to_underbar(text: str):
    return text.replace(" ", "_")

def replace_word_to_array(file_path: str, word: str, replace_word: list):
    with open(file_path, 'r', encoding='UTF8') as f:
        content = f.read()
        content = content.replace(word, str(replace_word))
    with open(file_path, 'w', encoding='UTF8') as f:
        f.write(content)
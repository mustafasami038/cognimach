import os

files = [
    r'frontend\src\pages\Admin.jsx',
    r'frontend\src\pages\Dashboard.jsx',
    r'frontend\src\pages\Login.jsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    content = content.replace("'http://localhost:8000", "(import.meta.env.VITE_API_URL || 'http://localhost:8000') + '")
    content = content.replace("`http://localhost:8000", "`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

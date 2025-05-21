import csv
import requests

print("🟡 Старт: читаю sample_data.csv")

try:
    with open('sample_data.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        data = []
        for row in reader:
            print("📄 Читаю строку:", row)
            data.append({
                "station": row['station'],
                "date": row['date'],
                "value": float(row['value'])
            })
except FileNotFoundError:
    print("❌ Файл sample_data.csv не найден!")
    exit()
except Exception as e:
    print("❌ Ошибка при чтении CSV:", e)
    exit()

print("✅ Данные готовы, отправляю на сервер...")

try:
    response = requests.post("http://localhost:8000/upload", json=data)
    print("🟢 Ответ от сервера:", response.json())
except Exception as e:
    print("❌ Ошибка при запросе к серверу:", e)

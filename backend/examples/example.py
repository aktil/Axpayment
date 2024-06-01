import requests

response = requests.post(
    'http://localhost:8000/api/payments/',
    headers={
        'Authorization': f'Bearer {'your_token'}',
        'Content-Type': 'application/json'
    },
    json={
        'user': 1,
        'amount': 100.00
    }
)
print(response.json())

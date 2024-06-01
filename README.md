Описание проекта
Система приема онлайн-платежей, позволяющая принимать оплату через API на веб-сайтах и в мобильных приложениях.

Технологии
Django + SQLite
Angular 17 (standalone)
REST API
Swagger для документации
Установка и запуск
Backend
Создайте виртуальную среду:



python -m venv venv
Активируйте виртуальную среду:



venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix/macOS
Установите зависимости:



pip install -r requirements.txt
Примените миграции:



python manage.py makemigrations
python manage.py migrate
Создайте суперпользователя:



python manage.py createsuperuser
Запустите сервер разработки:



python manage.py runserver
Frontend
Перейдите в директорию frontend:



cd frontend
Установите зависимости:



npm install
Запустите сервер разработки:



ng serve
Документация API
Документация доступна по следующим URL:
Swagger: http://localhost:8000/swagger/
ReDoc: http://localhost:8000/redoc/
Примеры кода
Пример запроса на создание платежа (JavaScript):

javascript

fetch('http://localhost:8000/api/payments/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    user: 1,
    amount: 100.00
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
Пример запроса на создание платежа (Python):

python

import requests

response = requests.post(
    'http://localhost:8000/api/payments/',
    headers={
        'Authorization': f'Bearer {your_token}',
        'Content-Type': 'application/json'
    },
    json={
        'user': 1,
        'amount': 100.00
    }
)
print(response.json())
Маршруты API
Регистрация

URL: /api/register/
Метод: POST
Тело запроса:
json

{
  "username": "string",
  "password": "string",
  "email": "string"
}
Авторизация

URL: /api/login/
Метод: POST
Тело запроса:
json

{
  "username": "string",
  "password": "string"
}
Пример ответа:
json

{
  "refresh": "string",
  "access": "string"
}
Создание платежа

URL: /api/payments/
Метод: POST
Заголовки:
json

{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
Тело запроса:
json

{
  "user": 1,
  "amount": 100.00
}
Получение списка платежей

URL: /api/payments/
Метод: GET
Заголовки:
json

{
  "Authorization": "Bearer <access_token>"
}
Получение деталей платежа

URL: /api/payments/<id>/
Метод: GET
Заголовки:
json

{
  "Authorization": "Bearer <access_token>"
}
Отмена платежа

URL: /api/payments/<id>/cancel/
Метод: PATCH
Заголовки:
json

{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
Методы безопасности аккаунтов
Для восстановления пароля используйте следующие конечные точки:
Запрос на восстановление пароля

URL: /password_reset/
Метод: POST
Тело запроса:
json

{
  "email": "string"
}
Подтверждение восстановления пароля

URL: /reset/<uidb64>/<token>/
Метод: POST
Тело запроса:
json

{
  "new_password1": "string",
  "new_password2": "string"
}
Новый функционал
Генерация QR-кода для оплаты

URL: /api/payments/<id>/generate_qr_code/
Метод: POST
Заголовки:
json

{
  "Authorization": "Bearer <access_token>"
}
Пример ответа:
json

{
  "status": "QR code generated",
  "qr_code_url": "string"
}
Обработка платежа по QR-коду

URL: /api/payments/<id>/process_payment/
Метод: POST
Заголовки:
json

{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
Тело запроса:
json

{
  "card_number": "string",
  "expiry_date": "string",
  "cvv": "string"
}
Управление API ключами пользователя

URL: /api/api-keys/
Метод: GET, POST
Заголовки:
json

{
  "Authorization": "Bearer <access_token>"
}
Тело запроса (для создания API ключа):
json

{
  "key": "string"
}
Удаление API ключа

URL: /api/api-keys/<id>/
Метод: DELETE
Заголовки:
json
 
{
  "Authorization": "Bearer <access_token>"
}
Маршруты страниц
Страница профиля пользователя

URL: /profile
Описание: Страница, на которой пользователь может управлять своими API ключами и просматривать свои данные.
Страница оплаты по QR-коду

URL: /pay/<id>
Описание: Страница, на которой пользователь может ввести свои банковские данные для обработки платежа по QR-коду.
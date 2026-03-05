# QuickHire 

---

## Features

- Job listing and browsing
- Company profiles
- Job application system
- Email job notifications
- Responsive modern UI
- API based architecture

---

## Tech Stack

Frontend:
- Next.js
- React
- Tailwind CSS
- Axios
- Lucide icons

Backend:
- Laravel 
- MySQL

---

# ⚙️ How to Run Locally

Follow these steps to run the project locally.


```bash

1. Clone the repository

git clone https://github.com/mishimanto/quickhire-backend.git
git clone https://github.com/mishimanto/quickhire-frontend.git

cd backend 
cd frontend

Stucture: 
quickhire/
├─ frontend/      (Next.js)
├─ backend/       (Laravel)


2. Environment Setup
.env.example -> .env
.env -> 
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quickhire
DB_USERNAME=root
DB_PASSWORD=

&

.env.local -> NEXT_PUBLIC_API_URL=http://localhost:8000/api


3. Install dependencies

composer install
npm install
npm run build


4. Database Migration

php artisan migrate
php artisan db:seed


5. Run the API

php artisan serve


6. Run the Frontend

npm run dev
```


## Credentials:
### admin
email: admin@gmail.com
password: password


### user 
email: user@gmail.com
password: password

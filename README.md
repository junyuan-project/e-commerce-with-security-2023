# E‑Commerce with Security (Django)

Secure, production-minded full‑stack e‑commerce web application built with Django. This repository demonstrates backend ownership, secure‑by‑design practices, and deployment readiness.

---

## Quick summary

- Role showcased: Backend-focused full‑stack engineer with strong security practices.
- Core capabilities: product catalogue, shopping cart, checkout, orders, admin management.
- Emphasis: OWASP Top‑10 mitigations, secure auth, input validation, session hardening, and test coverage.

---

## 📌 Project Overview

This project implements an online store with a clear separation of concerns (Django project + app structure). It focuses on secure implementation of common e‑commerce flows and documents production deployment choices, trade‑offs, and testability.

Highlights:

- Modular Django app structure (ascapp/) and project settings (ascproject/)
- RESTful endpoints and template driven UI
- Security controls integrated across the stack

---

## ✨ Key Features

### Customer Features

- User registration & secure authentication
- Browse categories and products
- Search, filter, and product details
- Persistent shopping cart and checkout
- Order history and user profile

### Administrator Features

- Admin dashboard: CRUD for products, categories, users, and orders
- Order processing and status updates
- Basic reporting of sales and orders

### Security & compliance

- Strong password hashing (Django defaults; Argon2 ready)
- CSRF protection on forms and state-changing endpoints
- Template output encoding + input validation to reduce XSS risk
- ORM-based queries to prevent SQL injection
- Secure headers (HSTS, X-Frame-Options) and Content‑Security‑Policy hooks
- Session hardening: Secure, HttpOnly cookies and reasonable expiry
- Rate limiting and brute‑force protection hooks for auth endpoints
- Audit logging for security monitoring and incident investigation

---

## Architecture

Frontend (Django templates / optional frontend app)
│
▼
Django Backend (views, REST API, auth, business logic)
│
▼
Database (SQLite for dev / PostgreSQL recommended for production)

Optional: Redis (session/cache), Celery (async jobs), Nginx + Gunicorn

---

## 🛠 Technology Stack

- Backend: Python 3.10+, Django
- Frontend: Django templates, Bootstrap (optional separate frontend in ascproject-frontend/)
- Database: SQLite (dev)
- Optional services: Redis, Celery, Gunicorn, Nginx
- Development: pip, venv, Git, Docker (optional)
- Security libs / patterns: django-csp, django-axes (optional), secure settings patterns

---

## 📂 Project Structure

```text
ascproject/
├─ ascapp/ # core Django app (products, orders, auth)
├─ ascproject/ # Django project settings and urls
├─ ascproject-frontend/ # optional separate frontend or assets
├─ manage.py
├─ db.sqlite3 # development DB
└─ README.md
```

---

## Setup — Development (Windows)

1. Clone:
   git clone https://github.com/junyuan-project/e-commerce-with-security-2023.git

2. Create virtual environment and install:
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt

3. Environment:
   Copy `.env.example` to `.env` and set SECRET_KEY, DEBUG, DATABASE_URL.

4. Database and superuser:
   python manage.py migrate
   python manage.py createsuperuser

5. Run server:
   python manage.py runserver 0.0.0.0:8000

---

## Testing

- Run unit & integration tests:
  python manage.py test

- Linting / static checks (if configured): flake8, isort

---

## Deployment notes (production)

- Use PostgreSQL and environment variables for secrets.
- Serve with Gunicorn behind Nginx; enable HTTPS and HSTS.
- Use Redis for session & caching and Celery for background tasks (emails, order processing).
- Containerize with Docker and provide a docker-compose for reproducible deployment.
- Log to a centralized system and rotate logs; monitor error rates and suspicious auth behavior.

---

## Resume‑friendly bullets

- Built a secure e‑commerce platform with Django demonstrating authentication, cart lifecycle, and admin management.
- Hardened application against OWASP Top‑10 vulnerabilities: CSRF, XSS mitigation, SQLi prevention, secure headers, and rate limiting.
- Added automated tests and clear deployment instructions for production readiness (Postgres, Gunicorn, Nginx).

---

## 🔮 Future Improvements

- Integrate payment gateway with tokenised flows (Stripe / PayPal)
- Implement 2‑Factor Authentication and account recovery hardening
- Real‑time order updates via WebSockets
- Full REST API with OpenAPI docs and versioning
- Dockerized CI/CD and IaC (Terraform)

---

## 👨‍💻 Author

JY Wong

Software Engineer specializing in backend development, API integration, and healthcare interoperability solutions.

LinkedIn: https://www.linkedin.com/in/jun-yuan-wong-66b094233/

GitHub: https://github.com/junyuan-project

---

## 📄 License

This project is developed for educational and portfolio purposes.

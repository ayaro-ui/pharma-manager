# PharmaManager

Application de gestion de pharmacie — Développé dans le cadre du test technique SMARTHOLOL

## Stack Technique

- **Backend** : Django 4.x + Django REST Framework + PostgreSQL
- **Frontend** : React.js (Vite)
- **Documentation API** : Swagger (drf-spectacular)

## Structure du Projet
```
pharma-manager/
├── backend/      # Django REST Framework + PostgreSQL
├── frontend/     # React.js (Vite)
└── README.md
```

## Installation Backend
```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Appliquer les migrations
python manage.py migrate

# Charger les données de test
python manage.py loaddata fixtures/initial_data.json

# Lancer le serveur
python manage.py runserver
```

## Variables d'Environnement Backend (.env)
```
DEBUG=True
SECRET_KEY=votre-secret-key-ici
DB_NAME=pharma_db
DB_USER=postgres
DB_PASSWORD=votre-password
DB_HOST=localhost
DB_PORT=5432
```

## Installation Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

## Variables d'Environnement Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Documentation API

Swagger UI disponible sur : http://localhost:8000/api/schema/swagger-ui/

## Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/medicaments/` | Liste des médicaments actifs |
| POST | `/api/v1/medicaments/` | Créer un médicament |
| PUT/PATCH | `/api/v1/medicaments/{id}/` | Modifier un médicament |
| DELETE | `/api/v1/medicaments/{id}/` | Archiver un médicament |
| GET | `/api/v1/medicaments/alertes/` | Médicaments sous stock minimum |
| GET | `/api/v1/categories/` | Liste des catégories |
| POST | `/api/v1/ventes/` | Créer une vente |
| POST | `/api/v1/ventes/{id}/annuler/` | Annuler une vente |

## Fonctionnalités

- Gestion complète des médicaments (CRUD + soft delete)
- Alertes automatiques pour les stocks sous le seuil minimum
- Gestion des ventes avec déduction automatique du stock
- Annulation de vente avec réintégration du stock
- Dashboard avec statistiques en temps réel
- Documentation API Swagger complète avec schémas
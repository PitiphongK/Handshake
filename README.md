# Handshake
Handshake is a web application designed to foster collaboration between NatureScot and Scotland’s Higher Education sector. By enabling staff, researchers, and students to create profiles and find others with matching interests or activities, Handshake aims to encourage mutual partnerships that benefit both the academic and conservation communities.

# Overview
NatureScot recognized that many university departments across Scotland are engaged in work highly relevant to conservation and environmental management, yet collaboration between NatureScot staff and university personnel remains limited. Handshake addresses this gap by providing a centralized platform where:

Users (staff, researchers, and students) can register and display their conservation interests.
Projects can be represented, allowing interested parties to find and potentially join them.
Users can search for specific skills, interests, and geographical locations, then reach out via email to begin collaboration.
By bridging these networks, Handshake aims to spark new partnerships and more effective conservation initiatives.

# Features
## User Registration

Users must have an email address from an approved institution to register.
They provide details such as name, institution, and areas of interest.

## Login & Authentication

Secure login with email and password.
Once logged in, users are taken to a homepage where they can search for others.

## Search & Filters

Users can filter by interests, location, or areas of expertise.
Projects can also be discovered via filtering criteria.
## Profiles

Each user or project has a dedicated profile page.
Users can view profiles to learn more about specific interests or ongoing initiatives.
## Contact

Direct messaging within the platform is not available.
Instead, users can reach out to each other via email (linked from the profile page).

# Technology Stack
* Backend: Django
* Frontend: React (written in TypeScript)
* Database: PostgreSQL
* Communication: RESTful API between Django and React
* Testing: Jest & django.test

# Installation & Setup
Follow these steps to get Handshake running locally:

## Clone the Repository

```
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh18/sh18-main.git
cd handshake

```
## Backend Setup (Django)

* Navigate to the handshake (backend) folder.
* Install dependencies:
```
pip install -r requirements.txt
```
* Run migrations:

```
python manage.py makemigrations
python manage.py migrate
```

* Start the Django server:
```
python manage.py runserver
```

## Frontend Setup (TS-React)

* Open a new terminal and navigate to the frontend folder:

```
cd ./frontend
```

* Install dependencies:

```
npm install
```

* Run the development server:

```
npm run
```

# Usage
## Registration

Visit the registration page and sign up with an approved institutional email.
Provide necessary details: name, institution, location, interests, etc.

## Login

Log in with the email and password you registered with.
You’ll be redirected to the homepage.

## Searching

On the homepage, use the filters to find individuals or projects by interests, location, or other attributes.

## Profile Viewing

Click on a user or project profile to see more details.
Profiles display areas of interest, institution affiliation, and an email link to contact.

## Email Outreach

There is no direct messaging feature in the site itself.
To connect, email the user at the address listed on their profile.

# License

This project is licensed under the MIT License.
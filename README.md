# Job Board Platform 💼

A full-featured Job Board REST API built with Node.js, Express.js, and MongoDB.

## Features

- Employer registration, login, and job posting
- Candidate registration, login, and job applications
- JWT authentication and bcrypt password hashing
- Job search with filters (location, type, skills)
- Application status tracking
- Role-based protected routes

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Auth:** JWT + bcrypt
- **Architecture:** REST API / MVC

## Installation

1. Clone the repository
   git clone https://github.com/oabutalep/CodeAlpha_Job-Board.git

2. Install dependencies
   npm install

3. Make sure MongoDB is running locally

4. Start the server
   node index.js

## API Endpoints

### Employers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /employers/register | Register employer |
| POST | /employers/login | Login employer |
| GET | /employers/:id | Get employer profile |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /candidates/register | Register candidate |
| POST | /candidates/login | Login candidate |
| GET | /candidates/:id | Get candidate profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /jobs | Get all jobs (with filters) |
| GET | /jobs/:id | Get single job |
| POST | /jobs | Create job (protected) |
| DELETE | /jobs/:id | Delete job (protected) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /applications | Apply for job (protected) |
| GET | /applications/candidate | My applications (protected) |
| GET | /applications/job/:jobId | Job applications (protected) |
| PUT | /applications/:id | Update status (protected) |
| DELETE | /applications/:id | Cancel application (protected) |

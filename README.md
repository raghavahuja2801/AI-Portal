# AI Job Portal - MERN Stack

![AI Job Portal](https://img.shields.io/badge/MERN-FullStack-blue) ![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

## Description

AI Job Portal is a web application built on the MERN stack (MongoDB, Express.js, React, Node.js) designed to connect employers with candidates efficiently. The platform leverages AI to streamline job application processes, such as resume parsing, skill extraction, and job matching, making it easier for candidates to find the right job and employers to find the right talent.

The system enables users to upload their resumes, extract relevant skills, and build profiles, while employers can create job listings and manage applicants.

## Features

- **User Authentication**: Secure JWT-based authentication for both job seekers and employers.
- **AI-Powered Resume Parsing**: Upload resumes (PDF/DOC), parse content, and extract skills automatically.
- **Profile Management**: Users can manage their profiles, update personal details, and add job-specific skills.
- **Employer Dashboard**: Employers can create job listings, view applicants, and manage their postings.
- **Job Search and Filters**: Search for job listings based on various filters (location, remote availability, required skills, etc.).
- **Dynamic Job Matching**: AI-driven job recommendations based on user profiles and extracted skills.
- **File Upload & LaTeX Resume Generation**: Generate PDF resumes from LaTeX templates and store files securely.

## Technologies Used

- **Frontend**: React.js, Redux, Axios
- **Backend**: Node.js, Express.js, Multer for file uploads, JWT for authentication
- **Database**: MongoDB (Mongoose ORM)
- **AI/ML**: AI-based skill extraction from uploaded resumes
- **PDF Generation**: LaTeX templates compiled into PDF using `node-latex`
- **Other Tools**: Docker (for containerization), Git, Postman for API testing

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (installed locally or MongoDB Atlas)
- LaTeX Distribution (for PDF generation)
- Git

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/ai-job-portal.git
   cd ai-job-portal
2. **Install Dependencies:**
   # Backend installation
   ```bash
   cd Backend
   npm install

# Frontend installation
```bash
cd ../Frontend
npm install

3. **Configure Environment Variables:**
   Create a .env file in the backend directory with the following content:
   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   PORT=5000

4.**Run the Development Servers:**

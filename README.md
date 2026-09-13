# Scribly — Social Blogging Platform

Scribly is a full-stack social blogging platform where users can write, publish, and discover articles, then engage with authors and each other through likes, comments, and follows. It combines a rich-text authoring experience with a lightweight social layer such as personal profiles, a following-based feed, and per-post engagement metrics.

# Core Features
### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing
- User-specific permissions
### Blog Management
- Create, edit, and publish blog posts
- Rich-text editor powered by React Quill
- Image uploads for blog posts
- Category-based organization
- View counts for every post
- Like/unlike functionality
- Related-post recommendations
### Post Discovery
- Live title search
- Debounced search
- Category filtering
- Masonry-style responsive post grid
- Related posts based on categories
### Social Features
- Like and unlike posts
- Threaded comments
- Delete your own comments
- Follow/unfollow authors
- Personalized feed based on followed users
- Author engagement statistics
### User Profiles
- User avatar
- Personal bio
- Published posts
- Followers and following
- Profile statistics
- Follow/unfollow functionality
### User Experience
- Toast notifications
- Relative timestamps
- Responsive layout
- Protected and pre-login route guards
- Clean and modern UI
# Architecture

Scribly follows a client-server REST API architecture.

                    ┌─────────────────────┐
                    │     React Client    │
                    │                     │
                    │  Redux Toolkit      │
                    │  React Router       │
                    │  Axios              │
                    │  Bootstrap          │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │                     │
                    │ Authentication      │
                    │ Blog APIs           │
                    │ Comment APIs        │
                    │ Like APIs           │
                    │ User APIs           │
                    │ Follow APIs         │
                    └──────────┬──────────┘
                               │
                               │ mysql2
                               ▼
                    ┌─────────────────────┐
                    │    MySQL Database   │
                    │                     │
                    │ Users               │
                    │ Blogs               │
                    │ Comments            │
                    │ Likes               │
                    │ Follows             │
                    │ Categories          │
                    └─────────────────────┘

# Authentication Flow
```text
User
 │
 ▼
Register / Login
 │
 ▼
Backend validates credentials
 │
 ▼
JWT generated
 │
 ▼
Token stored on client
 │
 ▼
Protected API request
 │
 ▼
JWT verification
 │
 ▼
Authorized resource access
```
# Project Structure
```text
Scribly/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── app.js
│   └── package.json
│
├── vercel.json
└── README.md
```
# Project Goals

Scribly was developed to demonstrate how a modern full-stack application can combine:

- Frontend state management
- REST API development
- Relational database design
- Authentication and authorization
- CRUD operations
- File uploads
- Social interactions
- Responsive UI development
- Personalized content feeds

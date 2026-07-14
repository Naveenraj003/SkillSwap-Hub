# SkillSwap Hub
## Software Requirements Specification (SRS) & Technical Documentation

**Project Name:** SkillSwap Hub  
**Tagline:** Exchange knowledge with skilled peers. Teach what you know, learn what you need, and grow together through meaningful connections.

**Document Type:** Software Requirements Specification and Technical Documentation

**Version:** 1.0

**Project Type:** Full Stack Web Application

**Development Approach:** Hybrid Product Documentation + MVP Implementation

---

# Table of Contents

1. Product Overview
2. System Objectives
3. Product Scope
4. Target Users
5. User Roles and Permissions
6. System Workflow
7. Functional Requirements
8. System Modules
9. Database Design
10. System Architecture
11. Technology Stack
12. Security Requirements
13. Non Functional Requirements
14. Deployment Architecture
15. Expected Outcome
16. Future Enhancements


---

# 1. Product Overview

## 1.1 Introduction

SkillSwap Hub is a peer-to-peer skill exchange platform designed to connect individuals who want to teach their knowledge and individuals who want to learn new skills.

The platform enables users to discover skilled peers, exchange knowledge, communicate securely, schedule learning sessions, and build meaningful professional and personal connections.

Unlike traditional learning platforms, SkillSwap Hub focuses on mutual knowledge exchange where every user can become both a learner and a teacher.

---

## 1.2 Product Vision

The vision of SkillSwap Hub is to create a trusted community where knowledge sharing becomes accessible, structured, and privacy-focused.

The platform aims to remove barriers between people who have valuable skills and people who want to acquire those skills.

---

## 1.3 Problem Statement

Many individuals possess useful skills but lack a proper platform to share their knowledge.

At the same time, learners often struggle to find suitable mentors or peers who match their learning requirements.

Existing platforms mainly focus on paid courses or professional networking but do not provide a simple peer-to-peer skill exchange environment.

SkillSwap Hub addresses this gap by creating a platform for direct skill-based connections.

---

## 1.4 Proposed Solution

SkillSwap Hub provides:

- Skill-based user discovery
- Teacher and learner matching
- Secure connection requests
- Privacy-controlled communication
- Session scheduling
- Online meeting support
- Community-based learning environment

The platform allows users to:

- Teach skills they know
- Learn skills they need
- Connect with suitable peers
- Exchange knowledge effectively

---

# 2. System Objectives

The primary objectives of SkillSwap Hub are:

## 2.1 Knowledge Exchange

Enable users to share their expertise and learn from others through structured interactions.

---

## 2.2 Skill Discovery

Allow users to find people based on their teaching and learning requirements.

---

## 2.3 Privacy Protection

Maintain user privacy by hiding personal contact information and providing controlled communication.

---

## 2.4 Meaningful Connections

Create a trusted environment where users can connect based on actual learning interests.

---

## 2.5 Secure Communication

Provide safe communication through controlled messaging and user privacy features.

---

## 2.6 Structured Learning Sessions

Allow users to request, schedule, and conduct learning sessions.

---

# 3. Product Scope

## 3.1 MVP Scope

The Minimum Viable Product includes:

### Authentication

- Email and password registration
- Secure login
- User account management

---

### Profile Management

Users can create and manage profiles containing:

- Full Name
- Profile Image
- Bio
- Teaching Skills
- Learning Skills
- Skill Level
- Experience

---

### Skill Management

Users can:

- Add skills they can teach
- Add skills they want to learn
- Select skill proficiency level

Skill levels:

- Beginner
- Intermediate
- Advanced
- Expert

---

### Skill Discovery

Users can search other users through:

- Skill name
- Unique SkillSwap ID

Personal information search is not supported.

---

### Connection Management

Users can:

- Send connection requests
- Accept requests
- Reject requests
- Manage connections

Connection requests contain:

- Requested Skill
- Short Message

---

### Communication

Users can communicate through privacy-controlled chat.

Chat includes message restrictions to prevent spam.

---

### Session Management

Users can:

- Request learning sessions
- Approve sessions
- Schedule meetings
- Manage session details

---

### Video Meeting

The platform supports integration with existing free video meeting solutions.

---

### Privacy Controls

Users can:

- Restrict other users
- Block other users

---

### Administration

Admin can:

- Manage users
- Handle reports
- Review complaints
- Remove users
- Monitor platform activities

---

# 3.2 Future Scope

Future enhancements include:

- AI-based skill recommendations
- Intelligent user matching
- Skill verification system
- Rating and reputation system
- Gamification
- Achievement badges
- Advanced analytics
- Mobile application

---

# 4. Target Users

## 4.1 General Users

SkillSwap Hub is designed for anyone interested in sharing or learning skills.

There are no restrictions based on:

- Profession
- Education
- Experience level

---

## 4.2 Learners

Users who want to acquire new skills.

They can:

- Search required skills
- Find suitable teachers
- Send learning requests
- Schedule sessions
- Communicate with teachers

---

## 4.3 Teachers

Users who want to share their knowledge.

They can:

- Add skills they know
- Receive learning requests
- Conduct sessions
- Help other users grow

---

## 4.4 Dual Role Users

A user can simultaneously act as:

- Learner
- Teacher

Example:

A user can teach Java programming while learning Machine Learning.

---

## 4.5 Administrator

The administrator manages platform safety and operations.

Responsibilities:

- User management
- Report handling
- Complaint resolution
- Content moderation
- Platform monitoring

# 5. User Roles and Permissions

SkillSwap Hub follows a role-based access approach where users can have multiple capabilities under a single account.

A single user account can act as:

- Learner
- Teacher
- Both Learner and Teacher

The administrator has separate management privileges.

---

# 5.1 Normal User

## Description

A registered user who participates in the SkillSwap Hub community.

A user can become a learner, teacher, or both depending on their selected skills.

---

## Permissions

### Account Management

Users can:

- Register an account
- Login securely
- Update profile information
- Manage their account settings

---

### Profile Management

Users can:

- Add profile image
- Update bio
- Add teaching skills
- Add learning skills
- Select skill proficiency level
- Add experience details

---

### Skill Interaction

Users can:

- Search users by skills
- Search users using SkillSwap ID
- View public profiles
- Send connection requests

---

### Communication

Users can:

- Communicate with connected users
- Send and receive messages
- Restrict other users
- Block users

---

### Learning Session

Users can:

- Request sessions
- Accept sessions
- Schedule meetings
- Join video meetings

---

# 5.2 Learner Role

## Description

A user who wants to acquire knowledge from another user.

---

## Permissions

Learners can:

- Search required skills
- Find users who teach required skills
- Send learning requests
- Communicate with teachers
- Schedule learning sessions

---

# 5.3 Teacher Role

## Description

A user who shares their knowledge with others.

---

## Permissions

Teachers can:

- Publish teaching skills
- Receive learning requests
- Accept or reject requests
- Conduct learning sessions

---

# 5.4 Dual Role User

## Description

A user who teaches some skills and learns other skills.

Example:
Teaching:
Java Programming

Learning:
Artificial Intelligence


---

## Permissions

A dual-role user has combined learner and teacher capabilities.

---

# 5.5 Administrator Role

## Description

The administrator manages the complete platform.

Currently, the system supports a single administrator.

---

## Admin Permissions

### User Management

Admin can:

- View users
- Remove users
- Disable accounts
- Manage user activities

---

### Complaint Management

Admin can:

- View user reports
- Review complaints
- Take corrective actions

---

### Platform Management

Admin can:

- Monitor activities
- Manage skill data
- Maintain platform security

---

# 6. User Permission Matrix

| Feature | User | Admin |
|---|---|---|
| Register Account | ✓ | ✓ |
| Login | ✓ | ✓ |
| Manage Profile | ✓ | ✓ |
| Add Skills | ✓ | ✓ |
| Search Users | ✓ | ✓ |
| Search SkillSwap ID | ✓ | ✓ |
| Send Connection Request | ✓ | - |
| Accept Connection Request | ✓ | - |
| Chat | ✓ | - |
| Restrict User | ✓ | ✓ |
| Block User | ✓ | ✓ |
| Request Session | ✓ | - |
| Join Meeting | ✓ | - |
| Report User | ✓ | ✓ |
| View Reports | - | ✓ |
| Remove User | - | ✓ |
| Manage Platform | - | ✓ |

---

# 7. System Workflow

## 7.1 User Registration Workflow

User Opens Platform
|
↓
Create Account
|
↓
Enter Email and Password
|
↓
Authentication Verification
|
↓
Account Created
|
↓
Generate Unique SkillSwap ID
|
↓
Complete Profile


---

# 7.2 Profile Creation Workflow

User Login
|
↓
Create Profile
|
↓
Add Basic Information
    |
    ↓
Add Teaching Skills
    |
    ↓
Add Learning Skills
    |
    ↓
Select Skill Levels
    |
    ↓
Profile Published


---

# 7.3 Skill Addition Workflow

Skill addition follows validation-based entry.

User Enters Skill
|
↓
System Checks Skill Database
|
↓
Skill Valid?
|
Yes | No
|
↓
Add Skill Suggest Valid Skills


The purpose is to:

- Avoid duplicate skills
- Maintain quality search results
- Improve user matching

---

# 7.4 User Discovery Workflow

Users can discover others through:

## Skill Search

The purpose is to:

- Avoid duplicate skills
- Maintain quality search results
- Improve user matching

---

Enter Required Skill
|
↓
Search Database
|
↓
Display Matching Users


---

## SkillSwap ID Search


Enter Unique ID
|
↓
Find User
|
↓
View Public Profile


---

# 7.5 Connection Request Workflow


User Finds Profile
|
↓
Send Connection Request

Request Contains:

Requested Skill

Short Message

  |
  ↓

Receiver Gets Request

    |
    ↓

Accept / Reject

    |
    ↓

Connection Created


---

# 7.6 Chat Workflow

After successful connection:


Connection Accepted
|
↓
Chat Enabled
|
↓
Users Exchange Messages


Chat follows privacy restrictions.

---

# 7.7 Chat Restriction Workflow

The platform limits uncontrolled messaging.


User Sends Message

    |
    ↓

Message Count Checked

    |
    ↓

Maximum 3 unread messages reached

    |
    ↓

Further messages restricted

    |
    ↓

Receiver Opens Chat

    |
    ↓

Restriction Reset


The restriction applies to all users.

---

# 7.8 Session Workflow


Connected Users

    |
    ↓

Session Request

    |
    ↓

Select Topic / Skill

    |
    ↓

Schedule Meeting

    |
    ↓

Approval

    |
    ↓

Meeting Created

    |
    ↓

Video Session


---

# 7.9 Blocking Workflow


User Blocks Another User

    |
    ↓

Block Record Created

    |
    ↓

Blocked User Cannot:

Send Messages
Send Requests
Interact

---

# 7.10 Admin Workflow


Reports Received

    |
    ↓

Admin Reviews

    |
    ↓

Investigation

    |
    ↓

Action Taken

    |
    ↓

User Updated


---

# 8. Functional Requirements

## FR-01 Authentication System

The system shall provide secure user registration and login.

### Requirements:

- User registration using email and password
- Secure authentication
- Session management
- Account verification

---

## FR-02 Profile Management

The system shall allow users to create and maintain profiles.

Profile information:

- Name
- Profile image
- Bio
- Teaching skills
- Learning skills
- Skill levels
- Experience

Private information:

- Email
- Phone number
- Location

shall not be visible to other users.

---

## FR-03 Skill Management

The system shall allow users to manage skills.

Users can:

- Add teaching skills
- Add learning skills
- Select proficiency level

# 8. Functional Requirements (Continued)

---

# FR-04 Skill Validation and Management System

## Description

The system shall maintain a trusted skill database to ensure consistent and meaningful skill discovery.

Users should not be able to create random or duplicate skill names.

---

## Requirements

The system shall:

- Validate entered skills
- Suggest existing valid skills
- Prevent duplicate skill entries
- Maintain standardized skill records

---

## Skill Levels

Every skill shall support proficiency levels:

| Level | Description |
|---|---|
| Beginner | Basic understanding of the skill |
| Intermediate | Practical knowledge and experience |
| Advanced | Strong knowledge and ability to teach others |
| Expert | Professional-level expertise |

---

# FR-05 User Search and Discovery

## Description

Users should be able to find suitable peers based on their learning or teaching requirements.

---

## Search Methods

The system supports:

### Skill-Based Search

Users can search using:

- Skill name

Example:


Search:
Python


Result:


Users teaching Python


---

### SkillSwap ID Search

Users can search directly using:


SSH-102845


The system displays the matching public profile.

---

## Search Restrictions

The system shall not support searching by:

- Email
- Phone number
- Location

This maintains user privacy.

---

# FR-06 Connection Request Management

## Description

Users can establish learning connections through controlled requests.

---

## Connection Request Contains

- Sender information
- Receiver information
- Requested skill
- Short message
- Request status

---

## Request Status

Possible states:


Pending
|
|
Accepted / Rejected
|
|
Connected


---

# FR-07 Communication System

## Description

The platform provides controlled communication between connected users.

---

## Requirements

Users can:

- Send messages
- Receive messages
- View conversation history

---

## Privacy Features

The communication system includes:

- Message restrictions
- User blocking
- User restriction

---

# FR-08 Session Management

## Description

The system allows connected users to schedule knowledge exchange sessions.

---

## Session Information

Each session contains:

- Session ID
- Participants
- Skill/topic
- Date
- Time
- Status
- Meeting information

---

## Session Status


Requested

↓

Approved

↓

Scheduled

↓

Completed


---

# FR-09 Video Meeting Integration

## Description

The platform supports online meetings using existing free video solutions.

---

## Requirements

The system shall:

- Generate/store meeting information
- Provide meeting access
- Connect users during scheduled sessions

---

## Implementation Approach

The platform will integrate an existing free video meeting solution instead of building complete video infrastructure.

Examples:

- Jitsi Meet
- Other open-source video meeting solutions

---

# FR-10 User Privacy Management

## Description

Users have control over unwanted interactions.

---

## Restriction Feature

Users can restrict another user.

Restricted users:

- Cannot interact normally
- Have limited communication access

---

## Blocking Feature

Users can completely block another user.

Blocked users cannot:

- Send messages
- Send connection requests
- Access interaction features

---

# FR-11 Notification System

## Description

The system provides notifications for important activities.

---

## Notification Events

Users receive notifications for:

- Connection requests
- Request acceptance
- New messages
- Session updates
- Reports/status updates

---

# FR-12 Report and Complaint System

## Description

Users can report inappropriate behavior or platform issues.

---

## Report Types

Examples:

- User misconduct
- Spam
- Abuse
- Fake skill information
- Privacy violations

---

## Report Workflow


User Submits Report

    ↓

Stored in Database

    ↓

Admin Reviews

    ↓

Admin Action

    ↓

Resolution


---

# FR-13 Administration System

## Description

The administrator manages platform operations.

---

## Admin Features

### User Control

Admin can:

- View users
- Remove users
- Disable accounts


### Report Management

Admin can:

- View complaints
- Investigate issues
- Resolve reports


### Platform Monitoring

Admin can:

- Monitor activities
- Maintain system safety
- Manage skill records

---

# 9. System Modules

SkillSwap Hub is divided into independent functional modules.

---

# Module 1: Authentication Module

## Purpose

Provides secure user registration and login.

---

## Features

- Email/password registration
- User login
- Authentication verification
- Session management

---

## Database Interaction

Tables:


Users


---

# Module 2: User Profile Module

## Purpose

Maintains user identity and public information.

---

## Features

- Profile creation
- Profile update
- Profile viewing

---

## Stored Information

Public:

- Name
- Profile image
- Bio
- Skills
- Skill level
- Experience
- SkillSwap ID


Private:

- Email
- Phone
- Location

---

## Database Interaction

Tables:


Users
Profiles


---

# Module 3: Skill Management Module

## Purpose

Handles user skills and skill relationships.

---

## Features

- Add teaching skills
- Add learning skills
- Update skills
- Remove skills
- Skill level selection

---

## Database Interaction

Tables:


Skills

User_Skills


---

# Module 4: Skill Validation Module

## Purpose

Maintains trusted skill information.

---

## Features

- Skill verification
- Duplicate prevention
- Skill suggestions

---

## Database Interaction

Tables:


Skills


---

# Module 5: User Search Module

## Purpose

Allows users to discover suitable peers.

---

## Features

- Search by skill
- Search by SkillSwap ID
- View profiles

---

## Database Interaction

Tables:


Profiles
Skills
User_Skills


---

# Module 6: Connection Module

## Purpose

Manages user relationships.

---

## Features

- Send requests
- Accept requests
- Reject requests
- Maintain connections

---

## Database Interaction

Tables:


Connection_Requests

Connections


---

# Module 7: Chat Module

## Purpose

Provides secure communication.

---

## Features

- One-to-one messaging
- Message history
- Message restriction system

---

## Database Interaction

Tables:


Messages

Chat_Restrictions


---

# Module 8: Session Module

## Purpose

Manages learning sessions.

---

## Features

- Request sessions
- Approve sessions
- Schedule sessions
- Track status

---

## Database Interaction

Tables:


Sessions


---

# Module 9: Video Meeting Module

## Purpose

Provides online learning meetings.

---

## Features

- Store meeting details
- Generate meeting access
- Connect participants

---

## Database Interaction

Tables:


Video_Meetings

# 9. System Modules (Continued)

---

# Module 10: Privacy and User Control Module

## Purpose

Provides users control over unwanted interactions and protects user privacy.

---

## Features

Users can:

- Restrict other users
- Block other users
- Manage interaction permissions

---

## Blocking Behaviour

When a user blocks another user:

The blocked user cannot:

- Send messages
- Send connection requests
- Create session requests
- Interact with the blocker

---

## Database Interaction

Tables:


Blocks


---

# Module 11: Notification Module

## Purpose

Provides real-time updates about important activities.

---

## Features

The system generates notifications for:

- New connection requests
- Accepted requests
- Rejected requests
- New messages
- Session updates
- Admin actions

---

## Database Interaction

Tables:


Notifications


---

# Module 12: Report and Complaint Module

## Purpose

Maintains platform safety by allowing users to report issues.

---

## Features

Users can:

- Report another user
- Submit complaints
- Track report status

---

## Report Information

A report contains:

- Reporter
- Reported user
- Reason
- Description
- Created date
- Status

---

## Database Interaction

Tables:


Reports


---

# Module 13: Admin Management Module

## Purpose

Allows administrator to control and maintain the platform.

---

## Features

Admin can:

- Manage users
- Remove users
- Handle complaints
- Review reports
- Monitor activities
- Maintain skill records

---

## Database Interaction

Tables:


Admin_Actions
Users
Reports


---

# 10. Database Design

## 10.1 Database Overview

SkillSwap Hub uses a relational database architecture.

The database is designed using PostgreSQL to maintain:

- Data consistency
- Strong relationships
- Secure access control
- Scalability

---

# 10.2 Database Technology

## Database

PostgreSQL

## Hosting

Supabase PostgreSQL

## Database Design Approach

Hybrid approach:

### Professional Design

- Normalized relational structure
- Proper primary keys
- Foreign key relationships
- Data integrity


### MVP Implementation

- Simplified queries
- Fast development
- Easy maintenance

---

# 10.3 Entity Relationship Overview

Main entities:


Users
|
|
Profiles
|
|
User Skills
|
|
Skills

Users
|
|
Connections
|
|
Messages

Users
|
|
Sessions
|
|
Video Meetings

Users
|
|
Reports

Users
|
|
Blocks


---

# 10.4 Database Tables

---

# Table 1: Users

## Purpose

Stores authentication-related information.

---

| Column | Type | Description |
|---|---|---|
| user_id | UUID | Primary key |
| email | VARCHAR | User email |
| password_hash | TEXT | Encrypted password |
| skillswap_id | VARCHAR | Unique generated ID |
| created_at | TIMESTAMP | Account creation date |
| status | VARCHAR | Active/Blocked |

---

## Relationships

One user:

- Has one profile
- Has many skills
- Has many connections
- Has many messages
- Has many reports

---

# Table 2: Profiles

## Purpose

Stores public user information.

---

| Column | Type | Description |
|---|---|---|
| profile_id | UUID | Primary key |
| user_id | UUID | Foreign key |
| full_name | VARCHAR | Display name |
| profile_image | TEXT | Image URL |
| bio | TEXT | User description |
| experience | TEXT | Experience details |

---

## Privacy

Not stored publicly:

- Email
- Phone number
- Location

---

# Table 3: Skills

## Purpose

Stores verified skill information.

---

| Column | Type | Description |
|---|---|---|
| skill_id | UUID | Primary key |
| skill_name | VARCHAR | Skill name |
| verified | BOOLEAN | Validation status |
| created_at | TIMESTAMP | Creation date |

---

# Table 4: User Skills

## Purpose

Creates relationship between users and skills.

---

| Column | Type | Description |
|---|---|---|
| user_skill_id | UUID | Primary key |
| user_id | UUID | User reference |
| skill_id | UUID | Skill reference |
| skill_type | VARCHAR | Teaching/Learning |
| skill_level | VARCHAR | Beginner/Intermediate/Advanced/Expert |

---

## Skill Type Values


Teaching

Learning


---

# Table 5: Connection Requests

## Purpose

Stores user connection requests.

---

| Column | Type | Description |
|---|---|---|
| request_id | UUID | Primary key |
| sender_id | UUID | Request sender |
| receiver_id | UUID | Request receiver |
| requested_skill | UUID | Skill reference |
| message | TEXT | Request message |
| status | VARCHAR | Pending/Accepted/Rejected |
| created_at | TIMESTAMP | Date |

---

# Table 6: Connections

## Purpose

Stores accepted relationships.

---

| Column | Type | Description |
|---|---|---|
| connection_id | UUID | Primary key |
| user_one | UUID | User reference |
| user_two | UUID | User reference |
| created_at | TIMESTAMP | Date |

---

# Table 7: Messages

## Purpose

Stores chat messages.

---

| Column | Type | Description |
|---|---|---|
| message_id | UUID | Primary key |
| sender_id | UUID | Sender |
| receiver_id | UUID | Receiver |
| message_text | TEXT | Content |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Date |

---

# Table 8: Chat Restrictions

## Purpose

Controls message limitation.

---

| Column | Type | Description |
|---|---|---|
| restriction_id | UUID | Primary key |
| sender_id | UUID | User sending messages |
| receiver_id | UUID | Message receiver |
| unread_count | INTEGER | Count |
| last_reset | TIMESTAMP | Reset time |

---
# 10.4 Database Tables (Continued)

---

# Table 9: Sessions

## Purpose

Stores learning session details between connected users.

---

| Column | Type | Description |
|---|---|---|
| session_id | UUID | Primary key |
| requester_id | UUID | User requesting session |
| receiver_id | UUID | User receiving request |
| skill_id | UUID | Skill being exchanged |
| session_date | DATE | Scheduled date |
| session_time | TIME | Scheduled time |
| status | VARCHAR | Session status |
| created_at | TIMESTAMP | Creation date |

---

## Session Status


Requested

Approved

Scheduled

Completed

Cancelled


---

# Table 10: Video Meetings

## Purpose

Stores online meeting information.

---

| Column | Type | Description |
|---|---|---|
| meeting_id | UUID | Primary key |
| session_id | UUID | Related session |
| meeting_url | TEXT | Video meeting link |
| provider | VARCHAR | Meeting provider |
| created_at | TIMESTAMP | Creation date |

---

## Meeting Provider

Examples:


Jitsi Meet

Other Free Video Service


---

# Table 11: Blocks

## Purpose

Stores user blocking relationships.

---

| Column | Type | Description |
|---|---|---|
| block_id | UUID | Primary key |
| blocker_id | UUID | User who blocked |
| blocked_user_id | UUID | Blocked user |
| reason | TEXT | Optional reason |
| created_at | TIMESTAMP | Date |

---

# Table 12: Reports

## Purpose

Stores user complaints and reports.

---

| Column | Type | Description |
|---|---|---|
| report_id | UUID | Primary key |
| reporter_id | UUID | User submitting report |
| reported_user_id | UUID | Reported user |
| reason | VARCHAR | Report category |
| description | TEXT | Report details |
| status | VARCHAR | Pending/Resolved |
| created_at | TIMESTAMP | Date |

---

# Table 13: Notifications

## Purpose

Stores user activity notifications.

---

| Column | Type | Description |
|---|---|---|
| notification_id | UUID | Primary key |
| user_id | UUID | Receiver |
| title | VARCHAR | Notification title |
| message | TEXT | Notification content |
| type | VARCHAR | Notification type |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Date |

---

# Table 14: Admin Actions

## Purpose

Maintains administrator activity logs.

---

| Column | Type | Description |
|---|---|---|
| action_id | UUID | Primary key |
| admin_id | UUID | Admin user |
| target_user_id | UUID | Affected user |
| action_type | VARCHAR | Action performed |
| description | TEXT | Details |
| created_at | TIMESTAMP | Date |

---

# 10.5 Database Relationships

## User Relationship


Users

1 : 1

Profiles


A user has one profile.

---

## User and Skills Relationship


Users

1 : Many

User_Skills

Many : 1

Skills


A user can have multiple skills.

---

## Connection Relationship


Users

Many : Many

Connections


Users can connect with multiple users.

---

## Messaging Relationship


Users

1 : Many

Messages


A user can send and receive many messages.

---

## Session Relationship


Users

1 : Many

Sessions

Many : 1

Skills


Users can conduct multiple skill sessions.

---

# 11. System Architecture

## 11.1 Architecture Overview

SkillSwap Hub follows a modern full-stack architecture.

             Users
               |
               |
          Web Browser
               |
               |
    React + TypeScript Frontend
               |
               |
          REST API Layer
               |
               |
          FastAPI Backend
               |
    -----------------------
    |                     |
    |                     |

PostgreSQL Database Supabase Services
| |
| |
Data Storage Authentication
Storage

               |
               |
      External Services

      Video Meeting Provider

---

# 11.2 Frontend Architecture

## Technology

- React
- TypeScript
- Tailwind CSS
- shadcn/ui


---

## Responsibilities

Frontend handles:

- User interface
- Navigation
- Form handling
- API communication
- State management
- User interaction

---

## Main Frontend Modules


src

├── components
│
├── pages
│
├── routes
│
├── services
│
├── hooks
│
├── utils
│
└── assets


---

# 11.3 Backend Architecture

## Technology

FastAPI

---

## Responsibilities

Backend handles:

- Business logic
- API management
- User permissions
- Data processing
- Database communication

---

## Backend Structure


backend

├── app
│
├── api
│
├── models
│
├── schemas
│
├── services
│
├── database
│
├── authentication
│
└── utils


---

# 11.4 API Architecture

SkillSwap Hub uses REST API communication.

---

## API Categories

### Authentication APIs

Examples:


POST /auth/register

POST /auth/login


---

### Profile APIs


GET /profile/{id}

PUT /profile/update


---

### Skill APIs


GET /skills

POST /skills/add


---

### Connection APIs


POST /connections/request

PUT /connections/respond


---

### Chat APIs


GET /messages

POST /messages/send


---

### Session APIs


POST /sessions/create

PUT /sessions/update


---

### Admin APIs


GET /admin/users

DELETE /admin/user/{id}


---

# 12. Technology Stack

## 12.1 Frontend Technology

---

## React + TypeScript

Purpose:

- Component-based development
- Type safety
- Maintainable UI architecture

---

## Tailwind CSS

Purpose:

- Rapid styling
- Consistent design system
- Responsive layouts

---

## shadcn/ui

Purpose:

- Accessible reusable UI components
- Professional interface development

---

# 12.2 Backend Technology

## FastAPI

Purpose:

- High-performance backend
- Easy API development
- Python ecosystem support
- Clean architecture

---

# 12.3 Database Technology

## PostgreSQL

Purpose:

- Reliable relational database
- Strong data consistency
- Complex relationship handling

---

# 12.4 Cloud Platform

## Supabase

Services used:

### PostgreSQL Database

Stores application data.

### Authentication

Handles:

- User signup
- Login
- Session management

### Storage

Handles:

- Profile images
- Uploaded resources if required

---

# 12.5 Deployment

## Vercel

Used for:

- Frontend hosting
- Continuous deployment

---

# 12.6 External Services

## Video Meeting Integration

Used for:

- Online learning sessions
- Real-time communication

Possible solutions:

- Jitsi Meet
- Similar free services

# 13. Security Requirements

Security is a major requirement of SkillSwap Hub because the platform handles user identity, communication, and community interactions.

---

# 13.1 Authentication Security

The system shall provide secure authentication using Supabase Authentication.

Requirements:

- Secure email/password authentication
- Password encryption and protection
- User session management
- Unauthorized access prevention

---

# 13.2 Authorization and Access Control

The system shall implement role-based access control.

Users can only access features permitted to their account.

Examples:

User:

- Manage own profile
- Send requests
- Chat with connections

Admin:

- Manage users
- Handle reports
- Perform moderation actions

---

# 13.3 User Privacy Protection

SkillSwap Hub follows privacy-first design.

The following information remains private:

- Email address
- Phone number
- Location
- Personal contact information

Users can only communicate through platform features.

---

# 13.4 Data Protection

The system shall ensure:

- Secure database access
- Protected API communication
- Input validation
- Prevention of unauthorized data modification

---

# 13.5 Communication Security

The chat system includes:

- User-based access control
- Message restriction system
- Blocking mechanism

Blocked users cannot communicate with each other.

---

# 13.6 Admin Security

Administrator access shall be protected.

Requirements:

- Secure admin authentication
- Restricted admin privileges
- Activity logging

All important admin actions are stored in:


Admin_Actions


---

# 13.7 Input Validation

The system shall validate:

- User inputs
- Skill information
- Messages
- Reports

Purpose:

- Prevent invalid data
- Improve reliability
- Reduce security risks

---

# 14. Non Functional Requirements

Non-functional requirements define system quality expectations.

---

# 14.1 Performance Requirements

The system should provide:

- Fast page loading
- Efficient API response
- Optimized database queries
- Smooth user interaction

---

# 14.2 Scalability Requirements

The architecture should support future growth.

The system should allow:

- More users
- More skills
- More sessions
- Additional features

without major redesign.

---

# 14.3 Reliability Requirements

The system should provide:

- Stable operation
- Data consistency
- Error handling
- Recovery mechanisms

---

# 14.4 Maintainability Requirements

The application should be easy to maintain through:

- Modular architecture
- Clean code structure
- Reusable components
- Proper documentation

---

# 14.5 Usability Requirements

The interface should provide:

- Simple navigation
- Clear workflows
- Minimal learning curve
- Responsive design

---

# 14.6 Availability Requirements

The system should remain accessible through cloud deployment.

Infrastructure:


Frontend:
Vercel

Backend:
Supabase/FastAPI Deployment

Database:
Supabase PostgreSQL


---

# 15. Deployment Architecture

## 15.1 Deployment Overview

SkillSwap Hub uses cloud-based deployment.

Architecture:

             User

              |

              |

          Web Browser

              |

              |

          Vercel

    React + TypeScript App

              |

              |

          FastAPI API

              |

              |

    --------------------

    |                  |

Supabase Auth PostgreSQL

              |

              |

        Supabase Storage


              |

              |

    Video Meeting Service

---

# 15.2 Frontend Deployment

Platform:


Vercel


Responsibilities:

- Hosting React application
- Managing frontend builds
- Providing fast delivery

---

# 15.3 Backend Deployment

Backend:


FastAPI


Responsibilities:

- API processing
- Business logic
- Database operations

---

# 15.4 Database Deployment

Database:


Supabase PostgreSQL


Responsibilities:

- User data storage
- Skill information
- Connection records
- Messages
- Sessions

---

# 15.5 Storage Deployment

Supabase Storage manages:

- Profile images
- Future file resources

---

# 16. Development Workflow

## 16.1 Development Approach

SkillSwap Hub follows an incremental development approach.

---

## Phase 1: Foundation

Completed:

- Project setup
- Frontend architecture
- UI component system
- Database planning

---

## Phase 2: Authentication

Implementation:

- User registration
- Login
- Session handling

---

## Phase 3: User Management

Implementation:

- Profile creation
- Profile editing
- Skill management

---

## Phase 4: Skill Discovery

Implementation:

- Skill search
- Skill validation
- User discovery

---

## Phase 5: Communication

Implementation:

- Connection requests
- Chat system
- Privacy controls

---

## Phase 6: Session System

Implementation:

- Session requests
- Scheduling
- Video meeting integration

---

## Phase 7: Administration

Implementation:

- Reports
- User management
- Moderation

---

# 17. Expected Product Outcome

After implementation, SkillSwap Hub should provide:

---

## 17.1 Knowledge Exchange Platform

A platform where users can:

- Share their skills
- Learn new skills
- Build meaningful connections

---

## 17.2 Privacy-Focused Community

The system ensures:

- Hidden personal information
- Controlled communication
- User safety

---

## 17.3 Structured Learning Experience

Users can:

- Find suitable peers
- Request sessions
- Schedule meetings
- Exchange knowledge effectively

---

## 17.4 Real-World Full Stack Application

The project demonstrates:

- Frontend development
- Backend development
- Database design
- Authentication
- Cloud deployment
- API architecture

---

# 18. Future Enhancements

Future versions can include advanced capabilities.

---

# 18.1 AI-Based Skill Matching

Artificial intelligence can recommend:

- Suitable teachers
- Suitable learners
- Skill improvement paths

---

# 18.2 AI Profile Assistance

AI can help users:

- Improve profiles
- Write better descriptions
- Suggest skills

---

# 18.3 Skill Verification System

Future implementation:

- Skill assessments
- Certifications
- Verification badges

---

# 18.4 Rating and Reputation System

After complete session implementation:

Users can provide:

- Ratings
- Reviews
- Feedback

This builds trust within the community.

---

# 18.5 Gamification

Possible features:

- Learning points
- Achievement badges
- Skill milestones
- Leaderboards

---

# 18.6 Mobile Application

Future expansion:

- Android application
- iOS application
- Push notifications

---

# 19. Conclusion

SkillSwap Hub is a privacy-focused peer-to-peer skill exchange platform that enables individuals to teach, learn, and connect through meaningful knowledge sharing.

The platform combines skill discovery, controlled communication, session management, and community interaction to create a structured environment for continuous learning.

The system is designed with scalability, security, and maintainability in mind while providing a realistic foundation for future AI-powered enhancements.

---

# End of Document

SkillSwap Hub  
Software Requirements Specification & Technical Documentation

Version: 1.0

This completes the full SkillSwap Hub SRS Markdown document.

You can save it as:

SkillSwap-Hub-SRS.md
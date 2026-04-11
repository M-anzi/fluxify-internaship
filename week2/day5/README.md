# Team Directory App

A React application for managing and viewing team members with real-time search and add functionality.

## Features

- Display team members in responsive card layout
- Real-time search filtering by name or role
- Add new team members without page refresh
- Responsive design: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Avatar placeholders with member initials

## Component Structure

- **App**: Root component managing state and layout
- **SearchBar**: Controlled input for filtering members
- **MemberCard**: Displays individual member information
- **MemberList**: Renders grid of member cards
- **AddMemberForm**: Handles new member creation

## React Concepts Used

- Functional Components with Hooks (useState)
- Lifting State Up (search term and members array)
- Controlled Components (form inputs)
- Props for component communication
- Array mapping for dynamic rendering
- Conditional rendering (empty states)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
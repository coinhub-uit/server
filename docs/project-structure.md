# Project Structure

## `/src` - Main Application Modules

- **admin**: Manages admin accounts.
- **ai-chat**: Handles communication with an external AI chat API, using user data as context.
- **auth**: Manages authentication and authorization for both users and admins using JWT.
- **common**: Shared utilities including app configuration, database access, and general helpers.
- **config**: Centralized NestJS configuration used across modules via dependency injection.
- **notification**: Handles sending notifications.
- **payment**: Manages money transfers and top-ups.
- **plan**: Manages subscription plans and stores historical rate data.
- **report**: Provides reporting features for admins.
- **setting**: Defines data constraints and global settings.
- **source**: Manages user fund sources.
- **ticket**: Handles deposit tickets.
- **user**: Manages user authentication, profiles, and avatars.

## `/supabase` - Supabase Deployment Platform

- **functions**: Deno-based Supabase Edge Functions (e.g., account deletion, push notifications).
- **migrations**: SQL migration files for managing database schema.

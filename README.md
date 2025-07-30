# Fastify-Drizzle-BE

## To run project

1. Clone the repository
2. Install dependencies
3. Set up environment variables based on EnvSchema
4. Run migrations with command npm run db:migration:run
5. Run docker-compose with command npm run local:env
6. Start the server with command npm run local
7. To open drizzle.studio use command npm run db:migration:studio

# Project structure

```
src/
├── api/                                      # API module
│   ├── api.ts                                # Server setup
│   ├── errors/                               # Error handling
│   ├── hooks/                                # Route hooks
│   ├── plugins/                              # Fastify plugins
│   └── routes/                               # API routes
│       ├── autohooks.ts                      # Hooks for automatic execution
│       ├── entity/                           # Group of routes for entities
│       │   ├── :entityId/                    # Dynamic routes with entityId parameter
│       │   │   └── entity-id.route.ts        # Operations with a specific entity
│       │   └── entities.route.ts             # General operations with entities
│       └── schemas/                          # Validation schemas for routes
│           ├── CreateEntityReqSchema.ts      # Schema for creating an entity
│           ├── GetEntityByIdRespSchema.ts    # Schema for getting an entity
│           └── UpdateEntityReqSchema.ts      # Schema for updating an entity
├── consumers/                                # Message queue consumers
├── controllers/                              # Controllers
│   ├── entity/                               # Entity controllers
│   │   ├── create-entity.ts                  # Create entity
│   │   ├── update-entity.ts                  # Update entity
│   │   ├── delete-entity.ts                  # Delete entity
│   │   ├── get-entity-by-id.ts               # Get entity by ID
│   │   └── get-entities.ts                   # Get entities
├── lambdas/                                  # Lambda functions
├── services/                                 # Services
│   ├── aws/                                  # AWS integrations
│   │   ├── cognito/                          # Authentication
│   │   ├── kms/                              # Encryption
│   │   ├── s3/                               # File storage
│   │   └── sqs/                              # Message queues
│   ├── drizzle/                              # Database
│   ├── env/                                  # Environment configuration
│   ├── sendgrid/                             # Email service
│   └── uuid/                                 # ID generation
├── repos/                                    # Database repositories
├── types/                                    # TypeScript types
```
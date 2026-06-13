# billd — Entity Relationship Diagram

> Living document — updated in any story branch that changes models, so the diagram diff rides in the same PR as the migration. Money is **integer cents** everywhere (`amountCents Int`).

```mermaid
erDiagram
    USER ||--o{ CATEGORY : owns
    USER ||--o{ EXPENSE : owns
    USER ||--o{ BUDGET : sets
    CATEGORY ||--o{ EXPENSE : classifies
    CATEGORY ||--o{ BUDGET : limits
    USER {
        string id PK
        string email UK
        string name
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }
    CATEGORY {
        string id PK
        string userId FK
        string name "unique per user"
        string color "token: sapphire|seaweed|amethyst|lavender"
        int sortOrder
        datetime createdAt
        datetime updatedAt
    }
    EXPENSE {
        string id PK
        string userId FK
        string categoryId FK
        int amountCents
        string description
        date date
        datetime createdAt
        datetime updatedAt
    }
    BUDGET {
        string id PK
        string userId FK
        string categoryId FK
        int amountCents
        string timespan "monthly|yearly"
        datetime createdAt
        datetime updatedAt
    }
    %% unique: BUDGET(userId, categoryId, timespan)
    %% S6.1 adds RECURRING_TEMPLATE + POSTING_LEDGER
```

## Conventions
- All money columns are `Int` named `*Cents`.
- Every entity is user-scoped (`userId` FK); deletes cascade from `User`.
- `Category` is created in S1.2 (seeded at signup); CRUD/UI is S3.1.

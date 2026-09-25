# Database Schema Documentation - EduRights

## Overview of Collections

| Collection | Model File | Purpose |
| :--- | :--- | :--- |
| `users` | `models/User.js` | User identity, credentials, language preference, and role (`child`, `admin`). |
| `modules` | `models/Module.js` | Topic-based educational modules (stories, intro, key points). |
| `levels` | `models/Level.js` | Sequential levels per module with unlock criteria. |
| `quizzes` | `models/Quiz.js` | Level-specific quizzes containing 5–9 questions. |
| `quizattempts` | `models/QuizAttempt.js` | Audit trail of every quiz submission and answer given. |
| `progress` | `models/Progress.js` | User's active learning state, completed levels, and module scores. |
| `badges` | `models/Badge.js` | Global achievement badge rules and asset paths. |
| `userbadges` | `models/UserBadge.js` | User earned badge history. |
| `knowledgecontents` | `models/KnowledgeContent.js` | Articles, FAQs, and real-world case examples in Knowledge Hub. |
| `feedback` | `models/Feedback.js` | User ratings and module feedback. |

## Relationship Diagram

```text
User
 ├── Progress ──── Module
 │                  └── Levels ──── Quiz ──── Questions
 ├── QuizAttempt ─ Quiz
 └── UserBadge ─── Badge

Derived:
Leaderboard <── Progress.aggregate()
```

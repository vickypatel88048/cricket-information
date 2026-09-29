# AutoExam — AI Exam Automation

## Current MVP
- Teacher authentication and JWT-protected APIs
- MongoDB-backed question bank
- Test creation APIs
- AI question generation endpoint: `POST /api/ai/generate`
- Optional OpenAI integration using `OPENAI_API_KEY`
- Demo question generator works without an AI key
- Optional PDF upload field supported by the API (10 MB limit)

## AI endpoint
Send multipart/form-data with:
- `topic`: subject/topic
- `count`: 1–50
- `notes`: source notes/context
- `file`: optional uploaded source file

Authorization: `Bearer <JWT>`

The endpoint stores generated questions in MongoDB for the authenticated teacher.

## Environment
Copy `server/.env.example` to `server/.env` and configure MongoDB, JWT secret, and optionally OpenAI.

## Roadmap
1. PDF text extraction and source-aware question generation
2. Teacher UI connected to the API
3. Test builder and student attempt flow
4. Result/leaderboard analytics
5. Telegram delivery
6. Subscription billing

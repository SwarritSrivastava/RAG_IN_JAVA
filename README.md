# 📚 RAG in Java (Spring Boot + pgVector + Gemini)

This project implements a **Retrieval-Augmented Generation (RAG)** system using **Spring Boot** for the backend, **pgVector** for vector storage in PostgreSQL, and **Gemini (Google AI)** as the LLM.  
The frontend (React + TypeScript) was generated with AI assistance — I am still learning frontend development.

---

## ✨ Features
- 📄 Document ingestion via REST API (`/documents/upload`)
- 🧩 Automatic text splitting into chunks for embeddings
- 🔎 Embedding generation using `text-embedding-nomic-embed-text-v2-moe`
- 🗄️ Vector storage with PostgreSQL + pgVector
- 🤖 RAG pipeline using Gemini 2.5 Flash
- 🌍 Simple React frontend to upload docs and query AI

---

## ⚙️ Tech Stack
### Backend
- **Java 21 + Spring Boot**
- **Spring AI**
- **PostgreSQL + pgVector**
- **Gemini API (Google AI Studio / Generative Language API)**

### Frontend
- **React (TypeScript)**
- **TailwindCSS**
- **Axios** for API calls

---

## 📦 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/SwarritSrivastava/RAG_IN_JAVA.git
cd RAG_IN_JAVA

-- inside PostgreSQL
CREATE DATABASE rag_demo;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE rag_demo TO myuser;

-- enable pgvector extension
\c rag_demo
CREATE EXTENSION vector;
```
## application.properties
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/rag_demo
spring.datasource.username=myuser
spring.datasource.password=mypassword

spring.ai.openai.base-url=http://127.0.0.1:1234
spring.ai.openai.api-key=

spring.ai.openai.embedding.options.model=text-embedding-nomic-embed-text-v2-moe
spring.ai.openai.embedding.options.dimensions=768

spring.ai.openai.chat.base-url=https://generativelanguage.googleapis.com/v1beta/openai/
spring.ai.openai.chat.api-key=YOUR_GEMINI_API_KEY
spring.ai.openai.chat.options.model=gemini-2.5-flash

spring.ai.vectorstore.pgvector.index-type=HNSW
spring.ai.vectorstore.pgvector.distance-type=COSINE_DISTANCE
spring.ai.vectorstore.pgvector.dimensions=768
spring.ai.vectorstore.pgvector.table-name=vector_store
```

## Run Backend
```bash
./mvnw spring-boot:run
```
## Run Embedding model in LM Studio or any other platform

## Run Frontend 
```bash
cd rag-frontend
npm install
npm run dev
```

## Usage

# upload
```bash
curl -X POST http://localhost:8080/documents/upload \
  -F "file=@/path/to/document.pdf"
```

# Ask query
```bash
curl -X POST http://localhost:8080/ai/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "Summarize problem statements"}'
```

# Example Response
```bash
{
  "answer": "There are two problem statements identified in the Smart India Hackathon..."
}
```

## 📌 Notes

Backend: fully hand-written (Spring Boot + pgVector + Gemini integration)

Frontend: AI-assisted (React + TS, basic UI)

Still learning frontend — contributions/suggestions are welcome!

Made with lack of Sleep by SwaritSrivastava

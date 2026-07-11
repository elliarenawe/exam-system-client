# Regression Test Report

**Site:** https://elliarenawe.github.io/exam-system-client/  
**Date:** 2026-07-11  
**Method:** Fresh localStorage + live browser flows

## Seeding

| Test | Result |
|------|--------|
| Demo users seeded on first visit | ✅ teacher@demo.com, student@demo.com |
| Demo exam seeded when teacher loads | ✅ JavaScript Basics (2 questions) |
| Seed skipped when data exists | ✅ |

## Public Pages

| Test | Result |
|------|--------|
| Home shows name, GitHub, Deploy links | ✅ |
| Login / Register links work | ✅ |
| Register new student → redirect login | ✅ |
| Login teacher → teacher dashboard | ✅ |
| Login student → student dashboard | ✅ |
| Logout → home page | ✅ |

## Teacher Flows

| Test | Result |
|------|--------|
| List own exams | ✅ |
| Open exam details (ID, code, category, duration) | ✅ |
| View questions with correct answers marked | ✅ |
| Create new exam → redirect to exam page | ✅ |
| View student results after submission | ✅ Demo Student 100% |
| Auth: student URL redirects teacher | ✅ |

## Student Flows

| Test | Result |
|------|--------|
| Available exams list | ✅ |
| Search by name | ✅ |
| Search by code | ❌ → **fixed** (case mismatch bug) |
| Take exam + timer | ✅ |
| Submit + immediate score | ✅ 100% |
| Answer review after submit | ✅ |
| History + average on dashboard | ✅ avg 100%, 1 exam |

## Bug Fixed

**Search by exam code** – `searchExams()` compared lowercased query to uppercased code incorrectly. Fixed in `ExamService.js`.

## Commit Workflow (simulated)

1. `fix: correct exam code search case comparison` – bugfix commit
2. `docs: add regression test report` – this file

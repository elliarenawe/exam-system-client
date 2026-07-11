# Regression Test Report

**Site:** https://elliarenawe.github.io/exam-system-client/  
**Date:** 2026-07-11 (full regression)  
**Method:** Fresh localStorage + live browser flows

## Seeding

| Test | Result |
|------|--------|
| Demo users seeded on first visit | ✅ teacher@demo.com, student@demo.com |
| Demo exam seeded when teacher loads | ✅ JavaScript Basics (2 questions, easy + medium) |
| Seed skipped when data exists | ✅ |

## Public Pages

| Test | Result |
|------|--------|
| Home shows name, ת.ז, GitHub, Deploy links | ✅ 214298200 |
| Login / Register links work | ✅ |
| Register new student → redirect login | ✅ regtest2026@test.com |
| Login teacher → teacher dashboard | ✅ |
| Login student → student dashboard | ✅ |
| Logout → home page | ✅ |

## Teacher Flows

| Test | Result |
|------|--------|
| List own exams | ✅ |
| Open exam details (ID, code, category, duration) | ✅ |
| View questions with difficulty + correct answers | ✅ קל / בינוני |
| Add question with difficulty selector | ✅ |
| Create new exam | ✅ (previous runs) |
| View student results after submission | ✅ Demo Student 100% |
| Auth: student URL redirects teacher | ✅ |

## Student Flows

| Test | Result |
|------|--------|
| Available exams list | ✅ |
| Search by name | ✅ |
| Search by code | ✅ 5SLQ01 |
| Filter by category | ✅ Web Dev |
| Filter by difficulty | ✅ easy=1, hard=0 |
| Clear filters | ✅ |
| Take exam + timer | ✅ |
| Submit + immediate score | ✅ 100% |
| Answer review after submit | ✅ with difficulty badges |
| History + average on dashboard | ✅ avg 100%, 1 exam |

## Bonus Features

| Test | Result |
|------|--------|
| Dark mode toggle | ✅ persists in localStorage |
| Category filter dropdown | ✅ auto-populated |
| Difficulty filter dropdown | ✅ easy / medium / hard |
| Question difficulty on take-exam | ✅ |

## Bug Fixed This Run

**Home page nav** – `home.js` did not call `renderNav()`, so dark mode toggle was missing on the home page. Fixed.

## Summary

**All flows passing** — ready for submission.

## GTD-Inspired Task Manager PRD

### 1. Product Summary & Background

#### 1.1 Problem Statement

#### 1.2 Target Users & Context

#### 1.3 Why Existing Tools Fall Short

#### 1.4 Proposed Solution (High-Level)

#### 1.5 GTD Inspiration and Adaptation (Lightweight Approach)

### 2. Goals and Non-Goals

#### 2.1 Primary Product Goals (v1)

#### 2.2 Secondary / Nice-to-Have Goals

#### 2.3 Non-Goals and Explicit Exclusions for v1

### 3. User Personas & Key Use Cases

#### 3.1 Persona A: Busy Knowledge Worker

##### 3.1.1 Goals and Pain Points

##### 3.1.2 Typical Work Patterns

#### 3.2 Persona B: Student / Maker

##### 3.2.1 Goals and Pain Points

##### 3.2.2 Typical Work Patterns

#### 3.3 Core Use Cases (Across Personas)

##### 3.3.1 Capture Tasks and Ideas

##### 3.3.2 Clarify and Decide Next Actions

##### 3.3.3 Organize into Projects and Contexts

##### 3.3.4 Execute from Context-Based Views

### 4. User Journeys / Flows

#### 4.1 End-to-End Lifecycle Overview

#### 4.2 Capture Flow

##### 4.2.1 Trigger and Entry Points (Inbox, Quick Add)

##### 4.2.2 Minimal Fields and Defaults

#### 4.3 Clarify Flow

##### 4.3.1 Turning Captured Items into Actions or Projects

##### 4.3.2 Handling Reference Material and Trash

##### 4.3.3 Constraints on Actionable Items

#### 4.4 Organize Flow

##### 4.4.1 Assigning Projects and Contexts

##### 4.4.2 Navigating Projects and Their Actions

##### 4.4.3 Viewing Actions by Context

#### 4.5 Execute Flow

##### 4.5.1 Context-Centric Views

##### 4.5.2 Simple Filters (time, energy, due date)

##### 4.5.3 Completing Actions

#### 4.6 Flow Diagram

##### 4.6.1 Mermaid Diagram: Item Lifecycle from Capture to Completion

### 5. Functional Requirements

#### 5.1 Capture

##### 5.1.1 Inbox and Quick Add

##### 5.1.2 Required and Optional Fields

##### 5.1.3 Testable Requirements (Numbered List)

#### 5.2 Clarify

##### 5.2.1 Rules for Converting Captured Items

##### 5.2.2 Handling Non-Actionable Items (Reference, Someday, Trash)

##### 5.2.3 Testable Requirements (Numbered List)

#### 5.3 Organize

##### 5.3.1 Projects and Their Structure

##### 5.3.2 Linking Actions to Projects and Contexts

##### 5.3.3 Navigation and Views (By Project, By Context)

##### 5.3.4 Testable Requirements (Numbered List)

#### 5.4 Execute

##### 5.4.1 Context Views (e.g., “At Computer”, “Errands”)

##### 5.4.2 Filters and Sorting (Due Date, Time/Energy, Status)

##### 5.4.3 Marking Actions Done and Feedback

##### 5.4.4 Testable Requirements (Numbered List)

#### 5.5 Account & Session Basics (Single-User)

##### 5.5.1 Sign Up / Sign In / Sign Out

##### 5.5.2 Basic Profile / Settings (if any in v1)

##### 5.5.3 Testable Requirements (Numbered List)

### 6. Data Model & Domain Concepts

#### 6.1 Conceptual Domain Model Overview

#### 6.2 Entity: Captured Item

##### 6.2.1 Definition and Purpose

##### 6.2.2 Key Attributes

#### 6.3 Entity: Action

##### 6.3.1 Definition and Purpose

##### 6.3.2 Key Attributes

#### 6.4 Entity: Project

##### 6.4.1 Definition and Purpose

##### 6.4.2 Key Attributes

#### 6.5 Entity: Context

##### 6.5.1 Definition and Purpose

##### 6.5.2 Key Attributes

#### 6.6 Relationships Between Entities

##### 6.6.1 Captured Item → Action / Project / Reference / Trash

##### 6.6.2 Projects ↔ Actions

##### 6.6.3 Actions ↔ Contexts

#### 6.7 Implementation View (High-Level, Tech-Agnostic)

##### 6.7.1 Likely Storage Structures

##### 6.7.2 IDs and Linking Strategy

### 7. Non-Functional Requirements

#### 7.1 UX Principles

##### 7.1.1 Low-Friction Capture

##### 7.1.2 Clarity Over Configuration

##### 7.1.3 Sensible Defaults and Minimal Cognitive Load

#### 7.2 Performance & Scalability (Single-User SaaS)

##### 7.2.1 Expected Data Volumes and Response Times

##### 7.2.2 Offline / Latency Considerations (if any)

#### 7.3 Security & Privacy

##### 7.3.1 Authentication and Session Management (High-Level)

##### 7.3.2 Data Protection and Privacy Baselines

#### 7.4 Reliability & Availability

##### 7.4.1 Data Durability Expectations

##### 7.4.2 Error Handling Principles

### 8. Out of Scope & Future Considerations

#### 8.1 Out-of-Scope for v1

##### 8.1.1 Team Collaboration and Shared Workspaces

##### 8.1.2 Calendar and Email Integrations

##### 8.1.3 Full GTD Review System (Weekly, Horizons of Focus, etc.)

##### 8.1.4 Advanced Automations and Integrations

#### 8.2 Future Iterations / Roadmap Ideas

##### 8.2.1 Enhanced Review Workflows

##### 8.2.2 Integrations (Calendar, Email, Notes Tools)

##### 8.2.3 Mobile Apps and Cross-Device Sync Enhancements

#### 8.3 Open Questions and Assumptions


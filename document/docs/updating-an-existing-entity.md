---
sidebar_position: 12
---

# Updating an Existing Entity

In a real-world application, business requirements evolve. This guide provides a step-by-step process to safely add a new property to an existing entity in the Student Manager System project. The process ensures consistency across the backend, frontend, and database schema.

# Use Case Example

Let’s assume we want to add a new property called `dateOfBirth` (type: `Date`) to the Student entity.

## Backend – Update NestJS Entity & DTOs

### Step 1: Update the Schema (Mongoose)

File: `server/src/student/schemas/student.schema.ts`

```ts title=ts
@Schema()
export class Student {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    dateOfBirth: Date; // ✅ New Property
}
```

### Step 2: Update DTOs

File: `server/src/student/dtos/student.dto.ts`

```ts title=ts
export class CreateStudentDto {
    name: string;
    email: string;

    @IsDateString()
    dateOfBirth: string; // ✅ New Property
}
```

File: `server/src/student/interfaces/student.interface.ts`

```ts title=ts
export interface Student extends Document  {
    name?: string;
  email?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // ✅ New Property
}
```

### Step 3: Update Service Logic (if needed)

File: `student.service.ts`

Ensure that the new field is accepted and saved to the database.

## Frontend – Update React Interface & Forms

### Step 1: Update TypeScript Interface

File: `client/src/components/mainInformation/students/models/student.ts`

```ts title=ts
export interface Student {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string; // ✅ New Property
}
```

### Step 2: Update Form UI

File: `StudentForm.tsx`

```tsx title=tsx
<label htmlFor="dateOfBirth">Date of Birth</label>
<input
  type="date"
  id="dateOfBirth"
  name="dateOfBirth"
  value={form.dateOfBirth}
  onChange={handleChange}
/>
```

### Step 3: Update API Calls

Ensure the new field is included in POST or PUT request bodies:

```ts title=ts
await axios.post("/api/students", {
    name,
    email,
    dateOfBirth, // ✅ New Property
});
```

## Test the Feature

-   Create a new student via the UI or API and verify that `dateOfBirth` is saved correctly.

-   Check database (MongoDB Atlas or Compass) for the new field.

-   Update existing data if necessary with migration scripts or manual edits.

## Optional: Handle Backward Compatibility

-   If some students don't have the `dateOfBirth` field yet, ensure your app:

    -   Uses default values or optional chaining (`student?.dateOfBirth`)

    -   Does not break UI if the field is missing.

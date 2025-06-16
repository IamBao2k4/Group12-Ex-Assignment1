---
sidebar_position: 13
---

# Data Validation

Data validation is a critical part of the Student Manager System to ensure that user input and API data are correct, complete, and secure before being processed or stored. This section outlines how **data validation** is implemented in both the **backend (NestJS)** and **frontend (React + TypeScript)**.

## Backend Validation (NestJS + class-validator)

The backend uses the **class-validator** and **class-transformer** packages for validating incoming request data via **DTOs (Data Transfer Objects)**.

### Validation with DTOs

Each entity has a corresponding `Create` and `Update` DTO that contains validation rules via decorators.

**Example** – student.dto.ts

```ts title=ts
import { IsEmail, IsNotEmpty, IsString, IsDateString } from "class-validator";

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsDateString()
    dateOfBirth: string;
}
```

**Explanation of Validators:**
| Decorator | Purpose |
|------------------|----------------------------------------------|
| `@IsNotEmpty()` | Ensures field is not empty |
| `@IsEmail()` | Ensures field is a valid email |
| `@IsString()` | Ensures field is of type string |
| `@IsDateString()`| Ensures field follows ISO date format |

### How It Works

NestJS pipes (`ValidationPipe`) automatically validate incoming requests. If validation fails, a 400 error with detailed messages is returned.

Example:

```json title=json
{
    "statusCode": 400,
    "message": ["email must be an email", "name should not be empty"],
    "error": "Bad Request"
}
```

### Enable Global Validation Pipe

File: `main.ts`

```ts title=ts
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    );
    await app.listen(3000);
}
```

-   `whitelist`: strips out unrecognized properties.

-   `forbidNonWhitelisted`: throws an error if unknown fields are submitted.

## Frontend Validation (React + TypeScript)

Frontend validation is implemented to enhance user experience and reduce invalid server requests. It includes **form-level** validation and **real-time feedback**.

### HTML5 Form Validation

Basic attributes like `required`, `type`, and `pattern` are used for instant browser-level checks.

```tsx title=tsx
<input type="email" name="email" required />
```

### Validation Libraries (Optional)

Libraries like `Yup` + `Formik` or `React Hook Form` can be used for advanced validation with custom rules and error handling.

Example using React Hook Form + Yup:

```tsx title=tsx
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required(),
});

const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm({
    resolver: yupResolver(schema),
});
```

### Display Validation Errors

Show clear error messages to users when input is invalid.

```tsx title=tsx
{
    errors.email && <p className="text-red-500">{errors.email.message}</p>;
}
```

## Security Considerations

-   Never trust client-side validation alone – **always validate data again on the server**.

-   Use `forbidNonWhitelisted: true` to prevent injection of unexpected fields.

-   Sanitize data if it’s rendered as HTML to prevent XSS attacks.

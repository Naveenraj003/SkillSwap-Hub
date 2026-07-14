import * as React from "react";
import { useForm } from "react-hook-form";
import type { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode?: AuthMode;
}

interface AuthShellProps {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

function AuthForm({ mode = "login" }: AuthFormProps) {
  return mode === "register" ? <RegisterForm /> : <LoginForm />;
}

function AuthShell({ title, description, footer, children }: AuthShellProps) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          SkillSwap Hub
        </p>
      </div>

      <section className="rounded-lg border border-slate-200/80 bg-white/95 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="space-y-2 px-6 pb-4 pt-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        <div className="space-y-5 px-6 pb-6">{children}</div>

        {footer}
      </section>
    </div>
  );
}

function EmailField<TFieldValues extends FieldValues>({
  registration,
  errorMessage,
}: {
  registration: UseFormRegister<TFieldValues>;
  errorMessage?: string;
}) {
  const errorId = errorMessage ? "email-error" : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium text-slate-900">
        Email address
      </label>
      <div className="relative">
        <Mail
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorId}
          className="h-11 pl-10"
          {...registration("email" as FieldPath<TFieldValues>)}
        />
      </div>
      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function PasswordField<TFieldValues extends FieldValues>({
  registration,
  errorMessage,
  showPassword,
  onTogglePassword,
  inputId,
  label,
  autoComplete,
}: {
  registration: UseFormRegister<TFieldValues>;
  errorMessage?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  inputId: FieldPath<TFieldValues>;
  label: string;
  autoComplete: string;
}) {
  const errorId = errorMessage ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-900">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <Input
          id={inputId}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="Enter your password"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorId}
          className="h-11 pr-24 pl-10"
          {...registration(inputId)}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          aria-pressed={showPassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:text-slate-900"
        >
          {showPassword ? (
            <EyeOff className="mr-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="mr-1 h-4 w-4" aria-hidden="true" />
          )}
          <span>{showPassword ? "Hide" : "Show"}</span>
        </button>
      </div>
      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        or
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function GoogleButton() {
  return (
    <Button type="button" variant="outline" className="h-11 w-full" disabled>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M12.545 10.239v3.821h5.445c-.239 1.321-1.759 3.871-5.445 3.871-3.281 0-5.955-2.72-5.955-6.071s2.674-6.071 5.955-6.071c1.867 0 3.121.8 3.841 1.491l2.615-2.519C16.863 2.981 14.915 2 12.545 2 7.506 2 3.45 5.985 3.45 10.86s4.055 8.86 9.095 8.86c5.253 0 8.731-3.7 8.731-8.916 0-.598-.066-1.053-.148-1.505h-8.583Z"
        />
      </svg>
      Continue with Google
    </Button>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.info("Login form submitted", values);
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your skill exchange journey."
      footer={
        <div className="flex justify-center px-6 pb-6 pt-0">
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-slate-950 underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Register
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <EmailField<LoginFormValues>
          registration={register}
          errorMessage={errors.email?.message}
        />

        <PasswordField<LoginFormValues>
          registration={register}
          errorMessage={errors.password?.message}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword((currentValue) => !currentValue)
          }
          inputId="password"
          label="Password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end">
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-slate-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Forgot Password?
          </a>
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>

      <div className="space-y-4 pt-5">
        <Divider />
        <GoogleButton />
      </div>
    </AuthShell>
  );
}

function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    console.info("Register form submitted", values);
  };

  return (
    <AuthShell
      title="Create your account"
      description="Join SkillSwap Hub and start building your exchange network."
      footer={
        <div className="flex justify-center px-6 pb-6 pt-0">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-slate-950 underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Login
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-900">
            Name
          </label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-11"
            {...register("name")}
          />
          {errors.name ? (
            <p id="name-error" className="text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <EmailField<RegisterFormValues>
          registration={register}
          errorMessage={errors.email?.message}
        />

        <PasswordField<RegisterFormValues>
          registration={register}
          errorMessage={errors.password?.message}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword((currentValue) => !currentValue)
          }
          inputId="password"
          label="Password"
          autoComplete="new-password"
        />

        <PasswordField<RegisterFormValues>
          registration={register}
          errorMessage={errors.confirmPassword?.message}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword((currentValue) => !currentValue)
          }
          inputId="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
        />

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>

      <div className="space-y-4 pt-5">
        <Divider />
        <GoogleButton />
      </div>
    </AuthShell>
  );
}

export default AuthForm;

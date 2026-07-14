import AuthForm from "../components/common/AuthForm";

function Register() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-sky-50 px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)]"
        aria-hidden="true"
      />
      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}

export default Register;

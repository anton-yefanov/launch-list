import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <LoginForm
          title={
            <h1 className="text-2xl font-semibold">
              <span className="font-normal">
                Let&#39;s launch your product,
              </span>
              <br /> everywhere!
            </h1>
          }
        />
      </div>
    </div>
  );
}

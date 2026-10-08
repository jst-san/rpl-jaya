import { Eye, EyeClosed, Home } from "lucide-react";
import React, { useContext, useState } from "react";
import { Api } from "../lib/api";
import { UserContext } from "../layouts/RootLayout";
import type { User } from "../types/models";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const api = new Api();

  const updateFormData = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api.post("/api/login", {
      body: JSON.stringify({ ...formData }),
    });

    const { data, errors } = await res.json();

    if (!res.ok && errors) {
      return setFormError(errors);
    }

    await cookieStore.set("access_token", data.access_token);
    setUser(data.user);
    console.log(user);

    setFormData({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white p-12 w-full max-w-md mx-auto grid grid-cols-2 gap-8"
        onSubmit={(e) => handleSubmit(e)}
      >
        <a
          type="button"
          className="absolute top-6 left-6 p-2 rounded text-slate-600 hover:bg-slate-100 active:bg-slate-100 transition-colors"
          href="/"
        >
          <Home />
        </a>
        <div className="w-max col-span-2">
          <h2 className="text-xl font-medium text-blue-500">EDIT</h2>
        </div>
        <div className="relative col-span-2">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            id="tanggal"
            name="tanggal"
            type="email"
            className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
            placeholder="Masukkan email"
            onBlur={(e) => updateFormData({ email: e.target.value })}
            onKeyDown={(e) => {
              e.key == "Enter" &&
                updateFormData({ email: e.currentTarget.value });
            }}
          />
          <hr className="absolute w-full bottom-0 border-slate-300" />
          <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

          <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
            {formError.email}
          </span>
        </div>
        <div className="relative col-span-2">
          <label htmlFor="password" className="">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
              placeholder="Masukkan password"
              onBlur={(e) => updateFormData({ password: e.target.value })}
              onKeyDown={(e) => {
                e.key == "Enter" &&
                  updateFormData({ password: e.currentTarget.value });
              }}
            />
            <button
              type="button"
              className="absolute right-0 top-1/2 text-slate-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
            </button>
            <hr className="absolute w-full bottom-0 border-slate-300" />
            <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />
          </div>

          <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
            {formError.password}
          </span>
        </div>

        {formError.form && (
          <span className="col-span-2 text-slate-600 text-sm">
            {formError.form}
          </span>
        )}
        <button
          type="submit"
          className="mt-6 col-span-2 w-full px-5 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

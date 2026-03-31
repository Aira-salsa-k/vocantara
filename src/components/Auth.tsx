import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email atau password yang Anda masukkan salah.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/email-already-in-use":
        return "Email sudah terdaftar. Silakan login.";
      case "auth/weak-password":
        return "Password terlalu lemah. Minimal 6 karakter.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan login. Coba lagi nanti.";
      case "auth/network-request-failed":
        return "Koneksi jaringan bermasalah. Periksa koneksi internet Anda.";
      default:
        return "Terjadi kesalahan saat otentikasi. Silakan coba lagi.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = authSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const flatErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        email: flatErrors.email?.[0],
        password: flatErrors.password?.[0],
      });
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setErrors({ general: getFriendlyErrorMessage(err.code || "unknown") });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row bg-white shadow-xl border border-gray-200 rounded-xl overflow-hidden items-stretch lg:items-center">
        {/* Gambar */}
        <div className="lg:flex-1 flex items-center justify-center md:mt-10 lg:mt-0 sm:p-0 md:p-2 lg:pl-10">
          <img
            src="/b-vocantara.jpg"
            alt="Robot Illustration"
            className="
          w-full
          max-w-[100%] sm:max-w-[100%] md:max-w-[90%] lg:max-w-[100%]
          h-auto lg:h-full
          object-cover
          rounded-xl
        "
          />
        </div>

        {/* Form Login */}
        <div className="lg:flex-1 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-center text-2xl font-bold text-indigo-900 mb-8">
            {isLogin ? "Sign in to your account" : "Buat akun baru"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className={`w-full px-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                      general: undefined,
                    }));
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className={`w-full px-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                      general: undefined,
                    }));
                  }}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 active:scale-[0.98]"
            >
              {isLogin ? "Login" : "Buat Akun"}
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-3">
            {isLogin && (
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Lupa password?
              </button>
            )}
            <button
              className="text-gray-500 hover:text-indigo-700 text-sm font-medium transition"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
            >
              {isLogin
                ? "Belum punya akun? Daftar sekarang"
                : "Sudah punya akun? Login di sini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

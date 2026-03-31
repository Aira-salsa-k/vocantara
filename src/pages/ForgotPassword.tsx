import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { z } from "zod";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

// Validasi Zod
const resetSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validasi dengan Zod
    const validationResult = resetSchema.safeParse({ email });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      // Karena Firebase secara default mengaktifkan "Email Enumeration Protection" (pelindungan pembacaan data email),
      // metode fetchSignInMethodsForEmail akan selalu return [] array kosong.
      // Jadi kita harus langsung memanggil sendPasswordResetEmail.
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.code === "auth/user-not-found") {
        setError("Email ini belum terdaftar di sistem kami.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak permintaan. Silakan coba lagi nanti.");
      } else {
        setError("Terjadi kesalahan sistem. Coba beberapa saat lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center sm:text-left">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">
            Lupa Password?
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Jangan khawatir! Masukkan alamat email yang tertaut dengan akun Anda
            dan kami akan mengirimkan instruksi untuk mereset password.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-fade-in-up">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <MailCheck size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Email Terkirim!
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Silakan periksa kotak masuk (atau folder spam) email{" "}
              <strong className="text-gray-700">{email}</strong> untuk mengatur
              ulang password Anda.
            </p>
            <Link
              to="/login"
              className="mt-4 w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 text-center"
            >
              Kembali ke Halaman Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 border ${
                  error
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow`}
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium animate-fade-in-up">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-indigo-900 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Kirim Link Reset"
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-700 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Kembali ke halaman utama
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

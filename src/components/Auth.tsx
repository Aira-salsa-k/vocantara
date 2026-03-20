// import React, { useState } from 'react';
// import { auth } from '../firebase';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut
// } from 'firebase/auth';

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       setError('');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       setError('');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {error && <p className="error">{error}</p>}
//         <button onClick={handleSignUp}>Sign Up</button>
//         <button onClick={handleSignIn}>Sign In</button>
//         <button onClick={handleSignOut}>Sign Out</button>
//       </form>
//     </div>
//   );
// };

// export default Auth;

import React from "react";
import { useState } from "react";
import { auth } from "../firebase";
// First install react-router-dom:
// npm install react-router-dom @types/react-router-dom
import { useNavigate } from "react-router-dom";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";

export const AuthForm = () => {
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isLogin) {
				console.log("Attempting to sign in with:", email);
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				console.log("Sign in successful:", userCredential.user);
				navigate("/");
			} else {
				await createUserWithEmailAndPassword(auth, email, password);
				navigate("/");
			}
		} catch (err) {
			console.error("Authentication error:", err);
			if (err instanceof Error) {
				setError(err.message);
			} else if (typeof err === "object" && err !== null && "code" in err) {
				const firebaseError = err as { code: string; message: string };
				setError(firebaseError.message);
			} else {
				setError("An error occurred during authentication");
			}
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

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-4">
							<input
								type="email"
								required
								placeholder="Email address"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<input
								type="password"
								required
								placeholder="Password"
								className="w-full px-4 py-3  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{error && (
							<p className="text-red-500 text-sm text-center">{error}</p>
						)}

						<button
							type="submit"
							className="w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
						>
							{isLogin ? "Login" : "Buat Akun"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<button
							className="text-indigo-600 bg-indigo-50 hover:text-indigo-800 text-sm font-medium transition"
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin
								? "Gak punya akun? daftar"
								: "Sudah Punya akun? Login"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

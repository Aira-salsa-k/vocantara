import { useState } from "react";
import { auth } from "../firebase"; // pastikan path sudah benar
import { signOut } from "firebase/auth"; // jika pakai firebase auth
import React from "react";

export default function UserAvatar() {
	const [showPopup, setShowPopup] = useState(false);

	const handleToggle = () => setShowPopup(!showPopup);
	const handleClose = () => setShowPopup(false);

	// Fungsi sign out
	const handleSignOut = async () => {
		await signOut(auth);
		setShowPopup(false);
	};

	return (
		<>
			{/* Avatar pojok kiri atas */}
			<div className="absolute top-0 left-0 z-50 p-4">
				{auth.currentUser ? (
					<div className="relative">
						<button onClick={handleToggle} className="flex items-center gap-2">
							{/* Avatar */}
							{auth.currentUser.photoURL ? (
								<img
									src={auth.currentUser.photoURL}
									alt="avatar"
									className="w-8 h-8 rounded-full border"
								/>
							) : (
								<div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold ">
									{auth.currentUser.displayName
										? auth.currentUser.displayName[0].toUpperCase()
										: auth.currentUser.email
										? auth.currentUser.email[0].toUpperCase()
										: "U"}
								</div>
							)}

							{/* Nama hanya muncul di desktop */}
							<span className="hidden sm:inline text-sm font-medium text-gray-700 " >
								{auth.currentUser.displayName || auth.currentUser.email}
							</span>
						</button>

						{/* Popup user info */}
						{showPopup && (
							<>
								{/* Klik di luar untuk tutup */}
								<div
									className="fixed inset-0 z-40 




"
									onClick={handleClose}
								></div>

								<div className="absolute  mt-2 left-0 bg-gray-50 shadow-lg rounded-lg border border-gray-300 p-4 pb-5 z-50 w-52 text-sm">
									<div className="font-semibold text-gray-800 ">
										{auth.currentUser.displayName || "User"}
									</div>
									<div className="text-gray-500 break-all text-sm">
										{auth.currentUser.email}
									</div>
									<div className="flex justify-start mt-4">
										<button
											onClick={handleSignOut}
											className="flex items-center gap-2 text-white bg-gray-800 hover:bg-red-600 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition shadow-md hover:shadow-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-4 h-4 sm:w-5 sm:h-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
												/>
											</svg>
											<span>Sign Out</span>
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				) : (
					<div className="text-sm text-red-500 font-semibold">Belum Login</div>
				)}
			</div>
		</>
	);
}

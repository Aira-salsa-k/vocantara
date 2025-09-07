import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
	Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

const AppLayout = () => {
	const location = useLocation();
	const hideHeaderRoutes = ["/login", "/register"];

	const handleSignOut = () => {
		localStorage.removeItem("token");
		window.location.href = "/login";
	};

	return (
		<div className="min-h-screen w-full flex flex-col">
			{!hideHeaderRoutes.includes(location.pathname) && (
				<Header onSignOut={handleSignOut} />
			)}
			<main className="flex-1 p-4">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</main>
		</div>
	);
};

export default function App() {
	return (
		<Router>
			<AppLayout />
		</Router>
	);
}
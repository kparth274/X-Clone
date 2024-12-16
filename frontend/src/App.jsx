
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/auth/Home/HomePage';
import SignupPage from './pages/auth/Signup/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import NotificationPage from './pages/auth/notifications/NotificationPage';
import ProfilePage from './pages/auth/profile/ProfilePage';

// Importing the Sidebar component
import Sidebar from './components/common/sideBar';
import RightPanel from './components/common/RightPanel';

import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';


function App() {
	const {data: authUser, isloading, error, isError} = useQuery({
		// we use querykey to give a unique name to our query and refer it later
		queryKey: ["authUser"],
		queryFn : async () => {
			try {
				const res = await fetch('/api/auth/me');
				const data = await res.json();
				if (data.error) return null;
				if(!res.ok){
					throw new Error(data.error || 'Something went wrong');
				}
				console.log("Auth user is here!",data);
			} catch (error) {
				throw new Error(error.message);
			}
		},
		retry: false,
	})
	if(isloading) {
		return (<div className='h-screen flex justify-center items-center'>
       <LoadingSpinner size='lg'/>
		</div>)
	}
	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* It is a common component because it is not wrapped with Routes */}
			<Sidebar /> 
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
				<Route path='/signup' element={!authUser ? <SignupPage />: <Navigate to="/" />}  />
				<Route path='/login' element={!authUser ? <LoginPage />: <Navigate to="/" />} />
				<Route path='/notifications' element={authUser ? <NotificationPage />: <Navigate to="/login" />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage />: <Navigate to="/login" />} />
			</Routes>
			<RightPanel/>
			<Toaster />
		</div>
	);
}

export default App;

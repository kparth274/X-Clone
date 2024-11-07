
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/auth/Home/HomePage';
import SignupPage from './pages/auth/Signup/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import NotificationPage from './pages/auth/notifications/NotificationPage';
import ProfilePage from './pages/auth/profile/ProfilePage';

// Importing the Sidebar component
import Sidebar from './components/common/sideBar';
import RightPanel from './components/common/RightPanel';


function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* It is a common component because it is not wrapped with Routes */}
			<Sidebar /> 
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignupPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='/profile/:username' element={<ProfilePage />} />
			</Routes>
			<RightPanel/>
		</div>
	);
}

export default App;

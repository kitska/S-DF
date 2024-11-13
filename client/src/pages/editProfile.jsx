import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';
import UserHandler from '../api/userHandler';
import AuthHandler from '../api/authHandler';
import Header from '../components/header';
import Footer from '../components/footer';
import { FaEdit } from 'react-icons/fa'; // Импортируем иконку

const EditProfilePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState({
		login: '',
		full_name: '',
		profile_picture: null,
	});
	const token = localStorage.getItem('token');
	const userTokenId = decodeToken(token);
	const [previewImage, setPreviewImage] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [email, setEmail] = useState('');
	const [isHovered, setIsHovered] = useState(false); // State to track hover

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await UserHandler.getUserById(id);
				if (userTokenId !== response.data.id) {
					navigate('/error', {
						state: {
							errorCode: 404,
							errorMessage: 'Page not found',
						},
					});
				}
				setProfileData({
					login: response.data.login,
					full_name: response.data.full_name,
					profile_picture: response.data.profile_picture,
				});
				setPreviewImage(`${process.env.REACT_APP_BASE_URL}/${response.data.profile_picture}`);
				setEmail(response.data.email);
			} catch (error) {
				setError('Failed to load profile data.');
			}
		};

		fetchProfileData();
	}, [id]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setProfileData({ ...profileData, [name]: value });
	};

	const handleImageChange = e => {
		const file = e.target.files[0];
		setProfileData({ ...profileData, profile_picture: file });
		setPreviewImage(URL.createObjectURL(file));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		try {
			if (profileData.profile_picture instanceof File) {
				await UserHandler.updateAvatar(profileData.profile_picture, token);
			}

			const userData = {
				login: profileData.login,
				full_name: profileData.full_name,
			};
			const response = await UserHandler.updateUser (id, userData, token);
			if (response.status === 200) {
				setMessage('Profile updated successfully.');
				setTimeout(() => navigate(`/user/${id}`), 2000);
			}
		} catch (error) {
			setError('Failed to update profile. Please try again.');
		}
	};

	const handlePasswordReset = async () => {
		try {
			const response = await AuthHandler.sendPasswordResetLink(email);
			if (response.status === 200) {
				setMessage('Password reset link sent successfully.');
			}
		} catch (error) {
			setError(error.message || 'Failed to send password reset link.');
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-700'>
			<Header />
			<div className='flex items-center justify-center flex-grow'>
				<div className='p-8 bg-gray-800 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl text-center text-white'>Edit Profile</h2>
					{error && <p className='mb-4 text-red-500'>{error}</p>}
					{message && <p className='mb-4 text-green-500'>{message}</p>}
					<form onSubmit={handleSubmit}>
						<div className='relative mb-4'>
							{previewImage && (
								<div
									className='relative flex justify-center'
									onMouseEnter={() => setIsHovered(true)}
									onMouseLeave={() => setIsHovered(false)}
									onClick={() => document.getElementById('fileInput').click()} // Клик по затемненной области открывает выбор файла
								>
									<img
										src={previewImage}
										alt='Profile Preview'
										className={`w-24 h-24 mt-2 rounded-full cursor-pointer transition-all duration-300 ${isHovered ? 'opacity-70' : ''}`}
									/>
									{isHovered && (
										<div className='absolute flex items-center justify-center w-24 h-24 bg-black bg-opacity-50 rounded-full top-2 left-18'>
											<label htmlFor='fileInput' className='text-white cursor-pointer'>
												<FaEdit className='w-8 h-8' />
											</label>
											<input type='file' id='fileInput' accept='image/*' onChange={handleImageChange} className='hidden' />
										</div>
									)}
								</div>
							)}
						</div>
						<div className='mb-4'>
							<label className='block text-gray-300'>Username</label>
							<input type='text' name='login' value={profileData.login} onChange={handleInputChange} className='w-full p-2 text-white bg-gray-600 rounded' required />
						</div>
						<div className='mb-4'>
							<label className='block text-gray-300'>Full Name</label>
							<input
								type='text'
								name='full_name'
								value={profileData.full_name}
								onChange={handleInputChange}
								className='w-full p-2 text-white bg-gray-600 rounded'
								required
							/>
						</div>
						<button type='submit' className='w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600'>
							Update Profile
						</button>
					</form>
					<div className='mt-4'>
						<button onClick={handlePasswordReset} className='w-full py-2 text-white bg-red-500 rounded hover:bg-red-600'>
							Reset Password
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default EditProfilePage;
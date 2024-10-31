import { Link } from 'react-router-dom';

const RegisterPage = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h2 className='mb-4 text-2xl'>Register</h2>
			<form className='flex flex-col'>
				<input type='text' placeholder='Full Name' className='p-2 mb-2 border' />
				<input type='text' placeholder='Email' className='p-2 mb-2 border' />
				<input type='text' placeholder='Login' className='p-2 mb-2 border' />
				<input type='password' placeholder='Password' className='p-2 mb-2 border' />
				<button className='px-4 py-2 bg-blue-500 rounded hover:bg-blue-600'>Register</button>
			</form>
			<p className='mt-4'>
				Already have an account?{' '}
				<Link to='/login' className='text-blue-500'>
					Log in here
				</Link>
			</p>
		</div>
	);
};

export default RegisterPage;

import { Link } from 'react-router-dom';

const LoginPage = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h2 className='mb-4 text-2xl'>Login</h2>
			<form className='flex flex-col'>
				<input type='text' placeholder='Email or Login' className='p-2 mb-2 border' />
				<input type='password' placeholder='Password' className='p-2 mb-2 border' />
				<button className='px-4 py-2 bg-blue-500 rounded hover:bg-blue-600'>Log In</button>
			</form>
			<p className='mt-4'>
				Don't have an account?{' '}
				<Link to='/register' className='text-blue-500'>
					Register here
				</Link>
			</p>
		</div>
	);
};

export default LoginPage;

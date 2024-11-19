import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ErrorPage from './pages/error';
import PostsPage from './pages/posts';
import UsersPage from './pages/users';
import CategoriesPage from './pages/categories';
import UserProfilePage from './pages/user';
import EditProfilePage from './pages/editProfile';
import PostPage from './pages/post';
import CreatePostPage from './pages/createPost';
import CategoryPostsPage from './pages/categoryPost';
import ScrollToTopButton from './components/UI/scrollToTopButton';
import EmailConfirmPage from './pages/emailConfirm';
import ResetPasswordPage from './pages/passwordReset';
import PasswordResetRequestPage from './pages/passwordResetRequest';
import { marked } from 'marked';
import './styles/main.scss';
import 'highlight.js/styles/github.css';

marked.setOptions({
	gfm: true,
	breaks: true,
	smartLists: true,
	smartypants: true,
	highlight: (code, lang) => {
		if (hljs.getLanguage(lang)) {
			return hljs.highlight(lang, code).value;
		} else {
			return hljs.highlightAuto(code).value;
		}
	},
});

// NavigateToErrorPage will handle the redirection for 404 error
const NavigateToErrorPage = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		navigate('/error', {
			state: {
				errorCode: 404,
				errorMessage: 'Page Not Found',
			},
		});
	}, [navigate]);

	return null;
};

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/posts' element={<PostsPage />} />
				<Route path='/categories' element={<CategoriesPage />} />
				<Route path='/user/:id' element={<UserProfilePage />} />
				<Route path='/user/:id/edit-profile' element={<EditProfilePage />} />
				<Route path='/post/:postId' element={<PostPage />} />
				<Route path='/create-post' element={<CreatePostPage />} />
				<Route path='/category/:categoryId' element={<CategoryPostsPage />} />
				<Route path='/confirm-email/:token' element={<EmailConfirmPage />} />
				<Route path='/reset-password' element={<PasswordResetRequestPage />} />
				<Route path='/reset-password/:token' element={<ResetPasswordPage />} />
				<Route path='/error' element={<ErrorPage />} />
				{/* <Route path='*' element={<NavigateToErrorPage />} /> */}
			</Routes>
			<ScrollToTopButton />
		</Router>
	);
}

export default App;

/* 
	/todo: reset password button in login 
	/todo: edit profile + reset password in profile edit
	/todo: empty comments + posts errors handl
	/todo: markdown in posts
	/todo: new post/edit post/delete post |  post creator | 
	todo: edit/delete comment
	/todo: admin premisions
	todo: filter post/sort post
	todo: sort/comments
	todo: filter users/sort users
	todo: like/dislike posts/comments
	todo: favourites add delete
	todo: search

	? todo: link in post to user profile + in comments
	? todo: category edit/delete/create
*/

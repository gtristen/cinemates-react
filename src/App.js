import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.scss';
import * as assets from './utils/assets-manager';
import * as authService from './services/auth-service';

// pages
import ExplorePage from "./components/pages/ExplorePage/ExplorePage";
import FeedsPage from './components/pages/FeedsPage/FeedsPage';
import SearchPage from "./components/pages/SearchPage/SearchPage";
import NotificationPage from './components/pages/NotificationPage/NotificationPage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import PlaygroundPage from './components/pages/PlaygroundPage/PlaygroundPage';
import Error404Page from './components/pages/Error404Page/Error404Page';
import MoviePage from "./components/pages/MoviePage/MoviePage";

//
import WithMainHeader from './components/reusable/WithMainHeader/WithMainHeader';
import WithoutMainHeader from './components/reusable/WithoutMainHeader/WithoutMainHeader';
import ExplorePageList from './components/reusable/ExplorePageList/ExplorePageList';
import SignUpPage from "./components/pages/SignUpPage/SignUpPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import {useDispatch} from "react-redux";
import {authActions} from './redux/slices/auth-slice'

// init backend
authService.init();

function App() {
    const dispatcher = useDispatch();

    authService.listenAuthStateChanges(async (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            console.log('USER SIGNED IN: ', uid);

            dispatcher(authActions.setIsLogged({isLogged: true}));
            const userData = await authService.getUserData(user.uid);
            dispatcher(authActions.setUserData({userData}));
            // ...
        } else {
            // User is signed out
            // ...
            console.log('USER SIGNED OUT');
            dispatcher(authActions.setIsLogged({isLogged: false}));
            dispatcher(authActions.setUserData({}));

        }
    })

    return (
        <div className={'App'}>
            <Routes>
                <Route path={assets.pathRoot} element={<WithMainHeader />}>
                    <Route index element={<ExplorePage />} />
                    <Route path={assets.pathExplorePage} element={<ExplorePage />} />
                    <Route path={assets.pathFeedsPage} element={ <FeedsPage /> } />
                    <Route path={assets.pathSearchPage} element={<SearchPage />} />

                    <Route path={assets.pathPlayground} element={<PlaygroundPage />} />
                    <Route path={assets.pathTest} element={ <Navigate to={assets.pathPlayground} /> } />
                    <Route path={assets.pathAny} element={<Error404Page />} />
                </Route>

                <Route path={assets.pathRoot} element={<WithoutMainHeader />}>
                    <Route path={assets.pathNotificationPage} element={<NotificationPage />} />
                    <Route path={assets.pathMovieInfoPageWithId} element={<MoviePage />} />
                    <Route path={assets.pathSinUpPage} element={<SignUpPage />} />
                    <Route path={assets.pathLoginPage} element={<LoginPage />} />
                    <Route path={assets.pathProfilePage} element={<ProfilePage />} />
                    <Route path={assets.pathExploreList} element={<ExplorePageList />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;

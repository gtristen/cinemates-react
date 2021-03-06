import styles from './ProfilePage.module.scss';
import HeaderWithBackButton
    from "../../reusable/HeaderWithBackButton/HeaderWithBackButton";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../../redux/slices/auth-slice";
import {useNavigate} from "react-router-dom";
import * as authService from '../../../services/auth-service';
import * as cloudinaryService from '../../../services/cloudinary-service';
import {AdvancedImage} from '@cloudinary/react';
import * as assets from '../../../utils/assets-manager';
// import * as utils from '../../../utils/utils';
import {useState} from "react";
import ActionDialog from "../../reusable/Dialog/ActionDialog/ActionDialog";
import ListButton from '../../reusable/ListButton/ListButton';
import {IconLogout} from '../../../utils/assets-manager';
import {motion} from 'framer-motion';


function ProfilePage(props) {
    const classesHeader = `${styles['header']}`;
    const classesProfilePage = `${styles['profile-page']}`;
    const classesMain = `${styles['profile-page__main']}`;
    const classesUserData = `${styles['profile-page__user-data']}`;
    const classesProfileImage = `${styles['profile-page__profile-image']}`;
    const classesUsername = `${styles['profile-page__profile-username']}`;
    const classesLists = `${styles['profile-page__lists']}`;
    const classesSettings = `${styles['profile-page__settings']}`;
    const classesLabel = `${styles['profile-page__label']}`;

    const userData = useSelector(state => state.authSlice.userData);
    //console.log('user data:',userData);
    const isLogged = useSelector(state => state.authSlice.isLogged);
    //console.log('PROFILE PAGE, user is logged:', isLogged);
    const username = userData?.username ?? '';
    const imageId = userData?.imageId ?? '';
    const profileImage = cloudinaryService.getTransformedImage(imageId) || assets.iconBrokenImage;
    // const email = userData.email;

    const navigate = useNavigate();

    const dispatcher = useDispatch();
    const userIsLogged = useSelector((state) => state.authSlice.isLogged);

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const movieLists = userData?.lists ?? {};


    /////////////////////////////
    // FUNCTIONS
    /////////////////////////////
    function onClickLogoutHandler(ev) {
        ev.preventDefault();
        if (!userIsLogged) return;

        setShowConfirmationDialog(true);
    }

    function onClickPositiveButtonHandler(ev) {
        authService.logout(() => {
            console.log('LOGOUT SUCCESSFUL');
            dispatcher(authActions.setIsLogged({isLogged: false}));
            dispatcher(authActions.setUserData({}));
            navigate('/');
        }, (errorCode, errorMessage) => {
            console.log('LOGOUT FAIL');
            console.log('error code:', errorCode);
            console.log('error message:', errorMessage);
        });
    }

    function onClickNegativeButtonHandler(ev) {
        setShowConfirmationDialog(false);

    }


    /////////////////////////////
    // JSX
    /////////////////////////////
    return (
        <>
            <motion.div className={classesProfilePage}
                        initial="hidden"
                        animate="visible"
                        // exit="hidden"
                        variants={props.variants}
            >
                <HeaderWithBackButton className={classesHeader}
                                      backTo={assets.pathRoot}
                                      title={assets.stringPersonalProfile}/>

                <main className={classesMain}>
                    <section className={classesUserData}>
                        <AdvancedImage className={classesProfileImage}
                                       cldImg={profileImage}
                                       alt={assets.stringAltProfilePicture}/>
                        <p className={classesUsername}>{'@' + username}</p>

                    </section>

                    <section className={classesLists}>
                        <h2 className={`${classesLabel} ${styles['profile-page__label-list']}`}> {assets.stringLists} </h2>

                        <ListButton className={`${styles['profile-page__list-button']}`} 
                                    movies={movieLists.watchlist} listName={'watchlist'} title={'Watchlist'} titleColor={'rgb(255, 0, 0)'}/>
                        <ListButton className={`${styles['profile-page__list-button']}`} 
                                    movies={movieLists.favorites} listName={'favorites'} title={'Favorites'} titleColor={'#fed23f'} />
                        <ListButton className={`${styles['profile-page__list-button']}`} 
                                    movies={movieLists.watched} listName={'watched'} title={'Watched'} titleColor={'rgb(0, 173, 14)'} />
                    </section>
                </main>

                <footer className={classesSettings}>
                    <h2 className={`${classesLabel} ${styles['profile-page__label-settings']}`}> {assets.stringSettings} </h2>
                    <button className={`${styles['profile-page__btn-option']}`}
                            onClick={onClickLogoutHandler}> 
                                <IconLogout />
                                <p>{assets.stringLogout}</p>
                    </button>
                </footer>

            </motion.div>

            {showConfirmationDialog && <ActionDialog buttonNegativeAction={onClickNegativeButtonHandler}
                                                     buttonPositiveAction={onClickPositiveButtonHandler}
                                                     onClickOutside={onClickNegativeButtonHandler}>

                <p>Are you sure you want to logout?</p>

            </ActionDialog>}
        </>

    );

}// ProfilePage

export default ProfilePage;
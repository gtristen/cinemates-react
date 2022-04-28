import styles from './MainNav.module.css';
import * as assets from '../../../utils/assets-manager';
import { NavLink } from 'react-router-dom';
import { ReactComponent as MovieIcon } from '../../reusable/Icons/theaters_white_24dp.svg';
import { ReactComponent as HomeIcon } from '../../reusable/Icons/home_white_24dp.svg';
import { ReactComponent as SearchIcon } from '../../reusable/Icons/search_white_24dp.svg';
import { useSelector, useDispatch } from 'react-redux';
import {currentPageActions} from '../../../redux/slices/curent-page-slice';

function MainNav() {
    let explorePageActive = true;
    let homePageActive = false;
    let searchPageActive = false;

    const currentPage = useSelector((state) => state.currentPageSlice.currentPage);
    const dispatcher = useDispatch();

    switch (currentPage) {
        case 'explore':
            explorePageActive = true;
            homePageActive = false;
            searchPageActive = false;
            break;
        case 'home':
            explorePageActive = false;
            homePageActive = true;
            searchPageActive = false;
            break;
        case 'search':
            explorePageActive = false;
            homePageActive = false;
            searchPageActive = true;
            break;
        default:
            explorePageActive = true;
            homePageActive = false;
            searchPageActive = false;
    }


    // icon color
    let movieIconColor = explorePageActive ?
        assets.colorPrimaryYellow :
        assets.colorPrimaryLightBlue;
    let homeIconColor = homePageActive ?
        assets.colorPrimaryYellow :
        assets.colorPrimaryLightBlue;
    let searchIconColor = searchPageActive ?
        assets.colorPrimaryYellow :
        assets.colorPrimaryLightBlue;


    // button style
    let movieLinkStyle = explorePageActive ?
        `${styles['main-nav__link']} ${styles['main-nav__link--active']}` :
        `${styles['main-nav__link']}`;

    let homeLinkStyle = homePageActive ?
        `${styles['main-nav__link']} ${styles['main-nav__link--active']}` :
        `${styles['main-nav__link']}`;

    let searchLinkStyle = searchPageActive ?
        `${styles['main-nav__link']} ${styles['main-nav__link--active']}` :
        `${styles['main-nav__link']}`;


    function onClickExploreHandler(ev) {
        dispatcher(currentPageActions.setPage({page: assets.pathExplorePage}));
    }

    function onClickHomeHandler(ev) {
        dispatcher(currentPageActions.setPage({page: assets.pathFeedsPage}));
    }

    function onClickSearchHandler(ev) {
        dispatcher(currentPageActions.setPage({page: assets.pathSearchPage}));
    }


    ////////////////////////////
    // JSX
    ////////////////////////////
    return (
        <nav className={styles['main-nav']}>
            <ul className={`${styles['main-nav__list']}`}>
                <li className={`${styles['main-nav__item']}`}>
                    <NavLink className={movieLinkStyle}
                             to={assets.pathExplorePage}
                             onClick={onClickExploreHandler}>
                        <MovieIcon className={styles['main-nav__link-icon']} fill={movieIconColor} />
                    </NavLink>
                </li>

                <li className={`${styles['main-nav__item']}`}>
                    <NavLink className={homeLinkStyle}
                             to={assets.pathFeedsPage}
                             onClick={onClickHomeHandler}>
                        <HomeIcon className={styles['main-nav__link-icon']}  fill={homeIconColor}/>
                    </NavLink>
                </li>

                <li className={`${styles['main-nav__item']}`}>
                    <NavLink className={searchLinkStyle}
                             to={assets.pathSearchPage}
                             onClick={onClickSearchHandler}>
                        <SearchIcon className={styles['main-nav__link-icon']}  fill={searchIconColor}/>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}// MainNav


export default MainNav;
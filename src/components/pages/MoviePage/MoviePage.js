import styles from './MoviePage.module.scss';
import * as assets from '../../../utils/assets-manager';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import HeaderWithBackButton
    from "../../reusable/HeaderWithBackButton/HeaderWithBackButton";
import {fetchCast, fetchMovie} from '../../../services/movie-database-service';
import MoviePoster from "../../reusable/MoviePoster/MoviePoster";
import CastList from "../../reusable/CastList/CastList";
import OptionsDialog from '../../reusable/Dialog/OptionsDialog/OptionsDialog';
import * as userDao from '../../../dao/user-dao';
import {useDispatch, useSelector} from "react-redux";
import {authActions} from '../../../redux/slices/auth-slice';


function MoviePage() {
    const classesMoviePage = `${styles['movie-page']} `;
    const params = useParams();
    const movieId = params.id;
    const [movie, setMovie] = useState({});
    const [cast, setCast] = useState([]);
    const [showDialogList, setShowDialogList] = useState(false);
    const isLogged = useSelector(state => state.authSlice.isLogged);
    const dispatcher = useDispatch()

    let lists = {};
    let listKeys = [];
    let checkedLists = [];
    let selectedLists = new Set();
    const userData = useSelector(state => state.authSlice.userData);
    if (isLogged) {
        // console.log(userData);
        if (Object.keys(userData).length !== 0) {
            lists = userData?.lists ?? {};
            listKeys = Object.keys(userData?.lists) ?? [];

            //
            for (const [listName, movieIds] of Object.entries(lists)) {
                checkedLists.push(movieIds.includes(movieId));
            }

            // console.log(lists);
        }
    }


    ////////////////////////////////////
    // FUNCTIONS
    ////////////////////////////////////
    // fetch movie info
    useEffect(() => {
        (async () => {
            const fetchedMovie = await fetchMovie(movieId);
            const fetchedCast = await fetchCast(movieId);
            setMovie(fetchedMovie);
            setCast(fetchedCast);
        })();
    }, [setMovie, movieId]);

    function onClickAddToListHandler() {
        setShowDialogList(true);
    }

    function onClickOutsideHandler(ev) {
        setShowDialogList(false);
        selectedLists.clear();
    }

    function onClickNegativeButtonHandler(ev) {
        setShowDialogList(false);
        selectedLists.clear();
    }

    function onClickPositiveButtonHandler(ev) {
        let updatedLists = {...lists};
        let updatedUserData = {...userData};

        listKeys.forEach((listName, i) => {
            const listIsChecked = checkedLists[i];
            const updatedList = [...lists[listName]];

            if (listIsChecked) {
                if (!updatedList.includes(movieId)) { // add only if the item is not included
                    updatedList.push(movieId);
                    userDao.addMovieToList(listName, movieId);
                }
            } else {
                if (updatedList.includes(movieId)) { // remove only if the item is included
                    removeAt(updatedList, movieId);
                    userDao.removeMovieFromList(listName, movieId);
                }
            }

            // set the updated list
            updatedLists[listName] = updatedList;
        })

        // update in-memory user data
        updatedUserData.lists = updatedLists;
        dispatcher(authActions.setUserData({userData: updatedUserData}))

        //
        setShowDialogList(false);
    }
    
    function onListCheckHandler(ev, i, isChecked) {
        checkedLists[i] = isChecked;
        console.log('list checked: ', checkedLists);
    }

    function removeAt(array, value) {
        if (array && array.length <= 0) return;
        const index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
    }


    ////////////////////////////////////
    // JSX
    ////////////////////////////////////
    return (
        <div className={classesMoviePage}>
            <HeaderWithBackButton className={`${styles['header']}`}
                                  title={''}/>

            {/******************** MOVIE BACKDROP */}
            <section className={`${styles['movie-page__container-backdrop']}`}>
                <div className={`${styles['movie-page__gradient']}`}></div>
                <img className={`${styles['movie-page__backdrop']}`}
                     src={movie.backdropUrl}
                     alt={movie.title}/>
                <h1 className={`${styles['movie-page__title']}`}>
                    {movie.title}</h1>

                {isLogged &&
                    <button className={styles['movie-page__btn-add-to-list']}
                            type={'button'}
                            onClick={onClickAddToListHandler}>+</button>}

                {showDialogList && <OptionsDialog items={listKeys}
                                                  checkedItems={checkedLists}
                                                  onItemCheck={onListCheckHandler}
                                                  buttonNegativeAction={onClickNegativeButtonHandler}
                                                  buttonPositiveAction={onClickPositiveButtonHandler}
                                                  onClickOutside={onClickOutsideHandler}
                />}

            </section>

            {/******************** MOVIE OVERVIEW */}
            <section className={`${styles['movie-page__container-overview']}`}>
                <div className={`${styles['movie-page__release-date']}`}>
                    {`(${movie.releaseDate?.split('-')[0] || ''})`}</div>

                <p className={`${styles['movie-page__overview']}`}>
                    {movie.overview}</p>
            </section>

            {/******************** MOVIE DETAILS */}
            <section className={`${styles['movie-page__container-details']}`}>
                <MoviePoster className={`${styles['movie-page__poster']}`}
                             posterImageUrl={movie.posterUrl}
                             alt={movie.title}
                             movieTitle={movie.title}/>

                <div className={`${styles['movie-page__container-listing']}`}>
                    <ul className={`${styles['movie-page__listing']}`}>
                        <li className={`${styles['movie-page__list-item']}`}>
                            <h3 className={`${styles['movie-page__list-title']}`}>
                                {assets.stringMovieDuration}</h3>
                            <p className={`${styles['movie-page__list-value']}`}>
                                {movie.duration + 'm'}</p></li>

                        <li className={`${styles['movie-page__list-item']}`}>
                            <h3 className={`${styles['movie-page__list-title']}`}>
                                {assets.stringMovieGenres}</h3>
                            <p className={`${styles['movie-page__list-value']}`}>
                                {movie.genres?.join(', ')}</p></li>

                        <li className={`${styles['movie-page__list-item']}`}>
                            <h3 className={`${styles['movie-page__list-title']}`}>
                                {assets.stringMovieStatus}</h3>
                            <p className={`${styles['movie-page__list-value']}`}>
                                {movie.status}</p></li>
                    </ul>
                </div>

            </section>

            {/******************** CAST */}
            <section className={`${styles['movie-page__container-cast']}`}>
                <h2 className={`${styles['movie-page__cast-title']}`}>Cast</h2>
                <CastList cast={cast}/>
            </section>
        </div>
    );
}// MoviePage

export default MoviePage;
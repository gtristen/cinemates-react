import styles from './ExplorePage.module.css';
import HorizontalMovieList from "./HorizontalMoviesList/HorizontalMovieList";
import {useEffect, useState} from "react";
import {getUpcoming, getPopular, getNowPlaying} from '../../../services/movieDatabaseService';


function ExplorePage() {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);

    useEffect(() => {
        ( async () => {
            const nowPlaying = await getNowPlaying();
            const upcoming = await getUpcoming();
            const popular = await getPopular();

            setNowPlayingMovies(nowPlaying);
            setUpcomingMovies(upcoming);
            setPopularMovies(popular);
        })();

    }, [])

    function buildListProps(title, movies) {
        const props = {
            title,
            movies,
            buttonText: 'See all',
            seeAllUrl: '/explore-list',
            seeAllData: {title}
        }

        return props;
    }


    ////////////////////////////
    // JSX
    ////////////////////////////
    return (
        <div className={`${styles['explore-page']}`}>
            <ul className={`${styles['explore-list']}`}>

                <li className={`${styles['explore-item']}`}>
                    <HorizontalMovieList {...(buildListProps('Now playing', nowPlayingMovies))}/>
                </li>
                <li className={`${styles['explore-item']}`}>
                    <HorizontalMovieList {...(buildListProps('Upcoming', upcomingMovies))}/>
                </li>
                <li className={`${styles['explore-item']}`}>
                    <HorizontalMovieList {...(buildListProps('Popular', popularMovies))}/>
                </li>

            </ul>
        </div>
    );
}

export default ExplorePage;
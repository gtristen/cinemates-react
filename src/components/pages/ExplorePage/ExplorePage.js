import styles from './ExplorePage.module.scss';
import HorizontalMovieList from "./HorizontalMoviesList/HorizontalMovieList";
import {useEffect, useState} from "react";
import {getUpcoming, getPopular, getNowPlaying} from '../../../services/movie-database-service';
import * as assets from '../../../utils/assets-manager';
import {motion} from 'framer-motion';


function ExplorePage(props) {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);


    ////////////////////////////////////
    // FUNCTIONS
    ////////////////////////////////////

    // fetch movies on page mounted
    useEffect(() => {
        ( async () => {
            const [nowPlaying] = await getNowPlaying();
            const [upcoming] = await getUpcoming();
            const [popular] = await getPopular();

            setNowPlayingMovies(nowPlaying);
            setUpcomingMovies(upcoming);
            setPopularMovies(popular);
        })();

    }, [])

    function buildListProps(title, movies) {
        const props = {
            title,
            movies,
            buttonText: assets.stringLabelSeeAll,
            seeAllUrl: assets.pathExploreList,
            seeAllData: {title}
        }

        return props;
    }


    ////////////////////////////////////
    // JSX
    ////////////////////////////////////
    return (
        <motion.div className={`${styles['explore-page']}`}
        initial="hidden"
        animate="visible"
        // exit="hidden"
        variants={props.variants}
        >
            <ul className={`${styles['explore-list']}`}>

                <li className={`${styles['explore-item']}`}>
                    <HorizontalMovieList {...(buildListProps(assets.stringTitleNowPlaying, nowPlayingMovies))}/>
                </li>
                <li className={`${styles['explore-item']}`}>
                    <HorizontalMovieList {...(buildListProps(assets.stringTitleUpcoming, upcomingMovies))}/>
                </li>
                <li className={`${styles['explore-item']}`}>
                    <HorizontalMovieList {...(buildListProps(assets.stringTitlePopular, popularMovies))}/>
                </li>

            </ul>
        </motion.div>
    );
}// ExplorePage

export default ExplorePage;
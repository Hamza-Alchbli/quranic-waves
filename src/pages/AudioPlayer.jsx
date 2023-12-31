import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AnimatedPage from "../components/AnimatedPage";

import AudioLibrary from "../components/AudioLibrary.jsx";
import Surah from "../components/Surah.jsx";
import PLayer from "../components/Player.jsx";
import Loader from "../components/Loader.jsx";

import useLoadingStatus from "../components/hooks/useLoadingStatus.jsx";
import { useSurahs } from "../components/hooks/useSurahs.jsx";

function AudioPlayer({
    setLibraryStatus,
    libraryStatus,
    reciter,
    setReciter,
    currentIndex,
    setCurrentIndex,
}) {
    const { error, loading, setLoading, setError } = useLoadingStatus();

    const {
        surahs,
        currentSurah,
        setCurrentSurah,
        currentSurahAudio,
        setCurrentSurahAudio,
        setLang,
        lang,
    } = useSurahs({ reciter, currentIndex });
    // console.log(currentIndex);

    const [isPlaying, setIsPlaying] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [randomSurah, setRandomSurah] = useState(null);

    const audio = useRef(null);

    const [surahInfo, setSurahInfo] = useState({
        currentTime: 0,
        duration: 0,
        animationPercentage: 0,
    });

    useEffect(() => {
        if (currentSurahAudio) {
            const playAudio = async () => {
                try {
                    if (isPlaying === true) {
                        await audio.current.play();
                        setIsPlaying(true);
                    }
                } catch (err) {
                    console.log(err);
                }
            };

            playAudio();
        }
    }, [currentSurahAudio, audio, isPlaying]);

    const generateRandomIndex = () => {
        const newSurah = Math.floor(Math.random() * 114);
        setRandomSurah(newSurah);
    };
    const generateSurahAudioURL = async (
        index,
        reciter = "mishari_al_afasy"
    ) => {
        try {
            setCurrentSurahAudio(
                `https://download.quranicaudio.com/qdc/${reciter}/murattal/${
                    index + 1
                }.mp3`
            );
            setCurrentSurah(surahs[index]);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch surah audio. Please try again later.");
            setLoading(false);
        }
    };

    const timeUpdateHandler = (e) => {
        const current = e.target.currentTime;
        const duration = e.target.duration;
        //Calculate percentage
        const roundedCurrent = Math.round(current);
        const roundedDuration = Math.round(duration);
        const animation = Math.round((roundedCurrent / roundedDuration) * 100);

        setSurahInfo({
            ...surahInfo,
            currentTime: current,
            duration,
            animationPercentage: animation,
        });
    };

    const surahEndHandler = () => {
        if (shuffle) {
            if (currentSurah.id === 114) {
                currentIndex = -1;
            }
            generateRandomIndex();
            if (randomSurah) {
                generateSurahAudioURL(randomSurah, reciter);
            }
        } else {
            let currentIndex = currentSurah.id - 1;

            if (currentSurah.id === 114) {
                currentIndex = -1;
            }

            generateSurahAudioURL(currentIndex + 1, reciter);
        }
    };
    const playSongHandler = () => {
        if (isPlaying) {
            audio.current.pause();
            setIsPlaying(!isPlaying);
        } else {
            audio.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <AnimatedPage>
            {loading ? (
                <Loader />
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {currentSurah && <Surah {...{ currentSurah, reciter }} />}
                    <PLayer
                        {...{
                            isPlaying,
                            setIsPlaying,
                            generateSurahAudioURL,
                            currentSurah,
                            audio,
                            surahInfo,
                            setSurahInfo,
                            playSongHandler,
                            reciter,
                            setCurrentIndex,
                            shuffle,
                            setShuffle,
                            randomSurah,
                            generateRandomIndex,
                        }}
                    />
                    <AudioLibrary
                        {...{
                            surahs,
                            libraryStatus,
                            generateSurahAudioURL,
                            currentSurah,
                            playSongHandler,
                            isPlaying,
                            reciter,
                            setReciter,
                            setLang,
                            lang,
                            setCurrentIndex,
                            setLibraryStatus,
                            setCurrentSurah,
                        }}
                    ></AudioLibrary>

                    <audio
                        ref={audio}
                        src={currentSurahAudio}
                        onEnded={surahEndHandler}
                        onTimeUpdate={timeUpdateHandler}
                        onLoadedMetadata={timeUpdateHandler}
                    ></audio>
                </>
            )}
        </AnimatedPage>
    );
}
AudioPlayer.propTypes = {
    libraryStatus: PropTypes.bool.isRequired,
    setLibraryStatus: PropTypes.func.isRequired,
    reciter: PropTypes.string.isRequired,
    setReciter: PropTypes.func.isRequired,
    currentIndex: PropTypes.number.isRequired,
    setCurrentIndex: PropTypes.func.isRequired,
};
export default AudioPlayer;

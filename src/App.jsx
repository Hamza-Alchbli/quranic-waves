import { useState, useEffect, useRef } from "react";

import Nav from "./components/Nav.jsx";
import Library from "./components/Library.jsx";
import Surah from "./components/Surah.jsx";
import PLayer from "./components/Player.jsx";

import useLoadingStatus from "./components/hooks/useLoadingStatus.jsx";
import { useSurahs } from "./components/hooks/useSurahs.jsx";

function App() {
    const { error, loading, setLoading, setError } = useLoadingStatus();
    const {
        surahs,
        currentSurah,
        setCurrentSurah,
        currentSurahAudio,
        setCurrentSurahAudio,
    } = useSurahs();

    // error and loading states
    // library and isPlaying states
    const [libraryStatus, setLibraryStatus] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // data states (surahs contains the text data and SurahsAudio contains audio data)
    // curent surah data and audio
    const audio = useRef(null);
    const [reciter, setReciter] = useState("mishari_al_afasy");

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
            if (libraryStatus) {
                setLibraryStatus(!libraryStatus);
            }
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
        let currentIndex = currentSurah.number - 1;

        if (currentSurah.number === 114) {
            currentIndex = -1;
        }

        generateSurahAudioURL(currentIndex + 1, reciter);
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
        <div>
            {loading ? (
                <p>Loading website...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className={`App ${libraryStatus ? "library-active" : ""}`}>
                    <Nav
                        libraryStatus={libraryStatus}
                        setLibraryStatus={setLibraryStatus}
                    />
                    {currentSurah && (
                        <Surah currentSurah={currentSurah} reciter={reciter} />
                    )}
                    <PLayer
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        generateSurahAudioURL={generateSurahAudioURL}
                        currentSurah={currentSurah}
                        audio={audio}
                        surahInfo={surahInfo}
                        setSurahInfo={setSurahInfo}
                        playSongHandler={playSongHandler}
                        reciter={reciter}
                    />
                    <Library
                        surahs={surahs}
                        libraryStatus={libraryStatus}
                        generateSurahAudioURL={generateSurahAudioURL}
                        currentSurah={currentSurah}
                        playSongHandler={playSongHandler}
                        isPlaying={isPlaying}
                        reciter={reciter}
                        setReciter={setReciter}
                    ></Library>
                    <audio
                        ref={audio}
                        src={currentSurahAudio}
                        onEnded={surahEndHandler}
                        onTimeUpdate={timeUpdateHandler}
                        onLoadedMetadata={timeUpdateHandler}
                    ></audio>
                </div>
            )}
        </div>
    );
}

export default App;

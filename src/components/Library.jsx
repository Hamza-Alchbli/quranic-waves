import PropTypes from "prop-types";

import LibrarySurah from "./LibrarySurah.jsx";

function Library({ surahs, libraryStatus, generateSurahAudioURL }) {
    return (
        <div className={`library ${libraryStatus ? "active-library" : ""}`}>
            <h2>Quran Library</h2>
            {surahs.map((surah, index) => {
                return (
                    <LibrarySurah
                        key={surah.name}
                        generateSurahAudioURL={generateSurahAudioURL}
                        surah={surah}
                        index={index}
                    ></LibrarySurah>
                );
            })}
        </div>
    );
}

Library.propTypes = {
    surahs : PropTypes.array.isRequired,
    libraryStatus: PropTypes.bool.isRequired,
    generateSurahAudioURL: PropTypes.func.isRequired
}
export default Library;

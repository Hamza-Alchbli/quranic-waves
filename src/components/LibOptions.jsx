import useAllLang from "./hooks/useAllLang";
import PropTypes from "prop-types";

const LibOptions = ({
    setReciter,
    setLang,
    currentSurah,
    generateSurahAudioURL,
}) => {
    const allLang = useAllLang();

    const handleReciterChange = (event) => {
        setReciter(event.target.value);
        generateSurahAudioURL
            ? generateSurahAudioURL(currentSurah.id - 1, event.target.value)
            : "";
    };

    const handleLangChange = (event) => {
        setLang(event.target.value);
    };

    return (
        <>
            <select onChange={handleReciterChange} id="reciter">
                <option value="mishari_al_afasy" disabled hidden>
                    Choose Reciter || اختيار القارئ
                </option>
                <option value="mishari_al_afasy">
                    Mishary rashid alafasy || مشاري بن راشد العفاسي
                </option>
                <option value="abdul_baset">
                    Abdul Basit Abdul Samad || عبد الباسط عبد الصمد
                </option>
                <option value="siddiq_minshawi">
                    Mohamed Siddiq El-Minshawi || محمد صديق المنشاوي
                </option>
                <option value="khalil_al_husary">
                    Mahmoud Khalil Al-Hussary || محمود خليل الحصري
                </option>
                {/* devider for other type of reciters*/}
                <option value="abdulbaset_warsh">
                    Abdul Basit Abdul Samad warsh || عبد الباسط عبد الصمد (ورش)
                </option>
                <option value="abdurrashid_sufi_soosi_rec">
                    abdurrashid sufi soosi || عبد الرشيد صوفي
                </option>
                <option value="noreen_siddiq">
                    noreen siddiq || نورين صديق
                </option>
            </select>
            {allLang ? (
                <select onChange={handleLangChange} id="lang">
                    {allLang.map((lang, index) => {
                        return (
                            <option
                                key={lang.iso_code + index}
                                value={lang.iso_code}
                            >
                                {lang.name}{" "}
                                {lang.native_name == ""
                                    ? lang.native_name
                                    : `|| ${lang.native_name}`}
                            </option>
                        );
                    })}
                </select>
            ) : (
                ""
            )}
        </>
    );
};
LibOptions.defaultProps = {
    generateSurahAudioURL: null, // Provide a default value (null in this case)
    currentSurah: {},
};
LibOptions.propTypes = {
    setReciter: PropTypes.func.isRequired,
    setLang: PropTypes.func.isRequired,
    generateSurahAudioURL: PropTypes.func,
    currentSurah: PropTypes.object.isRequired,
};
export default LibOptions;

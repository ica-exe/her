/**
 * ====================================================================
 * EXACTLY 100 ENRICHED UNIQUE LANGUAGES OF "I LOVE YOU" DATASET
 * Structured, reusable dataset with pronunciation, origin country,
 * country code, flag emoji, and meaning.
 * ====================================================================
 */

const loveLanguages = [
  {
    language: "Spanish",
    word: "Te amo",
    pronunciation: "/teh AH-moh/",
    originCountry: "Spain",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    meaning: "I love you"
  },
  {
    language: "French",
    word: "Je t'aime",
    pronunciation: "/zhuh TEM/",
    originCountry: "France",
    countryCode: "FR",
    countryFlag: "🇫🇷",
    meaning: "I love you"
  },
  {
    language: "English",
    word: "I love you",
    pronunciation: "/eye luhv yoo/",
    originCountry: "United Kingdom",
    countryCode: "GB",
    countryFlag: "🇬🇧",
    meaning: "I love you"
  },
  {
    language: "German",
    word: "Ich liebe dich",
    pronunciation: "/ikh LEE-buh deekh/",
    originCountry: "Germany",
    countryCode: "DE",
    countryFlag: "🇩🇪",
    meaning: "I love you"
  },
  {
    language: "Italian",
    word: "Ti amo",
    pronunciation: "/tee AH-moh/",
    originCountry: "Italy",
    countryCode: "IT",
    countryFlag: "🇮🇹",
    meaning: "I love you"
  },
  {
    language: "Portuguese",
    word: "Eu te amo",
    pronunciation: "/eh-oo teh AH-moh/",
    originCountry: "Portugal",
    countryCode: "PT",
    countryFlag: "🇵🇹",
    meaning: "I love you"
  },
  {
    language: "Mandarin Chinese",
    word: "我爱你",
    pronunciation: "/wǒ ài nǐ/",
    originCountry: "China",
    countryCode: "CN",
    countryFlag: "🇨🇳",
    meaning: "I love you"
  },
  {
    language: "Japanese",
    word: "愛してる",
    pronunciation: "/aisheteru/",
    originCountry: "Japan",
    countryCode: "JP",
    countryFlag: "🇯🇵",
    meaning: "I love you"
  },
  {
    language: "Korean",
    word: "사랑해",
    pronunciation: "/sa-rang-hae/",
    originCountry: "South Korea",
    countryCode: "KR",
    countryFlag: "🇰🇷",
    meaning: "I love you"
  },
  {
    language: "Russian",
    word: "Я тебя люблю",
    pronunciation: "/ya te-BYA lyub-LYU/",
    originCountry: "Russia",
    countryCode: "RU",
    countryFlag: "🇷🇺",
    meaning: "I love you"
  },
  {
    language: "Arabic",
    word: "أحبك",
    pronunciation: "/u-hib-bu-ki/",
    originCountry: "Saudi Arabia",
    countryCode: "SA",
    countryFlag: "🇸🇦",
    meaning: "I love you"
  },
  {
    language: "Hindi",
    word: "मैं तुमसे प्यार करता हूँ",
    pronunciation: "/main tumse pyaar karta hoon/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Bengali",
    word: "আমি তোমাকে ভালোবাসি",
    pronunciation: "/ami tomake bhalobashi/",
    originCountry: "Bangladesh",
    countryCode: "BD",
    countryFlag: "🇧🇩",
    meaning: "I love you"
  },
  {
    language: "Turkish",
    word: "Seni seviyorum",
    pronunciation: "/se-ni se-vi-yo-rum/",
    originCountry: "Turkey",
    countryCode: "TR",
    countryFlag: "🇹🇷",
    meaning: "I love you"
  },
  {
    language: "Vietnamese",
    word: "Tôi yêu bạn",
    pronunciation: "/toy yew bahn/",
    originCountry: "Vietnam",
    countryCode: "VN",
    countryFlag: "🇻🇳",
    meaning: "I love you"
  },
  {
    language: "Tagalog / Filipino",
    word: "Mahal kita",
    pronunciation: "/mah-HAL kee-TAH/",
    originCountry: "Philippines",
    countryCode: "PH",
    countryFlag: "🇵🇭",
    meaning: "I love you"
  },
  {
    language: "Polish",
    word: "Kocham cię",
    pronunciation: "/KOH-kham chyeh/",
    originCountry: "Poland",
    countryCode: "PL",
    countryFlag: "🇵🇱",
    meaning: "I love you"
  },
  {
    language: "Dutch",
    word: "Ik hou van jou",
    pronunciation: "/ik HOW van yow/",
    originCountry: "Netherlands",
    countryCode: "NL",
    countryFlag: "🇳🇱",
    meaning: "I love you"
  },
  {
    language: "Greek",
    word: "Σ' αγαπώ",
    pronunciation: "/s'ah-gah-POH/",
    originCountry: "Greece",
    countryCode: "GR",
    countryFlag: "🇬🇷",
    meaning: "I love you"
  },
  {
    language: "Swedish",
    word: "Jag älskar dig",
    pronunciation: "/yah EL-skar dey/",
    originCountry: "Sweden",
    countryCode: "SE",
    countryFlag: "🇸🇪",
    meaning: "I love you"
  },
  {
    language: "Ukrainian",
    word: "Я тебе кохаю",
    pronunciation: "/ya te-BE ko-KHA-yu/",
    originCountry: "Ukraine",
    countryCode: "UA",
    countryFlag: "🇺🇦",
    meaning: "I love you"
  },
  {
    language: "Romanian",
    word: "Te iubesc",
    pronunciation: "/teh yoo-BESK/",
    originCountry: "Romania",
    countryCode: "RO",
    countryFlag: "🇷🇴",
    meaning: "I love you"
  },
  {
    language: "Hungarian",
    word: "Szeretlek",
    pronunciation: "/SEH-ret-lek/",
    originCountry: "Hungary",
    countryCode: "HU",
    countryFlag: "🇭🇺",
    meaning: "I love you"
  },
  {
    language: "Czech",
    word: "Miluji tě",
    pronunciation: "/MI-loo-yi tyeh/",
    originCountry: "Czech Republic",
    countryCode: "CZ",
    countryFlag: "🇨🇿",
    meaning: "I love you"
  },
  {
    language: "Swahili",
    word: "Nakupenda",
    pronunciation: "/nah-koo-PEN-dah/",
    originCountry: "Kenya",
    countryCode: "KE",
    countryFlag: "🇰🇪",
    meaning: "I love you"
  },
  {
    language: "Hebrew",
    word: "אני אוהב אותך",
    pronunciation: "/a-ni o-hev o-tach/",
    originCountry: "Israel",
    countryCode: "IL",
    countryFlag: "🇮🇱",
    meaning: "I love you"
  },
  {
    language: "Thai",
    word: "ฉันรักคุณ",
    pronunciation: "/chan rak khun/",
    originCountry: "Thailand",
    countryCode: "TH",
    countryFlag: "🇹🇭",
    meaning: "I love you"
  },
  {
    language: "Indonesian",
    word: "Aku cinta kamu",
    pronunciation: "/ah-koo CHIN-tah kah-moo/",
    originCountry: "Indonesia",
    countryCode: "ID",
    countryFlag: "🇮🇩",
    meaning: "I love you"
  },
  {
    language: "Malay",
    word: "Saya sayang awak",
    pronunciation: "/sah-yah sah-yahng ah-wahk/",
    originCountry: "Malaysia",
    countryCode: "MY",
    countryFlag: "🇲🇾",
    meaning: "I love you"
  },
  {
    language: "Persian (Farsi)",
    word: "دوستت دارم",
    pronunciation: "/doo-stat dah-ram/",
    originCountry: "Iran",
    countryCode: "IR",
    countryFlag: "🇮🇷",
    meaning: "I love you"
  },
  {
    language: "Urdu",
    word: "میں آپ سے محبت کرتا ہوں",
    pronunciation: "/main aap se mohabbat karta hoon/",
    originCountry: "Pakistan",
    countryCode: "PK",
    countryFlag: "🇵🇰",
    meaning: "I love you"
  },
  {
    language: "Cantonese",
    word: "我愛你",
    pronunciation: "/ngo oi nei/",
    originCountry: "Hong Kong",
    countryCode: "HK",
    countryFlag: "🇭🇰",
    meaning: "I love you"
  },
  {
    language: "Danish",
    word: "Jeg elsker dig",
    pronunciation: "/yay EL-sker dee/",
    originCountry: "Denmark",
    countryCode: "DK",
    countryFlag: "🇩🇰",
    meaning: "I love you"
  },
  {
    language: "Finnish",
    word: "Minä rakastan sinua",
    pronunciation: "/MI-na RA-kas-tan SI-noo-a/",
    originCountry: "Finland",
    countryCode: "FI",
    countryFlag: "🇫🇮",
    meaning: "I love you"
  },
  {
    language: "Norwegian",
    word: "Jeg elsker deg",
    pronunciation: "/yay EL-sker day/",
    originCountry: "Norway",
    countryCode: "NO",
    countryFlag: "🇳🇴",
    meaning: "I love you"
  },
  {
    language: "Slovak",
    word: "Ľúbim ťa",
    pronunciation: "/LYOO-bim tya/",
    originCountry: "Slovakia",
    countryCode: "SK",
    countryFlag: "🇸🇰",
    meaning: "I love you"
  },
  {
    language: "Bulgarian",
    word: "Обичам те",
    pronunciation: "/oh-BI-cham teh/",
    originCountry: "Bulgaria",
    countryCode: "BG",
    countryFlag: "🇧🇬",
    meaning: "I love you"
  },
  {
    language: "Croatian",
    word: "Volim te",
    pronunciation: "/VOH-leem teh/",
    originCountry: "Croatia",
    countryCode: "HR",
    countryFlag: "🇭🇷",
    meaning: "I love you"
  },
  {
    language: "Serbian",
    word: "Волим те",
    pronunciation: "/VO-leem teh/",
    originCountry: "Serbia",
    countryCode: "RS",
    countryFlag: "🇷🇸",
    meaning: "I love you"
  },
  {
    language: "Lithuanian",
    word: "Aš tave myliu",
    pronunciation: "/ash tah-VEH MEE-lyoo/",
    originCountry: "Lithuania",
    countryCode: "LT",
    countryFlag: "🇱🇹",
    meaning: "I love you"
  },
  {
    language: "Latvian",
    word: "Es tevi mīlu",
    pronunciation: "/es TEH-vee MEE-loo/",
    originCountry: "Latvia",
    countryCode: "LV",
    countryFlag: "🇱🇻",
    meaning: "I love you"
  },
  {
    language: "Estonian",
    word: "Ma armastan sind",
    pronunciation: "/mah AR-mas-tan seend/",
    originCountry: "Estonia",
    countryCode: "EE",
    countryFlag: "🇪🇪",
    meaning: "I love you"
  },
  {
    language: "Irish Gaelic",
    word: "Táim i ngrá leat",
    pronunciation: "/tawm ih n-graw lah-th/",
    originCountry: "Ireland",
    countryCode: "IE",
    countryFlag: "🇮🇪",
    meaning: "I love you"
  },
  {
    language: "Scottish Gaelic",
    word: "Tha gaol agam ort",
    pronunciation: "/hah guwl ah-gum orst/",
    originCountry: "Scotland",
    countryCode: "GB",
    countryFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    meaning: "I love you"
  },
  {
    language: "Welsh",
    word: "Rwy'n dy garu di",
    pronunciation: "/rooyn duh GAH-ree dee/",
    originCountry: "Wales",
    countryCode: "GB",
    countryFlag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    meaning: "I love you"
  },
  {
    language: "Hawaiian",
    word: "Aloha wau iā 'oe",
    pronunciation: "/ah-LOH-hah vow ee-AH oh-eh/",
    originCountry: "United States (Hawaii)",
    countryCode: "US",
    countryFlag: "🌺",
    meaning: "I love you"
  },
  {
    language: "Maori",
    word: "Aroha atu au ki a koe",
    pronunciation: "/ah-ROH-hah ah-too ow kee ah ko-eh/",
    originCountry: "New Zealand",
    countryCode: "NZ",
    countryFlag: "🇳🇿",
    meaning: "I love you"
  },
  {
    language: "Samoan",
    word: "Ou te alofa ia te oe",
    pronunciation: "/oh-oo teh ah-LOH-fah ee-ah teh oh-eh/",
    originCountry: "Samoa",
    countryCode: "WS",
    countryFlag: "🇼🇸",
    meaning: "I love you"
  },
  {
    language: "Tongan",
    word: "'Ofa atu",
    pronunciation: "/oh-fah ah-too/",
    originCountry: "Tonga",
    countryCode: "TO",
    countryFlag: "🇹🇴",
    meaning: "I love you"
  },
  {
    language: "Fijian",
    word: "Au domoni iko",
    pronunciation: "/ow doh-MOH-nee ee-koh/",
    originCountry: "Fiji",
    countryCode: "FJ",
    countryFlag: "🇫🇯",
    meaning: "I love you"
  },
  {
    language: "Tahitian",
    word: "Ua here au ia oe",
    pronunciation: "/oo-ah HEH-reh ow ee-ah oh-eh/",
    originCountry: "French Polynesia",
    countryCode: "PF",
    countryFlag: "🇵🇫",
    meaning: "I love you"
  },
  {
    language: "Afrikaans",
    word: "Ek het jou lief",
    pronunciation: "/ek het yoh leef/",
    originCountry: "South Africa",
    countryCode: "ZA",
    countryFlag: "🇿🇦",
    meaning: "I love you"
  },
  {
    language: "Zulu",
    word: "Ngiyakuthanda",
    pronunciation: "/n-gee-yah-koo-TAHN-dah/",
    originCountry: "South Africa",
    countryCode: "ZA",
    countryFlag: "🇿🇦",
    meaning: "I love you"
  },
  {
    language: "Xhosa",
    word: "Ndiyakuthanda",
    pronunciation: "/n-dee-yah-koo-TAHN-dah/",
    originCountry: "South Africa",
    countryCode: "ZA",
    countryFlag: "🇿🇦",
    meaning: "I love you"
  },
  {
    language: "Yoruba",
    word: "Mo ní ífẹ́ rẹ",
    pronunciation: "/mo nee ee-feh reh/",
    originCountry: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    meaning: "I love you"
  },
  {
    language: "Igbo",
    word: "A hụrụ m gị n'anya",
    pronunciation: "/ah hoo-roo m gee n-ahn-yah/",
    originCountry: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    meaning: "I love you"
  },
  {
    language: "Hausa",
    word: "Ina son ki",
    pronunciation: "/ee-nah son kee/",
    originCountry: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    meaning: "I love you"
  },
  {
    language: "Amharic",
    word: "እወድሃለሁ",
    pronunciation: "/ewedihalehu/",
    originCountry: "Ethiopia",
    countryCode: "ET",
    countryFlag: "🇪🇹",
    meaning: "I love you"
  },
  {
    language: "Somali",
    word: "Waan ku yêu ahay",
    pronunciation: "/wahn koo yay-oo ah-hay/",
    originCountry: "Somalia",
    countryCode: "SO",
    countryFlag: "🇸🇴",
    meaning: "I love you"
  },
  {
    language: "Malagasy",
    word: "Tiako ianao",
    pronunciation: "/tee-AH-ko ee-AH-no/",
    originCountry: "Madagascar",
    countryCode: "MG",
    countryFlag: "🇲🇬",
    meaning: "I love you"
  },
  {
    language: "Esperanto",
    word: "Mi amas vin",
    pronunciation: "/mee AH-mas veen/",
    originCountry: "Poland",
    countryCode: "PL",
    countryFlag: "🇵🇱",
    meaning: "I love you"
  },
  {
    language: "Latin",
    word: "Te amo",
    pronunciation: "/teh AH-moh/",
    originCountry: "Ancient Rome",
    countryCode: "IT",
    countryFlag: "🏛️",
    meaning: "I love you"
  },
  {
    language: "Sanskrit",
    word: "त्वयि स्निह्यामि",
    pronunciation: "/tvayi snihyaami/",
    originCountry: "Ancient India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Armenian",
    word: "Ես քեզ սիրում եմ",
    pronunciation: "/yes kez see-ROOM em/",
    originCountry: "Armenia",
    countryCode: "AM",
    countryFlag: "🇦🇲",
    meaning: "I love you"
  },
  {
    language: "Georgian",
    word: "მე შენ მიყვარხარ",
    pronunciation: "/me shen miq-var-khar/",
    originCountry: "Georgia",
    countryCode: "GE",
    countryFlag: "🇬🇪",
    meaning: "I love you"
  },
  {
    language: "Azerbaijani",
    word: "Mən səni sevirəm",
    pronunciation: "/man sah-nee seh-vee-ram/",
    originCountry: "Azerbaijan",
    countryCode: "AZ",
    countryFlag: "🇦🇿",
    meaning: "I love you"
  },
  {
    language: "Kazakh",
    word: "Мен сені жақсы көремін",
    pronunciation: "/men se-nee zhak-sy ko-re-min/",
    originCountry: "Kazakhstan",
    countryCode: "KZ",
    countryFlag: "🇰🇿",
    meaning: "I love you"
  },
  {
    language: "Uzbek",
    word: "Men seni sevaman",
    pronunciation: "/men se-ni se-va-man/",
    originCountry: "Uzbekistan",
    countryCode: "UZ",
    countryFlag: "🇺🇿",
    meaning: "I love you"
  },
  {
    language: "Kyrgyz",
    word: "Мен сени сүйөм",
    pronunciation: "/men se-ni soo-yom/",
    originCountry: "Kyrgyzstan",
    countryCode: "KG",
    countryFlag: "🇰🇬",
    meaning: "I love you"
  },
  {
    language: "Mongolian",
    word: "Би чамд хайртай",
    pronunciation: "/bee chamd khair-tai/",
    originCountry: "Mongolia",
    countryCode: "MN",
    countryFlag: "🇲🇳",
    meaning: "I love you"
  },
  {
    language: "Tibetan",
    word: "ང་ཁྱེད་ལ་དགའ་པོ་ཡོད།",
    pronunciation: "/nga khed la gah-po yoe/",
    originCountry: "Tibet",
    countryCode: "CN",
    countryFlag: "🏔️",
    meaning: "I love you"
  },
  {
    language: "Nepali",
    word: "म तिमीलाई माया गर्छु",
    pronunciation: "/ma timi-lai maya garchu/",
    originCountry: "Nepal",
    countryCode: "NP",
    countryFlag: "🇳🇵",
    meaning: "I love you"
  },
  {
    language: "Sinhala",
    word: "මම ඔයාට ආදරෙයි",
    pronunciation: "/mama oyata aadarei/",
    originCountry: "Sri Lanka",
    countryCode: "LK",
    countryFlag: "🇱🇰",
    meaning: "I love you"
  },
  {
    language: "Tamil",
    word: "நான் உன்னை காதலிக்கிறேன்",
    pronunciation: "/naan unnai kaadhalikkiren/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Telugu",
    word: "నేను నిన్ను ప్రేమిస్తున్నాను",
    pronunciation: "/nenu ninnu premistunnanu/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Kannada",
    word: "ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ",
    pronunciation: "/naanu ninnannu preetisuttene/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Malayalam",
    word: "ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു",
    pronunciation: "/njan ninne snehikkunnu/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Marathi",
    word: "माझे तुझ्यावर प्रेम आहे",
    pronunciation: "/majhe tujhyavar prem aahe/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Gujarati",
    word: "હું તને પ્રેમ કરું છું",
    pronunciation: "/hoo tane prem karoo chhoo/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Punjabi",
    word: "ਮੈਂ ਤੈਨੂੰ ਪਿਆਰ ਕਰਦਾ ਹਾਂ",
    pronunciation: "/main tainu pyaar karda haan/",
    originCountry: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    meaning: "I love you"
  },
  {
    language: "Burmese",
    word: "မင်းကိုချစ်တယ်",
    pronunciation: "/min ko chit te/",
    originCountry: "Myanmar",
    countryCode: "MM",
    countryFlag: "🇲🇲",
    meaning: "I love you"
  },
  {
    language: "Khmer",
    word: "ខ្ញុំស្រឡាញ់អ្នក",
    pronunciation: "/khnom srolanh nek/",
    originCountry: "Cambodia",
    countryCode: "KH",
    countryFlag: "🇰🇭",
    meaning: "I love you"
  },
  {
    language: "Lao",
    word: "ຂ້ອຍຮັກເຈົ້າ",
    pronunciation: "/khoi hak chao/",
    originCountry: "Laos",
    countryCode: "LA",
    countryFlag: "🇱🇦",
    meaning: "I love you"
  },
  {
    language: "Javanese",
    word: "Aku tresno karo kowe",
    pronunciation: "/ah-koo tres-no kah-ro ko-we/",
    originCountry: "Indonesia",
    countryCode: "ID",
    countryFlag: "🇮🇩",
    meaning: "I love you"
  },
  {
    language: "Sundanese",
    word: "Abdi bobogohan ka anjeun",
    pronunciation: "/ab-dee bo-bo-go-han kah an-je-un/",
    originCountry: "Indonesia",
    countryCode: "ID",
    countryFlag: "🇮🇩",
    meaning: "I love you"
  },
  {
    language: "Balinese",
    word: "Tiang tresna teken ragane",
    pronunciation: "/tee-ang tres-nah te-ken rah-gah-ne/",
    originCountry: "Indonesia",
    countryCode: "ID",
    countryFlag: "🇮🇩",
    meaning: "I love you"
  },
  {
    language: "Cebuano",
    word: "Gihigugma ko ikaw",
    pronunciation: "/gee-hee-GOOG-mah koh ee-KOW/",
    originCountry: "Philippines",
    countryCode: "PH",
    countryFlag: "🇵🇭",
    meaning: "I love you"
  },
  {
    language: "Ilocano",
    word: "Ay-ayaten ka",
    pronunciation: "/ay-ay-AH-ten kah/",
    originCountry: "Philippines",
    countryCode: "PH",
    countryFlag: "🇵🇭",
    meaning: "I love you"
  },
  {
    language: "Basque",
    word: "Maite zaitut",
    pronunciation: "/MY-teh ZHY-toot/",
    originCountry: "Spain",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    meaning: "I love you"
  },
  {
    language: "Catalan",
    word: "T'estimo",
    pronunciation: "/teh-STEE-moh/",
    originCountry: "Spain",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    meaning: "I love you"
  },
  {
    language: "Galician",
    word: "Ámo-te",
    pronunciation: "/AH-moh-teh/",
    originCountry: "Spain",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    meaning: "I love you"
  },
  {
    language: "Icelandic",
    word: "Ég elska þig",
    pronunciation: "/yehg EL-ska theeg/",
    originCountry: "Iceland",
    countryCode: "IS",
    countryFlag: "🇮🇸",
    meaning: "I love you"
  },
  {
    language: "Luxembourgish",
    word: "Ech hunn dech gär",
    pronunciation: "/esh hoon deshr gair/",
    originCountry: "Luxembourg",
    countryCode: "LU",
    countryFlag: "🇱🇺",
    meaning: "I love you"
  },
  {
    language: "Maltese",
    word: "Inħobbok",
    pronunciation: "/in-HOHB-bohk/",
    originCountry: "Malta",
    countryCode: "MT",
    countryFlag: "🇲🇹",
    meaning: "I love you"
  },
  {
    language: "Albanian",
    word: "Të dua",
    pronunciation: "/tuh DOO-ah/",
    originCountry: "Albania",
    countryCode: "AL",
    countryFlag: "🇦🇱",
    meaning: "I love you"
  },
  {
    language: "Macedonian",
    word: "Те сакам",
    pronunciation: "/te SA-kam/",
    originCountry: "North Macedonia",
    countryCode: "MK",
    countryFlag: "🇲🇰",
    meaning: "I love you"
  },
  {
    language: "Slovenian",
    word: "Ljubim te",
    pronunciation: "/LYOO-beem teh/",
    originCountry: "Slovenia",
    countryCode: "SI",
    countryFlag: "🇸🇮",
    meaning: "I love you"
  },
  {
    language: "Belarusian",
    word: "Я цябе кахаю",
    pronunciation: "/ya tsya-BE ka-KHA-yu/",
    originCountry: "Belarus",
    countryCode: "BY",
    countryFlag: "🇧🇾",
    meaning: "I love you"
  },
  {
    language: "Yiddish",
    word: "איך ליב דיך",
    pronunciation: "/ikh leeb deekh/",
    originCountry: "Germany",
    countryCode: "DE",
    countryFlag: "🇩🇪",
    meaning: "I love you"
  },
  {
    language: "Frisian",
    word: "Ik hal fan dy",
    pronunciation: "/ik hahl fahn dee/",
    originCountry: "Netherlands",
    countryCode: "NL",
    countryFlag: "🇳🇱",
    meaning: "I love you"
  }
].map(item => ({
  language: item.language,
  word: item.word,
  translation: item.word, // backward compatibility
  pronunciation: item.pronunciation,
  originCountry: item.originCountry,
  countryCode: item.countryCode,
  countryFlag: item.countryFlag,
  meaning: item.meaning,
  origin: item.originCountry, // backward compatibility
  l: item.language,
  t: item.word
}));

window.LOVE_LANGUAGES = loveLanguages;

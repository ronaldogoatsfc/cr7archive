// Goal-state classifications keyed by Ronaldo's career goal number.
// "Winning by N" and "Go-ahead goal" are independent tags and can overlap
// with the existing Match winner / Equalizer / Losing by N classifications.
const WINNING_BY_GOAL = {
  "1": [
    "Winning by 1"
  ],
  "2": [
    "Winning by 2"
  ],
  "4": [
    "Winning by 1"
  ],
  "5": [
    "Winning by 2"
  ],
  "6": [
    "Winning by 1"
  ],
  "7": [
    "Winning by 2"
  ],
  "8": [
    "Winning by 1"
  ],
  "16": [
    "Winning by 1"
  ],
  "17": [
    "Winning by 3"
  ],
  "18": [
    "Winning by 1"
  ],
  "19": [
    "Winning by 2"
  ],
  "24": [
    "Winning by 1"
  ],
  "25": [
    "Winning by 1"
  ],
  "27": [
    "Winning by 2"
  ],
  "28": [
    "Winning by 1"
  ],
  "30": [
    "Winning by 2"
  ],
  "33": [
    "Winning by 1"
  ],
  "34": [
    "Winning by 2"
  ],
  "35": [
    "Winning by 1"
  ],
  "36": [
    "Winning by 1"
  ],
  "37": [
    "Winning by 1"
  ],
  "38": [
    "Winning by 2"
  ],
  "39": [
    "Winning by 2"
  ],
  "41": [
    "Winning by 2"
  ],
  "43": [
    "Winning by 1"
  ],
  "44": [
    "Winning by 1"
  ],
  "45": [
    "Winning by 3"
  ],
  "48": [
    "Winning by 2"
  ],
  "49": [
    "Winning by 2"
  ],
  "50": [
    "Winning by 1"
  ],
  "51": [
    "Winning by 1"
  ],
  "53": [
    "Winning by 1"
  ],
  "55": [
    "Winning by 2"
  ],
  "57": [
    "Winning by 1"
  ],
  "59": [
    "Winning by 1"
  ],
  "60": [
    "Winning by 2"
  ],
  "66": [
    "Winning by 1"
  ],
  "67": [
    "Winning by 3"
  ],
  "68": [
    "Winning by 2"
  ],
  "69": [
    "Winning by 3"
  ],
  "77": [
    "Winning by 1"
  ],
  "78": [
    "Winning by 2"
  ],
  "79": [
    "Winning by 1"
  ],
  "80": [
    "Winning by 1"
  ],
  "81": [
    "Winning by 2"
  ],
  "83": [
    "Winning by 3"
  ],
  "85": [
    "Winning by 1"
  ],
  "88": [
    "Winning by 1"
  ],
  "89": [
    "Winning by 2"
  ],
  "92": [
    "Winning by 2"
  ],
  "96": [
    "Winning by 2"
  ],
  "97": [
    "Winning by 4"
  ],
  "98": [
    "Winning by 1"
  ],
  "100": [
    "Winning by 1"
  ],
  "102": [
    "Winning by 1"
  ],
  "103": [
    "Winning by 1"
  ],
  "104": [
    "Winning by 2"
  ],
  "108": [
    "Winning by 1"
  ],
  "109": [
    "Winning by 1"
  ],
  "115": [
    "Winning by 1"
  ],
  "121": [
    "Winning by 1"
  ],
  "123": [
    "Winning by 1"
  ],
  "125": [
    "Winning by 1"
  ],
  "127": [
    "Winning by 4"
  ],
  "128": [
    "Winning by 1"
  ],
  "129": [
    "Winning by 1"
  ],
  "130": [
    "Winning by 3"
  ],
  "131": [
    "Winning by 4"
  ],
  "134": [
    "Winning by 1"
  ],
  "136": [
    "Winning by 1"
  ],
  "143": [
    "Winning by 2"
  ],
  "144": [
    "Winning by 3"
  ],
  "147": [
    "Winning by 2"
  ],
  "149": [
    "Winning by 1"
  ],
  "151": [
    "Winning by 1"
  ],
  "154": [
    "Winning by 2"
  ],
  "155": [
    "Winning by 1"
  ],
  "157": [
    "Winning by 1"
  ],
  "158": [
    "Winning by 4"
  ],
  "160": [
    "Winning by 1"
  ],
  "161": [
    "Winning by 1"
  ],
  "162": [
    "Winning by 2"
  ],
  "164": [
    "Winning by 2"
  ],
  "169": [
    "Winning by 3"
  ],
  "172": [
    "Winning by 1"
  ],
  "177": [
    "Winning by 1"
  ],
  "179": [
    "Winning by 5"
  ],
  "182": [
    "Winning by 4"
  ],
  "183": [
    "Winning by 1"
  ],
  "185": [
    "Winning by 1"
  ],
  "186": [
    "Winning by 2"
  ],
  "188": [
    "Winning by 1"
  ],
  "189": [
    "Winning by 2"
  ],
  "190": [
    "Winning by 3"
  ],
  "191": [
    "Winning by 4"
  ],
  "193": [
    "Winning by 1"
  ],
  "194": [
    "Winning by 2"
  ],
  "195": [
    "Winning by 1"
  ],
  "196": [
    "Winning by 2"
  ],
  "197": [
    "Winning by 3"
  ],
  "198": [
    "Winning by 2"
  ],
  "199": [
    "Winning by 3"
  ],
  "201": [
    "Winning by 1"
  ],
  "202": [
    "Winning by 1"
  ],
  "203": [
    "Winning by 1"
  ],
  "204": [
    "Winning by 3"
  ],
  "205": [
    "Winning by 5"
  ],
  "206": [
    "Winning by 6"
  ],
  "208": [
    "Winning by 1"
  ],
  "213": [
    "Winning by 2"
  ],
  "214": [
    "Winning by 1"
  ],
  "215": [
    "Winning by 2"
  ],
  "217": [
    "Winning by 3"
  ],
  "218": [
    "Winning by 5"
  ],
  "219": [
    "Winning by 6"
  ],
  "220": [
    "Winning by 3"
  ],
  "221": [
    "Winning by 2"
  ],
  "222": [
    "Winning by 4"
  ],
  "225": [
    "Winning by 1"
  ],
  "226": [
    "Winning by 2"
  ],
  "227": [
    "Winning by 3"
  ],
  "228": [
    "Winning by 4"
  ],
  "230": [
    "Winning by 1"
  ],
  "231": [
    "Winning by 3"
  ],
  "232": [
    "Winning by 1"
  ],
  "233": [
    "Winning by 1"
  ],
  "235": [
    "Winning by 5"
  ],
  "236": [
    "Winning by 1"
  ],
  "239": [
    "Winning by 3"
  ],
  "240": [
    "Winning by 5"
  ],
  "242": [
    "Winning by 1"
  ],
  "245": [
    "Winning by 1"
  ],
  "246": [
    "Winning by 3"
  ],
  "249": [
    "Winning by 1"
  ],
  "250": [
    "Winning by 2"
  ],
  "251": [
    "Winning by 3"
  ],
  "253": [
    "Winning by 1"
  ],
  "255": [
    "Winning by 2"
  ],
  "256": [
    "Winning by 3"
  ],
  "258": [
    "Winning by 1"
  ],
  "259": [
    "Winning by 1"
  ],
  "261": [
    "Winning by 2"
  ],
  "262": [
    "Winning by 1"
  ],
  "263": [
    "Winning by 1"
  ],
  "265": [
    "Winning by 2"
  ],
  "266": [
    "Winning by 3"
  ],
  "267": [
    "Winning by 3"
  ],
  "270": [
    "Winning by 1"
  ],
  "275": [
    "Winning by 1"
  ],
  "282": [
    "Winning by 1"
  ],
  "283": [
    "Winning by 2"
  ],
  "285": [
    "Winning by 1"
  ],
  "286": [
    "Winning by 3"
  ],
  "287": [
    "Winning by 1"
  ],
  "288": [
    "Winning by 2"
  ],
  "289": [
    "Winning by 3"
  ],
  "290": [
    "Winning by 4"
  ],
  "293": [
    "Winning by 1"
  ],
  "299": [
    "Winning by 2"
  ],
  "305": [
    "Winning by 1"
  ],
  "309": [
    "Winning by 1"
  ],
  "312": [
    "Winning by 1"
  ],
  "314": [
    "Winning by 1"
  ],
  "315": [
    "Winning by 3"
  ],
  "317": [
    "Winning by 1"
  ],
  "318": [
    "Winning by 2"
  ],
  "321": [
    "Winning by 1"
  ],
  "323": [
    "Winning by 1"
  ],
  "324": [
    "Winning by 3"
  ],
  "331": [
    "Winning by 1"
  ],
  "334": [
    "Winning by 1"
  ],
  "335": [
    "Winning by 2"
  ],
  "336": [
    "Winning by 3"
  ],
  "337": [
    "Winning by 1"
  ],
  "338": [
    "Winning by 2"
  ],
  "339": [
    "Winning by 3"
  ],
  "341": [
    "Winning by 1"
  ],
  "342": [
    "Winning by 2"
  ],
  "343": [
    "Winning by 3"
  ],
  "346": [
    "Winning by 1"
  ],
  "353": [
    "Winning by 1"
  ],
  "354": [
    "Winning by 3"
  ],
  "355": [
    "Winning by 1"
  ],
  "357": [
    "Winning by 1"
  ],
  "360": [
    "Winning by 1"
  ],
  "365": [
    "Winning by 1"
  ],
  "368": [
    "Winning by 1"
  ],
  "370": [
    "Winning by 2"
  ],
  "371": [
    "Winning by 3"
  ],
  "372": [
    "Winning by 4"
  ],
  "374": [
    "Winning by 2"
  ],
  "378": [
    "Winning by 1"
  ],
  "380": [
    "Winning by 1"
  ],
  "383": [
    "Winning by 2"
  ],
  "384": [
    "Winning by 2"
  ],
  "385": [
    "Winning by 2"
  ],
  "387": [
    "Winning by 2"
  ],
  "390": [
    "Winning by 2"
  ],
  "391": [
    "Winning by 3"
  ],
  "393": [
    "Winning by 1"
  ],
  "395": [
    "Winning by 1"
  ],
  "397": [
    "Winning by 1"
  ],
  "399": [
    "Winning by 1"
  ],
  "400": [
    "Winning by 2"
  ],
  "401": [
    "Winning by 2"
  ],
  "404": [
    "Winning by 3"
  ],
  "405": [
    "Winning by 4"
  ],
  "406": [
    "Winning by 2"
  ],
  "407": [
    "Winning by 5"
  ],
  "410": [
    "Winning by 3"
  ],
  "413": [
    "Winning by 5"
  ],
  "414": [
    "Winning by 5"
  ],
  "418": [
    "Winning by 2"
  ],
  "420": [
    "Winning by 1"
  ],
  "421": [
    "Winning by 3"
  ],
  "422": [
    "Winning by 4"
  ],
  "424": [
    "Winning by 2"
  ],
  "427": [
    "Winning by 1"
  ],
  "428": [
    "Winning by 1"
  ],
  "430": [
    "Winning by 2"
  ],
  "432": [
    "Winning by 2"
  ],
  "433": [
    "Winning by 4"
  ],
  "435": [
    "Winning by 1"
  ],
  "436": [
    "Winning by 2"
  ],
  "437": [
    "Winning by 3"
  ],
  "438": [
    "Winning by 1"
  ],
  "441": [
    "Winning by 2"
  ],
  "442": [
    "Winning by 4"
  ],
  "445": [
    "Winning by 2"
  ],
  "449": [
    "Winning by 3"
  ],
  "451": [
    "Winning by 1"
  ],
  "452": [
    "Winning by 3"
  ],
  "455": [
    "Winning by 1"
  ],
  "456": [
    "Winning by 2"
  ],
  "458": [
    "Winning by 1"
  ],
  "459": [
    "Winning by 2"
  ],
  "463": [
    "Winning by 2"
  ],
  "465": [
    "Winning by 1"
  ],
  "467": [
    "Winning by 1"
  ],
  "468": [
    "Winning by 1"
  ],
  "470": [
    "Winning by 1"
  ],
  "471": [
    "Winning by 2"
  ],
  "472": [
    "Winning by 3"
  ],
  "473": [
    "Winning by 5"
  ],
  "474": [
    "Winning by 7"
  ],
  "477": [
    "Winning by 1"
  ],
  "479": [
    "Winning by 1"
  ],
  "480": [
    "Winning by 1"
  ],
  "484": [
    "Winning by 1"
  ],
  "485": [
    "Winning by 2"
  ],
  "491": [
    "Winning by 1"
  ],
  "493": [
    "Winning by 1"
  ],
  "494": [
    "Winning by 2"
  ],
  "495": [
    "Winning by 4"
  ],
  "496": [
    "Winning by 5"
  ],
  "497": [
    "Winning by 1"
  ],
  "498": [
    "Winning by 2"
  ],
  "499": [
    "Winning by 3"
  ],
  "501": [
    "Winning by 1"
  ],
  "502": [
    "Winning by 1"
  ],
  "504": [
    "Winning by 1"
  ],
  "506": [
    "Winning by 3"
  ],
  "507": [
    "Winning by 1"
  ],
  "508": [
    "Winning by 3"
  ],
  "509": [
    "Winning by 2"
  ],
  "510": [
    "Winning by 3"
  ],
  "511": [
    "Winning by 4"
  ],
  "512": [
    "Winning by 5"
  ],
  "514": [
    "Winning by 3"
  ],
  "517": [
    "Winning by 1"
  ],
  "518": [
    "Winning by 3"
  ],
  "519": [
    "Winning by 1"
  ],
  "520": [
    "Winning by 3"
  ],
  "521": [
    "Winning by 4"
  ],
  "523": [
    "Winning by 2"
  ],
  "527": [
    "Winning by 1"
  ],
  "528": [
    "Winning by 2"
  ],
  "529": [
    "Winning by 2"
  ],
  "530": [
    "Winning by 3"
  ],
  "531": [
    "Winning by 2"
  ],
  "532": [
    "Winning by 1"
  ],
  "533": [
    "Winning by 1"
  ],
  "535": [
    "Winning by 2"
  ],
  "539": [
    "Winning by 3"
  ],
  "541": [
    "Winning by 1"
  ],
  "543": [
    "Winning by 1"
  ],
  "545": [
    "Winning by 2"
  ],
  "553": [
    "Winning by 1"
  ],
  "554": [
    "Winning by 3"
  ],
  "555": [
    "Winning by 4"
  ],
  "556": [
    "Winning by 3"
  ],
  "557": [
    "Winning by 4"
  ],
  "560": [
    "Winning by 2"
  ],
  "562": [
    "Winning by 1"
  ],
  "564": [
    "Winning by 1"
  ],
  "565": [
    "Winning by 2"
  ],
  "567": [
    "Winning by 1"
  ],
  "568": [
    "Winning by 1"
  ],
  "571": [
    "Winning by 1"
  ],
  "572": [
    "Winning by 2"
  ],
  "575": [
    "Winning by 1"
  ],
  "582": [
    "Winning by 1"
  ],
  "583": [
    "Winning by 2"
  ],
  "589": [
    "Winning by 1"
  ],
  "592": [
    "Winning by 1"
  ],
  "593": [
    "Winning by 2"
  ],
  "594": [
    "Winning by 1"
  ],
  "595": [
    "Winning by 1"
  ],
  "597": [
    "Winning by 1"
  ],
  "600": [
    "Winning by 1"
  ],
  "602": [
    "Winning by 1"
  ],
  "607": [
    "Winning by 1"
  ],
  "608": [
    "Winning by 2"
  ],
  "610": [
    "Winning by 1"
  ],
  "611": [
    "Winning by 1"
  ],
  "612": [
    "Winning by 1"
  ],
  "617": [
    "Winning by 4"
  ],
  "618": [
    "Winning by 5"
  ],
  "620": [
    "Winning by 1"
  ],
  "621": [
    "Winning by 1"
  ],
  "622": [
    "Winning by 2"
  ],
  "625": [
    "Winning by 3"
  ],
  "626": [
    "Winning by 4"
  ],
  "628": [
    "Winning by 1"
  ],
  "629": [
    "Winning by 1"
  ],
  "630": [
    "Winning by 3"
  ],
  "631": [
    "Winning by 3"
  ],
  "634": [
    "Winning by 1"
  ],
  "636": [
    "Winning by 2"
  ],
  "637": [
    "Winning by 1"
  ],
  "638": [
    "Winning by 1"
  ],
  "639": [
    "Winning by 2"
  ],
  "645": [
    "Winning by 2"
  ],
  "649": [
    "Winning by 1"
  ],
  "654": [
    "Winning by 1"
  ],
  "660": [
    "Winning by 1"
  ],
  "662": [
    "Winning by 1"
  ],
  "667": [
    "Winning by 1"
  ],
  "669": [
    "Winning by 2"
  ],
  "677": [
    "Winning by 1"
  ],
  "678": [
    "Winning by 1"
  ],
  "679": [
    "Winning by 2"
  ],
  "689": [
    "Winning by 1"
  ],
  "690": [
    "Winning by 2"
  ],
  "691": [
    "Winning by 1"
  ],
  "694": [
    "Winning by 1"
  ],
  "695": [
    "Winning by 2"
  ],
  "697": [
    "Winning by 1"
  ],
  "698": [
    "Winning by 2"
  ],
  "699": [
    "Winning by 1"
  ],
  "704": [
    "Winning by 1"
  ],
  "705": [
    "Winning by 5"
  ],
  "706": [
    "Winning by 1"
  ],
  "711": [
    "Winning by 1"
  ],
  "714": [
    "Winning by 1"
  ],
  "715": [
    "Winning by 3"
  ],
  "716": [
    "Winning by 1"
  ],
  "722": [
    "Winning by 1"
  ],
  "727": [
    "Winning by 1"
  ],
  "728": [
    "Winning by 1"
  ],
  "729": [
    "Winning by 1"
  ],
  "730": [
    "Winning by 1"
  ],
  "734": [
    "Winning by 1"
  ],
  "739": [
    "Winning by 1"
  ],
  "740": [
    "Winning by 2"
  ],
  "744": [
    "Winning by 2"
  ],
  "746": [
    "Winning by 5"
  ],
  "748": [
    "Winning by 1"
  ],
  "750": [
    "Winning by 1"
  ],
  "752": [
    "Winning by 2"
  ],
  "754": [
    "Winning by 1"
  ],
  "755": [
    "Winning by 1"
  ],
  "756": [
    "Winning by 2"
  ],
  "758": [
    "Winning by 2"
  ],
  "759": [
    "Winning by 1"
  ],
  "765": [
    "Winning by 1"
  ],
  "767": [
    "Winning by 2"
  ],
  "769": [
    "Winning by 1"
  ],
  "776": [
    "Winning by 1"
  ],
  "778": [
    "Winning by 1"
  ],
  "779": [
    "Winning by 1"
  ],
  "793": [
    "Winning by 1"
  ],
  "794": [
    "Winning by 4"
  ],
  "803": [
    "Winning by 2"
  ],
  "809": [
    "Winning by 1"
  ],
  "813": [
    "Winning by 1"
  ],
  "814": [
    "Winning by 1"
  ],
  "815": [
    "Winning by 2"
  ],
  "816": [
    "Winning by 1"
  ],
  "818": [
    "Winning by 2"
  ],
  "822": [
    "Winning by 1"
  ],
  "823": [
    "Winning by 2"
  ],
  "824": [
    "Winning by 3"
  ],
  "826": [
    "Winning by 1"
  ],
  "827": [
    "Winning by 2"
  ],
  "829": [
    "Winning by 2"
  ],
  "830": [
    "Winning by 3"
  ],
  "832": [
    "Winning by 3"
  ],
  "834": [
    "Winning by 2"
  ],
  "845": [
    "Winning by 1"
  ],
  "846": [
    "Winning by 2"
  ],
  "847": [
    "Winning by 4"
  ],
  "849": [
    "Winning by 1"
  ],
  "850": [
    "Winning by 2"
  ],
  "853": [
    "Winning by 1"
  ],
  "856": [
    "Winning by 1"
  ],
  "857": [
    "Winning by 1"
  ],
  "859": [
    "Winning by 1"
  ],
  "862": [
    "Winning by 1"
  ],
  "864": [
    "Winning by 2"
  ],
  "866": [
    "Winning by 1"
  ],
  "867": [
    "Winning by 2"
  ],
  "869": [
    "Winning by 2"
  ],
  "873": [
    "Winning by 2"
  ],
  "880": [
    "Winning by 1"
  ],
  "882": [
    "Winning by 3"
  ],
  "884": [
    "Winning by 1"
  ],
  "885": [
    "Winning by 3"
  ],
  "889": [
    "Winning by 1"
  ],
  "890": [
    "Winning by 4"
  ],
  "891": [
    "Winning by 1"
  ],
  "893": [
    "Winning by 1"
  ],
  "894": [
    "Winning by 1"
  ],
  "896": [
    "Winning by 1"
  ],
  "899": [
    "Winning by 1"
  ],
  "900": [
    "Winning by 1"
  ],
  "903": [
    "Winning by 1"
  ],
  "904": [
    "Winning by 1"
  ],
  "906": [
    "Winning by 1"
  ],
  "908": [
    "Winning by 1"
  ],
  "909": [
    "Winning by 1"
  ],
  "910": [
    "Winning by 4"
  ],
  "913": [
    "Winning by 2"
  ],
  "915": [
    "Winning by 1"
  ],
  "919": [
    "Winning by 1"
  ],
  "920": [
    "Winning by 1"
  ],
  "922": [
    "Winning by 1"
  ],
  "927": [
    "Winning by 1"
  ],
  "930": [
    "Winning by 1"
  ],
  "931": [
    "Winning by 1"
  ],
  "935": [
    "Winning by 1"
  ],
  "940": [
    "Winning by 1"
  ],
  "941": [
    "Winning by 1"
  ],
  "942": [
    "Winning by 3"
  ],
  "944": [
    "Winning by 2"
  ],
  "945": [
    "Winning by 3"
  ],
  "946": [
    "Winning by 1"
  ],
  "950": [
    "Winning by 1"
  ],
  "953": [
    "Winning by 1"
  ],
  "956": [
    "Winning by 1"
  ],
  "960": [
    "Winning by 1"
  ],
  "964": [
    "Winning by 3"
  ],
  "967": [
    "Winning by 1"
  ],
  "971": [
    "Winning by 1"
  ],
  "972": [
    "Winning by 1"
  ],
  "977": [
    "Winning by 3"
  ],
  "981": [
    "Winning by 1"
  ],
  "984": [
    "Winning by 1"
  ]
};
const GO_AHEAD_GOALS = new Set([983,979,974,970,969,968,966,965,963,962,961,955,952,949,943,937,933,928,925,921,918,917,914,912,907,905,902,901,892,888,886,883,879,877,875,874,872,868,865,863,860,858,854,852,848,844,842,841,839,838,837,836,835,833,831,825,821,819,817,810,808,807,806,805,804,802,801,800,799,796,795,792,791,790,787,786,785,777,775,773,771,768,764,763,762,760,757,753,751,747,743,738,735,733,726,725,721,719,718,717,713,712,710,709,703,702,701,696,693,692,688,687,682,675,674,673,672,670,668,665,661,659,658,648,647,643,642,641,640,635,633,627,624,619,614,613,609,606,605,604,603,601,599,598,596,591,590,588,587,586,576,573,570,566,563,561,559,552,549,548,544,542,540,538,534,526,524,522,516,515,513,505,503,500,492,490,488,486,483,478,476,475,464,462,460,457,454,453,450,448,446,444,443,440,434,431,426,425,419,417,416,415,412,411,409,403,402,398,396,394,392,389,386,382,381,379,377,376,375,373,369,367,363,362,361,359,356,352,349,348,347,345,333,330,327,326,325,319,316,311,308,307,306,304,303,301,298,297,295,294,292,291,284,281,280,279,278,277,276,274,272,269,268,264,257,254,252,247,243,241,238,234,229,224,212,211,207,200,192,187,184,181,180,178,176,174,170,168,167,163,159,156,153,152,150,148,146,145,142,140,138,137,135,133,132,126,124,122,120,119,118,117,116,114,112,111,110,107,106,105,101,99,95,94,93,91,90,87,86,84,82,76,75,74,72,71,70,65,63,62,61,58,56,54,52,47,40,32,29,26,23,21,20,15,14,13,11,10,3]);

function existingCategories(event) {
  const raw = String(event?.gameState ?? "");
  const found = [];
  if (raw === "Match winner") found.push("Match winner");
  else if (raw === "Equalizer" || raw === "Losing by 1") found.push("Equalizer");
  else if (/^(Winning by [1-7]|Losing by [2-4])$/.test(raw)) found.push(raw);
  else if (raw) {
    const primary = raw.split(" (")[0];
    if (primary === "Losing by 1") found.push("Equalizer");
    else if (/^(Winning by [1-7]|Losing by [2-4])$/.test(primary)) found.push(primary);
    if (raw.includes("Match winner")) found.push("Match winner");
    if (raw.includes("Equalizer")) found.push("Equalizer");
  }
  return found;
}

export function getGameStateCategories(event) {
  const categories = new Set(existingCategories(event));
  for (const category of WINNING_BY_GOAL[event?.goalNumber] ?? []) categories.add(category);
  if (GO_AHEAD_GOALS.has(Number(event?.goalNumber))) categories.add("Go-ahead goal");
  if ([...categories].some((category) => category.startsWith("Winning by "))) categories.add("Winning");
  if ([...categories].some((category) => category.startsWith("Losing by "))) categories.add("Losing");
  return [...categories];
}

export function getGameStateDisplay(event) {
  const categories = getGameStateCategories(event);
  const winningBy = categories.find((category) => /^Winning by [1-7]$/.test(category));
  const losingBy = categories.find((category) => /^Losing by [1-4]$/.test(category));
  const primary = winningBy || losingBy || (categories.includes("Equalizer") ? "Equalizer" : categories.includes("Go-ahead goal") ? "Go-ahead goal" : null);
  if (primary && categories.includes("Match winner")) return `${primary} (Match winner)`;
  return primary || (categories.includes("Match winner") ? "Match winner" : categories.includes("Go-ahead goal") ? "Go-ahead goal" : "");
}

export const GAME_STATE_FILTER_OPTIONS = [
  "Go-ahead goal",
  "Equalizer",
  "Match winner",
  "Winning",
  "Winning by 1",
  "Winning by 2",
  "Winning by 3",
  "Winning by 4",
  "Winning by 5",
  "Winning by 6",
  "Winning by 7",
  "Losing",
  "Losing by 2",
  "Losing by 3",
  "Losing by 4",
];

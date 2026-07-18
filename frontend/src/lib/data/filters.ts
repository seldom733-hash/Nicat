// 200 Tourist Countries with Cities
export interface Country {
  code: string;
  name: string;
  nameRu: string;
  nameAz: string;
  cities: string[];
}

export const countries: Country[] = [
  // Europe
  { code: 'AL', name: 'Albania', nameRu: 'Албания', nameAz: 'Albaniya', cities: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Korçë'] },
  { code: 'AD', name: 'Andorra', nameRu: 'Андорра', nameAz: 'Andorra', cities: ['Andorra la Vella', 'Encamp', 'Pas de la Casa', 'Canillo', 'La Massana'] },
  { code: 'AT', name: 'Austria', nameRu: 'Австрия', nameAz: 'Avstriya', cities: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Hallstatt'] },
  { code: 'BY', name: 'Belarus', nameRu: 'Беларусь', nameAz: 'Belarus', cities: ['Minsk', 'Brest', 'Grodno', 'Vitebsk', 'Mogilev', 'Gomel'] },
  { code: 'BE', name: 'Belgium', nameRu: 'Бельгия', nameAz: 'Belçika', cities: ['Brussels', 'Bruges', 'Ghent', 'Antwerp', 'Leuven', 'Liège'] },
  { code: 'BA', name: 'Bosnia and Herzegovina', nameRu: 'Босния и Герцеговина', nameAz: 'Bosniya və Herseqovina', cities: ['Sarajevo', 'Mostar', 'Banja Luka', 'Tuzla', 'Trebinje'] },
  { code: 'BG', name: 'Bulgaria', nameRu: 'Болгария', nameAz: 'Bolqarıstan', cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Veliko Tarnovo', 'Ruse'] },
  { code: 'HR', name: 'Croatia', nameRu: 'Хорватия', nameAz: 'Xorvatiya', cities: ['Zagreb', 'Dubrovnik', 'Split', 'Zadar', 'Pula', 'Hvar'] },
  { code: 'CY', name: 'Cyprus', nameRu: 'Кипр', nameAz: 'Kipr', cities: ['Nicosia', 'Limassol', 'Paphos', 'Larnaca', 'Ayia Napa'] },
  { code: 'CZ', name: 'Czech Republic', nameRu: 'Чехия', nameAz: 'Çexiya', cities: ['Prague', 'Brno', 'Český Krumlov', 'Karlovy Vary', 'Olomouc', 'Plzeň'] },
  { code: 'DK', name: 'Denmark', nameRu: 'Дания', nameAz: 'Danimarka', cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Roskilde'] },
  { code: 'EE', name: 'Estonia', nameRu: 'Эстония', nameAz: 'Estoniya', cities: ['Tallinn', 'Tartu', 'Pärnu', 'Kuressaare'] },
  { code: 'FI', name: 'Finland', nameRu: 'Финляндия', nameAz: 'Finlandiya', cities: ['Helsinki', 'Rovaniemi', 'Turku', 'Tampere', 'Oulu', 'Levi'] },
  { code: 'FR', name: 'France', nameRu: 'Франция', nameAz: 'Fransa', cities: ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg', 'Nice', 'Mont Saint-Michel', 'Cannes', 'Chamonix'] },
  { code: 'DE', name: 'Germany', nameRu: 'Германия', nameAz: 'Almaniya', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Dresden', 'Nuremberg', 'Heidelberg'] },
  { code: 'GR', name: 'Greece', nameRu: 'Греция', nameAz: 'Yunanıstan', cities: ['Athens', 'Santorini', 'Mykonos', 'Thessaloniki', 'Rhodes', 'Crete', 'Corfu', 'Zakynthos'] },
  { code: 'HU', name: 'Hungary', nameRu: 'Венгрия', nameAz: 'Macarıstan', cities: ['Budapest', 'Debrecen', 'Eger', 'Pécs', 'Szentendre'] },
  { code: 'IS', name: 'Iceland', nameRu: 'Исландия', nameAz: 'İslandiya', cities: ['Reykjavik', 'Akureyri', 'Vik', 'Húsavík', 'Selfoss'] },
  { code: 'IE', name: 'Ireland', nameRu: 'Ирландия', nameAz: 'İrlandiya', cities: ['Dublin', 'Galway', 'Cork', 'Limerick', 'Dingle', 'Kilkenny'] },
  { code: 'IT', name: 'Italy', nameRu: 'Италия', nameAz: 'İtaliya', cities: ['Rome', 'Milan', 'Venice', 'Florence', 'Naples', 'Amalfi', 'Cinque Terre', 'Pisa', 'Bologna', 'Siena'] },
  { code: 'XK', name: 'Kosovo', nameRu: 'Косово', nameAz: 'Kosovo', cities: ['Pristina', 'Peja', 'Prizren', 'Mitrovica'] },
  { code: 'LV', name: 'Latvia', nameRu: 'Латвия', nameAz: 'Latviya', cities: ['Riga', 'Daugavpils', 'Jūrmala', 'Liepāja', 'Cēsis'] },
  { code: 'LI', name: 'Liechtenstein', nameRu: 'Лихтенштейн', nameAz: 'Lixtenşteyn', cities: ['Vaduz', 'Schaan', 'Balzers'] },
  { code: 'LT', name: 'Lithuania', nameRu: 'Литва', nameAz: 'Litva', cities: ['Vilnius', 'Kaunas', 'Klaipėda', 'Druskininkai', 'Palanga', 'Trakai'] },
  { code: 'LU', name: 'Luxembourg', nameRu: 'Люксембург', nameAz: 'Lüksemburq', cities: ['Luxembourg City', 'Echternach', 'Vianden', 'Bergheim'] },
  { code: 'MT', name: 'Malta', nameRu: 'Мальта', nameAz: 'Malta', cities: ['Valletta', 'Sliema', 'St. Julian\'s', 'Mdina', 'Gozo'] },
  { code: 'MD', name: 'Moldova', nameRu: 'Молдова', nameAz: 'Moldova', cities: ['Chișinău', 'Orhei', 'Cricova', 'Tiraspol'] },
  { code: 'MC', name: 'Monaco', nameRu: 'Монако', nameAz: 'Monako', cities: ['Monaco', 'Monte Carlo', 'Fontvieille', 'Larvotto'] },
  { code: 'ME', name: 'Montenegro', nameRu: 'Черногория', nameAz: 'Qərbi Balkanlar', cities: ['Podgorica', 'Kotor', 'Budva', 'Herceg Novi', 'Sveti Stefan'] },
  { code: 'NL', name: 'Netherlands', nameRu: 'Нидерланды', nameAz: 'Niderland', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Maastricht', 'Haarlem'] },
  { code: 'MK', name: 'North Macedonia', nameRu: 'Северная Македония', nameAz: 'Şimali Makedoniya', cities: ['Skopje', 'Ohrid', 'Bitola', 'Tetovo', 'Prilep'] },
  { code: 'NO', name: 'Norway', nameRu: 'Норвегия', nameAz: 'Norveç', cities: ['Oslo', 'Bergen', 'Tromsø', 'Stavanger', 'Trondheim', 'Flam', 'Lofoten Islands'] },
  { code: 'PL', name: 'Poland', nameRu: 'Польша', nameAz: 'Polşa', cities: ['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Zakopane', 'Toruń'] },
  { code: 'PT', name: 'Portugal', nameRu: 'Португалия', nameAz: 'Portuqaliya', cities: ['Lisbon', 'Porto', 'Faro', 'Sintra', 'Madeira', 'Azores', 'Óbidos'] },
  { code: 'RO', name: 'Romania', nameRu: 'Румыния', nameAz: 'Rumıniya', cities: ['Bucharest', 'Brașov', 'Cluj-Napoca', 'Timișoara', 'Sighișoara', 'Constanta'] },
  { code: 'RU', name: 'Russia', nameRu: 'Россия', nameAz: 'Rusiya', cities: ['Moscow', 'Saint Petersburg', 'Kazan', 'Sochi', 'Novosibirsk', 'Vladivostok', 'Irkutsk', 'Kaliningrad'] },
  { code: 'SM', name: 'San Marino', nameRu: 'Сан-Марино', nameAz: 'San-Marino', cities: ['San Marino', 'Borgo Maggiore', 'Serravalle'] },
  { code: 'RS', name: 'Serbia', nameRu: 'Сербия', nameAz: 'Serbiya', cities: ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica'] },
  { code: 'SK', name: 'Slovakia', nameRu: 'Словакия', nameAz: 'Slovakiya', cities: ['Bratislava', 'Košice', 'Banská Štiavnica', 'Poprad', 'Žilina'] },
  { code: 'SI', name: 'Slovenia', nameRu: 'Словения', nameAz: 'Sloveniya', cities: ['Ljubljana', 'Bled', 'Piran', 'Maribor', 'Postojna'] },
  { code: 'ES', name: 'Spain', nameRu: 'Испания', nameAz: 'İspaniya', cities: ['Madrid', 'Barcelona', 'Seville', 'Valencia', 'Granada', 'Ibiza', 'Mallorca', 'San Sebastián', 'Toledo', 'Bilbao'] },
  { code: 'SE', name: 'Sweden', nameRu: 'Швеция', nameAz: 'İsveç', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Kiruna', 'Uppsala', 'Visby'] },
  { code: 'CH', name: 'Switzerland', nameRu: 'Швейцария', nameAz: 'İsveçrə', cities: ['Zurich', 'Geneva', 'Lucerne', 'Interlaken', 'Zermatt', 'Bern', 'Grindelwald', 'Lausanne'] },
  { code: 'TR', name: 'Turkey', nameRu: 'Турция', nameAz: 'Türkiyə', cities: ['Istanbul', 'Ankara', 'Antalya', 'Cappadocia', 'Bodrum', 'Izmir', 'Pamukkale', 'Ephesus', 'Kalkan'] },
  { code: 'UA', name: 'Ukraine', nameRu: 'Украина', nameAz: 'Ukrayna', cities: ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Vinnytsia', 'Chernivtsi'] },
  { code: 'GB', name: 'United Kingdom', nameRu: 'Великобритания', nameAz: 'Böyük Britaniya', cities: ['London', 'Edinburgh', 'Bath', 'Oxford', 'Cambridge', 'Liverpool', 'Manchester', 'York', 'Brighton', 'Stonehenge'] },
  { code: 'VA', name: 'Vatican City', nameRu: 'Ватикан', nameAz: 'Vatikan', cities: ['Vatican City'] },

  // Asia
  { code: 'AF', name: 'Afghanistan', nameRu: 'Афганистан', nameAz: 'Əfqanıstan', cities: ['Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar'] },
  { code: 'AM', name: 'Armenia', nameRu: 'Армения', nameAz: 'Ermənistan', cities: ['Yerevan', 'Gyumri', 'Dilijan', 'Tatev', 'Tsaghkadzor'] },
  { code: 'AZ', name: 'Azerbaijan', nameRu: 'Азербайджан', nameAz: 'Azərbaycan', cities: ['Baku', 'Ganja', 'Sheki', 'Shamakhi', 'Gabala'] },
  { code: 'BH', name: 'Bahrain', nameRu: 'Бахрейн', nameAz: 'Bəhreyn', cities: ['Manama', 'Riffa', 'Muharraq'] },
  { code: 'BD', name: 'Bangladesh', nameRu: 'Бангладеш', nameAz: 'Banqladeş', cities: ['Dhaka', 'Chittagong', 'Sylhet', 'Cox\'s Bazar'] },
  { code: 'BT', name: 'Bhutan', nameRu: 'Бутан', nameAz: 'Butan', cities: ['Thimphu', 'Paro', 'Punakha', 'Bumthang', 'Gangtey'] },
  { code: 'BN', name: 'Brunei', nameRu: 'Бруней', nameAz: 'Bruney', cities: ['Bandar Seri Begawan', 'Seria', 'Tutong'] },
  { code: 'KH', name: 'Cambodia', nameRu: 'Камбоджа', nameAz: 'Kamboca', cities: ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot'] },
  { code: 'CN', name: 'China', nameRu: 'Китай', nameAz: 'Çin', cities: ['Beijing', 'Shanghai', 'Hong Kong', 'Guangzhou', 'Chengdu', 'Xi\'an', 'Hangzhou', 'Shenzhen', 'Lhasa', 'Guilin'] },
  { code: 'GE', name: 'Georgia', nameRu: 'Грузия', nameAz: 'Gürcüstan', cities: ['Tbilisi', 'Batumi', 'Kutaisi', 'Mestia', 'Kazbegi', 'Telavi', 'Sighnaghi'] },
  { code: 'IN', name: 'India', nameRu: 'Индия', nameAz: 'Hindistan', cities: ['New Delhi', 'Mumbai', 'Jaipur', 'Agra', 'Varanasi', 'Goa', 'Kerala', 'Udaipur', 'Shimla', 'Darjeeling'] },
  { code: 'ID', name: 'Indonesia', nameRu: 'Индонезия', nameAz: 'İndoneziya', cities: ['Jakarta', 'Bali', 'Yogyakarta', 'Lombok', 'Raja Ampat', 'Komodo', 'Bandung'] },
  { code: 'IR', name: 'Iran', nameRu: 'Иран', nameAz: 'İran', cities: ['Tehran', 'Isfahan', 'Shiraz', 'Tabriz', 'Yazd', 'Kashan'] },
  { code: 'IQ', name: 'Iraq', nameRu: 'Ирак', nameAz: 'İraq', cities: ['Baghdad', 'Basra', 'Erbil', 'Mosul', 'Sulaymaniyah'] },
  { code: 'IL', name: 'Israel', nameRu: 'Израиль', nameAz: 'İsrail', cities: ['Jerusalem', 'Tel Aviv', 'Haifa', 'Eilat', 'Dead Sea', 'Nazareth', 'Beersheba'] },
  { code: 'JP', name: 'Japan', nameRu: 'Япония', nameAz: 'Yaponiya', cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara', 'Nagoya', 'Fukuoka', 'Sapporo', 'Mount Fuji', 'Okinawa'] },
  { code: 'JO', name: 'Jordan', nameRu: 'Иордания', nameAz: 'İordaniya', cities: ['Amman', 'Petra', 'Aqaba', 'Wadi Rum', 'Dead Sea', 'Jerash'] },
  { code: 'KZ', name: 'Kazakhstan', nameRu: 'Казахстан', nameAz: 'Qazaxıstan', cities: ['Astana', 'Almaty', 'Nur-Sultan', 'Shymkent', 'Baikonur'] },
  { code: 'KW', name: 'Kuwait', nameRu: 'Кувейт', nameAz: 'Küveyt', cities: ['Kuwait City', 'Hawalli', 'Salmiya'] },
  { code: 'KG', name: 'Kyrgyzstan', nameRu: 'Кыргызстан', nameAz: 'Qırğızıstan', cities: ['Bishkek', 'Osh', 'Karakol', 'Issyk-Kul', 'Naryn'] },
  { code: 'LA', name: 'Laos', nameRu: 'Лаос', nameAz: 'Laos', cities: ['Vientiane', 'Luang Prabang', 'Vang Vieng', 'Champasak'] },
  { code: 'LB', name: 'Lebanon', nameRu: 'Ливан', nameAz: 'Livan', cities: ['Beirut', 'Tripoli', 'Byblos', 'Baalbek', 'Sidon', 'Tyre'] },
  { code: 'MY', name: 'Malaysia', nameRu: 'Малайзия', nameAz: 'Malayziya', cities: ['Kuala Lumpur', 'Langkawi', 'Penang', 'Kota Kinabalu', 'George Town', 'Malacca'] },
  { code: 'MV', name: 'Maldives', nameRu: 'Мальдивы', nameAz: 'Maldiv adaları', cities: ['Malé', 'Ari Atoll', 'Baa Atoll', 'South Malé Atoll', 'Laamu Atoll'] },
  { code: 'MN', name: 'Mongolia', nameRu: 'Монголия', nameAz: 'Monqolustan', cities: ['Ulaanbaatar', 'Karakorum', 'Khövsgöl', 'Gobi Desert', 'Terelj'] },
  { code: 'MM', name: 'Myanmar', nameRu: 'Мьянма', nameAz: 'Myanma', cities: ['Yangon', 'Mandalay', 'Bagan', 'Inle Lake', 'Naypyidaw'] },
  { code: 'NP', name: 'Nepal', nameRu: 'Непал', nameAz: 'Nepal', cities: ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Bhaktapur', 'Nagarkot'] },
  { code: 'OM', name: 'Oman', nameRu: 'Оман', nameAz: 'Oman', cities: ['Muscat', 'Salalah', 'Nizwa', 'Sur', 'Wahiba Sands'] },
  { code: 'PK', name: 'Pakistan', nameRu: 'Пакистан', nameAz: 'Pakistan', cities: ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Gilgit', 'Hunza'] },
  { code: 'PH', name: 'Philippines', nameRu: 'Филиппины', nameAz: 'Filippin', cities: ['Manila', 'Cebu', 'Palawan', 'Boracay', 'Siargao', 'Bohol', 'Davao'] },
  { code: 'QA', name: 'Qatar', nameRu: 'Катар', nameAz: 'Qətər', cities: ['Doha', 'Al Wakrah', 'Lusail', 'Al Khor'] },
  { code: 'SA', name: 'Saudi Arabia', nameRu: 'Саудовская Аравия', nameAz: 'Səudiyyə Ərəbistanı', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Al Ula', 'NEOM'] },
  { code: 'SG', name: 'Singapore', nameRu: 'Сингапур', nameAz: 'Sinqapur', cities: ['Singapore'] },
  { code: 'KR', name: 'South Korea', nameRu: 'Южная Корея', nameAz: 'Cənubi Koreya', cities: ['Seoul', 'Busan', 'Jeju', 'Incheon', 'Gyeongju', 'Gangneung'] },
  { code: 'LK', name: 'Sri Lanka', nameRu: 'Шри-Ланка', nameAz: 'Şri-Lanka', cities: ['Colombo', 'Kandy', 'Sigiriya', 'Ella', 'Galle', 'Nuwara Eliya'] },
  { code: 'SY', name: 'Syria', nameRu: 'Сирия', nameAz: 'Suriya', cities: ['Damascus', 'Aleppo', 'Palmyra', 'Hama', 'Latakia'] },
  { code: 'TW', name: 'Taiwan', nameRu: 'Тайвань', nameAz: 'Tayvan', cities: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Hualien', 'Kenting'] },
  { code: 'TJ', name: 'Tajikistan', nameRu: 'Таджикистан', nameAz: 'Tacikistan', cities: ['Dushanbe', 'Khorog', 'Panjikent', 'Fann Mountains'] },
  { code: 'TH', name: 'Thailand', nameRu: 'Таиланд', nameAz: 'Tayland', cities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Pattaya', 'Koh Samui', 'Ayutthaya', 'Pai', 'Phi Phi Islands'] },
  { code: 'TL', name: 'Timor-Leste', nameRu: 'Восточный Тимор', nameAz: 'Şərqi Timor', cities: ['Dili', 'Baucau', 'Lospalos'] },
  { code: 'AE', name: 'United Arab Emirates', nameRu: 'ОАЭ', nameAz: 'BƏA', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'] },
  { code: 'UZ', name: 'Uzbekistan', nameRu: 'Узбекистан', nameAz: 'Özbəkistan', cities: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva', 'Nukus', 'Fergana'] },
  { code: 'VN', name: 'Vietnam', nameRu: 'Вьетнам', nameAz: 'Vyetnam', cities: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An', 'Ha Long Bay', 'Nha Trang', 'Sapa', 'Phú Quốc'] },
  { code: 'YE', name: 'Yemen', nameRu: 'Йемен', nameAz: 'Yəmən', cities: ['Sana\'a', 'Aden', 'Socotra', 'Shibam'] },

  // Africa
  { code: 'DZ', name: 'Algeria', nameRu: 'Алжир', nameAz: 'Əlcəzir', cities: ['Algiers', 'Oran', 'Constantine', 'Tlemcen', 'Ghardaia'] },
  { code: 'AO', name: 'Angola', nameRu: 'Ангола', nameAz: 'Anqola', cities: ['Luanda', 'Benguela', 'Lubango'] },
  { code: 'BJ', name: 'Benin', nameRu: 'Бенин', nameAz: 'Benin', cities: ['Porto-Novo', 'Cotonou', 'Ganvié'] },
  { code: 'BW', name: 'Botswana', nameRu: 'Ботсвана', nameAz: 'Botsvana', cities: ['Gaborone', 'Maun', 'Kasane', 'Chobe'] },
  { code: 'BF', name: 'Burkina Faso', nameRu: 'Буркина-Фасо', nameAz: 'Burkina-Faso', cities: ['Ouagadougou', 'Bobo-Dioulasso'] },
  { code: 'BI', name: 'Burundi', nameRu: 'Бурунди', nameAz: 'Burundi', cities: ['Bujumbura', 'Gitega'] },
  { code: 'CV', name: 'Cape Verde', nameRu: 'Кабо-Верде', nameAz: 'Kabo-Verde', cities: ['Praia', 'Mindelo', 'Sal', 'Boa Vista'] },
  { code: 'CM', name: 'Cameroon', nameRu: 'Камерун', nameAz: 'Kamerun', cities: ['Yaoundé', 'Douala', 'Bamenda'] },
  { code: 'CF', name: 'Central African Republic', nameRu: 'ЦАР', nameAz: 'Mərkəzi Afrika Respublikası', cities: ['Bangui', 'Bimbo'] },
  { code: 'TD', name: 'Chad', nameRu: 'Чад', nameAz: 'Çad', cities: ['N\'Djamena', 'Moundou'] },
  { code: 'KM', name: 'Comoros', nameRu: 'Коморы', nameAz: 'Komor adaları', cities: ['Moroni', 'Mutsamudu', 'Fomboni'] },
  { code: 'CG', name: 'Congo', nameRu: 'Конго', nameAz: 'Kongo', cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie'] },
  { code: 'CD', name: 'DR Congo', nameRu: 'ДР Конго', nameAz: 'DR Konqo', cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Goma'] },
  { code: 'CI', name: 'Côte d\'Ivoire', nameRu: 'Кот-д\'Ивуар', nameAz: 'Kot-dİvuar', cities: ['Yamoussoukro', 'Abidjan', 'Bouaké'] },
  { code: 'DJ', name: 'Djibouti', nameRu: 'Джибути', nameAz: 'Cibuti', cities: ['Djibouti City', 'Ali Sabieh', 'Obock'] },
  { code: 'EG', name: 'Egypt', nameRu: 'Египет', nameAz: 'Misir', cities: ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'Giza', 'Dahab'] },
  { code: 'GQ', name: 'Equatorial Guinea', nameRu: 'Экваториальная Гвинея', nameAz: 'Ekvatorial Qvineya', cities: ['Malabo', 'Bata'] },
  { code: 'ER', name: 'Eritrea', nameRu: 'Эритрея', nameAz: 'Eritreya', cities: ['Asmara', 'Keren', 'Massawa'] },
  { code: 'SZ', name: 'Eswatini', nameRu: 'Эсватини', nameAz: 'Esvatini', cities: ['Mbabane', 'Manzini', 'Lobamba'] },
  { code: 'ET', name: 'Ethiopia', nameRu: 'Эфиопия', nameAz: 'Efiopiya', cities: ['Addis Ababa', 'Lalibela', 'Axum', 'Gondar', 'Bahir Dar', 'Harar'] },
  { code: 'GA', name: 'Gabon', nameRu: 'Габон', nameAz: 'Qabon', cities: ['Libreville', 'Port-Gentil', 'Franceville'] },
  { code: 'GM', name: 'Gambia', nameRu: 'Гамбия', nameAz: 'Qambiya', cities: ['Banjul', 'Serekunda', 'Bakau'] },
  { code: 'GH', name: 'Ghana', nameRu: 'Гана', nameAz: 'Qana', cities: ['Accra', 'Kumasi', 'Cape Coast', 'Tamale'] },
  { code: 'GN', name: 'Guinea', nameRu: 'Гвинея', nameAz: 'Qvineya', cities: ['Conakry', 'Kankan', 'Labé'] },
  { code: 'GW', name: 'Guinea-Bissau', nameRu: 'Гвинея-Бисау', nameAz: 'Qvineya-Bisau', cities: ['Bissau', 'Bafatá', 'Cacheu'] },
  { code: 'KE', name: 'Kenya', nameRu: 'Кения', nameAz: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Masai Mara', 'Amboseli'] },
  { code: 'LS', name: 'Lesotho', nameRu: 'Лесото', nameAz: 'Lesoto', cities: ['Maseru', 'Teyateyaneng', 'Thaba-Tseka'] },
  { code: 'LR', name: 'Liberia', nameRu: 'Либерия', nameAz: 'Liberiya', cities: ['Monrovia', 'Gbarnga', 'Harper'] },
  { code: 'LY', name: 'Libya', nameRu: 'Ливия', nameAz: 'Liviya', cities: ['Tripoli', 'Benghazi', 'Misrata', 'Sabratha'] },
  { code: 'MG', name: 'Madagascar', nameRu: 'Мадагаскар', nameAz: 'Madaqaskar', cities: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Antsiranana'] },
  { code: 'MW', name: 'Malawi', nameRu: 'Малави', nameAz: 'Malavi', cities: ['Lilongwe', 'Blantyre', 'Mangochi'] },
  { code: 'ML', name: 'Mali', nameRu: 'Мали', nameAz: 'Mali', cities: ['Bamako', 'Mopti', 'Timbuktu', 'Djenné'] },
  { code: 'MR', name: 'Mauritania', nameRu: 'Мавритания', nameAz: 'Mavritaniya', cities: ['Nouakchott', 'Nouadhibou', 'Chinguetti'] },
  { code: 'MU', name: 'Mauritius', nameRu: 'Маврикий', nameAz: 'Mavriki', cities: ['Port Louis', 'Curepipe', 'Flic en Flac', 'Grand Baie'] },
  { code: 'MA', name: 'Morocco', nameRu: 'Марокко', nameAz: 'Mərakeş', cities: ['Marrakech', 'Casablanca', 'Fez', 'Chefchaouen', 'Tangier', 'Essaouira', 'Rabat', 'Agadir'] },
  { code: 'MZ', name: 'Mozambique', nameRu: 'Мозамбик', nameAz: 'Mozambik', cities: ['Maputo', 'Beira', 'Inhambane', 'Tofo'] },
  { code: 'NA', name: 'Namibia', nameRu: 'Намибия', nameAz: 'Namibiya', cities: ['Windhoek', 'Swakopmund', 'Walvis Bay', 'Sossusvlei', 'Etosha'] },
  { code: 'NE', name: 'Niger', nameRu: 'Нигер', nameAz: 'Niger', cities: ['Niamey', 'Agadez', 'Zinder'] },
  { code: 'NG', name: 'Nigeria', nameRu: 'Нигерия', nameAz: 'Nigeliya', cities: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Benin City'] },
  { code: 'RW', name: 'Rwanda', nameRu: 'Руанда', nameAz: 'Ruanda', cities: ['Kigali', 'Butare', 'Gisenyi'] },
  { code: 'ST', name: 'São Tomé and Príncipe', nameRu: 'Сан-Томе и Принсипи', nameAz: 'San-Tome və Prinsipi', cities: ['São Tomé', 'Santo Amaro'] },
  { code: 'SN', name: 'Senegal', nameRu: 'Сенегал', nameAz: 'Senegal', cities: ['Dakar', 'Saint-Louis', 'Ziguinchor', 'Gorée Island'] },
  { code: 'SC', name: 'Seychelles', nameRu: 'Сейшелы', nameAz: 'Seyşel adaları', cities: ['Victoria', 'Mahé', 'Praslin', 'La Digue'] },
  { code: 'SL', name: 'Sierra Leone', nameRu: 'Сьерра-Леоне', nameAz: 'Syerra-Leone', cities: ['Freetown', 'Bo', 'Kenema'] },
  { code: 'SO', name: 'Somalia', nameRu: 'Сомали', nameAz: 'Somali', cities: ['Mogadishu', 'Hargeisa', 'Kismayo'] },
  { code: 'ZA', name: 'South Africa', nameRu: 'ЮАР', nameAz: 'Cənub Afrika Respublikası', cities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Kruger National Park', 'Garden Route', 'Stellenbosch'] },
  { code: 'SS', name: 'South Sudan', nameRu: 'Южный Судан', nameAz: 'Cənub Sudan', cities: ['Juba', 'Malakal', 'Wau'] },
  { code: 'SD', name: 'Sudan', nameRu: 'Судан', nameAz: 'Sudan', cities: ['Khartoum', 'Omdurman', 'Port Sudan'] },
  { code: 'TZ', name: 'Tanzania', nameRu: 'Танзания', nameAz: 'Tanzaniya', cities: ['Dar es Salaam', 'Zanzibar', 'Arusha', 'Serengeti', 'Ngorongoro', 'Kilimanjaro', 'Moshi'] },
  { code: 'TG', name: 'Togo', nameRu: 'Того', nameAz: 'Toqo', cities: ['Lomé', 'Kara', 'Sokodé'] },
  { code: 'TN', name: 'Tunisia', nameRu: 'Тунис', nameAz: 'Tunis', cities: ['Tunis', 'Sousse', 'Sidi Bou Said', 'Djerba', 'Tozeur', 'Dougga'] },
  { code: 'UG', name: 'Uganda', nameRu: 'Уганда', nameAz: 'Uqanda', cities: ['Kampala', 'Entebbe', 'Jinja', 'Murchison Falls'] },
  { code: 'ZM', name: 'Zambia', nameRu: 'Замбия', nameAz: 'Zambiya', cities: ['Lusaka', 'Livingstone', 'Victoria Falls'] },
  { code: 'ZW', name: 'Zimbabwe', nameRu: 'Зимбабве', nameAz: 'Zimbabve', cities: ['Harare', 'Bulawayo', 'Victoria Falls', 'Great Zimbabwe'] },

  // North America
  { code: 'AG', name: 'Antigua and Barbuda', nameRu: 'Антигуа и Барбуда', nameAz: 'Antiqua və Barbuda', cities: ['St. John\'s', 'All Saints'] },
  { code: 'BS', name: 'Bahamas', nameRu: 'Багамы', nameAz: 'Baham adaları', cities: ['Nassau', 'Freeport', 'Eleuthera', 'Exuma'] },
  { code: 'BB', name: 'Barbados', nameRu: 'Барбадос', nameAz: 'Barbados', cities: ['Bridgetown', 'Speightstown', 'Holetown'] },
  { code: 'BZ', name: 'Belize', nameRu: 'Белиз', nameAz: 'Beliz', cities: ['Belize City', 'San Ignacio', 'Ambergris Caye', 'Placencia'] },
  { code: 'CA', name: 'Canada', nameRu: 'Канада', nameAz: 'Kanada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Quebec City', 'Banff', 'Niagara Falls'] },
  { code: 'CR', name: 'Costa Rica', nameRu: 'Коста-Рика', nameAz: 'Kosta-Rika', cities: ['San José', 'Arenal', 'Manuel Antonio', 'Monteverde', 'Tamarindo', 'Tortuguero', 'Puerto Viejo'] },
  { code: 'CU', name: 'Cuba', nameRu: 'Куба', nameAz: 'Kuba', cities: ['Havana', 'Trinidad', 'Santiago de Cuba', 'Varadero', 'Viñales'] },
  { code: 'DM', name: 'Dominica', nameRu: 'Доминика', nameAz: 'Dominika', cities: ['Roseau', 'Portsmouth'] },
  { code: 'DO', name: 'Dominican Republic', nameRu: 'Доминиканская Республика', nameAz: 'Dominikan Respublikası', cities: ['Santo Domingo', 'Punta Cana', 'Samaná', 'Puerto Plata'] },
  { code: 'SV', name: 'El Salvador', nameRu: 'Сальвадор', nameAz: 'Salvador', cities: ['San Salvador', 'Santa Ana', 'La Libertad'] },
  { code: 'GD', name: 'Grenada', nameRu: 'Гренада', nameAz: 'Qrenada', cities: ['St. George\'s', 'Grenville'] },
  { code: 'GT', name: 'Guatemala', nameRu: 'Гватемала', nameAz: 'Qvatemala', cities: ['Guatemala City', 'Antigua Guatemala', 'Lake Atitlán', 'Tikal', 'Chichicastenango'] },
  { code: 'HT', name: 'Haiti', nameRu: 'Гаити', nameAz: 'Haiti', cities: ['Port-au-Prince', 'Cap-Haïtien', 'Jacmel'] },
  { code: 'HN', name: 'Honduras', nameRu: 'Гондурас', nameAz: 'Honduras', cities: ['Tegucigalpa', 'Roatán', 'Copán', 'Utila'] },
  { code: 'JM', name: 'Jamaica', nameRu: 'Ямайка', nameAz: 'Yamayka', cities: ['Kingston', 'Montego Bay', 'Ocho Rios', 'Negril', 'Port Antonio'] },
  { code: 'MX', name: 'Mexico', nameRu: 'Мексика', nameAz: 'Meksika', cities: ['Mexico City', 'Cancún', 'Tulum', 'Playa del Carmen', 'Oaxaca', 'Guadalajara', 'Monterrey', 'San Miguel de Allende', 'Puerto Vallarta', 'Cabo San Lucas'] },
  { code: 'NI', name: 'Nicaragua', nameRu: 'Никарагуа', nameAz: 'Nikaragua', cities: ['Managua', 'León', 'Granada', 'San Juan del Sur', 'Ometepe'] },
  { code: 'PA', name: 'Panama', nameRu: 'Панама', nameAz: 'Panama', cities: ['Panama City', 'Bocas del Toro', 'San Blas Islands', 'David'] },
  { code: 'KN', name: 'Saint Kitts and Nevis', nameRu: 'Сент-Китс и Невис', nameAz: 'Sent-Kits və Nevis', cities: ['Basseterre', 'Charlestown'] },
  { code: 'LC', name: 'Saint Lucia', nameRu: 'Сент-Люсия', nameAz: 'Sent-Lüsiya', cities: ['Castries', 'Soufrière', 'Rodney Bay'] },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', nameRu: 'Сент-Винсент и Гренадины', nameAz: 'Sent-Vinsent və Qrenadinlər', cities: ['Kingstown', 'Bequia', 'Canouan'] },
  { code: 'TT', name: 'Trinidad and Tobago', nameRu: 'Тринидад и Тобаго', nameAz: 'Trinidad və Tobaqo', cities: ['Port of Spain', 'Scarborough', 'Chaguaramas'] },
  { code: 'US', name: 'United States', nameRu: 'США', nameAz: 'ABŞ', cities: ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami', 'Chicago', 'Honolulu', 'Orlando', 'Boston', 'Seattle', 'Washington D.C.', 'Austin', 'Nashville', 'Denver'] },

  // South America
  { code: 'AR', name: 'Argentina', nameRu: 'Аргентина', nameAz: 'Argentina', cities: ['Buenos Aires', 'Bariloche', 'Mendoza', 'Ushuaia', 'Salta', 'Córdoba', 'Iguazu Falls', 'El Calafate'] },
  { code: 'BO', name: 'Bolivia', nameRu: 'Боливия', nameAz: 'Boliviya', cities: ['La Paz', 'Sucre', 'Uyuni', 'Cochabamba', 'Santa Cruz'] },
  { code: 'BR', name: 'Brazil', nameRu: 'Бразилия', nameAz: 'Braziliya', cities: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Fortaleza', 'Brasília', 'Manaus', 'Recife', 'Búzios', 'Florianópolis'] },
  { code: 'CL', name: 'Chile', nameRu: 'Чили', nameAz: 'Çili', cities: ['Santiago', 'Valparaíso', 'Atacama', 'Punta Arenas', 'Torres del Paine', 'Isla de Pascua', 'Viña del Mar'] },
  { code: 'CO', name: 'Colombia', nameRu: 'Колумбия', nameAz: 'Kolumbiya', cities: ['Bogotá', 'Cartagena', 'Medellín', 'Cali', 'Santa Marta', 'Salento', 'San Agustín'] },
  { code: 'EC', name: 'Ecuador', nameRu: 'Эквадор', nameAz: 'Ekvador', cities: ['Quito', 'Guayaquil', 'Cuenca', 'Galápagos Islands', 'Baños', 'Otavalo'] },
  { code: 'GY', name: 'Guyana', nameRu: 'Гайана', nameAz: 'Qayana', cities: ['Georgetown', 'Lethem'] },
  { code: 'PY', name: 'Paraguay', nameRu: 'Парагвай', nameAz: 'Parqvay', cities: ['Asunción', 'Encarnación', 'Ciudad del Este'] },
  { code: 'PE', name: 'Peru', nameRu: 'Перу', nameAz: 'Peru', cities: ['Lima', 'Cusco', 'Machu Picchu', 'Arequipa', 'Sacred Valley', 'Nazca', 'Iquitos', 'Lake Titicaca'] },
  { code: 'SR', name: 'Suriname', nameRu: 'Суринам', nameAz: 'Surinam', cities: ['Paramaribo', 'Lelydorp'] },
  { code: 'UY', name: 'Uruguay', nameRu: 'Уругвай', nameAz: 'Uruqvay', cities: ['Montevideo', 'Punta del Este', 'Colonia del Sacramento', 'Cabo Polonio'] },
  { code: 'VE', name: 'Venezuela', nameRu: 'Венесуэла', nameAz: 'Venesuela', cities: ['Caracas', 'Maracaibo', 'Valencia', 'Isla Margarita', 'Angel Falls'] },

  // Oceania
  { code: 'AU', name: 'Australia', nameRu: 'Австралия', nameAz: 'Avstraliya', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast', 'Cairns', 'Great Barrier Reef', 'Uluru', 'Adelaide', 'Hobart'] },
  { code: 'FJ', name: 'Fiji', nameRu: 'Фиджи', nameAz: 'Fici', cities: ['Suva', 'Nadi', 'Denarau Island', 'Mamanuca Islands'] },
  { code: 'KI', name: 'Kiribati', nameRu: 'Кирибати', nameAz: 'Kiribati', cities: ['Tarawa', 'Kiritimati'] },
  { code: 'MH', name: 'Marshall Islands', nameRu: 'Маршалловы Острова', nameAz: 'Marşall adaları', cities: ['Majuro', 'Kwajalein'] },
  { code: 'FM', name: 'Micronesia', nameRu: 'Микронезия', nameAz: 'Mikroneziya', cities: ['Palikir', 'Pohnpei', 'Kosrae'] },
  { code: 'NR', name: 'Nauru', nameRu: 'Науру', nameAz: 'Nauru', cities: ['Yaren', 'Denigomodu'] },
  { code: 'NZ', name: 'New Zealand', nameRu: 'Новая Зеландия', nameAz: 'Yeni Zelandiya', cities: ['Auckland', 'Queenstown', 'Christchurch', 'Wellington', 'Rotorua', 'Milford Sound', 'Hobbiton', 'Wanaka'] },
  { code: 'PW', name: 'Palau', nameRu: 'Палау', nameAz: 'Palau', cities: ['Ngerulmud', 'Koror'] },
  { code: 'PG', name: 'Papua New Guinea', nameRu: 'Папуа — Новая Гвинея', nameAz: 'Papua-Yeni Qvineya', cities: ['Port Moresby', 'Lae', 'Mt. Hagen'] },
  { code: 'WS', name: 'Samoa', nameRu: 'Самоа', nameAz: 'Samoa', cities: ['Apia', 'Asau'] },
  { code: 'SB', name: 'Solomon Islands', nameRu: 'Соломоновы Острова', nameAz: 'Solomon adaları', cities: ['Honiara', 'Gizo'] },
  { code: 'TO', name: 'Tonga', nameRu: 'Тонга', nameAz: 'Tonqa', cities: ['Nuku\'alofa', 'Vava\'u'] },
  { code: 'TV', name: 'Tuvalu', nameRu: 'Тувалу', nameAz: 'Tuvalu', cities: ['Funafuti'] },
  { code: 'VU', name: 'Vanuatu', nameRu: 'Вануату', nameAz: 'Vanuatu', cities: ['Port Vila', 'Santo'] },
];

// Tourism Services organized by categories
export interface ServiceCategory {
  id: string;
  name: string;
  nameRu: string;
  nameAz: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  nameRu: string;
  nameAz: string;
  icon?: string;
}

export const serviceCategories: ServiceCategory[] = [
  // Приключения и активный отдых
  {
    id: 'adventure',
    name: 'Adventure & Active Recreation',
    nameRu: 'Приключения и активный отдых',
    nameAz: 'Macəra və aktiv istirahət',
    services: [
      { id: 'adventure', name: 'Adventure', nameRu: 'Приключения', nameAz: 'Macəra' },
      { id: 'hiking', name: 'Hiking', nameRu: 'Хайкинг', nameAz: 'Gəzinti' },
      { id: 'trekking', name: 'Trekking', nameRu: 'Треккинг', nameAz: 'Trekking' },
      { id: 'mountaineering', name: 'Mountaineering', nameRu: 'Альпинизм', nameAz: 'Dağcılık' },
      { id: 'camping', name: 'Camping', nameRu: 'Кемпинг', nameAz: 'Kempinq' },
      { id: 'glamping', name: 'Glamping', nameRu: 'Глэмпинг', nameAz: 'Qlamping' },
      { id: 'survival', name: 'Survival', nameRu: 'Выживание', nameAz: 'Həyatda qalma' },
      { id: 'jungle-expedition', name: 'Jungle Expedition', nameRu: 'Экспедиция в джунгли', nameAz: 'Cəngəllik ekspedisiyası' },
      { id: 'safari', name: 'Safari', nameRu: 'Сафари', nameAz: 'Safari' },
      { id: 'rafting', name: 'Rafting', nameRu: 'Рафтинг', nameAz: 'Raftinq' },
      { id: 'kayaking', name: 'Kayaking', nameRu: 'Каякинг', nameAz: 'Kayakinq' },
      { id: 'canoeing', name: 'Canoeing', nameRu: 'Гребля на каноэ', nameAz: 'Kano ilə üzmə' },
      { id: 'rock-climbing', name: 'Rock Climbing', nameRu: 'Скалолазание', nameAz: 'Qaya dırmanması' },
      { id: 'caving', name: 'Caving', nameRu: 'Спелеология', nameAz: 'Mağara araşdırması' },
      { id: 'atv-tours', name: 'ATV Tours', nameRu: 'Туры на квадроциклах', nameAz: 'ATV turları' },
      { id: 'jeep-tours', name: 'Jeep Tours', nameRu: 'Джип-туры', nameAz: 'Cip turları' },
      { id: 'motorcycle-tours', name: 'Motorcycle Tours', nameRu: 'Мототуры', nameAz: 'Motosiklet turları' },
      { id: 'cycling-tours', name: 'Cycling Tours', nameRu: 'Велотуры', nameAz: 'Velosiped turları' },
      { id: 'ski-trips', name: 'Ski Trips', nameRu: 'Лыжные туры', nameAz: 'Xizək səfərləri' },
      { id: 'snowboard-trips', name: 'Snowboard Trips', nameRu: 'Сноуборд-туры', nameAz: 'Snowboard səfərləri' },
      { id: 'snowmobile-tours', name: 'Snowmobile Tours', nameRu: 'Туры на снегоходах', nameAz: 'Snowmobile turları' },
      { id: 'paragliding', name: 'Paragliding', nameRu: 'Парашютный спорт', nameAz: 'Pərəducu ilə uçuş' },
      { id: 'skydiving', name: 'Skydiving', nameRu: 'Прыжки с парашютом', nameAz: 'Paraşütlə tullanma' },
      { id: 'bungee-jumping', name: 'Bungee Jumping', nameRu: 'Банджи-джампинг', nameAz: 'Banji Cümpinq' },
    ],
  },

  // Морские путешествия
  {
    id: 'maritime',
    name: 'Maritime Travel',
    nameRu: 'Морские путешествия',
    nameAz: 'Dəniz səyahətləri',
    services: [
      { id: 'beach-holidays', name: 'Beach Holidays', nameRu: 'Пляжный отдых', nameAz: 'Çimərlik istirahəti' },
      { id: 'island-hopping', name: 'Island Hopping', nameRu: 'Переезд между островами', nameAz: 'Ada keçidləri' },
      { id: 'sailing', name: 'Sailing', nameRu: 'Парусный спорт', nameAz: 'Yelkənli gəmi' },
      { id: 'yacht-trips', name: 'Yacht Trips', nameRu: 'Яхтенные туры', nameAz: 'Yaxta səfərləri' },
      { id: 'catamaran-tours', name: 'Catamaran Tours', nameRu: 'Туры на катамаранах', nameAz: 'Katamaran turları' },
      { id: 'cruise-trips', name: 'Cruise Trips', nameRu: 'Круизы', nameAz: 'Kruiz səfərləri' },
      { id: 'diving', name: 'Diving', nameRu: 'Дайвинг', nameAz: 'Dalgıçlıq' },
      { id: 'scuba-diving', name: 'Scuba Diving', nameRu: 'Подводное плавание', nameAz: 'Akvakulman ilə dalgıçlıq' },
      { id: 'freediving', name: 'Freediving', nameRu: 'Фридайвинг', nameAz: 'Fridayvinq' },
      { id: 'snorkeling', name: 'Snorkeling', nameRu: 'Снорклинг', nameAz: 'Snoorklinq' },
      { id: 'surfing', name: 'Surfing', nameRu: 'Сёрфинг', nameAz: 'Surfinq' },
      { id: 'kitesurfing', name: 'Kitesurfing', nameRu: 'Кайтсёрфинг', nameAz: 'Kayt-surfinq' },
      { id: 'windsurfing', name: 'Windsurfing', nameRu: 'Виндсёрфинг', nameAz: 'Vind-surfinq' },
      { id: 'fishing-trips', name: 'Fishing Trips', nameRu: 'Рыбалка', nameAz: 'Balıqçılıq səfərləri' },
      { id: 'whale-watching', name: 'Whale Watching', nameRu: 'Наблюдение за китами', nameAz: 'Balinalara baxış' },
    ],
  },

  // Культурный туризм
  {
    id: 'cultural',
    name: 'Cultural Tourism',
    nameRu: 'Культурный туризм',
    nameAz: 'Mədəni turizm',
    services: [
      { id: 'cultural-tours', name: 'Cultural Tours', nameRu: 'Культурные туры', nameAz: 'Mədəni turlar' },
      { id: 'historical-tours', name: 'Historical Tours', nameRu: 'Исторические туры', nameAz: 'Tarixi turlar' },
      { id: 'heritage-tours', name: 'Heritage Tours', nameRu: 'Туры по наследию', nameAz: 'İrs turları' },
      { id: 'museum-tours', name: 'Museum Tours', nameRu: 'Музейные туры', nameAz: 'Muzey turları' },
      { id: 'archaeology-tours', name: 'Archaeology Tours', nameRu: 'Археологические туры', nameAz: 'Arxeologiya turları' },
      { id: 'religious-tours', name: 'Religious Tours', nameRu: 'Религиозные туры', nameAz: 'Dini turlar' },
      { id: 'pilgrimage-tours', name: 'Pilgrimage Tours', nameRu: 'Паломнические туры', nameAz: 'Ziyarət turları' },
      { id: 'unesco-tours', name: 'UNESCO Tours', nameRu: 'Туры по ЮНЕСКО', nameAz: 'YUNESKO turları' },
      { id: 'local-experience-tours', name: 'Local Experience Tours', nameRu: 'Местные туры', nameAz: 'Yerli təcrübə turları' },
      { id: 'traditional-villages', name: 'Traditional Villages', nameRu: 'Традиционные деревни', nameAz: 'Ənənəvi kəndlər' },
    ],
  },

  // Городской туризм
  {
    id: 'urban',
    name: 'Urban Tourism',
    nameRu: 'Городской туризм',
    nameAz: 'Şəhər turizmi',
    services: [
      { id: 'city-breaks', name: 'City Breaks', nameRu: 'Городские поездки', nameAz: 'Şəhər fasilələri' },
      { id: 'weekend-trips', name: 'Weekend Trips', nameRu: 'Выходные', nameAz: 'Həftəsonu səfərləri' },
      { id: 'urban-exploration', name: 'Urban Exploration', nameRu: 'Городские исследования', nameAz: 'Şəhər araşdırması' },
      { id: 'nightlife-tours', name: 'Nightlife Tours', nameRu: 'Ночная жизнь', nameAz: 'Gecə həyatı turları' },
      { id: 'shopping-tours', name: 'Shopping Tours', nameRu: 'Шоппинг-туры', nameAz: 'Alış-veriş turları' },
      { id: 'architecture-tours', name: 'Architecture Tours', nameRu: 'Архитектурные туры', nameAz: 'Memarlıq turları' },
      { id: 'street-art-tours', name: 'Street Art Tours', nameRu: 'Туры по стрит-арту', nameAz: 'Küçə sənəti turları' },
    ],
  },

  // Люкс
  {
    id: 'luxury',
    name: 'Luxury',
    nameRu: 'Люкс',
    nameAz: 'Lüks',
    services: [
      { id: 'luxury-travel', name: 'Luxury Travel', nameRu: 'Люкс-путешествия', nameAz: 'Lüks səyahət' },
      { id: 'vip-travel', name: 'VIP Travel', nameRu: 'VIP-путешествия', nameAz: 'VIP səyahət' },
      { id: 'private-jet-trips', name: 'Private Jet Trips', nameRu: 'Частные джеты', nameAz: 'Şəxsi təyyarə səfərləri' },
      { id: 'yacht-luxury-tours', name: 'Yacht Luxury Tours', nameRu: 'Люкс-яхтенные туры', nameAz: 'Lüks yaxta turları' },
      { id: 'premium-resorts', name: 'Premium Resorts', nameRu: 'Премиум-курорты', nameAz: 'Premium kurortlar' },
      { id: 'five-star-experiences', name: 'Five-Star Experiences', nameRu: 'Пятизвёздочный отдых', nameAz: 'Beş ulduzlu təcrübələr' },
      { id: 'exclusive-experiences', name: 'Exclusive Experiences', nameRu: 'Эксклюзивный отдых', nameAz: 'Eksklüziv təcrübələr' },
    ],
  },

  // Бюджетные путешествия
  {
    id: 'budget',
    name: 'Budget Travel',
    nameRu: 'Бюджетные путешествия',
    nameAz: 'Büdcə səyahətləri',
    services: [
      { id: 'backpacking', name: 'Backpacking', nameRu: 'Бэкпекинг', nameAz: 'Bəkbekinq' },
      { id: 'budget-travel', name: 'Budget Travel', nameRu: 'Бюджетные путешествия', nameAz: 'Büdcə səyahət' },
      { id: 'student-travel', name: 'Student Travel', nameRu: 'Студенческие путешествия', nameAz: 'Tələbə səyahət' },
      { id: 'hostel-trips', name: 'Hostel Trips', nameRu: 'Хостел-поездки', nameAz: 'Hostel səfərləri' },
      { id: 'low-cost-adventures', name: 'Low-Cost Adventures', nameRu: 'Бюджетные приключения', nameAz: 'Aşağı büdcəli macəralar' },
    ],
  },

  // Wellness и здоровье
  {
    id: 'wellness',
    name: 'Wellness & Health',
    nameRu: 'Wellness и здоровье',
    nameAz: 'Sağlamlıq və wellness',
    services: [
      { id: 'wellness-retreats', name: 'Wellness Retreats', nameRu: 'Wellness-ретриты', nameAz: 'Sağlamlıq retritləri' },
      { id: 'yoga-retreats', name: 'Yoga Retreats', nameRu: 'Йога-ретриты', nameAz: 'Yoga retritləri' },
      { id: 'meditation-retreats', name: 'Meditation Retreats', nameRu: 'Медитативные ретриты', nameAz: 'Meditasiya retritləri' },
      { id: 'detox-retreats', name: 'Detox Retreats', nameRu: 'Детокс-ретриты', nameAz: 'Detoks retritləri' },
      { id: 'spa-tours', name: 'Spa Tours', nameRu: 'СПА-туры', nameAz: 'SPA turları' },
      { id: 'mental-wellness-trips', name: 'Mental Wellness Trips', nameRu: 'Путешествия для ментального здоровья', nameAz: 'Mental sağlamlıq səfərləri' },
      { id: 'healing-retreats', name: 'Healing Retreats', nameRu: 'Исцеляющие ретриты', nameAz: 'Müalicə retritləri' },
    ],
  },

  // Digital Nomad
  {
    id: 'digital-nomad',
    name: 'Digital Nomad',
    nameRu: 'Digital Nomad',
    nameAz: 'Rəqəmsal nomad',
    services: [
      { id: 'digital-nomad-trips', name: 'Digital Nomad Trips', nameRu: 'Путешествия для digital nomads', nameAz: 'Rəqəmsal nomad səfərləri' },
      { id: 'remote-work-retreats', name: 'Remote Work Retreats', nameRu: 'Ретриты для удалённой работы', nameAz: 'Uzaqdan iş retritləri' },
      { id: 'coworking-travel', name: 'Coworking Travel', nameRu: 'Коворкинг-путешествия', nameAz: 'Kovorkinq səyahət' },
      { id: 'startup-travel', name: 'Startup Travel', nameRu: 'Путешествия для стартапов', nameAz: 'Startap səyahət' },
      { id: 'entrepreneur-retreats', name: 'Entrepreneur Retreats', nameRu: 'Ретриты для предпринимателей', nameAz: 'Sahibkar retritləri' },
    ],
  },

  // Фотография и контент
  {
    id: 'photography',
    name: 'Photography & Content',
    nameRu: 'Фотография и контент',
    nameAz: 'Fotoqrafiya və kontent',
    services: [
      { id: 'photography-tours', name: 'Photography Tours', nameRu: 'Фото-туры', nameAz: 'Fotoqrafiya turları' },
      { id: 'drone-photography-tours', name: 'Drone Photography Tours', nameRu: 'Туры с дроном', nameAz: 'Dron fotoqrafiya turları' },
      { id: 'content-creator-trips', name: 'Content Creator Trips', nameRu: 'Поездки для блогеров', nameAz: 'Kontent yaradıcıları səfərləri' },
      { id: 'instagram-tours', name: 'Instagram Tours', nameRu: 'Instagram-туры', nameAz: 'İnstagram turları' },
      { id: 'nature-photography', name: 'Nature Photography', nameRu: 'Фотография природы', nameAz: 'Təbiət fotoqrafiyası' },
      { id: 'wildlife-photography', name: 'Wildlife Photography', nameRu: 'Фотография животных', nameAz: 'Vəhşi təbiət fotoqrafiyası' },
    ],
  },

  // Еда и гастрономия
  {
    id: 'food',
    name: 'Food & Gastronomy',
    nameRu: 'Еда и гастрономия',
    nameAz: 'Yemək və qastronomiya',
    services: [
      { id: 'food-tours', name: 'Food Tours', nameRu: 'Гастрономические туры', nameAz: 'Yemək turları' },
      { id: 'wine-tours', name: 'Wine Tours', nameRu: 'Винные туры', nameAz: 'Şərab turları' },
      { id: 'coffee-tours', name: 'Coffee Tours', nameRu: 'Кофейные туры', nameAz: 'Qəhvə turları' },
      { id: 'culinary-experiences', name: 'Culinary Experiences', nameRu: 'Кулинарные впечатления', nameAz: 'Kulinariya təcrübələri' },
      { id: 'cooking-classes', name: 'Cooking Classes', nameRu: 'Кулинарные мастер-классы', nameAz: 'Cooking Classes' },
      { id: 'street-food-tours', name: 'Street Food Tours', nameRu: 'Туры по уличной еде', nameAz: 'Street Food Tours' },
      { id: 'brewery-tours', name: 'Brewery Tours', nameRu: 'Пивоваренные туры', nameAz: 'Brewery Tours' },
    ],
  },

  // Развлечения и вечеринки
  {
    id: 'entertainment',
    name: 'Entertainment & Parties',
    nameRu: 'Развлечения и вечеринки',
    nameAz: 'Развлечения и вечеринки',
    services: [
      { id: 'party-trips', name: 'Party Trips', nameRu: 'Вечеринки', nameAz: 'Party Trips' },
      { id: 'festival-tours', name: 'Festival Tours', nameRu: 'Фестивальные туры', nameAz: 'Festival Tours' },
      { id: 'music-festivals', name: 'Music Festivals', nameRu: 'Музыкальные фестивали', nameAz: 'Music Festivals' },
      { id: 'beach-parties', name: 'Beach Parties', nameRu: 'Пляжные вечеринки', nameAz: 'Beach Parties' },
      { id: 'clubbing-tours', name: 'Clubbing Tours', nameRu: 'Ночные клубы', nameAz: 'Clubbing Tours' },
      { id: 'concert-tours', name: 'Concert Tours', nameRu: 'Концертные туры', nameAz: 'Concert Tours' },
    ],
  },

  // Природа
  {
    id: 'nature',
    name: 'Nature',
    nameRu: 'Природа',
    nameAz: 'Природа',
    services: [
      { id: 'nature-tours', name: 'Nature Tours', nameRu: 'Туры по природе', nameAz: 'Nature Tours' },
      { id: 'national-parks', name: 'National Parks', nameRu: 'Национальные парки', nameAz: 'National Parks' },
      { id: 'wildlife-tours', name: 'Wildlife Tours', nameRu: 'Наблюдение за животными', nameAz: 'Wildlife Tours' },
      { id: 'bird-watching', name: 'Bird Watching', nameRu: 'Наблюдение за птицами', nameAz: 'Bird Watching' },
      { id: 'eco-tourism', name: 'Eco Tourism', nameRu: 'Эко-туризм', nameAz: 'Eco Tourism' },
      { id: 'sustainable-travel', name: 'Sustainable Travel', nameRu: 'Устойчивый туризм', nameAz: 'Sustainable Travel' },
    ],
  },

  // Тематические путешествия
  {
    id: 'thematic',
    name: 'Thematic Travel',
    nameRu: 'Тематические путешествия',
    nameAz: 'Тематические путешествия',
    services: [
      { id: 'anime-tours', name: 'Anime Tours', nameRu: 'Аниме-туры', nameAz: 'Anime Tours' },
      { id: 'manga-tours', name: 'Manga Tours', nameRu: 'Манга-туры', nameAz: 'Manga Tours' },
      { id: 'gaming-tours', name: 'Gaming Tours', nameRu: 'Игровые туры', nameAz: 'Gaming Tours' },
      { id: 'movie-location-tours', name: 'Movie Location Tours', nameRu: 'Туры по местам съёмок', nameAz: 'Movie Location Tours' },
      { id: 'k-pop-tours', name: 'K-Pop Tours', nameRu: 'K-Pop туры', nameAz: 'K-Pop Tours' },
      { id: 'formula-1-tours', name: 'Formula 1 Tours', nameRu: 'Туры Формулы 1', nameAz: 'Formula 1 Tours' },
      { id: 'football-tours', name: 'Football Tours', nameRu: 'Футбольные туры', nameAz: 'Football Tours' },
      { id: 'sports-events', name: 'Sports Events', nameRu: 'Спортивные события', nameAz: 'Sports Events' },
      { id: 'fashion-tours', name: 'Fashion Tours', nameRu: 'Модные туры', nameAz: 'Fashion Tours' },
      { id: 'art-tours', name: 'Art Tours', nameRu: 'Туры по искусству', nameAz: 'Art Tours' },
    ],
  },

  // Для женщин
  {
    id: 'women',
    name: 'For Women',
    nameRu: 'Для женщин',
    nameAz: 'Для женщин',
    services: [
      { id: 'girls-only', name: 'Girls Only', nameRu: 'Только для девушек', nameAz: 'Girls Only' },
      { id: 'women-retreats', name: 'Women Retreats', nameRu: 'Женские ретриты', nameAz: 'Women Retreats' },
      { id: 'women-adventures', name: 'Women Adventures', nameRu: 'Женские приключения', nameAz: 'Women Adventures' },
      { id: 'women-wellness', name: 'Women Wellness', nameRu: 'Женский wellness', nameAz: 'Women Wellness' },
    ],
  },

  // Для мужчин
  {
    id: 'men',
    name: 'For Men',
    nameRu: 'Для мужчин',
    nameAz: 'Для мужчин',
    services: [
      { id: 'men-only-trips', name: 'Men Only Trips', nameRu: 'Только для мужчин', nameAz: 'Men Only Trips' },
      { id: 'mens-adventure-retreats', name: "Men's Adventure Retreats", nameRu: 'Мужские приключенческие ретриты', nameAz: "Men's Adventure Retreats" },
    ],
  },

  // Для пар
  {
    id: 'couples',
    name: 'For Couples',
    nameRu: 'Для пар',
    nameAz: 'Для пар',
    services: [
      { id: 'couples-trips', name: 'Couples Trips', nameRu: 'Путешествия для пар', nameAz: 'Couples Trips' },
      { id: 'honeymoon-tours', name: 'Honeymoon Tours', nameRu: 'Медовые месяцы', nameAz: 'Honeymoon Tours' },
      { id: 'romantic-getaways', name: 'Romantic Getaways', nameRu: 'Романтические поездки', nameAz: 'Romantic Getaways' },
      { id: 'proposal-trips', name: 'Proposal Trips', nameRu: 'Поездки для предложений', nameAz: 'Proposal Trips' },
    ],
  },

  // Для семей
  {
    id: 'family',
    name: 'For Families',
    nameRu: 'Для семей',
    nameAz: 'Для семей',
    services: [
      { id: 'family-trips', name: 'Family Trips', nameRu: 'Семейные путешествия', nameAz: 'Family Trips' },
      { id: 'family-adventure', name: 'Family Adventure', nameRu: 'Семейные приключения', nameAz: 'Family Adventure' },
      { id: 'kids-friendly-tours', name: 'Kids Friendly Tours', nameRu: 'Детские туры', nameAz: 'Kids Friendly Tours' },
      { id: 'multi-generation-travel', name: 'Multi-Generation Travel', nameRu: 'Путешествия для нескольких поколений', nameAz: 'Multi-Generation Travel' },
    ],
  },

  // Для одиночных путешественников
  {
    id: 'solo',
    name: 'Solo Travelers',
    nameRu: 'Для одиночных путешественников',
    nameAz: 'Для одиночных путешественников',
    services: [
      { id: 'solo-travel', name: 'Solo Travel', nameRu: 'Одиночные путешествия', nameAz: 'Solo Travel' },
      { id: 'solo-female-travel', name: 'Solo Female Travel', nameRu: 'Путешествия для девушек', nameAz: 'Solo Female Travel' },
      { id: 'social-travel', name: 'Social Travel', nameRu: 'Социальные путешествия', nameAz: 'Social Travel' },
      { id: 'meet-new-people-trips', name: 'Meet New People Trips', nameRu: 'Знакомство с новыми людьми', nameAz: 'Meet New People Trips' },
    ],
  },

  // Возрастные категории
  {
    id: 'age',
    name: 'Age Groups',
    nameRu: 'Возрастные категории',
    nameAz: 'Возрастные категории',
    services: [
      { id: 'youth-travel-18-25', name: 'Youth Travel (18–25)', nameRu: 'Молодёжь (18–25)', nameAz: 'Youth Travel (18–25)' },
      { id: 'young-professionals', name: 'Young Professionals', nameRu: 'Молодые специалисты', nameAz: 'Young Professionals' },
      { id: '30-plus-travel', name: '30+ Travel', nameRu: '30+', nameAz: '30+ Travel' },
      { id: '40-plus-travel', name: '40+ Travel', nameRu: '40+', nameAz: '40+ Travel' },
      { id: '50-plus-travel', name: '50+ Travel', nameRu: '50+', nameAz: '50+ Travel' },
      { id: 'senior-travel', name: 'Senior Travel', nameRu: 'Пожилые путешественники', nameAz: 'Senior Travel' },
    ],
  },

  // Бизнес и обучение
  {
    id: 'business',
    name: 'Business & Education',
    nameRu: 'Бизнес и обучение',
    nameAz: 'Бизнес и обучение',
    services: [
      { id: 'business-travel', name: 'Business Travel', nameRu: 'Бизнес-путешествия', nameAz: 'Business Travel' },
      { id: 'networking-trips', name: 'Networking Trips', nameRu: 'Поездки для нетворкинга', nameAz: 'Networking Trips' },
      { id: 'conferences', name: 'Conferences', nameRu: 'Конференции', nameAz: 'Conferences' },
      { id: 'mastermind-retreats', name: 'Mastermind Retreats', nameRu: 'Мастермайнд-ретриты', nameAz: 'Mastermind Retreats' },
      { id: 'educational-tours', name: 'Educational Tours', nameRu: 'Образовательные туры', nameAz: 'Educational Tours' },
      { id: 'language-learning-trips', name: 'Language Learning Trips', nameRu: 'Поездки для изучения языка', nameAz: 'Language Learning Trips' },
      { id: 'university-tours', name: 'University Tours', nameRu: 'Туры по университетам', nameAz: 'University Tours' },
    ],
  },

  // По длительности
  {
    id: 'duration',
    name: 'By Duration',
    nameRu: 'По длительности',
    nameAz: 'По длительности',
    services: [
      { id: 'day-trips', name: 'Day Trips', nameRu: 'Однодневные туры', nameAz: 'Day Trips' },
      { id: 'weekend-trips-duration', name: 'Weekend Trips', nameRu: 'Выходные', nameAz: 'Weekend Trips' },
      { id: '3-5-days', name: '3–5 Days', nameRu: '3–5 дней', nameAz: '3–5 Days' },
      { id: '1-week', name: '1 Week', nameRu: '1 неделя', nameAz: '1 Week' },
      { id: '2-weeks', name: '2 Weeks', nameRu: '2 недели', nameAz: '2 Weeks' },
      { id: '1-month-plus', name: '1 Month+', nameRu: '1 месяц+', nameAz: '1 Month+' },
      { id: 'long-term-travel', name: 'Long-Term Travel', nameRu: 'Долгосрочные путешествия', nameAz: 'Long-Term Travel' },
    ],
  },

  // По формату
  {
    id: 'format',
    name: 'By Format',
    nameRu: 'По формату',
    nameAz: 'По формату',
    services: [
      { id: 'group-tours', name: 'Group Tours', nameRu: 'Групповые туры', nameAz: 'Group Tours' },
      { id: 'small-group-tours', name: 'Small Group Tours', nameRu: 'Небольшие группы', nameAz: 'Small Group Tours' },
      { id: 'private-tours', name: 'Private Tours', nameRu: 'Индивидуальные туры', nameAz: 'Private Tours' },
      { id: 'customized-tours', name: 'Customized Tours', nameRu: 'Индивидуальные туры', nameAz: 'Customized Tours' },
      { id: 'self-guided-tours', name: 'Self-Guided Tours', nameRu: 'Самостоятельные туры', nameAz: 'Self-Guided Tours' },
      { id: 'hosted-tours', name: 'Hosted Tours', nameRu: 'Туры с гидом', nameAz: 'Hosted Tours' },
      { id: 'local-led-tours', name: 'Local-Led Tours', nameRu: 'Туры с местными жителями', nameAz: 'Local-Led Tours' },
    ],
  },

  // По размещению
  {
    id: 'accommodation',
    name: 'By Accommodation',
    nameRu: 'По размещению',
    nameAz: 'По размещению',
    services: [
      { id: 'hotel-stay', name: 'Hotel Stay', nameRu: 'Проживание в отеле', nameAz: 'Hotel Stay' },
      { id: 'resort-stay', name: 'Resort Stay', nameRu: 'Проживание на курорте', nameAz: 'Resort Stay' },
      { id: 'villa-stay', name: 'Villa Stay', nameRu: 'Проживание в вилле', nameAz: 'Villa Stay' },
      { id: 'hostel-stay', name: 'Hostel Stay', nameRu: 'Проживание в хостеле', nameAz: 'Hostel Stay' },
      { id: 'eco-lodge', name: 'Eco Lodge', nameRu: 'Эко-лодж', nameAz: 'Eco Lodge' },
      { id: 'camping-accommodation', name: 'Camping', nameRu: 'Кемпинг', nameAz: 'Camping' },
      { id: 'glamping-accommodation', name: 'Glamping', nameRu: 'Глэмпинг', nameAz: 'Glamping' },
      { id: 'homestay', name: 'Homestay', nameRu: 'Проживание у местных', nameAz: 'Homestay' },
    ],
  },

  // По транспорту
  {
    id: 'transport',
    name: 'By Transport',
    nameRu: 'По транспорту',
    nameAz: 'По транспорту',
    services: [
      { id: 'road-trips', name: 'Road Trips', nameRu: 'Автопутешествия', nameAz: 'Road Trips' },
      { id: 'train-journeys', name: 'Train Journeys', nameRu: 'Железнодорожные путешествия', nameAz: 'Train Journeys' },
      { id: 'luxury-trains', name: 'Luxury Trains', nameRu: 'Люкс-поезда', nameAz: 'Luxury Trains' },
      { id: 'campervan-trips', name: 'Campervan Trips', nameRu: 'Кемпер-путешествия', nameAz: 'Campervan Trips' },
      { id: 'motorcycle-tours-transport', name: 'Motorcycle Tours', nameRu: 'Мототуры', nameAz: 'Motorcycle Tours' },
      { id: 'sailing-trips', name: 'Sailing Trips', nameRu: 'Парусные путешествия', nameAz: 'Sailing Trips' },
      { id: 'cruise-travel', name: 'Cruise Travel', nameRu: 'Круизы', nameAz: 'Cruise Travel' },
    ],
  },

  // По бюджету
  {
    id: 'budget-filter',
    name: 'By Budget',
    nameRu: 'По бюджету',
    nameAz: 'По бюджету',
    services: [
      { id: 'under-500', name: 'Under $500', nameRu: 'До $500', nameAz: 'Under $500' },
      { id: '500-1000', name: '$500–1000', nameRu: '$500–1000', nameAz: '$500–1000' },
      { id: '1000-2000', name: '$1000–2000', nameRu: '$1000–2000', nameAz: '$1000–2000' },
      { id: '2000-5000', name: '$2000–5000', nameRu: '$2000–5000', nameAz: '$2000–5000' },
      { id: '5000-plus', name: '$5000+', nameRu: '$5000+', nameAz: '$5000+' },
    ],
  },

  // Дополнительные услуги
  {
    id: 'additional',
    name: 'Additional Services',
    nameRu: 'Дополнительные услуги',
    nameAz: 'Дополнительные услуги',
    services: [
      { id: 'flight-included', name: 'Flight Included', nameRu: 'Перелёт включён', nameAz: 'Flight Included' },
      { id: 'flight-not-included', name: 'Flight Not Included', nameRu: 'Перелёт не включён', nameAz: 'Flight Not Included' },
      { id: 'airport-transfer', name: 'Airport Transfer', nameRu: 'Трансфер из аэропорта', nameAz: 'Airport Transfer' },
      { id: 'hotel-included', name: 'Hotel Included', nameRu: 'Отель включён', nameAz: 'Hotel Included' },
      { id: 'meals-included', name: 'Meals Included', nameRu: 'Питание включено', nameAz: 'Meals Included' },
      { id: 'visa-support', name: 'Visa Support', nameRu: 'Помощь с визой', nameAz: 'Visa Support' },
      { id: 'travel-insurance', name: 'Travel Insurance', nameRu: 'Страховка', nameAz: 'Travel Insurance' },
      { id: 'esim-included', name: 'eSIM Included', nameRu: 'eSIM включён', nameAz: 'eSIM Included' },
      { id: 'local-guide-included', name: 'Local Guide Included', nameRu: 'Местный гид включён', nameAz: 'Local Guide Included' },
      { id: 'equipment-included', name: 'Equipment Included', nameRu: 'Снаряжение включено', nameAz: 'Equipment Included' },
      { id: 'flexible-cancellation', name: 'Flexible Cancellation', nameRu: 'Гибкая отмена', nameAz: 'Flexible Cancellation' },
      { id: 'instant-booking', name: 'Instant Booking', nameRu: 'Мгновенное бронирование', nameAz: 'Instant Booking' },
    ],
  },
];

// Flat list of all service IDs for easy lookup
export const allServiceIds = serviceCategories.flatMap(cat => cat.services.map(s => s.id));

// Helper function to get service name by ID
export const getServiceNameById = (id: string): string | undefined => {
  for (const cat of serviceCategories) {
    const service = cat.services.find(s => s.id === id);
    if (service) return service.nameRu;
  }
  return undefined;
};

// Helper function to get service by ID
export const getServiceById = (id: string): Service | undefined => {
  for (const cat of serviceCategories) {
    const service = cat.services.find(s => s.id === id);
    if (service) return service;
  }
  return undefined;
};



// Helper function to get cities for a country
export const getCitiesForCountry = (countryCode: string): string[] => {
  const country = countries.find(c => c.code === countryCode);
  return country?.cities || [];
};




// Helper to get localized name based on locale
export function getLocalizedName(item: { name: string; nameRu: string; nameAz: string }, locale: string): string {
  if (locale === "ru") return item.nameRu;
  if (locale === "az") return item.nameAz;
  return item.name;
}

import s2002 from "./matches/2002-03.json";
import s2003 from "./matches/2003-04.json";
import s2004 from "./matches/2004-05.json";
import s2005 from "./matches/2005-06.json";
import s2006 from "./matches/2006-07.json";
import s2007 from "./matches/2007-08.json";
import s2008 from "./matches/2008-09.json";
import s2009 from "./matches/2009-10.json";
import s2010 from "./matches/2010-11.json";
import s2011 from "./matches/2011-12.json";
import s2012 from "./matches/2012-13.json";
import s2013 from "./matches/2013-14.json";
import s2014 from "./matches/2014-15.json";
import s2015 from "./matches/2015-16.json";
import s2016 from "./matches/2016-17.json";
import s2017 from "./matches/2017-18.json";
import s2018 from "./matches/2018-19.json";
import s2019 from "./matches/2019-20.json";
import s2020 from "./matches/2020-21.json";
import s2021 from "./matches/2021-22.json";
import s2022 from "./matches/2022-23.json";
import s2023 from "./matches/2023-24.json";
import s2024 from "./matches/2024-25.json";
import s2025 from "./matches/2025-26.json";
import s2026 from "./matches/2026-27.json";


const MANAGER_TIMELINES = {
  Portugal: [
    ["2003-01-11", "2008-06-19", "Luiz Felipe Scolari"],
    ["2008-07-11", "2010-09-09", "Carlos Queiroz"],
    ["2010-09-21", "2014-09-11", "Paulo Bento"],
    ["2014-09-23", "2022-12-15", "Fernando Santos"],
    ["2023-01-09", "2026-07-06", "Roberto Martínez"],
    ["2026-07-10", "9999-12-31", "Jorge Jesus"],
  ],
  "Sporting CP": [
    ["2002-08-14", "2003-06-30", "László Bölöni"],
  ],
  "Manchester United": [
    ["2003-08-12", "2009-06-30", "Sir Alex Ferguson"],
    ["2021-08-31", "2021-11-21", "Ole Gunnar Solskjær"],
    ["2021-11-21", "2021-12-02", "Michael Carrick"],
    ["2021-12-03", "2022-05-22", "Ralf Rangnick"],
    ["2022-05-23", "2022-11-22", "Erik ten Hag"],
  ],
  "Real Madrid": [
    ["2009-07-01", "2010-05-26", "Manuel Pellegrini"],
    ["2010-05-31", "2013-06-01", "José Mourinho"],
    ["2013-06-25", "2015-05-25", "Carlo Ancelotti"],
    ["2015-06-03", "2016-01-04", "Rafael Benítez"],
    ["2016-01-04", "2018-05-31", "Zinedine Zidane"],
  ],
  Juventus: [
    ["2018-07-10", "2019-05-17", "Massimiliano Allegri"],
    ["2019-06-16", "2020-08-08", "Maurizio Sarri"],
    ["2020-08-08", "2021-05-28", "Andrea Pirlo"],
  ],
  "Al Nassr": [
    ["2022-12-30", "2023-04-12", "Rudi Garcia"],
    ["2023-04-13", "2023-06-30", "Dinko Jeličić"],
    ["2023-07-06", "2024-09-17", "Luís Castro"],
    ["2024-09-18", "2025-06-25", "Stefano Pioli"],
    ["2025-07-14", "2026-06-30", "Jorge Jesus"],
    ["2026-07-03", "9999-12-31", "Ange Postecoglou"],
  ],
};

const MANAGER_MATCH_OVERRIDES = {
  "2019-05-19|Juventus": "Massimiliano Allegri",
  "2021-08-22|Juventus": "Massimiliano Allegri",
};

function getMatchManager(match) {
  const override = MANAGER_MATCH_OVERRIDES[`${match.date}|${match.team}`];
  if (override) return override;

  const timeline = MANAGER_TIMELINES[match.team] || [];
  // If appointments overlap on a date, the manager whose tenure starts
  // on that date takes precedence.
  const manager = [...timeline].reverse().find(
    ([start, end]) => match.date >= start && match.date <= end
  );
  return manager?.[2] ?? null;
}

const allMatches = [
  ...s2002,
  ...s2003,
  ...s2004,
  ...s2005,
  ...s2006,
  ...s2007,
  ...s2008,
  ...s2009,
  ...s2010,
  ...s2011,
  ...s2012,
  ...s2013,
  ...s2014,
  ...s2015,
  ...s2016,
  ...s2017,
  ...s2018,
  ...s2019,
  ...s2020,
  ...s2021,
  ...s2022,
  ...s2023,
  ...s2024,
  ...s2025,
  ...s2026
];

export default allMatches.map((match) => ({ ...match, manager: getMatchManager(match) ?? match.manager ?? null }));
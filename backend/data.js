// ── DATA ──────────────────────────────────────────────────────────────
let drills = [
  { id:1,  dur:30, name:'Wall Ball Testing',        notes:'Partners — 2 groups' },
  { id:2,  dur:10, name:'Warm Up',                  notes:'Sticks to the Outside' },
  { id:3,  dur:10, name:'Meatloaf',                 notes:'3 Stations: GB Trail, 2v1 GB, Gauntlet' },
  { id:4,  dur:10, name:'GB Fundies',               notes:'O: Fundy Shooting (Turn & Shoot, Swat Fly) · D: Hern' },
  { id:5,  dur:12, name:'O/D Split',                notes:'O & D split sessions' },
  { id:6,  dur:15, name:'3v3 Corner GBs to Goal',   notes:'Competitive — switch sides halfway through' },
  { id:7,  dur:10, name:'2v2 +1 Circle GBs',        notes:'Competitive' },
  { id:8,  dur:10, name:'1v1 Diamond',              notes:'Ohio to pairs' },
  { id:9,  dur:10, name:'2v2',                      notes:'From Sides' },
  { id:10, dur:15, name:'Numbers Drill',            notes:'' },
  { id:11, dur:15, name:'Buildup Conditioning',     notes:'Quarter, Half, Full, Half, Quarter' },
];

// Drill library (master list, alphabetical)
let drillLibrary = [
  { lid:1,  name:'1v1 Diamond',            dur:10 },
  { lid:2,  name:'1v1 Dodge Series',       dur:10 },
  { lid:3,  name:'2v1 GB',                 dur:10 },
  { lid:4,  name:'2v2',                    dur:10 },
  { lid:5,  name:'2v2 +1 Circle GBs',      dur:10 },
  { lid:6,  name:'3v3 Corner GBs to Goal', dur:15 },
  { lid:7,  name:'4v3 Transition',         dur:12 },
  { lid:8,  name:'Buildup Conditioning',   dur:15 },
  { lid:9,  name:'Cage Shooting',          dur:10 },
  { lid:10, name:'Clears',                 dur:10 },
  { lid:11, name:'Fast Break',             dur:10 },
  { lid:12, name:'GB Fundies',             dur:10 },
  { lid:13, name:'Gauntlet',               dur:10 },
  { lid:14, name:'Meatloaf',               dur:10 },
  { lid:15, name:'Numbers Drill',          dur:15 },
  { lid:16, name:'O/D Split',              dur:12 },
  { lid:17, name:'Ride & Clear',           dur:10 },
  { lid:18, name:'Settled Offense',        dur:15 },
  { lid:19, name:'Settled Defense',        dur:15 },
  { lid:20, name:'Turn & Shoot',           dur:10 },
  { lid:21, name:'Wall Ball Testing',      dur:30 },
  { lid:22, name:'Warm Up',               dur:10 },
];

let depthData = {
  'ATTACK':        { cls:'att', players:['Tommy G','Danny','Colten','Jordan','Buck','Angus?','Byrd/Lowe?'] },
  'MIDFIELD':      { cls:'mid', players:['Sean','Arkin','Dylan?','Jude','Bo?','Ziggy Powell','Magnus','Zach Worthen'] },
  'DEFENSE — CD':  { cls:'def', players:['Durke','Lukas','Charm','Elliot','Henry','Cooper'] },
  'DEFENSE — DM':  { cls:'def', players:['Franny','Conor G','Georges','Rafe?','Zaki?'] },
  'DEFENSE — LSM': { cls:'def', players:['T-Sull','Jack Cummings','Aden (SSDM?)'] },
  'GOALIE':        { cls:'gol', players:['Beckett'] },
  'FACE-OFF':      { cls:'fo',  players:['Knox','Jake'] },
};

let nextId = 100;
let nextLid = 50;
let dragSrcDrill = null;
let dragSrcPlayer = null;
let startAmPm = 'AM';
let libOpen = false;

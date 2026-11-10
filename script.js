document.documentElement.classList.add('js');

const mainContent = document.querySelector('main');
const pageOrder = [
  document.querySelector('#inicio'),
  document.querySelector('#clasificacion'),
  document.querySelector('#calendario'),
  document.querySelector('#equipos'),
  document.querySelector('#jugadores'),
  document.querySelector('#estadisticas'),
  document.querySelector('#palmares'),
  document.querySelector('#normativa')
];
pageOrder.forEach((section) => mainContent.append(section));
if (window.location.hash) {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  window.addEventListener('load', () => {
    window.requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
  }, {once:true});
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navigation.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting));
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = [...document.querySelectorAll('.page-section')];
const updateActiveNavigation = () => {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 220);
  const visible = [...sections].reverse().find((section) => section.offsetTop <= marker) || sections[0];
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visible.id}`);
  });
};
let navigationFrame;
window.addEventListener('scroll', () => {
  if (navigationFrame) return;
  navigationFrame = window.requestAnimationFrame(() => {
    updateActiveNavigation();
    navigationFrame = null;
  });
}, {passive:true});
window.addEventListener('load', updateActiveNavigation);

updateActiveNavigation();

const playersGrid = document.querySelector('#players-grid');

const teamDialog = document.querySelector('#team-dialog');
document.querySelector('#teams-grid').addEventListener('click', (event) => {
  const card = event.target.closest('.team-panel');
  if (!card) return;
  const members = teamMembers.get(card.dataset.team) || [];
  teamDialog.querySelector('img').src = card.querySelector('img').src;
  teamDialog.querySelector('img').alt = card.dataset.team;
  teamDialog.querySelector('h3').textContent = card.dataset.team;
  teamDialog.querySelector('.team-roster').innerHTML = renderTeamRoster(members);
  teamDialog.showModal();
});
teamDialog.querySelector('.dialog-close').addEventListener('click', () => teamDialog.close());
teamDialog.addEventListener('click', (event) => { if (event.target === teamDialog) teamDialog.close(); });

const logo = (name) => ({
  'Monos Coruña':'assets/monos-coruna.png','Chorbitos':'assets/chorbitos.png','Chicks Dig Vision':'assets/chicks-dig-vision.png','Tarnished':'assets/tarnished.png','Domingueros':'assets/domingueros.png','FF15':'assets/ff15.png','Ego Team':'assets/ego-team.png','Maaa Nugueets':'assets/maaa-nugueets.png'
}[name]);
const games = [
  {date:'1–14 septiembre',a:'Monos Coruña',b:'Maaa Nugueets',winner:'Maaa Nugueets',week:'Jornada 1',duration:'33:18',twitch:'https://www.twitch.tv/videos/2874299653',lineups:{
    'Monos Coruña':[
      {name:'Conde Nesquick',champion:'Malphite',kda:'2/5/4'},
      {name:'General Panza',champion:'Wukong',kda:'7/4/4'},
      {name:'DrRedFlag',champion:'Vex',kda:'2/4/5'},
      {name:'Tugoldobello',champion:'Xayah',kda:'1/4/0'},
      {name:'MNC Roicetee',champion:'Rakan',kda:'0/5/2'}
    ],
    'Maaa Nugueets':[
      {name:'eiboll',champion:'Garen',kda:'8/3/9'},
      {name:'jadriab10',champion:'Lee Sin',kda:'1/4/6'},
      {name:'MKOI Keiwocky',champion:'Pantheon',kda:'4/4/4'},
      {name:'JONI',champion:'Caitlyn',kda:'4/0/11'},
      {name:'puminy',champion:'Lux',kda:'5/1/7'}
    ]
  }},
  {date:'1–14 septiembre',a:'Tarnished',b:'Chorbitos',winner:'Chorbitos',week:'Jornada 1',duration:'39:20',twitch:'https://www.twitch.tv/videos/2863148202',lineups:{
    'Tarnished':[
      {name:'TR Markos316',champion:'Teemo',kda:'14/10/2'},
      {name:'TR Arkinos',champion:'Sylas',kda:'7/8/10'},
      {name:'TR Adria Kila',champion:'Aatrox',kda:'5/11/10'},
      {name:'TR alex132mini',champion:'Caitlyn',kda:'4/10/5'},
      {name:'TR Terminator',champion:'Alistar',kda:'0/7/10'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Cassiopeia',kda:'11/10/7'},
      {name:'Romera',champion:'Talon',kda:'11/3/13'},
      {name:'Nómada',champion:'Ahri',kda:'15/4/8'},
      {name:'SobrinoRelax',champion:'Jinx',kda:'8/6/17'},
      {name:'Afelaino',champion:'Yuumi',kda:'1/7/23'}
    ]
  }},
  {date:'15–28 septiembre',a:'Chorbitos',b:'Maaa Nugueets',winner:'Chorbitos',week:'Jornada 2',duration:'29:56',twitch:'https://www.twitch.tv/videos/2888366698',lineups:{
    'Chorbitos':[
      {name:'Panker',champion:'Ambessa',kda:'9/1/5'},
      {name:'Romera',champion:'Olaf',kda:'5/4/8'},
      {name:'Nómada',champion:'Syndra',kda:'2/4/7'},
      {name:'SobrinoRelax',champion:'Tristana',kda:'5/2/1'},
      {name:'Bochi',champion:'Sona',kda:'1/3/10'}
    ],
    'Maaa Nugueets':[
      {name:'JONI',champion:'Aatrox',kda:'1/6/3'},
      {name:'MKOI Keiwocky',champion:'Shyvana',kda:'8/6/1'},
      {name:'eiboll',champion:'Zilean',kda:'1/3/10'},
      {name:'jadriab10',champion:'Yunara',kda:'2/4/6'},
      {name:'puminy',champion:'Amumu',kda:'2/3/8'}
    ]
  }},
  {date:'15–28 septiembre',a:'Monos Coruña',b:'Tarnished',winner:'Monos Coruña',week:'Jornada 2',duration:'28:19',twitch:'https://www.twitch.tv/videos/2886607109',lineups:{
    'Monos Coruña':[
      {name:'CANICHEMANIA63',champion:'Volibear',kda:'7/4/2'},
      {name:'General Panza',champion:'Lillia',kda:'10/3/10'},
      {name:'Tugoldobello',champion:'Naafiri',kda:'5/3/7'},
      {name:'DrRedFlag',champion:'Yunara',kda:'9/2/9'},
      {name:'Iontxas',champion:'Braum',kda:'1/2/19'}
    ],
    'Tarnished':[
      {name:'TR Markos316',champion:'Darius',kda:'3/7/5'},
      {name:'TR Arkinos',champion:'Vi',kda:'9/6/5'},
      {name:'TR Adria Kila',champion:'Galio',kda:'2/6/8'},
      {name:'TR alex132mini',champion:'Kai’Sa',kda:'0/5/3'},
      {name:'TR Terminator',champion:'Nautilus',kda:'0/8/5'}
    ]
  }},
  {date:'29 septiembre–12 octubre',a:'Monos Coruña',b:'Chorbitos',winner:'Monos Coruña',week:'Jornada 3',duration:'31:50',twitch:'https://www.twitch.tv/videos/2892876516',lineups:{
    'Monos Coruña':[
      {name:'CANICHEMANIA63',champion:'Dr. Mundo',kda:'6/3/4'},
      {name:'General Panza',champion:'Wukong',kda:'6/2/8'},
      {name:'Tugoldobello',champion:'Galio',kda:'1/4/12'},
      {name:'DrRedFlag',champion:'Tristana',kda:'6/2/9'},
      {name:'MNC Roicetee',champion:'Nautilus',kda:'3/2/14'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Gwen',kda:'2/4/3'},
      {name:'ZaRg0t',champion:'Talon',kda:'6/2/3'},
      {name:'Nómada',champion:'Diana',kda:'3/4/4'},
      {name:'SobrinoRelax',champion:'Kai’Sa',kda:'1/7/4'},
      {name:'Afelaino',champion:'Yuumi',kda:'1/5/4'}
    ]
  }},
  {date:'29 septiembre–12 octubre',a:'Maaa Nugueets',b:'Tarnished',winner:'Maaa Nugueets',week:'Jornada 3',duration:'26:23',twitch:'https://www.twitch.tv/videos/2900841639',lineups:{
    'Maaa Nugueets':[
      {name:'MKOI Keiwocky',champion:'Yone',kda:'6/6/9'},
      {name:'eiboll',champion:'Jarvan IV',kda:'11/1/18'},
      {name:'jadriab10',champion:'Ekko',kda:'8/3/11'},
      {name:'JONI',champion:'Ziggs',kda:'11/3/7'},
      {name:'puminy',champion:'Shaco',kda:'5/2/13'}
    ],
    'Tarnished':[
      {name:'TR alex132mini',champion:'Mordekaiser',kda:'5/7/4'},
      {name:'TR Arkinos',champion:'Viego',kda:'0/10/2'},
      {name:'TRPescadocanario',champion:'Katarina',kda:'6/8/1'},
      {name:'TR Markos316',champion:'Swain',kda:'0/7/4'},
      {name:'TR Adria Kila',champion:'Pantheon',kda:'4/9/1'}
    ]
  }},
  {date:'13–26 octubre',a:'Monos Coruña',b:'Maaa Nugueets',winner:'Maaa Nugueets',week:'Jornada 4',duration:'37:52',lineups:{
    'Monos Coruña':[
      {name:'CANICHEMANIA63',champion:'Nasus',kda:'0/7/2'},
      {name:'General Panza',champion:'Lillia',kda:'3/3/6'},
      {name:'Tugoldobello',champion:'Naafiri',kda:'5/6/2'},
      {name:'DrRedFlag',champion:'Twitch',kda:'5/3/6'},
      {name:'MNC Roicetee',champion:'Nautilus',kda:'2/5/6'}
    ],
    'Maaa Nugueets':[
      {name:'eiboll',champion:'Mordekaiser',kda:'4/1/2'},
      {name:'JONI',champion:'Jarvan IV',kda:'4/2/11'},
      {name:'jadriab10',champion:'Ahri',kda:'10/3/7'},
      {name:'sam',champion:'Jinx',kda:'5/4/7'},
      {name:'puminy',champion:'Milio',kda:'1/5/12'}
    ]
  }},
  {date:'13–26 octubre',a:'Tarnished',b:'Chorbitos',winner:'Tarnished',week:'Jornada 4',duration:'26:20',twitch:'https://www.twitch.tv/videos/2911664510',lineups:{
    'Tarnished':[
      {name:'TR alex132mini',champion:'Renekton',kda:'9/2/7'},
      {name:'TR Arkinos',champion:'Amumu',kda:'9/1/7'},
      {name:'TRPescadocanario',champion:'Katarina',kda:'15/2/5'},
      {name:'TR Markos316',champion:'Twitch',kda:'10/3/14'},
      {name:'Bolrich',champion:'Nautilus',kda:'1/3/25'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Ambessa',kda:'1/7/2'},
      {name:'Romera',champion:'Hecarim',kda:'3/9/2'},
      {name:'Nómada',champion:'Syndra',kda:'3/4/1'},
      {name:'SobrinoRelax',champion:'Miss Fortune',kda:'3/13/2'},
      {name:'Afelaino',champion:'Lux',kda:'1/11/4'}
    ]
  }},
  {date:'27 octubre–9 noviembre',a:'Tarnished',b:'Monos Coruña',winner:'Monos Coruña',week:'Jornada 5',duration:'32:58',twitch:'https://www.twitch.tv/videos/2924337389',lineups:{
    'Tarnished':[
      {name:'TR alex132mini',champion:'Malphite',kda:'1/5/3'},
      {name:'TR Arkinos',champion:'Shyvana',kda:'3/4/5'},
      {name:'TRPescadocanario',champion:'Vladimir',kda:'3/5/2'},
      {name:'TR Markos316',champion:'Twitch',kda:'3/6/1'},
      {name:'TR Adria Kila',champion:'Galio',kda:'1/5/4'}
    ],
    'Monos Coruña':[
      {name:'CANICHEMANIA63',champion:'Olaf',kda:'11/3/7'},
      {name:'General Panza',champion:'Cho’Gath',kda:'7/0/8'},
      {name:'Tugoldobello',champion:'Cassiopeia',kda:'1/3/9'},
      {name:'Ñeñi Impact',champion:'Kai’Sa',kda:'6/4/10'},
      {name:'MNC Roicetee',champion:'Leona',kda:'0/1/14'}
    ]
  }},
  {date:'27 octubre–9 noviembre',a:'Maaa Nugueets',b:'Chorbitos',winner:'Maaa Nugueets',week:'Jornada 5',duration:'46:45',twitch:'https://www.twitch.tv/videos/2924398234',lineups:{
    'Maaa Nugueets':[
      {name:'eiboll',champion:'Anivia',kda:'10/5/8'},
      {name:'puminy',champion:'Nocturne',kda:'9/4/16'},
      {name:'MKOI Keiwocky',champion:'Galio',kda:'9/4/14'},
      {name:'jadriab10',champion:'Yunara',kda:'12/2/14'},
      {name:'miguelgimenez567',champion:'Lulu',kda:'1/3/26'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Fiora',kda:'10/9/0'},
      {name:'Bochi',champion:'Rammus',kda:'1/8/11'},
      {name:'Nómada',champion:'Diana',kda:'3/12/7'},
      {name:'SobrinoRelax',champion:'Ezreal',kda:'3/4/2'},
      {name:'geko',champion:'Karma',kda:'1/8/7'}
    ]
  }},
  {date:'10–23 noviembre',a:'Chorbitos',b:'Monos Coruña',winner:null,week:'Jornada 6 · Pendiente'},
  {date:'10–23 noviembre',a:'Tarnished',b:'Maaa Nugueets',winner:null,week:'Jornada 6 · Pendiente'}
];
const teamMembers = new Map();
const playerStats = new Map();
const lineupRoles = ['top','jungle','mid','adc','support'];
games.forEach((game) => {
  Object.entries(game.lineups || {}).forEach(([team, lineup]) => {
    const members = teamMembers.get(team) || new Set();
    const teamKills = lineup.reduce((total, player) => total + Number(player.kda.split('/')[0]), 0);
    lineup.forEach((player, roleIndex) => {
      members.add(player.name);
      const stats = playerStats.get(player.name) || {name:player.name,team,games:0,wins:0,kills:0,deaths:0,assists:0,teamKills:0,picks:new Set(),roles:new Set()};
      const [kills, deaths, assists] = player.kda.split('/').map(Number);
      stats.games += 1;
      if (game.winner === team) stats.wins += 1;
      stats.kills += kills;
      stats.deaths += deaths;
      stats.assists += assists;
      stats.teamKills += teamKills;
      if (player.champion) stats.picks.add(player.champion);
      if (lineupRoles[roleIndex]) stats.roles.add(lineupRoles[roleIndex]);
      playerStats.set(player.name, stats);
    });
    teamMembers.set(team, members);
  });
});
const registeredPlayers = [
  {name:'sam',team:'Maaa Nugueets'}
];
registeredPlayers.forEach((player) => {
  const members = teamMembers.get(player.team) || new Set();
  members.add(player.name);
  teamMembers.set(player.team, members);
  if (!playerStats.has(player.name)) {
    playerStats.set(player.name, {name:player.name,team:player.team,games:0,wins:0,kills:0,deaths:0,assists:0,teamKills:0,picks:new Set(),roles:new Set()});
  }
});
teamMembers.forEach((members, team) => teamMembers.set(team, [...members].sort((a, b) => a.localeCompare(b, 'es'))));

const teamCaptains = {
  'Monos Coruña':{player:'MNC Roicetee'},
  Tarnished:{player:'TR alex132mini'},
  'Maaa Nugueets':{player:'jadriab10'},
  Chorbitos:{player:'Afelaino'}
};
const captainPlayers = new Set(Object.values(teamCaptains).map((captain) => captain.player));
const captainBadge = (name) => captainPlayers.has(name)
  ? '<span class="captain-badge" title="Capitán del equipo" aria-label="Capitán del equipo">★</span>'
  : '';

const riotProfiles = {
  eiboll:{tag:'eibol',status:'known'}, DrRedFlag:{tag:'EUW',status:'known'},
  'TR alex132mini':{tag:'ASF',status:'known'}, Panker:{tag:'MV3',status:'known'},
  CANICHEMANIA63:{tag:'nerf',status:'inferred'}, Afelaino:{tag:'9703',status:'inferred'},
  Bochi:{tag:'7630',status:'inferred'}, jadriab10:{tag:'shot',status:'inferred'},
  puminy:{tag:'EUW',status:'inferred'}, 'MNC Roicetee':{tag:'014',status:'inferred'},
  Iontxas:{tag:'MNC',status:'inferred'}, Tugoldobello:{tag:'YOKO',status:'inferred'},
  'TR Adria Kila':{tag:'DKS',status:'inferred'}, 'TR Markos316':{tag:'GGWP',status:'inferred'},
  'MKOI Keiwocky':{tag:'GAP',status:'known'}, 'General Panza':{tag:'NGL',status:'found'},
  'TR Arkinos':{tag:'777',status:'found'}, 'TR Terminator':{tag:'1998',status:'found'},
  Bolrich:{tag:'EUW',status:'found'}, Romera:{tag:'888',status:'found'},
  miguelgimenez567:{tag:'EUW',status:'known'},
  'Ñeñi Impact':{tag:'NGLmc',status:'known'},
  geko:{tag:'6781',status:'known'},
  'Nómada':{tag:'00000',status:'found'}, SobrinoRelax:{tag:'EUW',status:'found'},
  ZaRg0t:{tag:'17495',status:'found'}, 'Conde Nesquick':{tag:'NGL',status:'found'},
  JONI:{gameName:'J0NI',tag:'SAD',status:'known'},
  TRPescadocanario:{tag:'316',status:'known'}, sam:{tag:'scp',status:'known'}
};
const soloQueueRanks = {
  eiboll:{tier:'Diamante',division:4,lp:82}, DrRedFlag:{tier:'Esmeralda',division:3,lp:79},
  'TR alex132mini':{tier:'Plata',division:1,lp:21}, Panker:{tier:'Maestro',lp:40},
  CANICHEMANIA63:{tier:'Diamante',division:1,lp:75}, Afelaino:{tier:'Hierro',division:1,lp:59},
  Bochi:{tier:'Esmeralda',division:4,lp:94}, jadriab10:{tier:'Diamante',division:3,lp:5},
  puminy:{tier:'Diamante',division:4,lp:17}, 'MNC Roicetee':{tier:'Oro',division:4,lp:49},
  Iontxas:{tier:'Plata',division:2,lp:99}, Tugoldobello:{tier:'Plata',division:3,lp:10},
  'TR Adria Kila':{tier:'Platino',division:4,lp:73}, 'TR Markos316':{tier:'Oro',division:2,lp:15},
  'MKOI Keiwocky':{tier:'Oro',division:3,lp:45},
  'General Panza':{tier:'Esmeralda',division:3,lp:23}, 'TR Arkinos':{tier:'Esmeralda',division:4,lp:17},
  'TR Terminator':{tier:'Plata',division:3,lp:86}, Bolrich:{tier:'Diamante',division:3,lp:49},
  Romera:{tier:'Diamante',division:2,lp:29}, miguelgimenez567:{tier:'Esmeralda',division:3,lp:63},
  'Ñeñi Impact':{tier:'Platino',division:3,lp:96}, geko:{tier:'Platino',division:4,lp:18},
  'Nómada':{tier:'Esmeralda',division:4,lp:28}, SobrinoRelax:{tier:'Plata',division:4,lp:49},
  ZaRg0t:{tier:'Platino',division:2,lp:78}, sam:{tier:'Esmeralda',division:2,lp:65}
};
const soloQueuePeakRanks = {
  eiboll:{tier:'Diamante',division:1,lp:10}, DrRedFlag:{tier:'Diamante',division:4,lp:83},
  'TR alex132mini':{tier:'Plata',division:1,lp:21}, Panker:{tier:'Maestro',lp:40},
  CANICHEMANIA63:{tier:'Maestro',lp:42}, Afelaino:{tier:'Hierro',division:1,lp:84},
  Bochi:{tier:'Esmeralda',division:2,lp:20}, jadriab10:{tier:'Diamante',division:3,lp:5},
  puminy:{tier:'Diamante',division:3,lp:88}, 'MNC Roicetee':{tier:'Oro',division:4,lp:49},
  Iontxas:{tier:'Oro',division:2,lp:2}, Tugoldobello:{tier:'Plata',division:2,lp:90},
  'TR Adria Kila':{tier:'Platino',division:4,lp:73}, 'TR Markos316':{tier:'Oro',division:2,lp:47},
  'MKOI Keiwocky':{tier:'Oro',division:2,lp:4}, 'General Panza':{tier:'Esmeralda',division:3,lp:23},
  'TR Arkinos':{tier:'Esmeralda',division:4,lp:47}, 'TR Terminator':{tier:'Plata',division:2,lp:2},
  Bolrich:{tier:'Diamante',division:1,lp:32}, Romera:{tier:'Maestro',lp:313},
  miguelgimenez567:{tier:'Esmeralda',division:3,lp:80}, 'Ñeñi Impact':{tier:'Platino',division:3,lp:96},
  geko:{tier:'Platino',division:4,lp:18}, 'Nómada':{tier:'Esmeralda',division:4,lp:58},
  SobrinoRelax:{tier:'Oro',division:2,lp:24},
  ZaRg0t:{tier:'Esmeralda',division:4,lp:27}, JONI:{tier:'Plata',division:2,lp:15},
  sam:{tier:'Esmeralda',division:2,lp:65}
};
const rankTiers = ['Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Maestro','Gran Maestro','Challenger'];
const romanDivision = (division) => ['','I','II','III','IV'][division] || '';
const rankScore = (rank) => (rankTiers.indexOf(rank.tier) * 400) + (rank.division ? (4 - rank.division) * 100 : 0) + rank.lp;
const formatRank = (rank) => {
  if (!rank) return 'Pendiente';
  const lp = rankTiers.indexOf(rank.tier) >= rankTiers.indexOf('Maestro') ? ` · ${rank.lp} LP` : '';
  return `${rank.tier}${rank.division ? ` ${romanDivision(rank.division)}` : ''}${lp}`;
};

function formatAverageRank(score) {
  const tierIndex = Math.max(0, Math.min(rankTiers.length - 1, Math.floor(score / 400)));
  const remainder = Math.round(score - tierIndex * 400);
  if (tierIndex >= 7) return rankTiers[tierIndex];
  const divisionStep = Math.min(3, Math.floor(remainder / 100));
  return `${rankTiers[tierIndex]} ${romanDivision(4 - divisionStep)}`;
}

function getTeamRankSummary(members) {
  const rankedMembers = members
    .map((name) => ({name, rank:soloQueueRanks[name]}))
    .filter((player) => player.rank)
    .sort((a, b) => rankScore(b.rank) - rankScore(a.rank));
  const bestFive = rankedMembers.slice(0, 5);
  const averageScore = bestFive.length ? bestFive.reduce((total, player) => total + rankScore(player.rank), 0) / bestFive.length : null;
  return {bestFive, averageScore};
}

function renderTeamRoster(members) {
  if (!members.length) return '<p>Plantilla pendiente de identificar</p>';
  const {averageScore} = getTeamRankSummary(members);
  const rows = members.map((name) => {
    const rank = soloQueueRanks[name];
    const peakRank = soloQueuePeakRanks[name];
    const player = playerStats.get(name) || {name};
    return `<tr><td><a href="${opggUrl(player)}" target="_blank" rel="noopener"><strong>${name}${captainBadge(name)}</strong><span>OP.GG ↗</span></a></td><td class="${rank ? 'has-rank' : 'rank-pending'}">${formatRank(rank)}</td><td class="${peakRank ? 'has-rank' : 'rank-pending'}">${formatRank(peakRank)}</td></tr>`;
  }).join('');
  return `<div class="team-rank-summary"><span>Rango promedio · mejores 5</span><strong>${averageScore === null ? 'Pendiente' : formatAverageRank(averageScore)}</strong></div><div class="team-table-wrap"><table><thead><tr><th>Jugador</th><th>Rango SoloQ</th><th>Peak SoloQ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

document.querySelectorAll('.team-panel').forEach((card) => {
  const members = teamMembers.get(card.dataset.team) || [];
  const {averageScore} = getTeamRankSummary(members);
  const rank = averageScore === null ? 'Pendiente' : formatAverageRank(averageScore);
  const captain = teamCaptains[card.dataset.team];
  card.insertAdjacentHTML('beforeend', `<div class="team-panel-rank"><span class="team-captain">★ Capitán · ${captain.player}</span><span>Rango promedio · mejores 5</span><strong>${rank}</strong></div>`);
});
const leaguePlayers = [...playerStats.values()].sort((a, b) => a.team.localeCompare(b.team, 'es') || a.name.localeCompare(b.name, 'es'));
const formatNumber = (value, minimumFractionDigits = 1, maximumFractionDigits = minimumFractionDigits) => value.toLocaleString('es-ES', {minimumFractionDigits, maximumFractionDigits});
const formatRatio = (value) => formatNumber(value, 2, 2);
const average = (total, gamesPlayed) => gamesPlayed ? formatNumber(total / gamesPlayed) : '0,0';
const kdaRatio = (player) => (player.kills + player.assists) / Math.max(player.deaths, 1);
const killParticipation = (player) => player.teamKills ? ((player.kills + player.assists) / player.teamKills) * 100 : null;
const winRate = (player) => player.games ? (player.wins / player.games) * 100 : null;
const formatWinRate = (player) => winRate(player) === null ? '—' : `${Math.round(winRate(player))}%`;
const formatKillParticipation = (player) => killParticipation(player) === null ? '—' : `${Math.round(killParticipation(player))}%`;
const championSlug = (champion) => ({'Kai’Sa':'Kaisa','Bel’Veth':'Belveth','Cho’Gath':'Chogath','Dr. Mundo':'DrMundo','Jarvan IV':'JarvanIV','Lee Sin':'LeeSin','Tahm Kench':'TahmKench',Wukong:'MonkeyKing',LeBlanc:'Leblanc'}[champion] || champion.replace(/[^A-Za-z0-9]/g, ''));
const championIcon = (champion) => `https://ddragon.leagueoflegends.com/cdn/16.21.1/img/champion/${championSlug(champion)}.png`;
const opggUrl = (player) => {
  const profile = riotProfiles[player.name];
  const gameName = profile?.gameName || player.name;
  return `https://op.gg/es/lol/summoners/euw/${encodeURIComponent(profile ? `${gameName}-${profile.tag}` : gameName)}`;
};
const riotIdLabel = (player) => {
  const profile = riotProfiles[player.name];
  if (!profile) return '<span class="riot-id unresolved">Tag pendiente</span>';
  return `<span class="riot-id">#${profile.tag}</span>`;
};
const roleIcons = [
  {key:'top',label:'Top',icon:'assets/roles/top.svg'},
  {key:'jungle',label:'Jungla',icon:'assets/roles/jungle.svg'},
  {key:'mid',label:'Mid',icon:'assets/roles/middle.svg'},
  {key:'adc',label:'ADC',icon:'assets/roles/bottom.svg'},
  {key:'support',label:'Support',icon:'assets/roles/utility.svg'}
];
const playedRoles = (player) => roleIcons.filter((role) => player.roles?.has(role.key));
const renderRoleIcons = (player) => `<div class="role-icons">${playedRoles(player).map((role) => `<span class="role-icon is-played" title="${role.label}"><img src="${role.icon}" alt="${role.label}"></span>`).join('')}</div>`;
const renderPlayerMetric = (count, singularLabel, pluralLabel, detail, content) => {
  const label = count === 1 ? singularLabel : pluralLabel;
  const hasDetail = count > 0;
  return `<div class="player-metric${hasDetail ? '' : ' is-empty'}"${hasDetail ? ' tabindex="0"' : ''} aria-label="${count} ${label}${hasDetail ? `: ${detail}` : ''}"><strong>${count}</strong>${hasDetail ? '<span class="player-metric-hint" aria-hidden="true">⌄</span>' : ''}${hasDetail ? `<div class="player-metric-popover" aria-hidden="true">${content}</div>` : ''}</div>`;
};

function renderPlayers(list) {
  if (!list.length) {
    playersGrid.innerHTML = '<p>No se encontraron jugadores.</p>';
    return;
  }
  const rows = list.map((player) => {
    const picks = [...player.picks];
    const rank = soloQueueRanks[player.name];
    const peakRank = soloQueuePeakRanks[player.name];
    const pickIcons = picks.map((champion) => `<span class="pick-icon" title="${champion}"><img src="${championIcon(champion)}" alt="${champion}"><small>${champion}</small></span>`).join('');
    const roles = playedRoles(player);
    const roleMetric = renderPlayerMetric(roles.length, 'posición', 'posiciones', roles.map((role) => role.label).join(', '), renderRoleIcons(player));
    const pickMetric = renderPlayerMetric(picks.length, 'campeón', 'campeones', picks.join(', '), `<div class="player-picks">${pickIcons}</div>`);
    return `<tr><td class="player-team-cell"><img src="${logo(player.team)}" alt=""><span>${player.team}</span></td><td><a class="player-link" href="${opggUrl(player)}" target="_blank" rel="noopener"><strong>${player.name}${captainBadge(player.name)}</strong>${riotIdLabel(player)}</a></td><td class="player-kda"><strong>${formatRatio(kdaRatio(player))}</strong><small>${average(player.kills, player.games)} / ${average(player.deaths, player.games)} / ${average(player.assists, player.games)}</small></td><td class="player-kill-participation">${formatKillParticipation(player)}</td><td class="player-win-rate">${formatWinRate(player)}</td><td class="${rank ? 'has-rank' : 'rank-pending'}">${formatRank(rank)}</td><td class="${peakRank ? 'has-rank' : 'rank-pending'}">${formatRank(peakRank)}</td><td>${player.games}</td><td class="player-metric-cell">${roleMetric}</td><td class="player-metric-cell">${pickMetric}</td></tr>`;
  }).join('');
  const sortableHeader = (key, label, description = '') => {
    const active = playerSortState.key === key;
    const direction = active ? playerSortState.direction : 'none';
    const indicator = active ? (direction === 'asc' ? '▲' : '▼') : '↕';
    const tooltip = description ? ` data-tooltip="${description}" aria-label="${description}"` : '';
    return `<th aria-sort="${active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" class="table-sort${active ? ' active' : ''}" data-sort="${key}"${tooltip}>${label}<span aria-hidden="true">${indicator}</span></button></th>`;
  };
  playersGrid.innerHTML = `<table class="players-table"><thead><tr>${sortableHeader('team', 'Equipo')}${sortableHeader('name', 'Jugador')}${sortableHeader('kda', 'KDA', 'Ratio de kills y asistencias por muerte')}${sortableHeader('participation', '% KP', 'Porcentaje de participación en las kills del equipo')}${sortableHeader('winrate', '% V', 'Porcentaje de victorias')}${sortableHeader('rank', 'SoloQ', 'Rango actual en SoloQ')}${sortableHeader('peakRank', 'Peak', 'Mejor rango alcanzado en SoloQ')}${sortableHeader('games', 'PJ', 'Partidas jugadas')}${sortableHeader('roles', 'Pos.', 'Número de posiciones distintas jugadas')}${sortableHeader('picks', 'Camp.', 'Número de campeones diferentes jugados')}</tr></thead><tbody>${rows}</tbody></table>`;
}

const playerSearch = document.querySelector('#player-search');
const playerSort = document.querySelector('#player-sort');
const playerSortState = {key:'kda',direction:'desc'};
const defaultSortDirection = (key) => ['team', 'name'].includes(key) ? 'asc' : 'desc';
function updatePlayers() {
  const query = playerSearch.value.trim().toLocaleLowerCase('es');
  const filtered = leaguePlayers.filter((player) => [player.name, player.team, ...player.picks].join(' ').toLocaleLowerCase('es').includes(query));
  filtered.sort((a, b) => {
    const values = {
      team:[a.team, b.team], name:[a.name, b.name], kda:[kdaRatio(a), kdaRatio(b)],
      participation:[killParticipation(a) ?? -1, killParticipation(b) ?? -1],
      winrate:[winRate(a) ?? -1, winRate(b) ?? -1],
      rank:[soloQueueRanks[a.name] ? rankScore(soloQueueRanks[a.name]) : -1, soloQueueRanks[b.name] ? rankScore(soloQueueRanks[b.name]) : -1],
      peakRank:[soloQueuePeakRanks[a.name] ? rankScore(soloQueuePeakRanks[a.name]) : -1, soloQueuePeakRanks[b.name] ? rankScore(soloQueuePeakRanks[b.name]) : -1],
      games:[a.games, b.games],
      roles:[a.roles.size, b.roles.size],
      picks:[a.picks.size, b.picks.size]
    }[playerSortState.key];
    const comparison = typeof values[0] === 'string' ? values[0].localeCompare(values[1], 'es') : values[0] - values[1];
    return (playerSortState.direction === 'asc' ? comparison : -comparison) || a.name.localeCompare(b.name, 'es');
  });
  renderPlayers(filtered);
}
updatePlayers();
playerSearch.addEventListener('input', updatePlayers);
playerSort.addEventListener('change', () => {
  playerSortState.key = playerSort.value;
  playerSortState.direction = defaultSortDirection(playerSort.value);
  updatePlayers();
});
playersGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-sort]');
  if (!button) return;
  const key = button.dataset.sort;
  playerSortState.direction = playerSortState.key === key
    ? (playerSortState.direction === 'asc' ? 'desc' : 'asc')
    : defaultSortDirection(key);
  playerSortState.key = key;
  playerSort.value = key;
  updatePlayers();
});

const completedGames = games.filter((game) => game.winner && game.lineups && game.duration);
const currentTeams = [...document.querySelectorAll('.team-panel')].map((card) => card.dataset.team);
const standings = currentTeams.map((team) => {
  const played = completedGames.filter((game) => game.a === team || game.b === team);
  const wins = played.filter((game) => game.winner === team).length;
  return {team, played:played.length, wins, losses:played.length - wins, points:wins * 3};
}).sort((a, b) => b.points - a.points || b.wins - a.wins || a.team.localeCompare(b.team, 'es'));
const completedRounds = Math.max(0, ...completedGames.map((game) => Number(game.week.match(/\d+/)?.[0] || 0)));
document.querySelector('#standings-status').textContent = `Temporada 2026/27 · Tras ${completedRounds} jornadas`;
document.querySelector('#standings-table').insertAdjacentHTML('beforeend', standings.map((entry, index) => `<div role="row"><b>${index + 1}</b><span><img src="${logo(entry.team)}" alt="">${entry.team}</span><span>${entry.played}</span><span>${entry.wins}</span><span>${entry.losses}</span><strong>${entry.points}</strong></div>`).join(''));
const [leader, semifinalistA, semifinalistB] = standings;
document.querySelector('#playoffs-bracket').innerHTML = `<div><p>Semifinal · Si terminase hoy</p><span><img src="${logo(semifinalistA.team)}" alt="">2.º ${semifinalistA.team}</span><span><img src="${logo(semifinalistB.team)}" alt="">3.º ${semifinalistB.team}</span></div><i>→</i><div><p>Gran Final</p><span><img src="${logo(leader.team)}" alt="">1.º ${leader.team}</span><span><img src="assets/wolf.png" alt="">Ganador semifinal</span></div>`;
const durationInSeconds = (duration) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes * 60) + seconds;
};
const formatDecimal = (value) => formatNumber(value);
const formatPercent = (value) => `${Math.round(value)}%`;
const statKda = (entry) => (entry.kills + entry.assists) / Math.max(entry.deaths, 1);
const statWinRate = (entry) => (entry.wins / entry.games) * 100;
const descending = (getter) => (a, b) => getter(b) - getter(a);
const ascending = (getter) => (a, b) => getter(a) - getter(b);
const selectLeader = (entries, comparators) => [...entries].sort((a, b) => {
  for (const compare of comparators) {
    const result = compare(a, b);
    if (result) return result;
  }
  return (a.name || '').localeCompare(b.name || '', 'es');
})[0];
const selectLeaders = (entries, getter, direction = 'max') => {
  const target = Math[direction](...entries.map(getter));
  const metricLeaders = entries.filter((entry) => Math.abs(getter(entry) - target) < 1e-9);
  const mostGames = Math.max(...metricLeaders.map((entry) => entry.games));
  return metricLeaders
    .filter((entry) => entry.games === mostGames)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
};
const lineupTotals = (lineup) => lineup.reduce((totals, player) => {
  const [kills, deaths, assists] = player.kda.split('/').map(Number);
  totals.kills += kills;
  totals.deaths += deaths;
  totals.assists += assists;
  return totals;
}, {kills:0, deaths:0, assists:0});

const championStats = new Map();
completedGames.forEach((game) => {
  Object.entries(game.lineups).forEach(([team, lineup]) => {
    lineup.forEach((player, roleIndex) => {
      if (!player.champion) return;
      const champion = championStats.get(player.champion) || {
        name:player.champion, games:0, wins:0, kills:0, deaths:0, assists:0, roles:new Set()
      };
      const [kills, deaths, assists] = player.kda.split('/').map(Number);
      champion.games += 1;
      champion.wins += Number(game.winner === team);
      champion.kills += kills;
      champion.deaths += deaths;
      champion.assists += assists;
      if (lineupRoles[roleIndex]) champion.roles.add(lineupRoles[roleIndex]);
      championStats.set(player.champion, champion);
    });
  });
});

const teamStats = new Map();
completedGames.forEach((game) => {
  const totalsByTeam = Object.fromEntries(Object.entries(game.lineups).map(([team, lineup]) => [team, lineupTotals(lineup)]));
  Object.entries(game.lineups).forEach(([team, lineup]) => {
    const rival = team === game.a ? game.b : game.a;
    const totals = totalsByTeam[team];
    const teamEntry = teamStats.get(team) || {
      name:team, games:0, wins:0, kills:0, deaths:0, assists:0, killDifference:0, combinedKills:0, champions:new Set(),
      lineupSignatures:new Set()
    };
    teamEntry.games += 1;
    teamEntry.wins += Number(game.winner === team);
    teamEntry.kills += totals.kills;
    teamEntry.deaths += totals.deaths;
    teamEntry.assists += totals.assists;
    teamEntry.killDifference += totals.kills - totalsByTeam[rival].kills;
    teamEntry.combinedKills += totals.kills + totalsByTeam[rival].kills;
    lineup.forEach((player) => {
      if (player.champion) teamEntry.champions.add(player.champion);
    });
    teamEntry.lineupSignatures.add(lineup.map((player, roleIndex) => `${lineupRoles[roleIndex]}:${player.name}`).join('|'));
    teamStats.set(team, teamEntry);
  });
});

const matchStats = completedGames.map((game) => {
  const aTotals = lineupTotals(game.lineups[game.a]);
  const bTotals = lineupTotals(game.lineups[game.b]);
  const winnerKills = game.winner === game.a ? aTotals.kills : bTotals.kills;
  const loserKills = game.winner === game.a ? bTotals.kills : aTotals.kills;
  return {
    game,
    name:`${game.a} vs ${game.b}`,
    seconds:durationInSeconds(game.duration),
    totalKills:aTotals.kills + bTotals.kills,
    killDifference:Math.abs(aTotals.kills - bTotals.kills),
    result:`${game.winner} venció ${winnerKills}-${loserKills}`
  };
});

const eligibleChampions = [...championStats.values()];
const eligiblePlayers = leaguePlayers;
const eligibleTeams = [...teamStats.values()];
const minimumRateGames = 2;
const rateEligibleChampions = eligibleChampions.filter((champion) => champion.games >= minimumRateGames);
const rateEligiblePlayers = eligiblePlayers.filter((player) => player.games >= minimumRateGames);
const rateEligibleTeams = eligibleTeams.filter((team) => team.games >= minimumRateGames);

const mostPlayedChampions = selectLeaders(eligibleChampions, (champion) => champion.games);
const highestWinRateChampions = selectLeaders(rateEligibleChampions, statWinRate);
const lowestWinRateChampions = selectLeaders(rateEligibleChampions, statWinRate, 'min');
const bestKdaChampions = selectLeaders(rateEligibleChampions, statKda);
const mostVersatileChampions = selectLeaders(eligibleChampions, (champion) => champion.roles.size);

const bestKdaPlayers = selectLeaders(rateEligiblePlayers, kdaRatio);
const mostKillsPerGamePlayers = selectLeaders(rateEligiblePlayers, (player) => player.kills / player.games);
const fewestDeathsPerGamePlayers = selectLeaders(rateEligiblePlayers, (player) => player.deaths / player.games, 'min');
const highestParticipationPlayers = selectLeaders(rateEligiblePlayers, killParticipation);
const widestPoolPlayers = selectLeaders(eligiblePlayers, (player) => player.picks.size);

const assistsPerKill = (team) => team.assists / Math.max(team.kills, 1);
const bestTeamworkTeams = selectLeaders(rateEligibleTeams, assistsPerKill);
const mostDominantTeams = selectLeaders(rateEligibleTeams, (team) => team.killDifference / team.games);
const widestTeamPools = selectLeaders(eligibleTeams, (team) => team.champions.size);
const mostChaoticTeams = selectLeaders(rateEligibleTeams, (team) => team.combinedKills / team.games);
const mostVersatileTeams = selectLeaders(eligibleTeams, (team) => team.lineupSignatures.size);

const longestMatch = selectLeader(matchStats, [descending((match) => match.seconds)]);
const shortestMatch = selectLeader(matchStats, [ascending((match) => match.seconds)]);
const bloodiestMatch = selectLeader(matchStats, [descending((match) => match.totalKills / match.seconds), descending((match) => match.totalKills), ascending((match) => match.seconds)]);
const dullestMatch = selectLeader(matchStats, [ascending((match) => match.totalKills / match.seconds), ascending((match) => match.totalKills), descending((match) => match.seconds)]);
const biggestStomp = selectLeader(matchStats, [descending((match) => match.killDifference), ascending((match) => match.seconds)]);

const championCard = (title, champions, value, detail) => ({
  title, value, detail, kind:'champion', leaders:champions.map((champion) => ({
    name:champion.name, image:championIcon(champion.name), imageAlt:champion.name
  }))
});
const playerCard = (title, players, value, detail) => ({
  title, value, detail, kind:'player', leaders:players.map((player) => ({
    name:player.name, image:logo(player.team), imageAlt:`Escudo de ${player.team}`
  }))
});
const teamCard = (title, teams, value, detail) => ({
  title, value, detail, kind:'team', leaders:teams.map((team) => ({
    name:team.name, image:logo(team.name), imageAlt:`Escudo de ${team.name}`
  }))
});
const matchCard = (title, match, value, detail) => ({
  title, subject:match.name, value, detail,
  versusImages:[{src:logo(match.game.a), alt:`Escudo de ${match.game.a}`}, {src:logo(match.game.b), alt:`Escudo de ${match.game.b}`}],
  kind:'match'
});
const statisticsGroups = [
  {
    eyebrow:'El meta', title:'Campeones',
    items:[
      championCard('Hasta en la sopa', mostPlayedChampions, `${mostPlayedChampions[0].games} partidas`, 'Máximo de apariciones esta temporada'),
      championCard('El talismán', highestWinRateChampions, `${formatPercent(statWinRate(highestWinRateChampions[0]))} winrate`, `Mayor porcentaje de victorias · ${highestWinRateChampions[0].games} partidas`),
      championCard('El agujero negro', lowestWinRateChampions, `${formatPercent(statWinRate(lowestWinRateChampions[0]))} winrate`, `Menor porcentaje de victorias · ${lowestWinRateChampions[0].games} partidas`),
      championCard('Intocable', bestKdaChampions, `${formatRatio(statKda(bestKdaChampions[0]))} KDA`, `Mejor ratio en ${bestKdaChampions[0].games} partidas`),
      championCard('El comodín', mostVersatileChampions, `${mostVersatileChampions[0].roles.size} posiciones`, 'Utilizado en más posiciones diferentes')
    ]
  },
  {
    eyebrow:'Nombres propios', title:'Jugadores',
    items:[
      playerCard('KDA Player', bestKdaPlayers, `${formatRatio(kdaRatio(bestKdaPlayers[0]))} KDA`, 'Mejor ratio de la temporada'),
      playerCard('El verdugo', mostKillsPerGamePlayers, `${formatDecimal(mostKillsPerGamePlayers[0].kills / mostKillsPerGamePlayers[0].games)} kills`, 'Media por partida'),
      playerCard('El superviviente', fewestDeathsPerGamePlayers, `${formatDecimal(fewestDeathsPerGamePlayers[0].deaths / fewestDeathsPerGamePlayers[0].games)} muertes`, 'Media por partida'),
      playerCard('En todas las peleas', highestParticipationPlayers, `${formatPercent(killParticipation(highestParticipationPlayers[0]))} KP`, 'Mayor participación en las kills del equipo'),
      playerCard('Océano de campeones', widestPoolPlayers, `${widestPoolPlayers[0].picks.size} campeones`, 'Mayor número de campeones diferentes')
    ]
  },
  {
    eyebrow:'Fuerza colectiva', title:'Equipos',
    items:[
      teamCard('Dominio total', mostDominantTeams, `${mostDominantTeams[0].killDifference >= 0 ? '+' : ''}${formatDecimal(mostDominantTeams[0].killDifference / mostDominantTeams[0].games)} kills`, 'Diferencia media por partida'),
      teamCard('Trabajo en equipo', bestTeamworkTeams, `${formatRatio(assistsPerKill(bestTeamworkTeams[0]))} asist./kill`, `${bestTeamworkTeams[0].assists} asistencias en ${bestTeamworkTeams[0].kills} kills`),
      teamCard('Arsenal sin fondo', widestTeamPools, `${widestTeamPools[0].champions.size} campeones`, `Utilizados en ${widestTeamPools[0].games} partidas`),
      teamCard('Imán del caos', mostChaoticTeams, `${formatDecimal(mostChaoticTeams[0].combinedKills / mostChaoticTeams[0].games)} kills`, 'Combinadas por partida entre ambos equipos'),
      teamCard('Versatilidad total', mostVersatileTeams, `${mostVersatileTeams[0].lineupSignatures.size} alineaciones`, `En ${mostVersatileTeams[0].games} partidas`)
    ]
  },
  {
    eyebrow:'Para la historia', title:'Partidas',
    items:[
      matchCard('El maratón', longestMatch, longestMatch.game.duration, `${longestMatch.game.week} · ${longestMatch.result}`),
      matchCard('Victoria exprés', shortestMatch, shortestMatch.game.duration, `${shortestMatch.game.week} · ${shortestMatch.result}`),
      matchCard('La carnicería', bloodiestMatch, `${formatDecimal((bloodiestMatch.totalKills / bloodiestMatch.seconds) * 60)} kills/min`, `${bloodiestMatch.totalKills} kills en ${bloodiestMatch.game.duration} · ${bloodiestMatch.result}`),
      matchCard('A fuego lento', dullestMatch, `${formatDecimal((dullestMatch.totalKills / dullestMatch.seconds) * 60)} kills/min`, `${dullestMatch.totalKills} kills en ${dullestMatch.game.duration} · ${dullestMatch.result}`),
      matchCard('Paliza histórica', biggestStomp, `${biggestStomp.killDifference} kills`, `De diferencia · ${biggestStomp.result}`)
    ]
  }
];

function renderStatMedia(item) {
  if (item.versusImages) {
    return `<div class="stat-media stat-match-media"><img src="${item.versusImages[0].src}" alt="${item.versusImages[0].alt}"><b aria-hidden="true">VS</b><img src="${item.versusImages[1].src}" alt="${item.versusImages[1].alt}"></div>`;
  }
  if (item.kind === 'champion' && item.leaders.length > 1) {
    return `<div class="stat-leaders-media stat-leaders-icons">${item.leaders.map((leader) => `<img src="${leader.image}" alt="${leader.imageAlt}" title="${leader.name}">`).join('')}</div>`;
  }
  if (item.leaders.length > 1) {
    return `<div class="stat-leaders-media">${item.leaders.map((leader) => `<div class="stat-leader"><img src="${leader.image}" alt="${leader.imageAlt}"><span>${leader.name}</span></div>`).join('')}</div>`;
  }
  const leader = item.leaders[0];
  return `<div class="stat-media stat-${item.kind}-media"><img src="${leader.image}" alt="${leader.imageAlt}"></div>`;
}

function renderStatisticCard(item) {
  const hasTiedLeaders = item.leaders?.length > 1;
  const subject = item.subject || item.leaders?.[0]?.name;
  return `<article class="stat-card stat-card-${item.kind}${hasTiedLeaders ? ' stat-card-tied' : ''}"><header><h4>${item.title}</h4></header>${renderStatMedia(item)}<div class="stat-card-copy">${hasTiedLeaders ? '' : `<h5>${subject}</h5>`}<strong>${item.value}</strong><p>${item.detail}</p></div></article>`;
}

document.querySelector('#stats-groups').innerHTML = statisticsGroups.map((group) => {
  const cards = group.items.map(renderStatisticCard).join('');
  return `<section class="stats-group"><div class="stats-group-heading"><div><span>${group.eyebrow}</span><h3>${group.title}</h3></div><b>${group.items.length} récords</b></div><div class="stats-grid">${cards}</div></section>`;
}).join('');

function renderLineup(game, team) {
  const lineup = game.lineups?.[team];
  if (!lineup) return '';
  return `<section><h4>${team}</h4><ul>${lineup.map((player) => `<li><span><strong>${player.name}</strong><small>${player.champion || 'Campeón pendiente'}</small></span><b>${player.kda}</b></li>`).join('')}</ul></section>`;
}

function getTeamKda(game, team) {
  return (game.lineups?.[team] || []).reduce((total, player) => {
    const [kills, deaths, assists] = player.kda.split('/').map(Number);
    return [total[0] + kills, total[1] + deaths, total[2] + assists];
  }, [0, 0, 0]).join('/');
}

function renderMatchStats(game) {
  if (!game.lineups) return '';
  return `<div class="match-summary"><span>Duración <b>${game.duration || 'No visible'}</b></span><span>${game.a} <b>${getTeamKda(game, game.a)}</b></span><span>${game.b} <b>${getTeamKda(game, game.b)}</b></span></div>`;
}

function renderTwitchLink(game) {
  if (game.twitch) return `<a class="twitch-link" href="${game.twitch}" target="_blank" rel="noopener">▶ Ver en Twitch</a>`;
  if (game.winner) return '<span class="twitch-missing">Twitch no disponible</span>';
  return '';
}

function renderMatchTeam(game, team) {
  const resultClass = game.winner === team ? ' is-winner' : game.winner ? ' is-loser' : '';
  return `<span class="match-team${resultClass}"><img src="${logo(team)}" alt=""><strong>${team}</strong></span>`;
}

document.querySelector('#matches-grid').innerHTML = games.map((game) => `<article class="flip-card${game.lineups ? ' has-details' : ''}${game.winner ? ' is-complete' : ''}" tabindex="0"><div class="flip-card-inner"><div class="flip-face"><p>${game.week}</p><div class="flip-teams">${renderMatchTeam(game, game.a)}<b>VS</b>${renderMatchTeam(game, game.b)}</div><div class="match-card-footer"><span>${game.lineups ? 'Ver alineaciones y KDA' : game.date}</span>${renderTwitchLink(game)}</div></div><div class="flip-face flip-back"><p class="match-result${game.winner ? ' is-winner' : ''}">${game.winner ? `✓ Victoria · ${game.winner}` : 'Partido pendiente'}</p>${renderMatchStats(game)}${game.lineups ? `<div class="match-lineups">${renderLineup(game, game.a)}${renderLineup(game, game.b)}</div>` : game.winner ? `<img src="${logo(game.winner)}" alt=""><h3>${game.winner}</h3>` : '<h3>Por disputar</h3>'}<div class="match-card-footer">${renderTwitchLink(game)}</div></div></div></article>`).join('');
document.querySelector('#matches-grid').addEventListener('click', (event) => {
  if (event.target.closest('a')) return;
  event.target.closest('.flip-card')?.classList.toggle('flipped');
});
document.querySelector('#matches-grid').addEventListener('keydown', (event) => {
  if (event.target.closest('a')) return;
  if (['Enter',' '].includes(event.key)) event.target.closest('.flip-card')?.classList.toggle('flipped');
});


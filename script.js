document.documentElement.classList.add('js');

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
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.3] });

sections.forEach((section) => sectionObserver.observe(section));

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
      {name:'General Panza',champion:'Vi',kda:'7/4/4'},
      {name:'DrRedFlag',champion:'Vex',kda:'2/4/5'},
      {name:'Tugoldobello',champion:'Kai’Sa',kda:'1/4/0'},
      {name:'MNC Roicetee',champion:'Zoe',kda:'0/5/2'}
    ],
    'Maaa Nugueets':[
      {name:'eiboll',champion:'Garen',kda:'8/3/9'},
      {name:'jadriab10',champion:'Lee Sin',kda:'1/4/6'},
      {name:'Keiwocky',champion:'Jayce',kda:'4/4/4'},
      {name:'JONI',champion:'Caitlyn',kda:'4/0/11'},
      {name:'puminy',champion:'Lux',kda:'5/1/7'}
    ]
  }},
  {date:'1–14 septiembre',a:'Tarnished',b:'Chorbitos',winner:'Chorbitos',week:'Jornada 1',duration:'39:20',twitch:'https://www.twitch.tv/videos/2863148202',lineups:{
    'Tarnished':[
      {name:'TR Markos316',champion:'Twitch',kda:'14/10/2'},
      {name:'TR Arkinos',champion:'Viego',kda:'7/8/10'},
      {name:'TR Adria Kila',champion:'Katarina',kda:'5/11/10'},
      {name:'TR alex132mini',champion:'Caitlyn',kda:'4/10/5'},
      {name:'TR Terminator',champion:'Nautilus',kda:'0/7/10'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Ambessa',kda:'11/10/7'},
      {name:'Romera',champion:'Hecarim',kda:'11/3/13'},
      {name:'Nómada',champion:'Kai’Sa',kda:'15/4/8'},
      {name:'SobrinoRelax',champion:'Jhin',kda:'8/6/17'},
      {name:'Afelaino',champion:'Zoe',kda:'1/7/23'}
    ]
  }},
  {date:'15–28 septiembre',a:'Chorbitos',b:'Maaa Nugueets',winner:'Chorbitos',week:'Jornada 2',duration:'29:56',twitch:'https://www.twitch.tv/videos/2888366698',lineups:{
    'Chorbitos':[
      {name:'Panker',champion:'Ambessa',kda:'9/1/5'},
      {name:'Romera',champion:'Olaf',kda:'5/4/8'},
      {name:'Nómada',champion:'Syndra',kda:'2/4/7'},
      {name:'SobrinoRelax',champion:'Tristana',kda:'5/2/1'},
      {name:'Bochi',champion:'Seraphine',kda:'1/3/10'}
    ],
    'Maaa Nugueets':[
      {name:'JONI',champion:'Sion',kda:'1/6/3'},
      {name:'Keiwocky',champion:'Shyvana',kda:'8/6/1'},
      {name:'eiboll',champion:'Fizz',kda:'1/3/10'},
      {name:'jadriab10',champion:'Kai’Sa',kda:'2/4/6'},
      {name:'puminy',champion:'Amumu',kda:'2/3/8'}
    ]
  }},
  {date:'15–28 septiembre',a:'Monos Coruña',b:'Tarnished',winner:'Monos Coruña',week:'Jornada 2',duration:'28:19',twitch:'https://www.twitch.tv/videos/2886607109',lineups:{
    'Monos Coruña':[
      {name:'CANICHEMANIA63',champion:'Kindred',kda:'7/4/2'},
      {name:'General Panza',champion:'Qiyana',kda:'10/3/10'},
      {name:'Tugoldobello',champion:'Vladimir',kda:'5/3/7'},
      {name:'DrRedFlag',champion:'Syndra',kda:'9/2/9'},
      {name:'Iontxas',champion:'Tahm Kench',kda:'1/2/19'}
    ],
    'Tarnished':[
      {name:'TR Markos316',champion:'Sion',kda:'3/7/5'},
      {name:'TR Arkinos',champion:'Brand',kda:'9/6/5'},
      {name:'TR Adria Kila',champion:'LeBlanc',kda:'2/6/8'},
      {name:'TR alex132mini',champion:'Azir',kda:'0/5/3'},
      {name:'TR Terminator',champion:'Anivia',kda:'0/8/5'}
    ]
  }},
  {date:'29 septiembre–12 octubre',a:'Monos Coruña',b:'Chorbitos',winner:'Monos Coruña',week:'Jornada 3',duration:'31:50',twitch:'https://www.twitch.tv/videos/2892876516',lineups:{
    'Monos Coruña':[
      {name:'CANICHEMANIA63',champion:'Dr. Mundo',kda:'6/3/4'},
      {name:'General Panza',champion:'Wukong',kda:'6/2/8'},
      {name:'Tugoldobello',champion:'Galio',kda:'1/4/12'},
      {name:'DrRedFlag',champion:'Tristana',kda:'6/2/9'},
      {name:'MNC Roicetee',champion:'Bard',kda:'3/2/14'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Gwen',kda:'2/4/3'},
      {name:'ZaRg0t',champion:'Kayn',kda:'6/2/3'},
      {name:'Nómada',champion:'Syndra',kda:'3/4/4'},
      {name:'SobrinoRelax',champion:'Smolder',kda:'1/7/4'},
      {name:'Afelaino',champion:'Yuumi',kda:'1/5/4'}
    ]
  }},
  {date:'29 septiembre–12 octubre',a:'Maaa Nugueets',b:'Tarnished',winner:'Maaa Nugueets',week:'Jornada 3',duration:'26:23',twitch:'https://www.twitch.tv/videos/2900841639',lineups:{
    'Maaa Nugueets':[
      {name:'Keiwocky',champion:'Shyvana',kda:'6/6/9'},
      {name:'eiboll',champion:'Jarvan IV',kda:'11/1/18'},
      {name:'jadriab10',champion:'Ekko',kda:'8/3/11'},
      {name:'JONI',champion:'Heimerdinger',kda:'11/3/7'},
      {name:'puminy',champion:'Shaco',kda:'5/2/13'}
    ],
    'Tarnished':[
      {name:'TR alex132mini',champion:'Bel’Veth',kda:'5/7/4'},
      {name:'TR Arkinos',champion:'Viego',kda:'0/10/2'},
      {name:'TRPescadocanario',champion:'Katarina',kda:'6/8/1'},
      {name:'TR Markos316',champion:'Twitch',kda:'0/7/4'},
      {name:'TR Adria Kila',champion:'Rumble',kda:'4/9/1'}
    ]
  }},
  {date:'13–26 octubre',a:'Monos Coruña',b:'Maaa Nugueets',winner:'Maaa Nugueets',week:'Jornada 4'},
  {date:'13–26 octubre',a:'Tarnished',b:'Chorbitos',winner:'Tarnished',week:'Jornada 4',duration:'26:20',twitch:'https://www.twitch.tv/videos/2911664510',lineups:{
    'Tarnished':[
      {name:'TR alex132mini',champion:'Cho’Gath',kda:'9/2/7'},
      {name:'TR Arkinos',champion:'Amumu',kda:'9/1/7'},
      {name:'TRPescadocanario',champion:'Katarina',kda:'15/2/5'},
      {name:'TR Markos316',champion:'Twitch',kda:'10/3/14'},
      {name:'Bolrich',champion:'Nautilus',kda:'1/3/25'}
    ],
    'Chorbitos':[
      {name:'Panker',champion:'Ambessa',kda:'1/7/2'},
      {name:'Romera',champion:'Hecarim',kda:'3/9/2'},
      {name:'Nómada',champion:'Kai’Sa',kda:'3/4/1'},
      {name:'SobrinoRelax',champion:'Jhin',kda:'3/13/2'},
      {name:'Afelaino',champion:'Zoe',kda:'1/11/4'}
    ]
  }},
  {date:'27 octubre–9 noviembre',a:'Tarnished',b:'Monos Coruña',winner:null,week:'Jornada 5 · Pendiente'},
  {date:'27 octubre–9 noviembre',a:'Maaa Nugueets',b:'Chorbitos',winner:null,week:'Jornada 5 · Pendiente'},
  {date:'10–23 noviembre',a:'Chorbitos',b:'Monos Coruña',winner:null,week:'Jornada 6 · Pendiente'},
  {date:'10–23 noviembre',a:'Tarnished',b:'Maaa Nugueets',winner:null,week:'Jornada 6 · Pendiente'}
];
const teamMembers = new Map();
const playerStats = new Map();
games.forEach((game) => {
  Object.entries(game.lineups || {}).forEach(([team, lineup]) => {
    const members = teamMembers.get(team) || new Set();
    lineup.forEach((player) => {
      members.add(player.name);
      const stats = playerStats.get(player.name) || {name:player.name,team,games:0,kills:0,deaths:0,assists:0,picks:new Set()};
      const [kills, deaths, assists] = player.kda.split('/').map(Number);
      stats.games += 1;
      stats.kills += kills;
      stats.deaths += deaths;
      stats.assists += assists;
      if (player.champion) stats.picks.add(player.champion);
      playerStats.set(player.name, stats);
    });
    teamMembers.set(team, members);
  });
});
teamMembers.forEach((members, team) => teamMembers.set(team, [...members].sort((a, b) => a.localeCompare(b, 'es'))));

const riotProfiles = {
  eiboll:{tag:'eibol',status:'known'}, DrRedFlag:{tag:'EUW',status:'known'},
  'TR alex132mini':{tag:'ASF',status:'known'}, Panker:{tag:'MV3',status:'known'},
  CANICHEMANIA63:{tag:'nerf',status:'inferred'}, Afelaino:{tag:'9703',status:'inferred'},
  Bochi:{tag:'7630',status:'inferred'}, jadriab10:{tag:'shot',status:'inferred'},
  puminy:{tag:'EUW',status:'inferred'}, 'MNC Roicetee':{tag:'014',status:'inferred'},
  Iontxas:{tag:'MNC',status:'inferred'}, Tugoldobello:{tag:'YOKO',status:'inferred'},
  'TR Adria Kila':{tag:'DKS',status:'inferred'}, 'TR Markos316':{tag:'GGWP',status:'inferred'},
  Keiwocky:{tag:'GAP',status:'inferred'}, 'General Panza':{tag:'NGL',status:'found'},
  'TR Arkinos':{tag:'777',status:'found'}, 'TR Terminator':{tag:'1998',status:'found'},
  Bolrich:{tag:'EUW',status:'found'}, Romera:{tag:'888',status:'found'},
  'Nómada':{tag:'00000',status:'found'}, SobrinoRelax:{tag:'EUW',status:'found'},
  ZaRg0t:{tag:'17495',status:'found'}, 'Conde Nesquick':{tag:'NGL',status:'found'},
  JONI:{gameName:'J0NI',tag:'SAD',status:'known'},
  TRPescadocanario:{tag:'316',status:'known'}
};
const soloQueueRanks = {
  eiboll:{tier:'Diamante',division:4,lp:97}, DrRedFlag:{tier:'Esmeralda',division:3,lp:59},
  'TR alex132mini':{tier:'Plata',division:2,lp:74}, Panker:{tier:'Maestro',lp:11},
  CANICHEMANIA63:{tier:'Maestro',lp:0}, Afelaino:{tier:'Hierro',division:1,lp:84},
  Bochi:{tier:'Esmeralda',division:4,lp:94}, jadriab10:{tier:'Esmeralda',division:2,lp:56},
  puminy:{tier:'Diamante',division:4,lp:0}, 'MNC Roicetee':{tier:'Oro',division:4,lp:19},
  Iontxas:{tier:'Plata',division:2,lp:99}, Tugoldobello:{tier:'Plata',division:3,lp:77},
  'TR Adria Kila':{tier:'Platino',division:4,lp:0}, 'TR Markos316':{tier:'Oro',division:3,lp:74},
  'General Panza':{tier:'Esmeralda',division:4,lp:85}, 'TR Arkinos':{tier:'Esmeralda',division:4,lp:0},
  'TR Terminator':{tier:'Plata',division:3,lp:86}, Bolrich:{tier:'Diamante',division:3,lp:41},
  Romera:{tier:'Diamante',division:2,lp:29}, 'Nómada':{tier:'Esmeralda',division:4,lp:28},
  SobrinoRelax:{tier:'Plata',division:4,lp:32}, ZaRg0t:{tier:'Platino',division:2,lp:44}
};
const rankTiers = ['Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Maestro','Gran Maestro','Challenger'];
const romanDivision = (division) => ['','I','II','III','IV'][division] || '';
const rankScore = (rank) => (rankTiers.indexOf(rank.tier) * 400) + (rank.division ? (4 - rank.division) * 100 : 0) + rank.lp;
const formatRank = (rank) => rank ? `${rank.tier}${rank.division ? ` ${romanDivision(rank.division)}` : ''}` : 'Pendiente';

function formatAverageRank(score) {
  const tierIndex = Math.max(0, Math.min(rankTiers.length - 1, Math.floor(score / 400)));
  const remainder = Math.round(score - tierIndex * 400);
  if (tierIndex >= 7) return rankTiers[tierIndex];
  const divisionStep = Math.min(3, Math.floor(remainder / 100));
  return `${rankTiers[tierIndex]} ${romanDivision(4 - divisionStep)}`;
}

function renderTeamRoster(members) {
  if (!members.length) return '<p>Plantilla pendiente de identificar</p>';
  const rankedMembers = members
    .map((name) => ({name, rank:soloQueueRanks[name]}))
    .filter((player) => player.rank)
    .sort((a, b) => rankScore(b.rank) - rankScore(a.rank));
  const bestFive = rankedMembers.slice(0, 5);
  const averageScore = bestFive.length ? bestFive.reduce((total, player) => total + rankScore(player.rank), 0) / bestFive.length : null;
  const rows = members.map((name) => {
    const rank = soloQueueRanks[name];
    const player = playerStats.get(name) || {name};
    return `<tr><td><a href="${opggUrl(player)}" target="_blank" rel="noopener">${name}<span>OP.GG ↗</span></a></td><td class="${rank ? 'has-rank' : 'rank-pending'}">${formatRank(rank)}</td></tr>`;
  }).join('');
  const countLabel = `${bestFive.length} ${bestFive.length === 1 ? 'jugador' : 'jugadores'}`;
  return `<div class="team-rank-summary"><span>Rango promedio · mejores 5</span><strong>${averageScore === null ? 'Pendiente' : formatAverageRank(averageScore)}</strong><small>Calculado con ${countLabel} con rango confirmado</small></div><div class="team-table-wrap"><table><thead><tr><th>Jugador</th><th>Rango SoloQ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
const leaguePlayers = [...playerStats.values()].sort((a, b) => a.team.localeCompare(b.team, 'es') || a.name.localeCompare(b.name, 'es'));
const average = (total, gamesPlayed) => (total / gamesPlayed).toFixed(1);
const kdaRatio = (player) => (player.kills + player.assists) / Math.max(player.deaths, 1);
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

function renderPlayers(list) {
  if (!list.length) {
    playersGrid.innerHTML = '<p>No se encontraron jugadores.</p>';
    return;
  }
  const rows = list.map((player) => {
    const picks = [...player.picks];
    const rank = soloQueueRanks[player.name];
    const pickIcons = picks.map((champion) => `<span class="pick-icon" title="${champion}"><img src="${championIcon(champion)}" alt="${champion}"><small>${champion}</small></span>`).join('');
    return `<tr><td class="player-team-cell"><img src="${logo(player.team)}" alt=""><span>${player.team}</span></td><td><a class="player-link" href="${opggUrl(player)}" target="_blank" rel="noopener"><strong>${player.name}</strong>${riotIdLabel(player)}</a></td><td class="player-kda"><strong>${kdaRatio(player).toFixed(2)}</strong><small>${average(player.kills, player.games)} / ${average(player.deaths, player.games)} / ${average(player.assists, player.games)}</small></td><td class="${rank ? 'has-rank' : 'rank-pending'}">${formatRank(rank)}</td><td>${player.games}</td><td><div class="player-picks">${pickIcons || 'Pendiente'}</div></td></tr>`;
  }).join('');
  playersGrid.innerHTML = `<table class="players-table"><thead><tr><th>Equipo</th><th>Jugador</th><th>KDA</th><th>Rango SoloQ</th><th>PJ</th><th>Picks</th></tr></thead><tbody>${rows}</tbody></table>`;
}

const playerSearch = document.querySelector('#player-search');
const playerSort = document.querySelector('#player-sort');
function updatePlayers() {
  const query = playerSearch.value.trim().toLocaleLowerCase('es');
  const filtered = leaguePlayers.filter((player) => [player.name, player.team, ...player.picks].join(' ').toLocaleLowerCase('es').includes(query));
  filtered.sort((a, b) => {
    if (playerSort.value === 'kda') return kdaRatio(b) - kdaRatio(a) || a.name.localeCompare(b.name, 'es');
    if (playerSort.value === 'rank') return (soloQueueRanks[b.name] ? rankScore(soloQueueRanks[b.name]) : -1) - (soloQueueRanks[a.name] ? rankScore(soloQueueRanks[a.name]) : -1) || a.name.localeCompare(b.name, 'es');
    return a.team.localeCompare(b.team, 'es') || a.name.localeCompare(b.name, 'es');
  });
  renderPlayers(filtered);
}
updatePlayers();
playerSearch.addEventListener('input', updatePlayers);
playerSort.addEventListener('change', updatePlayers);

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

document.querySelector('#matches-grid').innerHTML = games.map((game) => `<article class="flip-card${game.lineups ? ' has-details' : ''}" tabindex="0"><div class="flip-card-inner"><div class="flip-face"><p>${game.week}</p><div class="flip-teams"><span><img src="${logo(game.a)}" alt="">${game.a}</span><b>VS</b><span><img src="${logo(game.b)}" alt="">${game.b}</span></div><div class="match-card-footer"><span>${game.lineups ? 'Ver alineaciones y KDA' : game.date}</span>${renderTwitchLink(game)}</div></div><div class="flip-face flip-back"><p>${game.winner ? `Victoria · ${game.winner}` : 'Partido pendiente'}</p>${renderMatchStats(game)}${game.lineups ? `<div class="match-lineups">${renderLineup(game, game.a)}${renderLineup(game, game.b)}</div>` : game.winner ? `<img src="${logo(game.winner)}" alt=""><h3>${game.winner}</h3>` : '<h3>Por disputar</h3>'}<div class="match-card-footer">${renderTwitchLink(game)}</div></div></div></article>`).join('');
document.querySelector('#matches-grid').addEventListener('click', (event) => {
  if (event.target.closest('a')) return;
  event.target.closest('.flip-card')?.classList.toggle('flipped');
});
document.querySelector('#matches-grid').addEventListener('keydown', (event) => {
  if (event.target.closest('a')) return;
  if (['Enter',' '].includes(event.key)) event.target.closest('.flip-card')?.classList.toggle('flipped');
});


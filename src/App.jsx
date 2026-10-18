import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, CircleDot, History, Layers3, Minus, Plus, RotateCcw, Sparkles, Trophy, Undo2, Users, X } from 'lucide-react';

const SUITS = [
  { key: 'spades', symbol: '♠', name: 'Spades', red: false },
  { key: 'hearts', symbol: '♥', name: 'Hearts', red: true },
  { key: 'clubs', symbol: '♣', name: 'Clubs', red: false },
  { key: 'diamonds', symbol: '♦', name: 'Diamonds', red: true },
];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','Q','K'];
const PALETTE = [
  { name: 'Jade', color: '#278668', token: 'jade' },
  { name: 'Coral', color: '#d96058', token: 'coral' },
  { name: 'Sapphire', color: '#4c70d6', token: 'sapphire' },
  { name: 'Amber', color: '#c18a26', token: 'amber' },
  { name: 'Violet', color: '#8960c4', token: 'violet' },
  { name: 'Rose', color: '#c54c8a', token: 'rose' },
];
const keyOf = card => card ? card.rank + '-' + card.suit : '';
function makeBoard() {
  // Fixed classic Sequence layout so the on-screen board matches a physical board.
  const rows = [
    ['FREE','10S','QS','KS','AS','2D','3D','4D','5D','FREE'],
    ['9S','10H','9H','8H','7H','6H','5H','4H','3H','6D'],
    ['8S','QH','7D','8D','9D','10D','QD','KD','2H','7D'],
    ['7S','KH','6D','2S','AH','KH','QH','AD','2C','8D'],
    ['6S','AH','5D','3S','4H','3H','10H','AC','3C','9D'],
    ['5S','2C','4D','4S','5H','2H','9H','KC','4C','10D'],
    ['4S','3C','3D','5S','6H','7H','8H','QC','5C','QD'],
    ['3S','4C','2D','6C','7C','8C','9C','10C','6S','KD'],
    ['2S','5C','AS','KS','QS','10S','9S','8S','7S','AD'],
    ['FREE','6C','7C','8C','9C','10C','QC','KC','AC','FREE'],
  ];
  return rows.flatMap((row, r) => row.map((code, c) => {
    const id = r + '-' + c;
    if (code === 'FREE') return { id, row: r, col: c, free: true };
    const suitCode = code.slice(-1);
    const rank = code.slice(0, -1);
    const suit = ({ S: 'spades', H: 'hearts', C: 'clubs', D: 'diamonds' })[suitCode];
    return { id, row: r, col: c, rank, suit };
  }));
}
const BOARD = makeBoard();

function CardFace({ card }) {
  const suitCode = ({ spades: 'S', hearts: 'H', clubs: 'C', diamonds: 'D' })[card.suit];
  // Render the complete playing-card face as the card itself — no portrait
  // floating inside a homemade card-shaped div, and no duplicated corner marks.
  const cardCode = card.rank + suitCode;
  return <img
    className="card-face card-image"
    src={`/cards/${cardCode}.jpg`}
    alt={`${card.rank} of ${card.suit}`}
    loading="lazy"
    draggable="false"
  />;
}

function Setup({ onStart }) {
  const [playersCount, setPlayersCount] = useState(4);
  const [teamsCount, setTeamsCount] = useState(2);
  const [names, setNames] = useState(['Player 1','Player 2','Player 3','Player 4']);
  const [assignments, setAssignments] = useState([0,1,0,1]);
  const [teamNames, setTeamNames] = useState(PALETTE.slice(0,2).map(t => t.name));
  const resizePlayers = count => {
    setPlayersCount(count);
    setTeamsCount(n => Math.min(n, count));
    setNames(old => Array.from({length:count}, (_,i) => old[i] ?? 'Player ' + (i+1)));
    setAssignments(old => Array.from({length:count}, (_,i) => (old[i] ?? i) % Math.min(teamsCount,count)));
  };
  const resizeTeams = count => {
    setTeamsCount(count);
    setTeamNames(old => Array.from({length:count}, (_,i) => old[i] ?? PALETTE[i].name));
    setAssignments(old => old.map(team => team % count));
  };
  const start = () => onStart({
    players: names.map((name,i) => ({ id:i, name:name.trim() || 'Player ' + (i+1), team:assignments[i] ?? i % teamsCount })),
    teams: Array.from({length:teamsCount}, (_,i) => ({...PALETTE[i], name:teamNames[i]?.trim() || 'Team ' + (i+1)}))
  });
  return <main className="setup-screen">
    <section className="intro-panel">
      <div className="brand"><span className="brand-mark"><Layers3 size={20}/></span><span>SEQUENCE <i>TABLE COMPANION</i></span></div>
      <div className="intro-copy"><span className="eyebrow"><Sparkles size={14}/> YOUR GAME, IN SYNC</span><h1>Keep your eyes<br/>on the <em>sequence.</em></h1><p>A thoughtful companion for the game happening around your table. Track every chip, every wild move, every comeback.</p></div>
      <div className="hero-cards"><div className="hero-card hero-a"><CardFace card={{rank:'A',suit:'hearts'}}/></div><div className="hero-card hero-q"><CardFace card={{rank:'Q',suit:'spades'}}/></div><div className="hero-card hero-seven"><CardFace card={{rank:'7',suit:'diamonds'}}/></div><span className="hero-chip"><CircleDot size={25}/></span></div>
      <div className="intro-foot"><span>01 / SET THE TABLE</span><span>MADE FOR GAME NIGHT</span></div>
    </section>
    <section className="setup-content"><div className="setup-card">
      <span className="eyebrow">LET'S GET STARTED</span><h2>Who's playing today?</h2><p className="muted">Set up the table, then start tracking your physical game.</p>
      <div className="section-title"><span>01</span><div><h3>Players & teams</h3><p>Choose who's around the table.</p></div></div>
      <div className="counter-row"><div><b>Players</b><small>2–12 players</small></div><div className="stepper"><button aria-label="Remove player" disabled={playersCount<=2} onClick={()=>resizePlayers(playersCount-1)}><Minus size={17}/></button><strong>{playersCount}</strong><button aria-label="Add player" disabled={playersCount>=12} onClick={()=>resizePlayers(playersCount+1)}><Plus size={17}/></button></div></div>
      <div className="counter-row"><div><b>Teams</b><small>2–6 teams</small></div><div className="stepper"><button aria-label="Remove team" disabled={teamsCount<=2} onClick={()=>resizeTeams(teamsCount-1)}><Minus size={17}/></button><strong>{teamsCount}</strong><button aria-label="Add team" disabled={teamsCount>=Math.min(6,playersCount)} onClick={()=>resizeTeams(teamsCount+1)}><Plus size={17}/></button></div></div>
      <div className="section-title"><span>02</span><div><h3>Player order</h3><p>Turns follow this list, then loop back.</p></div></div>
      <div className="players-list">{names.map((name,i)=><div className="player-row" key={i}><span className="player-num">{String(i+1).padStart(2,'0')}</span><input aria-label={'Player '+(i+1)+' name'} value={name} onChange={e=>setNames(old=>old.map((v,j)=>i===j?e.target.value:v))} placeholder={'Player '+(i+1)}/><select aria-label={'Team for player '+(i+1)} value={assignments[i] ?? i%teamsCount} onChange={e=>setAssignments(old=>old.map((v,j)=>i===j?Number(e.target.value):v))}>{Array.from({length:teamsCount},(_,team)=><option key={team} value={team}>{teamNames[team] || 'Team '+(team+1)}</option>)}</select><span className="team-dot" style={{background:PALETTE[assignments[i] ?? i%teamsCount].color}}/></div>)}</div>
      <div className="team-names">{Array.from({length:teamsCount},(_,i)=><label key={i}><span style={{background:PALETTE[i].color}}/><input aria-label={'Team '+(i+1)+' name'} value={teamNames[i] || ''} onChange={e=>setTeamNames(old=>old.map((v,j)=>i===j?e.target.value:v))}/></label>)}</div>
      <button className="primary-button start-button" onClick={start}>Start keeping score <ArrowRight size={18}/></button>
      <p className="setup-note"><Users size={16}/> Built for physical cards and real chips. You play; we keep track.</p>
    </div></section>
  </main>;
}

function findWinningLines(board, team) {
  const directions = [[0,1],[1,0],[1,1],[1,-1]];
  const lines = [];
  for (let r=0;r<10;r++) for (let c=0;c<10;c++) for (const [dr,dc] of directions) {
    const endR=r+dr*4, endC=c+dc*4;
    if (endR<0 || endR>9 || endC<0 || endC>9) continue;
    const cells = Array.from({length:5},(_,i)=>[r+dr*i,c+dc*i]);
    if (cells.every(([rr,cc]) => ((rr===0||rr===9)&&(cc===0||cc===9)) || board[rr+'-'+cc]?.team===team)) {
      const set = new Set(cells.map(([rr,cc])=>rr+'-'+cc));
      if (!lines.some(line => line.filter(id=>set.has(id)).length >= 4)) lines.push([...set]);
    }
  }
  return lines;
}

function App() {
  const [game,setGame] = useState(null);
  const [chips,setChips] = useState({});
  const [history,setHistory] = useState([]);
  const [current,setCurrent] = useState(0);
  const [mode,setMode] = useState('mark');
  const [selectedCard,setSelectedCard] = useState(null);
  const [notice,setNotice] = useState('');
  const [winner,setWinner] = useState(null);
  const [winningLines,setWinningLines] = useState([]);
  const [historyOpen,setHistoryOpen] = useState(false);
  const [resetOpen,setResetOpen] = useState(false);
  const [restored,setRestored] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('sequence-table-companion-v1') || 'null');
      if (saved) {
        setGame(saved.game ?? null);
        setChips(saved.chips ?? {});
        setHistory(saved.history ?? []);
        setCurrent(saved.current ?? 0);
        setMode(saved.mode ?? 'mark');
        setWinner(saved.winner ?? null);
        setWinningLines(saved.winningLines ?? []);
      }
    } catch { /* Storage may be unavailable; the game still works in memory. */ }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem('sequence-table-companion-v1', JSON.stringify({ game, chips, history, current, mode, winner, winningLines }));
    } catch { /* Full or disabled storage should not interrupt a game. */ }
  }, [restored, game, chips, history, current, mode, winner, winningLines]);
  const scores = useMemo(()=> (game?.teams ?? []).map((_,i)=>Object.values(chips).filter(chip=>chip.team===i).length),[game,chips]);
  const snapshot = (description, nextChips, nextPlayer, nextWinner=winner, nextLines=winningLines) => {
    setHistory(old=>[...old,{chips,current,winner,winningLines,description,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}]);
    setChips(nextChips); setCurrent(nextPlayer); setWinner(nextWinner); setWinningLines(nextLines); setNotice(description);
  };
  const startGame = config => { setGame(config);setChips({});setHistory([]);setCurrent(0);setMode('mark');setSelectedCard(null);setWinner(null);setWinningLines([]);setNotice('Choose an action, then record the move on the board.'); };
  const nextPlayer = (current+1) % (game?.players.length || 1);
  const recordCell = cell => {
    if (!game || winner || cell.free) return;
    const player=game.players[current], existing=chips[cell.id];
    if (mode==='cut') {
      if (!existing) { setNotice('There is no chip on that space. Choose an opposing chip.'); return; }
      if (existing.team===player.team) { setNotice('You can only cut an opposing team chip.'); return; }
      if (findWinningLines(chips, existing.team).some(line => line.includes(cell.id))) { setNotice('That chip is part of a completed sequence and cannot be cut.'); return; }
      const next={...chips}; delete next[cell.id];
      snapshot(player.name+' cut a '+game.teams[existing.team].name+' chip.',next,nextPlayer,null,[]);
      setMode('mark');setSelectedCard(null);return;
    }
    if (existing) { setNotice('That space is occupied. Choose an open space.'); return; }
    if (mode==='mark' && selectedCard && keyOf(selectedCard)!==keyOf(cell)) { setNotice('That space does not match the selected card.');return; }
    const next={...chips,[cell.id]:{team:player.team,player:player.id,kind:mode}};
    const lines=findWinningLines(next,player.team);
    const required=game.teams.length===2?2:1;
    const hasWon=lines.length>=required;
    const label=mode==='wild'?player.name+' played a wild move.':player.name+' marked '+cell.rank+SUITS.find(s=>s.key===cell.suit).symbol+'.';
    snapshot(label,next,nextPlayer,hasWon?player.team:null,hasWon?lines:[]);
    setMode('mark');setSelectedCard(null);
  };
  const undo = () => {
    if (!history.length) return;
    const last=history[history.length-1];
    setChips(last.chips);setCurrent(last.current);setWinner(last.winner);setWinningLines(last.winningLines);setHistory(old=>old.slice(0,-1));setNotice('Undid: '+last.description);setSelectedCard(null);setMode('mark');
  };
  const reset = () => {setChips({});setHistory([]);setCurrent(0);setWinner(null);setWinningLines([]);setMode('mark');setSelectedCard(null);setNotice('Board cleared. Ready for a fresh round.');setResetOpen(false);};
  const skip = () => { if(winner)return; snapshot(game.players[current].name+' skipped their turn.',chips,nextPlayer);setMode('mark');setSelectedCard(null); };
  if(!game) return <Setup onStart={startGame}/>;
  const player=game.players[current], team=game.teams[player.team];
  return <div className="game-app">
    <header className="game-header"><div className="brand"><span className="brand-mark"><Layers3 size={19}/></span><span>SEQUENCE <i>TABLE COMPANION</i></span></div><div className="live-status"><span/> GAME IN PROGRESS</div><div className="header-actions"><button className="quiet-button" onClick={()=>setHistoryOpen(true)}><History size={17}/> History <b>{history.length}</b></button><button className="quiet-button" onClick={()=>setResetOpen(true)}><RotateCcw size={16}/> New game</button></div></header>
    <div className="game-layout">
      <aside className="left-rail">
        <div className="rail-label">AT THE TABLE</div>
        <section className="active-player"><div className="rail-label">UP NEXT <span className="pulse"/></div><div className="player-avatar" style={{background:team.color}}>{player.name.charAt(0).toUpperCase()}</div><h2>{player.name}</h2><p style={{color:team.color}}><span style={{background:team.color}}/>{team.name}</p><small>TURN <b>{history.length+1}</b></small></section>
        <section className="rail-card"><div className="rail-title">TEAM SCORE <span>{game.teams.length} TEAMS</span></div>{game.teams.map((t,i)=><div className={'score-row '+(i===player.team?'score-active':'')} key={t.name+i}><span className="team-dot" style={{background:t.color}}/><div><b>{t.name}</b><small>{game.players.filter(p=>p.team===i).map(p=>p.name).join(' · ')}</small></div><strong>{scores[i]}</strong></div>)}</section>
        <section className="rail-card player-order"><div className="rail-title">PLAYER ORDER</div>{game.players.map((p,i)=><div className={'order-row '+(i===current?'is-current':'')} key={p.id}><span>{String(i+1).padStart(2,'0')}</span><i style={{background:game.teams[p.team].color}}/><b>{p.name}</b>{i===current&&<small>NOW</small>}</div>)}</section>
      </aside>
      <main className="board-area">
        <div className="board-heading"><div><span className="eyebrow">✳ &nbsp; THE PLAYING BOARD</span><h1>Make your <em>move.</em></h1><p>Track the chips on your physical board, right here.</p></div><div className="board-meta"><b>{Object.keys(chips).length} CHIPS</b><span>10 × 10 BOARD</span></div></div>
        <div className="board-frame"><div className="board-grid">{BOARD.map(cell=>{const chip=chips[cell.id], suit=SUITS.find(s=>s.key===cell.suit), highlighted=selectedCard&&!cell.free&&keyOf(selectedCard)===keyOf(cell);return <button key={cell.id} className={'board-cell '+(cell.free?'free-cell ':'')+(chip?'occupied ':'')+(highlighted?'is-match ':'')} onClick={()=>recordCell(cell)} disabled={!!winner||cell.free} aria-label={cell.free?'Free corner':cell.rank+' of '+suit.name+(chip?', '+game.teams[chip.team].name+' chip':'') } title={cell.free?'Free corner':cell.rank+' of '+suit.name}>{cell.free?<span className="free-mark">✳<small>FREE</small></span>:<><CardFace card={cell}/>{chip&&<span className={'chip chip-'+game.teams[chip.team].token} style={{'--chip':game.teams[chip.team].color}}>{chip.kind==='wild'?'✦':''}</span>}</>}</button>})}</div></div>
        <div className="board-legend"><span><i className="free-key">✳</i> Free corner</span><span><i className="chip-key" style={{background:team.color}}/> Active team</span><span><i className="card-key">A♥</i> Card space</span><span className="legend-help">Tap an open space to record a chip</span></div>
      </main>
      <aside className="right-rail">
        <section className="action-panel"><div className="action-heading"><div><span className="rail-label">YOUR TURN</span><h2>Choose an action</h2></div><b>{current+1} / {game.players.length}</b></div><p className="action-copy">Playing as <strong style={{color:team.color}}>{player.name}</strong>. What happened on the physical board?</p>
          <button className={'action-option '+(mode==='mark'?'chosen':'')} onClick={()=>{setMode('mark');setSelectedCard(null);setNotice('Optional: select the physical card, then tap a matching open space.')}}><span className="action-icon mark"><Check size={19}/></span><span><b>Mark a card</b><small>Place your team's chip</small></span><i/></button>
          <button className={'action-option '+(mode==='wild'?'chosen':'')} onClick={()=>{setMode('wild');setSelectedCard(null);setNotice('Wild move selected. Tap any open space.')}}><span className="action-icon wild"><Sparkles size={19}/></span><span><b>Wild move</b><small>Place a chip on an open space</small></span><i/></button>
          <button className={'action-option '+(mode==='cut'?'chosen':'')} onClick={()=>{setMode('cut');setSelectedCard(null);setNotice("Cut selected. Tap an opposing team's chip.")}}><span className="action-icon cut"><X size={19}/></span><span><b>Cut a chip</b><small>Remove an opponent&apos;s chip</small></span><i/></button>
          {mode==='mark'&&<div className="card-picker"><div className="picker-heading">CARD PLAYED <span>OPTIONAL</span></div><p>Select a card to highlight all matching spaces.</p><div className="rank-picker">{RANKS.map(rank=><button key={rank} className={selectedCard?.rank===rank?'active':''} onClick={()=>setSelectedCard(old=>old?.rank===rank?null:{rank,suit:old?.suit||'hearts'})}>{rank}</button>)}</div><div className="suit-picker">{SUITS.map(s=><button aria-label={s.name} key={s.key} className={(s.red?'red-suit ':'')+(selectedCard?.suit===s.key?'active':'')} onClick={()=>setSelectedCard(old=>({rank:old?.rank||'A',suit:s.key}))}>{s.symbol}</button>)}</div></div>}
          <div className={'notice '+(notice?'notice-on':'')}><span>✳</span><p>{notice||'Choose an action, then record the move.'}</p></div>
          <div className="action-footer"><button className="secondary-button" onClick={undo} disabled={!history.length}><Undo2 size={17}/> Undo</button><button className="primary-button" onClick={skip} disabled={!!winner}>Skip turn <ArrowRight size={16}/></button></div>
        </section>
        <section className="rules-card"><h3><Sparkles size={16}/> Quick rules</h3><p><b>Mark</b> — record a normal chip.</p><p><b>Wild</b> — place a chip on an open space.</p><p><b>Cut</b> — remove an opposing chip.</p><small>Physical cards stay on your table. This is your scorekeeper.</small></section>
      </aside>
    </div>
    {historyOpen&&<div className="overlay" onClick={()=>setHistoryOpen(false)}><section className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">THE PAPER TRAIL</span><h2>Move history</h2></div><button className="close-button" onClick={()=>setHistoryOpen(false)} aria-label="Close history"><X/></button></div>{history.length?<div className="history-list">{[...history].reverse().map((item,i)=><div className="history-item" key={history.length-i}><span>{String(history.length-i).padStart(2,'0')}</span><div><b>{item.description}</b><small>{item.time}</small></div></div>)}</div>:<div className="empty-history"><History size={30}/><b>No moves yet</b><span>Your actions will appear here.</span></div>}<button className="secondary-button full-button" onClick={()=>{undo();setHistoryOpen(false)}} disabled={!history.length}><Undo2 size={17}/> Undo last action</button></section></div>}
    {winner!==null&&<div className="overlay centered"><section className="modal"><span className="trophy"><Trophy size={30}/></span><span className="eyebrow">SEQUENCE COMPLETE</span><h2>{game.teams[winner].name} takes it!</h2><p>Nice play. The scorekeeper has caught up with your physical game.</p><button className="primary-button full-button" onClick={()=>setResetOpen(true)}>Play another round <ArrowRight size={17}/></button><button className="text-button" onClick={()=>setWinner(null)}>Keep viewing the board</button></section></div>}
    {resetOpen&&<div className="overlay centered"><section className="modal"><span className="trophy reset-icon"><RotateCcw size={25}/></span><h2>Start a fresh game?</h2><p>This clears every chip and move. Your player setup will stay the same.</p><div className="modal-actions"><button className="secondary-button" onClick={()=>setResetOpen(false)}>Keep playing</button><button className="primary-button" onClick={reset}>Clear board</button></div></section></div>}
    <footer className="game-footer"><span>SEQUENCE TABLE COMPANION</span><span>GOOD COMPANY. CLEVER MOVES. ✳</span></footer>
  </div>;
}
export default App;
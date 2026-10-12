// Controles de teste locais. O servidor injeta este arquivo somente em /verify.
const controls = document.createElement('div');
controls.style = 'position:fixed;top:0;left:0;z-index:99999;background:white;color:black;max-width:100vw';
document.body.appendChild(controls);
function verifyStatus(){
  document.getElementById('verifyStatus').textContent = JSON.stringify({mode,coop:coop&&{host:coop.host,stage:coop.stage},battle:!!battle,ally:!!(battle&&battle.ally),boss:game.bosses[0],key:game.keys.includes(1),money:game.money,seen:Object.keys(game.dex||{}).length,caught:Object.values(game.dex||{}).filter(x=>x.caught).length,peers:net.remotes.size,team:game.team.map(m=>({species:m.species,hp:m.hp,rare:m.rare})),result:battle&&battle.result});
}
function verifyControl(label, fn){
  const button=document.createElement('button');button.textContent=label;
  button.onclick=()=>{try{fn();verifyStatus();}catch(e){document.getElementById('verifyStatus').textContent=e.stack;throw e;}};
  controls.appendChild(button);
}
verifyControl('Preparar teste',()=>{
  if(battle) throw new Error('Recarregue para preparar outro cenário.');
  game={team:[newMember('urso',12)],box:[],money:300,inv:{bolota:5,fruta:3},sel:'bolota',keys:[],bosses:{},tutorial:5,journal:cleanJournal()};
  game.team[0].rare=true;enterWorld();const b=BOSSES[0];trainer.pos.set(b.x+7,0,b.z);
  if(!b.c||b.c.removed)spawnBoss(b);b.c.cool=999;showTeleport(follower,b.x+6,b.z);publishLobby(1);render();
});
verifyControl('Sincronizar teste',()=>{if(net.room){updateRemotes();publishLobby(1);}if(mode==='world')step(1/60);render();});
verifyControl('Avançar teste',()=>{for(let i=0;i<10;i++)step(1/60);render();});
verifyControl('Vencer teste',()=>{if(battle&&battle.host){battle.wild.member.hp=0;battle.wild.fainted=true;for(let i=0;i<130;i++)step(1/60);render();}});
verifyControl('Descobrir bosque',()=>{closeMenu();trainer.pos.set(-29,0,29);updateJournal(1);render();});
verifyControl('Modo solo teste',()=>{net.room=null;net.user=null;for(const r of [...net.remotes.values()])removeRemote(r);coop=null;});
verifyControl('Modo online teste',()=>{window.claude.use('room').then(r=>{net.room=r;verifyStatus();});});
verifyControl('Sair da luta teste',()=>{pressed.KeyX=true;for(let i=0;i<30;i++)step(1/60);render();});
verifyControl('Soco teste',()=>{pressed.KeyQ=true;step(1/60);if(net.room)publishLobby(1);render();});
const verifyOutput=document.createElement('pre');verifyOutput.id='verifyStatus';verifyOutput.style='font-size:11px;margin:0';controls.appendChild(verifyOutput);verifyStatus();

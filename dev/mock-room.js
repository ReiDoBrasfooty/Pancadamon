// Simulador LOCAL da capability `room` (só para testar com duas abas no localhost).
(function(){
  const ch = new BroadcastChannel('pancadamon-mock');
  const me = Math.random().toString(36).slice(2, 10);
  const rooms = {};
  function makeRoom(name){
    const peers = new Map([[me, {presence:Object.freeze({}), updatedAt:Date.now(), seen:Date.now()}]]);
    let cbs = [], cached = null;
    const snap = () => Object.freeze([...peers.entries()].map(([peer, p]) => Object.freeze({peer, by:'u_' + peer, isMe:peer === me, sameTab:peer === me, kind:'viewer', guest:false, presence:p.presence, updatedAt:p.updatedAt})));
    const fire = () => { cached = snap(); const ch2 = {peers:cached, joined:[], left:[], updated:[]}; cbs.forEach(f => f(ch2)); };
    const api = Object.freeze({
      name,
      presence(patch){
        const cur = {...peers.get(me).presence};
        for (const k in patch){ if (patch[k] === null) delete cur[k]; else cur[k] = patch[k]; }
        peers.set(me, {presence:Object.freeze(JSON.parse(JSON.stringify(cur))), updatedAt:Date.now(), seen:Date.now()});
        ch.postMessage({room:name, peer:me, presence:cur}); fire();
        return Promise.resolve();
      },
      peers(){ return cached || (cached = snap()); },
      onPeers(f){ cbs.push(f); setTimeout(() => f({peers:api.peers(), joined:api.peers(), left:[], updated:[]}), 0); return () => { cbs = cbs.filter(x => x !== f); }; },
      emit(){ return Promise.resolve(); }, on(){ return () => {}; },
      connected(){ return true; }, onConnection(f){ setTimeout(() => f(true), 0); return () => {}; },
      leave(){ ch.postMessage({room:name, peer:me, leave:true}); delete rooms[name]; return Promise.resolve(); },
      join(n){ if (!rooms[n]){ rooms[n] = makeRoom(n); ch.postMessage({room:n, peer:me, hello:true}); } return Promise.resolve(rooms[n].api); }
    });
    return {api, peers, fire};
  }
  rooms[''] = makeRoom('');
  ch.onmessage = e => {
    const m = e.data, r = rooms[m.room]; if (!r) return;
    if (m.leave){ r.peers.delete(m.peer); r.fire(); return; }
    if (m.hello){ ch.postMessage({room:m.room, peer:me, presence:r.peers.get(me).presence}); if (!r.peers.has(m.peer)) r.peers.set(m.peer, {presence:Object.freeze({}), updatedAt:Date.now(), seen:Date.now()}); r.fire(); return; }
    const isNew = !r.peers.has(m.peer);
    r.peers.set(m.peer, {presence:Object.freeze(m.presence), updatedAt:Date.now(), seen:Date.now()});
    if (isNew) ch.postMessage({room:m.room, peer:me, presence:r.peers.get(me).presence});
    r.fire();
  };
  ch.postMessage({room:'', peer:me, hello:true});
  setInterval(() => {
    for (const name in rooms){
      const r = rooms[name];
      ch.postMessage({room:name, peer:me, presence:r.peers.get(me).presence});
      for (const [peer, p] of r.peers) if (peer !== me && Date.now() - p.seen > 4000){ r.peers.delete(peer); r.fire(); }
    }
  }, 1000);
  addEventListener('beforeunload', () => { for (const name in rooms) ch.postMessage({room:name, peer:me, leave:true}); });
  const user = Object.freeze({
    profiles: async ids => Object.fromEntries([].concat(ids).map(id => [id, {id, name:'Amigo ' + id.slice(2, 6), avatarUrl:'', color:'#888', email:null, isMe:false, guest:false}])),
    id: async () => 'u_' + me
  });
  window.claude = {use: async n => n === 'room' ? rooms[''].api : n === 'user' ? user : null};
})();

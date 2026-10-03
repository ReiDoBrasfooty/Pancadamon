# Pancadamon

Um jogo estilo Pokémon em 3D isométrico, só que os animais têm física de boneco molenga (ragdoll), como em Gang Beasts e Human Fall Flat. As batalhas são em tempo real: você soca, morde, agarra e arremessa o inimigo, e depois tenta capturá-lo com uma bolota.

Feito em um único arquivo HTML com [three.js](https://threejs.org/) (r128) para os gráficos e [cannon.js](https://schteppe.github.io/cannon.js/) (0.6.2) para a física, ambos carregados do cdnjs.

## Como jogar

Abra o `index.html` no navegador. Não precisa instalar nada.

O progresso fica salvo no navegador (localStorage).

### Controles

Todos os comandos ficam em volta do WASD, na mão esquerda.

| Tecla | Ação |
|---|---|
| `W` `A` `S` `D` | Andar / mover o animal na batalha |
| `Q` ou clique | Soco (animais de duas patas) ou mordida (quatro patas) |
| `E` (segurar) | Na batalha: agarrar ou morder e segurar |
| `Espaço` | Pular; segurando alguém, levanta. Solte `E` para arremessar |
| `F` | Golpe especial do animal |
| `R` ou botão direito | Arremessar o item de captura na mira |
| `C` | Trocar o item de captura |
| `X` | Fugir da batalha / desistir do duelo |
| `Z` | Mochila |
| `Tab` | Ver o time |
| `1`–`5` | Trocar de animal |
| `E` (no mapa) | Usar o Centro de Cura, a Caixa de Animais, a Loja ou um portal (no tapete) |
| `F` / `E` / `X` (no mapa) | Desafiar um amigo / aceitar / recusar |

No celular aparecem botões na tela.

## O que tem no jogo

- **10 animais em 3 classes:**
  - **Força:** Urso, Gorila, Rinoceronte, Javali
  - **Agilidade:** Lobo, Guepardo, Canguru
  - **Inteligência:** Macaco, Coruja, Raposa
- **Mais 12 animais que só aparecem em um mapa (um de cada classe por mapa):**

  | Mapa | Força | Agilidade | Inteligência |
  |---|---|---|---|
  | Sertão Rachado | Tatu (Tatu-Bola) | Calango (Corrida Quente) | Carcará (Pedra do Alto) |
  | Pico Congelado | Iaque (Patada na Neve) | Lebre-da-Neve (Salto da Lebre) | Pinguim (Bola de Neve) |
  | Brejo Lamacento | Jacaré (Bote do Jacaré) | Sapo-Boi (Pulo do Sapo) | Capivara (Calma Contagiante) |
  | Cratera Brava | Búfalo de Lava (Pisão Vulcânico) | Salamandra (Faísca) | Fênix (Brilho da Fênix) |
- **Triângulo de vantagem:** Força vence Agilidade, Agilidade vence Inteligência, Inteligência vence Força (+30% de dano).
- **Atributos:** FOR, AGI e INT que crescem por nível. Deles saem vida, dano, velocidade, esquiva e recarga do especial.
- **Golpe especial próprio de cada animal:**
  - Urso: Esmagada
  - Gorila: Murro no Chão
  - Rinoceronte: Investida de Chifre
  - Javali: Carga Selvagem
  - Lobo: Bote
  - Guepardo: Disparada
  - Canguru: Coice Duplo
  - Macaco: Pedrada
  - Coruja: Pio Hipnótico
  - Raposa: Truque da Raposa
- **Evolução no estilo Digimon:** a cada evolução o animal fica mais parecido com gente, e cada espécie tem o próprio figurino, combinando com o nome da forma.
  - **Nível 15, Guerreiro:** quem andava de quatro fica de pé e passa a socar, e o corpo fica mais alto.
  - **Nível 25, Mestre:** fica ainda mais alto, com a cabeça menor e o figurino completo.
  - Cada evolução aumenta FOR, AGI e INT (+12% no Guerreiro e +25% no Mestre). Se o animal está com você, ele sobe num casulo de luz e sai na forma nova.

  | Animal | Guerreiro | Mestre |
  |---|---|---|
  | Urso | Ursoldado: farda, capacete e mochila | Generurso: quepe, dragonas, medalhas, capa e espada |
  | Gorila | Gorilutador: máscara de luta-livre e cinturão | Gorimperador: toga, louros, capa roxa e cetro |
  | Rinoceronte | Rinocavaleiro: elmo de penacho, escudo e lança | Rinotitã: armadura de pedra e marreta gigante |
  | Javali | Javaliente: viking de gola de pele e machado | Javalorde: elmo de ouro, cota de malha, barba e machado duplo |
  | Lobo | Lobisomem: juba eriçada e garras | Lobonin: samurai de chapéu de palha, cachecol e katana |
  | Guepardo | Guepardleta: atleta de regata com número | Relampardo: super-herói de máscara, capa e raios |
  | Canguru | Canguboxe: luvas e protetor de boxe | Cangurulenda: luvas de ouro, cinturão e capa |
  | Macaco | Macacientista: jaleco, óculos e tubo de ensaio | Macacomago: mago de chapéu, barba, cajado e livro |
  | Coruja | Corujuíza: toga, peruca e martelo de juíza | Arquicoruja: capelo de formatura, monóculo e livro |
  | Raposa | Raposábia: quimono, óculos, pergaminho e leque | Nove-Caudas: nove caudas, marcas no rosto e fogo-fátuo azul |
  | Tatu | Tatuerreiro: ombreiras de couro, escudo e lança | Tatublindado: armadura completa, escudão e marreta |
  | Calango | Calangaceiro: chapéu de meia-lua, cartucheiras e facão | Calampião: chapéu cheio de estrelas, óculos redondos e dois facões |
  | Carcará | Carcavaqueiro: gibão de couro, chapéu e laço | Carcarapajé: cocar, pintura, colar de dentes e maracá |
  | Iaque | Iaquerreiro: gola de pele, faixa e machado | Iaquelosso: armadura e cristais de gelo, marreta de gelo |
  | Lebre-da-Neve | Lebreninja: roupa de ninja, máscara e shurikens | Lebrelâmina: samurai de armadura vermelha, kabuto e katana |
  | Pinguim | Pinguinventor: boné de hélice, óculos de solda e mochila a jato | Pinguimperador: coroa, capa de arminho e cetro |
  | Jacaré | Jacaraté: quimono e faixa preta | Jacarei: coroa, capa verde e tridente |
  | Sapo-Boi | Sapoeira: abadá, corda e berimbau | Mestre Sapão: túnica, barbona, sobrancelhas e cajado |
  | Capivara | Capimonge: manto laranja e contas | Capiguru: turbante, barba, auréola e esferas de luz |
  | Búfalo de Lava | Bufaferreiro: avental, luvas e martelo | Vulcabúfalo: armadura rachada de lava e marreta em brasa |
  | Salamandra | Salamaninja: ninja do fogo com duas adagas | Salamandragão: vira dragão, com asas, chifres e garras |
  | Fênix | Fênix Maga: capuz, manto e esferas de fogo | Fênix Divina: disco de sol, peitoral de ouro e asas em chamas |

  As aves evoluídas trocam as asas por braços e ficam com asas nas costas que batem.

  Animais selvagens de nível alto (Pico Congelado em diante) já aparecem evoluídos.
- **Chefes mitológicos e chaves:** cada mapa tem uma criatura mitológica que só existe ali, num covil (chão escuro com aro vermelho e tochas). Ela só aparece uma vez por jogo: vencida ou capturada, deixa a chave do mapa seguinte. Os portais dos Campos ficam trancados com correntes e cadeado até você ter a chave.

  | Mapa | Criatura | Classe e especial | Nível | Forma no covil | Deixa |
  |---|---|---|---|---|---|
  | Campos Pancada | Unicórnio | AGI · Chifrada Arco-Íris | 12 | Unicórnio | Chave do Sertão |
  | Sertão Rachado | Esfinge | INT · Enigma da Esfinge | 17 | Esfinge Alada | Chave do Pico |
  | Pico Congelado | Grifo | FOR · Mergulho do Grifo | 21 | Grifo Real | Chave do Brejo |
  | Brejo Lamacento | Hidra | AGI · Mordida das Cabeças | 26 | Hidra Ancestral | Chave da Cratera |
  | Cratera Brava | Dragão | FOR · Bola de Fogo | 31 | Dragão Imperador | Coroa da Cratera |

  - **Evolução própria:** as criaturas mitológicas não viram gente como os outros animais. Elas continuam bichos e ficam mais lendárias (estágios Mítico, Desperto e Lendário):
    - **Unicórnio → Alicórnio → Unicórnio Celestial:** ganha asas, o chifre cresce e o último tem asas douradas, auréola e estrelas em volta.
    - **Esfinge → Esfinge Alada → Grande Esfinge:** leoa com cocar de faraó; ganha asas douradas e depois colar e a coroa dupla do faraó.
    - **Grifo → Grifo Real → Grifo Tempestade:** cabeça de águia e corpo de leão; as asas crescem, ganham crista e pontas de ouro, e por fim raios azuis.
    - **Hidra → Hidra de Cinco Cabeças → Hidra Ancestral:** começa com 3 cabeças, passa a 5 e termina com 7, cada uma num pescoço que balança.
    - **Dragão → Dragão Ancião → Dragão Imperador:** asas de morcego e chifres que se multiplicam; o último tem chifres de ouro, couro rachado de lava e asas em brasa.
  - O chefe tem 50% a mais de PV e 10% a mais de atributos, e dá o dobro de XP e o triplo de moedas.
  - Capturar é mais difícil (40% da chance normal), mas a Semente Dourada continua garantida. Capturada, a criatura entra no time com os atributos extras e continua evoluindo do jeito dela.
  - Se você perder ou fugir, o chefe volta pro covil com a vida cheia.
  - A mochila (Z) mostra cada chefe e o que falta. Saves antigos já ganham as chaves dos mapas que o time aguenta.
- **Captura com frutos e sementes:** Bolota, Pinha (1,5x), Coco (2,2x) e Semente Dourada (garantida).
- **Loja do Mato e mochila:** itens de cura (Fruta Silvestre, Pote de Mel, Cesta de Frutas, Erva Reanimadora) e de captura, comprados com moedas ganhas nas batalhas.
- **Time de até 5 animais e Caixa de Animais:** capturas com o time cheio vão pra caixa, um terminal ao lado do Centro de Cura onde você guarda e pega animais. Quem é guardado descansa e volta curado.
- **5 mapas ligados por portais:** os Campos Pancada são o centro, com um portal em cada ponta da estrada. Cada mapa tem cidade própria (Centro de Cura, Loja e Caixa), clima, cenário e animais mais fortes:

  | Mapa | Níveis | Destaques |
  |---|---|---|
  | Campos Pancada | 2–10 | Vila Pancada, fazenda, lago, Bosque Sombrio, Arena PvP |
  | Sertão Rachado | 8–14 | cactos, Oásis Escondido, Paredões Vermelhos, Cemitério de Ossos |
  | Pico Congelado | 13–19 | neve caindo, Lago Congelado, Vila dos Iglus, Cume Gelado |
  | Brejo Lamacento | 17–23 | lagoas de lama, vaga-lumes, Árvore Anciã |
  | Cratera Brava | 22–28 | poças de lava, Vulcão Pancadão, Campo de Obsidiana |

- **Matos:** cada mapa tem 4 a 7 áreas de mato alto com níveis diferentes. Cada área mantém 2 animais e repõe quem foi capturado ou derrotado. O jogo lembra em qual mapa você parou.

## Multiplayer

O multiplayer (ver os amigos no mapa e duelar na Arena) usa o recurso de sala em tempo real dos artifacts do claude.ai (`window.claude.use("room")`). Ele funciona quando o jogo é aberto como artifact no claude.ai e compartilhado com os amigos.

Abrindo o `index.html` direto, ou por outro site como o GitHub Pages, o jogo roda só no modo single-player.

### Testar o multiplayer localmente

A pasta `dev/` tem um simulador da sala que funciona entre abas do mesmo navegador:

```bash
powershell -ExecutionPolicy Bypass -File dev/serve.ps1
```

Depois abra `http://localhost:8765/mp` em duas abas. Para o single-player, use `http://localhost:8765/`.

As duas abas dividem o mesmo save do navegador.

## Estrutura

```
index.html        o jogo inteiro (HTML, CSS e JavaScript)
dev/serve.ps1     servidor local de teste
dev/mock-room.js  simulador da sala multiplayer para testes locais
```

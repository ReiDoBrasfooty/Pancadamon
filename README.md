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
| `E` (no mapa) | Usar o Centro de Cura, a Caixa de Animais ou a Loja (no tapete) |
| `F` / `E` / `X` (no mapa) | Desafiar um amigo / aceitar / recusar |

No celular aparecem botões na tela.

## O que tem no jogo

- **10 animais em 3 classes:**
  - **Força:** Urso, Gorila, Rinoceronte, Javali
  - **Agilidade:** Lobo, Guepardo, Canguru
  - **Inteligência:** Macaco, Coruja, Raposa
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
- **Captura com frutos e sementes:** Bolota, Pinha (1,5x), Coco (2,2x) e Semente Dourada (garantida).
- **Loja do Mato e mochila:** itens de cura (Fruta Silvestre, Pote de Mel, Cesta de Frutas, Erva Reanimadora) e de captura, comprados com moedas ganhas nas batalhas.
- **Time de até 5 animais e Caixa de Animais:** capturas com o time cheio vão pra caixa, um terminal ao lado do Centro de Cura onde você guarda e pega animais. Quem é guardado descansa e volta curado.
- **Mapa:** áreas de mato alto com níveis diferentes. Cada área mantém 2 animais e repõe quem foi capturado ou derrotado.

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

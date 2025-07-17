class Board {
    #state;
    #board;
    #boardContainer;
    #currentPlayerIndex = 0;
    #players = [];
    #gameOver = false;
    #winningCombos = [];
    #dimension;

    constructor(elem, state = [], dimension = 3) {
        const mountPoint = document.querySelector(elem);
        if (!mountPoint) throw new Error("Element does not exist");

        if (!Array.isArray(state)) throw new Error("Bad board state");

        this.#dimension = dimension;
        const totalCells = dimension * dimension;

        state = state.slice(0, totalCells).concat(Array(totalCells).fill('')).slice(0, totalCells);

        this.#state = new Proxy([...state], {
            set: (target, prop, value) => {
                const index = Number(prop);
                if (!isNaN(index) && index >= 0 && index < totalCells) {
                    target[index] = value;
                    this.#updateCell(index, value);
                    return true;
                }
                return false;
            }
        });

        this.#winningCombos = this.#computeWinningCombos(dimension);
        this.#board = this.#create();
        this.#boardContainer = mountPoint;
        this.#boardContainer.appendChild(this.#board);
    }

    setPlayers(player1, player2) {
        this.#players = [player1, player2];
        this.#players[this.#currentPlayerIndex].play();
    }

    #create() {
        const container = document.createElement('div');
        container.classList.add('board');
        container.style.gridTemplateColumns = `repeat(${this.#dimension}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${this.#dimension}, 1fr)`;

        for (let i = 0; i < this.#dimension * this.#dimension; i++) {
            const cell = document.createElement('span');
            cell.classList.add('board_cell');
            cell.dataset.index = i;
            cell.innerText = this.#state[i];

            cell.onclick = () => {
                if (this.#gameOver) return;

                const current = this.#players[this.#currentPlayerIndex];
                if (current.type === 'human' && this.#state[i] === '') {
                    this.move(i, current.symbol);
                }
            };

            container.appendChild(cell);
        }

        return container;
    }

    #updateCell(index, value) {
        const cell = this.#board.querySelector(`.board_cell[data-index="${index}"]`);
        if (cell) {
            cell.innerText = value;
        }
    }

    #computeWinningCombos(n) {
        const combos = [];

        for (let row = 0; row < n; row++) {
            const combo = [];
            for (let col = 0; col < n; col++) {
                combo.push(row * n + col);
            }
            combos.push(combo);
        }

        for (let col = 0; col < n; col++) {
            const combo = [];
            for (let row = 0; row < n; row++) {
                combo.push(row * n + col);
            }
            combos.push(combo);
        }

        combos.push(Array.from({ length: n }, (_, i) => i * n + i));
        combos.push(Array.from({ length: n }, (_, i) => i * n + (n - i - 1)));

        return combos;
    }

    #checkGameOver() {
        for (const combo of this.#winningCombos) {
            const values = combo.map(i => this.#state[i]);
            if (values.every(v => v && v === values[0])) {
                this.#gameOver = true;
                this.#dispatchGameOver(values[0], combo);
                return;
            }
        }

        if (this.#state.every(cell => cell !== '')) {
            this.#gameOver = true;
            this.#dispatchGameOver(null, null);
        }
    }

    #dispatchGameOver(winner, combo) {
        const event = new CustomEvent('gameover', {
            detail: { winner, combo }
        });
        this.#boardContainer.dispatchEvent(event);
    }

    getState() {
        return [...this.#state];
    }

    getBoard() {
        return this.#board;
    }

    getCurrentPlayer() {
        return this.#players[this.#currentPlayerIndex];
    }

    move(cellIndex, playerMark) {
        if (this.#gameOver) return;
        if (cellIndex < 0 || cellIndex >= this.#dimension * this.#dimension) return;
        if (this.#state[cellIndex] !== '') return;

        const currentPlayer = this.#players[this.#currentPlayerIndex];
        if (currentPlayer.symbol !== playerMark) return;

        this.#state[cellIndex] = playerMark;
        this.#checkGameOver();

        if (this.#gameOver) return;

        this.#currentPlayerIndex = (this.#currentPlayerIndex + 1) % 2;

        const nextPlayer = this.#players[this.#currentPlayerIndex];
        if (nextPlayer.type === 'ai') {
            setTimeout(() => nextPlayer.play(), 200);
        }
    }
}

class HumanPlayer {
    constructor(symbol) {
        this.symbol = symbol;
        this.type = 'human';
    }

    play() {
        // human just waits for UI click
    }
}

class Menace {
    constructor(board, symbol) {
        this.board = board;
        this.symbol = symbol;
        this.type = 'ai';
    }

    play() {
        const state = this.board.getState();
        const empty = state
            .map((v, i) => v === '' ? i : null)
            .filter(i => i !== null);

        if (empty.length === 0) return;

        const choice = empty[Math.floor(Math.random() * empty.length)];
        this.board.move(choice, this.symbol);
    }
}

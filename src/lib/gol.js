class GameOfLife {
    constructor(initialState) {
        this.state = initialState;
        this.height = initialState.length;
        this.width = initialState[0].length;
    }

    _getAliveNeigboursCount(x, y) {
        const neigboursDeltas = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        let count = 0;

        neigboursDeltas.forEach((coords) => {
            let neigbourX = x + coords[0];
            let neigbourY = y + coords[1];

            if (neigbourX < 0) neigbourX = this.width - 1;
            else if (neigbourX === this.width) neigbourX = 0;

            if (neigbourY < 0) neigbourY = this.height - 1;
            else if (neigbourY === this.height) neigbourY = 0;

            const cell = this.state[neigbourY][neigbourX];

            if (cell) count++;
        })

        return count;
    }

    _copy() {
        const newState = [];
        for (let y = 0; y < this.height; y++) {
            newState.push([]);
            for (let x = 0; x < this.width; x++) {
                newState[y][x] = this.state[y][x];
            }
        }

        return newState;
    }

    getState() {
        return this.state;
    }

    evolve() {
        const nextState = this._copy(this.state);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.state[y][x];
                nextState[y][x] = cell;
                const aliveCount = this._getAliveNeigboursCount(x, y);


                if (cell && (aliveCount < 2 || aliveCount > 3)) nextState[y][x] = 0;
                if (!cell && aliveCount === 3) nextState[y][x] = 1;
            }
        }

        this.state = nextState;
    }
}
export default GameOfLife;
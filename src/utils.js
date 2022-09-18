export function generateRandomState(size) {
    return Array.from(Array(size), () => Array.from(Array(size)).map(() => Math.round(Math.random(1))));
}


export function generatePreloadedState(size, preloadedState) {


    const startRow = Math.floor(size / 2) - Math.floor(preloadedState.length / 2);
    const endRow = Math.floor(size / 2) + Math.floor(preloadedState.length / 2);


    const startCol = Math.floor(size / 2) - Math.floor(preloadedState[0].length / 2);
    const endCol = Math.floor(size / 2) + Math.floor(preloadedState[0].length / 2);

    return Array.from(Array(size), (_, i) => {
        return Array.from(Array(size), (_, j) => {
            if((i>=startRow && i<=endRow) && (j>=startCol && j <= endCol)) {
                try {
                    return preloadedState[i-startRow][j-startCol]

                } 
                catch(e) {
                    return 0;
                }
            }

            return 0;
        })
    });
}

export function generateEmptyState(gridSize) {
    return Array.from(Array(gridSize), () => Array.from(Array(gridSize)).map(() => 0));
}

export function isEmptyState(state){
    console.log(state);
    return !state.find((row) => row.some(col => col === 1))
}
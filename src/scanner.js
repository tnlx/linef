/**
 * Find a route to move from i to j.
 * @param {function} movableOf movableOf(i) determines where i can move to
 * @returns {any[]} the route as an array, or null if there is no route
 */
function hasRoute(i, j, movableOf) {
    let reachableIndices = [i];
    let reachableFrom = [i];
    let unresolved = [i];
    let route = [];
    while (!route?.length) {
        resolveNext();
        if (unresolved.length === 0) {
            break;
        }
        if (reachableIndices.includes(j)) {
            route = traceBackRoute();
        }
    }
    return route.length > 0 ? route : null;

    function traceBackRoute() {
        let route = [];
        let curr = reachableIndices.indexOf(j);
        while (curr !== 0) {
            const cameFrom = reachableFrom[curr];
            route.push(reachableFrom[cameFrom]);
            curr = cameFrom;
        }
        return route;
    }

    function resolveNext() {
        let allNu = [];
        for (const u of unresolved) {
            const from = reachableIndices.indexOf(u);
            const neighbors = movableOf(u).filter(n => !reachableIndices.includes(n));
            neighbors.forEach(n => {
                reachableIndices.push(n);
                reachableFrom.push(from);
            })
            allNu = allNu.concat(neighbors);
        }
        unresolved = allNu;
    }
}

export { hasRoute };
export const loadAbort = () => {
    const controller = new AbortController();
    return controller;
}

export default loadAbort
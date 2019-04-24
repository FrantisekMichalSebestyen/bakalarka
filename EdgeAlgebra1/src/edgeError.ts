class EdgeError {
}

export default function checkUndefined<T>(arg?: T): T {
    if (arg === undefined) {
        throw new EdgeError();
    }
    return arg;
}
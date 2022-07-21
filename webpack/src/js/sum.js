export default function sum(...params) {
    return params.reduce((p,v) => p+v, 0)
}
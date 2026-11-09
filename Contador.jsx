import { useState } from "react";

const MIN = 0;
const MAX = 9999;

// Valida el valor escrito manualmente. Devuelve un mensaje de error o null.
function validarEntrada(texto) {
  const valor = texto.trim();
  if (valor === "") return "Escribe un número.";
  if (valor.startsWith("-")) return "No se permiten valores negativos.";
  if (!/^\d+$/.test(valor)) return "Usa solo números enteros, sin decimales ni letras.";
  if (Number(valor) > MAX) return `El valor máximo es ${MAX}.`;
  return null;
}

export default function Contador() {
  const [conteo, setConteo] = useState(0);
  const [confirmando, setConfirmando] = useState(false);
  const [borrador, setBorrador] = useState("");
  const [errorBorrador, setErrorBorrador] = useState(null);

  const enMinimo = conteo <= MIN;
  const enMaximo = conteo >= MAX;

  const aumentar = () => {
    if (enMaximo) return;
    setConteo((c) => c + 1);
    setConfirmando(false);
  };

  const disminuir = () => {
    if (enMinimo) return;
    setConteo((c) => c - 1);
    setConfirmando(false);
  };

  const reiniciar = () => {
    setConteo(0);
    setConfirmando(false);
  };

  const fijarValor = () => {
    const error = validarEntrada(borrador);
    setErrorBorrador(error);
    if (error) return;
    setConteo(Number(borrador.trim()));
    setBorrador("");
    setConfirmando(false);
  };

  let aviso = null;
  if (enMinimo) aviso = "Estás en 0: el conteo no puede ser negativo.";
  if (enMaximo) aviso = `Llegaste al máximo permitido (${MAX}).`;

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <section
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        aria-labelledby="titulo"
      >
        <h1 id="titulo" className="text-lg font-semibold text-slate-800">
          Contador de eventos
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Registra cuántas veces ocurre algo durante tu observación.
        </p>

        {/* Número */}
        <div className="my-8 text-center">
          <output
            aria-live="polite"
            className="block text-8xl font-bold text-indigo-900 tabular-nums"
          >
            {conteo}
          </output>
          <p className="h-5 mt-2 text-sm text-amber-700" role="status">
            {aviso}
          </p>
        </div>

        {/* Botones principales */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={disminuir}
            disabled={enMinimo}
            aria-label="Disminuir en uno"
            className="py-4 text-3xl font-semibold rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-200"
          >
            −
          </button>
          <button
            type="button"
            onClick={aumentar}
            disabled={enMaximo}
            aria-label="Aumentar en uno"
            className="py-4 text-3xl font-semibold rounded-xl bg-indigo-700 text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-700"
          >
            +
          </button>
        </div>

        {/* Reinicio con confirmación */}
        <div className="mt-3">
          {!confirmando ? (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              disabled={conteo === 0}
              className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Reiniciar a 0
            </button>
          ) : (
            <div
              role="alertdialog"
              aria-label="Confirmar reinicio"
              className="rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm text-red-800 mb-3">
                Se perderá el conteo actual ({conteo}). ¿Reiniciar?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={reiniciar}
                  className="py-2 rounded-lg bg-red-700 text-white text-sm font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  Sí, reiniciar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Valor manual */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <label htmlFor="valor" className="block text-sm font-medium text-slate-700">
            Fijar un valor manualmente
          </label>
          <div className="flex gap-2 mt-2">
            <input
              id="valor"
              type="text"
              inputMode="numeric"
              value={borrador}
              onChange={(e) => {
                setBorrador(e.target.value);
                setErrorBorrador(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && fijarValor()}
              placeholder={`Entre ${MIN} y ${MAX}`}
              aria-invalid={errorBorrador ? "true" : "false"}
              aria-describedby="error-valor"
              className={`flex-1 min-w-0 px-3 py-2 rounded-lg border text-slate-800 focus:outline-none focus:ring-4 ${
                errorBorrador
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:ring-indigo-200"
              }`}
            />
            <button
              type="button"
              onClick={fijarValor}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-400"
            >
              Fijar
            </button>
          </div>
          <p id="error-valor" role="alert" className="min-h-5 mt-2 text-sm text-red-700">
            {errorBorrador}
          </p>
        </div>
      </section>
    </main>
  );
}

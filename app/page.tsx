"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

const Home: React.FC = () => {
  const [texto, setTexto] = useState<string>("");
  const [carnets, setCarnets] = useState<{ carnet: string; marcado: boolean }[]>([]);
  const [mostrarQR, setMostrarQR] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>("");

  const descargarQRCode = (carnet: string, index: number): void => {
    const svg = document.querySelectorAll("svg")[index];
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const url = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = url;
          link.download = `codigo_qr_${carnet}.png`;
          link.click();
        }
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  const formatearCarnet = (carnet: string): string => {
    const carnetLimpio = carnet.trim();
    if (carnetLimpio.length >= 2) {
      const base = carnetLimpio.slice(0, -2);
      const sufijo = carnetLimpio.slice(-2);
      return `${base}-${sufijo}`;
    }
    return carnetLimpio;
  };

  const generarQRCode = (): void => {
    const carnetsList = texto
      .split(/[\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0 && /^\d+$/.test(item))
      .map(formatearCarnet)
      .map(carnet => ({ carnet, marcado: false }));
    
    setCarnets(carnetsList);
    setMostrarQR(true);
  };

  const procesarTextoPegado = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const textoPegado = e.clipboardData.getData("text");
    setTexto(textoPegado);
  };

  const descargarTodosQR = () => {
    carnets.forEach((item, index) => {
      setTimeout(() => {
        descargarQRCode(item.carnet, index);
      }, index * 500);
    });
  };

  const toggleMarcado = (index: number) => {
    setCarnets(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, marcado: !item.marcado } : item
      )
    );
  };

  const carnetsFiltrados = carnets.filter(item =>
    item.carnet.replace(/-/g, "").includes(busqueda)
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-xl">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onPaste={procesarTextoPegado}
            placeholder="Pega aquí la lista de carnets"
            className="w-full p-4 border rounded-lg text-lg mb-4 font-mono bg-black text-white"
            rows={10}
          />
          <div className="flex gap-4">
            <button
              onClick={generarQRCode}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Generar QR
            </button>
            {mostrarQR && carnets.length > 0 && (
              <button
                onClick={descargarTodosQR}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Descargar Todos
              </button>
            )}
          </div>
        </div>
      </div>

      {mostrarQR && (
        <div className="w-full max-w-xl mb-8">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por 4 dígitos"
            className="w-full p-4 border rounded-lg text-lg font-mono bg-black text-white"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {mostrarQR && carnetsFiltrados.map((item, index) => (
          <div
        key={index}
        className={`flex flex-col items-center p-4 border rounded-lg ${
          item.marcado ? "bg-red-500" : "bg-black"
        }`}
          >
            <p className="text-white mb-2 font-mono text-2xl">{item.carnet}</p>
            <QRCode
              value={item.carnet}
              size={100}
              level="H"
              style={{ backgroundColor: "white", padding: "10px" }}
            />
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={item.marcado}
                onChange={() => toggleMarcado(index)}
                className="mr-2"
              />
              <span className="text-white">Marcar</span>
            </div>
            <button
              onClick={() => descargarQRCode(item.carnet, index)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Descargar QR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

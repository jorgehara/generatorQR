"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

const Home: React.FC = () => {
  const [texto, setTexto] = useState<string>("");
  const [mostrarQR, setMostrarQR] = useState<boolean>(false);

  // Función para descargar el código QR como imagen
  const descargarQRCode = (): void => {
    const svg = document.querySelector("svg");
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
          link.download = "codigo_qr.png";
          link.click();
        }
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  // Función para generar el código QR
  const generarQRCode = (): void => {
    setMostrarQR(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "150px" }}>
      <input
        type="text"
        value={texto}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, ""); // Solo permite números
          if (value.length > 12) {
            value = value.slice(0, 12) + "-" + value.slice(12, 14);
          }
          setTexto(value);
        }}
        placeholder="Ingresa el texto o enlace"
        style={{
          padding: "10px",
          width: "450px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          color: "#333",
          fontSize: "32px",
        }}
      />
      <button
        onClick={generarQRCode}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Generar QR
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {mostrarQR && texto && (
          <QRCode
            value={texto}
            size={250}
            level="H"
            style={{ backgroundColor: "white", padding: "10px" }}
          />
        )}
      </div>
      {mostrarQR && texto && (
        <button
          onClick={descargarQRCode}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Descargar QR
        </button>
      )}
    </div>
  );
};

export default Home;

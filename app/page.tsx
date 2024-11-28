"use client"
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Home: React.FC = () => {
  const [texto, setTexto] = useState<string>("");
  const [mostrarQR, setMostrarQR] = useState<boolean>(false);

  // Función para descargar el código QR como imagen
  const descargarQRCode = (): void => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "codigo_qr.png";
      link.click();
    }
  };

  // Función para generar el código QR
  const generarQRCode = (): void => {
    setMostrarQR(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "150px" }}>
      {/* <h1>Generador de Códigos QR</h1> */}
      <input
        type="text"
        value={texto}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
          if (value.length > 12) {
        value = value.slice(0, 12) + '-' + value.slice(12, 14);
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
          <QRCodeCanvas
        value={texto}
        size={250}
        level="H"
        includeMargin={true}
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

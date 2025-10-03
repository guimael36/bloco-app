import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

function ConfiguracoesModal({ onFechar, onSalvar, temposAtuais }) {
  const [temposEmMinutos, setTemposEmMinutos] = useState({
    foco: temposAtuais.foco / 60,
    descansoCurto: temposAtuais.descansoCurto / 60,
    descansoLongo: temposAtuais.descansoLongo / 60,
  });

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setTemposEmMinutos((prevState) => ({
      ...prevState,
      [key]: value === "" ? "" : Number(value),
    }));
  };

  const handleBlur = (e, key, min, max) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    setTemposEmMinutos((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSalvar = () => {
    const temposEmSegundos = {
      foco: Number(temposEmMinutos.foco) * 60,
      descansoCurto: Number(temposEmMinutos.descansoCurto) * 60,
      descansoLongo: Number(temposEmMinutos.descansoLongo) * 60,
    };
    onSalvar(temposEmSegundos);
    onFechar();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl relative w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="space-y-4">
          <div>
            <label htmlFor="foco" className="block mb-1 font-semibold text-gray-700">
              Pomodoro (minutos)
            </label>
            <input
              id="foco"
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={temposEmMinutos.foco}
              onChange={(e) => handleInputChange(e, "foco")}
              onBlur={(e) => handleBlur(e, "foco", 1, 120)}
              min="1"
              max="120"
            />
          </div>
          <div>
            <label htmlFor="descansoCurto" className="block mb-1 font-semibold text-gray-700">
              Descanso Curto (minutos)
            </label>
            <input
              id="descansoCurto"
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={temposEmMinutos.descansoCurto}
              onChange={(e) => handleInputChange(e, "descansoCurto")}
              onBlur={(e) => handleBlur(e, "descansoCurto", 1, 100)}
              min="1"
              max="100"
            />
          </div>
          <div>
            <label htmlFor="descansoLongo" className="block mb-1 font-semibold text-gray-700">
              Descanso Longo (minutos)
            </label>
            <input
              id="descansoLongo"
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={temposEmMinutos.descansoLongo}
              onChange={(e) => handleInputChange(e, "descansoLongo")}
              onBlur={(e) => handleBlur(e, "descansoLongo", 1, 100)}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSalvar}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default ConfiguracoesModal;
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

function ConfiguracoesModal({ onFechar, onSalvar, temposAtuais }) {
  const [temposEditaveis, setTemposEditaveis] = useState(temposAtuais);

  const handleSalvar = () => {
    onSalvar(temposEditaveis);
    onFechar();
  }

  const modalContent = (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl relative w-full max-w-md">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="foco"
              className="block mb-1 font-semibold text-gray-700"
            >
              Foco (minutos)
            </label>
            <input
              id="foco"
              type="number"
              min="1"
              max="120"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={temposEditaveis.foco / 60}
              onChange={(e) => {
                const valorEmMinutos = e.target.value;
                let valorCorrigido = valorEmMinutos;

                if (valorEmMinutos > 120){
                  valorCorrigido = 120;
                } else if (valorEmMinutos < 1){
                  valorCorrigido = 1;
                }

                setTemposEditaveis((prevState) => ({
                  ...prevState,
                  foco: valorCorrigido * 60,
                }));
              }}
            />
          </div>

          <div>
            <label
              htmlFor="descansoCurto"
              className="block mb-1 font-semibold text-gray-700"
            >
              Descanso Curto (minutos)
            </label>
            <input
              id="descansoCurto"
              type="number"
              min="1"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={temposEditaveis.descansoCurto / 60}
              onChange={(e) => {
                const valorEmMinutos = e.target.value;
                let valorCorrigido = valorEmMinutos;

                if (valorEmMinutos > 100){
                  valorCorrigido = 100;
                } else if (valorEmMinutos < 1){
                  valorCorrigido = 1;
                }

                setTemposEditaveis((prevState) => ({
                  ...prevState,
                  descansoCurto: valorCorrigido * 60,
                }));
              }}
            />
          </div>

          <div>
            <label
              htmlFor="descansoLongo"
              className="block mb-1 font-semibold text-gray-700"
            >
              Descanso Longo (minutos)
            </label>
            <input
              id="descansoLongo"
              type="number"
              min="1"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={temposEditaveis.descansoLongo / 60}
              onChange={(e) => {
                const valorEmMinutos = e.target.value;
                let valorCorrigido = valorEmMinutos;

                if (valorEmMinutos > 100){
                  valorCorrigido = 100;
                } else if (valorEmMinutos < 1){
                  valorCorrigido = 1;
                }

                setTemposEditaveis((prevState) => ({
                  ...prevState,
                  descansoLongo: valorCorrigido * 60,
                }));
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSalvar}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-400 transition-colors font-semibold"
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

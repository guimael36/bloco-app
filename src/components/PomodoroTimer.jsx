import { FaPlay, FaPause, FaSyncAlt, FaCog } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import ConfiguracoesModal from "./ConfiguracoesModal";

const synth = new Tone.Synth().toDestination();

function PomodoroTimer() {
  const [configTempos, setConfigTempos] = useState(() => {
    const configUsuario = localStorage.getItem("blocoConfigTempos");
    if (configUsuario !== null) {
      return JSON.parse(configUsuario);
    }
    return {
      foco: 25 * 60,
      descansoCurto: 5 * 60,
      descansoLongo: 15 * 60,
    };
  });

  const [tempoRestante, setTempoRestante] = useState(configTempos.foco);
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [pausas, setPausas] = useState(0);
  const [pausasLongas, setPausasLongas] = useState(0);
  const [pomodorosConcluidos, setPomodorosConcluidos] = useState(0);
  const [modo, setModo] = useState("foco");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    resetarTimer();
  }, [configTempos]);

  useEffect(() => {
    let timerId;
    if (estaAtivo && tempoRestante > 0) {
      timerId = setInterval(() => {
        setTempoRestante((tempoAnterior) => tempoAnterior - 1);
      }, 1000);
    } else if (tempoRestante === 0 && estaAtivo) {
      setEstaAtivo(false);
      tocarAlerta();
      if (modo === "foco") {
        const proximoPomodoro = pomodorosConcluidos + 1;
        setPomodorosConcluidos(proximoPomodoro);
        if (proximoPomodoro % 4 === 0) {
          setModo("descansoLongo");
          setTempoRestante(configTempos.descansoLongo);
        } else {
          setModo("descansoCurto");
          setTempoRestante(configTempos.descansoCurto);
        }
      } else {
        if (modo === "descansoCurto") {
          setPausas((pausasAnteriores) => pausasAnteriores + 1);
        } else {
          setPausasLongas(
            (pausasLongasAnteriores) => pausasLongasAnteriores + 1
          );
        }
        setModo("foco");
        setTempoRestante(configTempos.foco);
      }
    }
    return () => clearInterval(timerId);
  }, [estaAtivo, tempoRestante, modo, pomodorosConcluidos, configTempos]);

  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;

  const iniciarPausarTimer = () => {
    if (tempoRestante === 0) {
      setTempoRestante(configTempos.foco);
      setEstaAtivo(true);
    } else {
      setEstaAtivo(!estaAtivo);
    }
  };

  const resetarTimer = () => {
    setTempoRestante(configTempos.foco);
    setEstaAtivo(false);
    setPomodoros(0);
    setPausas(0);
    setPausasLongas(0);
    setPomodorosConcluidos(0);
    setModo("foco");
  };

  const salvarConfiguracoes = (novosTempos) => {
    setConfigTempos(novosTempos);
    localStorage.setItem("blocoConfigTempos", JSON.stringify(novosTempos));
  };

const tocarAlerta = () => {
  const agora = Tone.now();
  synth.triggerAttackRelease("C5", "16n", agora);
  synth.triggerAttackRelease("E5", "16n", agora + 0.15);
  synth.triggerAttackRelease("G5", "16n", agora + 0.3);
};

  let textoModo = "FOCO";
  if (modo === "descansoCurto") textoModo = "DESCANSO CURTO";
  if (modo === "descansoLongo") textoModo = "DESCANSO LONGO";

  return (
    <div className="flex flex-col items-center p-4 lg:p-8">
      <div className="flex justify-around text-center mb-8 w-full max-w-xs sm:max-w-sm">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 h-10 flex items-center justify-center">
            POMODOROS
          </h2>
          <p className="text-2xl font-semibold text-gray-700 mt-1">
            {pomodorosConcluidos}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 h-10 flex items-center justify-center">
            DESCANSOS
          </h2>
          <p className="text-2xl font-semibold text-gray-700 mt-1">{pausas}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 h-10 flex items-center justify-center">
            <span className="md:hidden">
              LONGOS
              <br />
              DESCANSOS
            </span>
            <span className="hidden md:inline">LONGOS DESCANSOS</span>
          </h2>
          <p className="text-2xl font-semibold text-gray-700 mt-1">
            {pausasLongas}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-full w-60 h-60 lg:w-64 lg:h-64 flex flex-col justify-center items-center mx-auto shadow-lg">
        <p className="text-5xl lg:text-6xl font-light text-gray-800">
          {minutos}:{("0" + segundos).slice(-2)}
        </p>
        <p className="text-md font-medium text-gray-500 mt-1">{textoModo}</p>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={resetarTimer}
          className="bg-gray-400 hover:bg-gray-600 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        >
          <FaSyncAlt />
        </button>
        <button
          onClick={iniciarPausarTimer}
          className={`${
            estaAtivo
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200`}
        >
          {estaAtivo ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-gray-400 hover:bg-gray-600 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        >
          <FaCog />
        </button>

        {modalAberto && (
          <ConfiguracoesModal
            onFechar={() => setModalAberto(false)}
            onSalvar={salvarConfiguracoes}
            temposAtuais={configTempos}
          />
        )}
      </div>
    </div>
  );
}

export default PomodoroTimer;

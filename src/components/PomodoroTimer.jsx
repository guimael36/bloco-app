import { FaPlay, FaPause, FaSyncAlt, FaCog } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import ConfiguracoesModal from "./ConfiguracoesModal";
import TimerWorker from '../workers/timerWorker.js?worker';

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

  const [contadores, setContadores] = useState(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const dadosSalvos = localStorage.getItem('blocoContadores');

    if (dadosSalvos) {
      const { date, pomodorosConcluidos, pausas, pausasLongas } = JSON.parse(dadosSalvos);
      if (date === hoje) {
        return { pomodorosConcluidos, pausas, pausasLongas };
      }
    }
    return { pomodorosConcluidos: 0, pausas: 0, pausasLongas: 0 };
  });

  const [tempoRestante, setTempoRestante] = useState(configTempos.foco);
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [modo, setModo] = useState("foco");
  const [modalAberto, setModalAberto] = useState(false);
  const [audioIniciado, setAudioIniciado] = useState(false);

  const workerRef = useRef(null);

  useEffect(() => {
    const worker = new TimerWorker();
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.command === 'tick') {
        setTempoRestante(prev => prev - 1);
      }
    };
    
    return () => worker.terminate();
  }, []);

  useEffect(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const dadosParaSalvar = {
      date: hoje,
      ...contadores
    };
    localStorage.setItem('blocoContadores', JSON.stringify(dadosParaSalvar));
  }, [contadores]);

  useEffect(() => {
    if (tempoRestante <= 0 && estaAtivo) {
      handleCicloFinalizado();
    }
  }, [tempoRestante, estaAtivo]);
  
  const handleCicloFinalizado = () => {
    setEstaAtivo(false);
    workerRef.current.postMessage({ command: 'stop' });
    tocarAlerta();
    if (modo === "foco") {
      const proximoPomodoro = contadores.pomodorosConcluidos + 1;
      setContadores(prev => ({...prev, pomodorosConcluidos: proximoPomodoro}));
      if (proximoPomodoro % 4 === 0) {
        setModo("descansoLongo");
        setTempoRestante(configTempos.descansoLongo);
      } else {
        setModo("descansoCurto");
        setTempoRestante(configTempos.descansoCurto);
      }
    } else {
      if (modo === "descansoCurto") {
        setContadores(prev => ({ ...prev, pausas: prev.pausas + 1 }));
      } else {
        setContadores(prev => ({ ...prev, pausasLongas: prev.pausasLongas + 1 }));
      }
      setModo("foco");
      setTempoRestante(configTempos.foco);
    }
  };

  useEffect(() => {
    resetarTimer(false);
  }, [configTempos]);

  const minutos = Math.max(0, Math.floor(tempoRestante / 60));
  const segundos = Math.max(0, Math.floor(tempoRestante % 60));

  const iniciarPausarTimer = async () => {
    if (!audioIniciado) {
      await Tone.start();
      setAudioIniciado(true);
    }
    if (estaAtivo) {
      workerRef.current.postMessage({ command: 'stop' });
      setEstaAtivo(false);
    } else {
      let tempoInicial = tempoRestante;
      if (tempoInicial <= 0) {
        tempoInicial = configTempos.foco;
        setTempoRestante(tempoInicial);
        setModo("foco");
      }
      workerRef.current.postMessage({ command: 'start' });
      setEstaAtivo(true);
    }
  };

  const resetarTimer = (resetarContadores = true) => {
    workerRef.current?.postMessage({ command: 'stop' });
    setTempoRestante(configTempos.foco);
    setEstaAtivo(false);
    setModo("foco");
    document.title = "Bloco";
    if (resetarContadores) {
      setContadores({ pomodorosConcluidos: 0, pausas: 0, pausasLongas: 0 });
    }
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
  
  let textoModo = "Pomodoro";
  if (modo === "descansoCurto") textoModo = "Descanso";
  if (modo === "descansoLongo") textoModo = "Descanso Longo";
  
  useEffect(() => {
    if (estaAtivo) {
      document.title = `${minutos}:${("0" + segundos).slice(-2)} - ${textoModo}`;
    } else {
      document.title = "Bloco";
    }
    return () => {
      document.title = "Bloco";
    };
  }, [estaAtivo, minutos, segundos, textoModo]);

  return (
    <div className="flex flex-col items-center p-4 lg:p-8">
      <div className="flex justify-around text-center mb-8 w-full max-w-xs sm:max-w-sm">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 h-10 flex items-center justify-center">
            POMODOROS
          </h2>
          <p className="text-2xl font-semibold text-gray-700 mt-1">
            {contadores.pomodorosConcluidos}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 h-10 flex items-center justify-center">
            DESCANSOS
          </h2>
          <p className="text-2xl font-semibold text-gray-700 mt-1">{contadores.pausas}</p>
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
            {contadores.pausasLongas}
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
          onClick={() => resetarTimer(true)}
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


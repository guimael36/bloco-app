import React, { useEffect, useState } from "react";
import { FaPlus, FaCheck, FaTimes, FaPencilAlt, FaTrash } from "react-icons/fa";

function ToDoList() {
  const [inputVisivel, setInputVisivel] = useState(false);
  const mostrarInput = () => setInputVisivel(true);
  const esconderInput = () => setInputVisivel(false);
  const inputChanged = (e) => setNovaTarefa(e.target.value);

  const [tarefas, setTarefas] = useState(() => {
    const tarefasUsuario = localStorage.getItem("blocoTarefas");
    if (tarefasUsuario !== null) {
      return JSON.parse(tarefasUsuario);
    } else {
      return [];
    }
  });
  const [novaTarefa, setNovaTarefa] = useState("");
  const [idTarefaEditando, setIdTarefaEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");

  useEffect(() => {
    localStorage.setItem("blocoTarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (novaTarefa.trim() !== "") {
      const novaTarefaObj = {
        id: Date.now(),
        texto: novaTarefa,
        concluida: false,
      };
      setTarefas([...tarefas, novaTarefaObj]);
      setNovaTarefa("");
      esconderInput();
    }
  };

  const handleAdicionarKeyDown = (event) => {
    if (event.key === "Enter") {
      adicionarTarefa();
    }
  };

  const deletarTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  const marcarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const iniciarEdicao = (id) => {
    const tarefaParaEditar = tarefas.find((tarefa) => tarefa.id === id);
    if (tarefaParaEditar) {
      setIdTarefaEditando(id);
      setTextoEditando(tarefaParaEditar.texto);
    }
  };

  const cancelarEdicao = () => {
    setIdTarefaEditando(null);
  };

  const mudarTextoTarefa = (e) => {
    setTextoEditando(e.target.value);
  };

  const confirmarEdicao = (id, novoTexto) => {
    if (novoTexto.trim() === "") {
      cancelarEdicao(id);
    } else {
      setTarefas(
        tarefas.map((tarefa) => {
          if (tarefa.id === id) {
            return { ...tarefa, texto: novoTexto };
          }
          return tarefa;
        })
      );
    }
    setIdTarefaEditando(null);
  };

  const handleEditarKeyDown = (event, id, texto) => {
    if (event.key === "Enter") {
      confirmarEdicao(id, texto);
    }
  };

  return (
    <div className="w-full p-8 h-full flex flex-col min-h-0">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button
          className="bg-red-500 text-white hover:bg-white hover:text-red-700 rounded-lg w-8 h-8 flex items-center justify-center shadow-lg"
          onClick={mostrarInput}
        >
          <FaPlus />
        </button>
      </header>

      {inputVisivel && (
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 p-2 pr-16 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Nova tarefa"
            value={novaTarefa}
            onChange={inputChanged}
            onKeyDown={handleAdicionarKeyDown}
            autoFocus
          />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex space-x-2">
            <button
              onClick={adicionarTarefa}
              className="text-green-400 hover:text-green-700"
            >
              <FaCheck size={20} />
            </button>
            <button
              onClick={esconderInput}
              className="text-gray-400 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {tarefas.map((tarefa) => (
          <div
            key={tarefa.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            {tarefa.id === idTarefaEditando ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={textoEditando}
                  onChange={mudarTextoTarefa}
                  onKeyDown={(e) =>
                    handleEditarKeyDown(e, tarefa.id, textoEditando)
                  }
                  autoFocus
                />
                <button
                  onClick={() => confirmarEdicao(tarefa.id, textoEditando)}
                  className="text-green-400 hover:text-green-700 ml-2"
                >
                  <FaCheck size={20} />
                </button>
                <button
                  onClick={cancelarEdicao}
                  className="text-gray-400 hover:text-red-700 ml-2"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-green-500 rounded-full"
                    checked={tarefa.concluida}
                    onChange={() => marcarConcluida(tarefa.id)}
                  />
                  <span
                    className={`text-gray-700 ml-2 ${
                      tarefa.concluida ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {tarefa.texto}
                  </span>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    onClick={() => iniciarEdicao(tarefa.id)}
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => deletarTarefa(tarefa.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToDoList;

import { FaGithub } from "react-icons/fa";
import PomodoroTimer from "./components/PomodoroTimer";
import ToDoList from "./components/TodoList";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col overflow-x-hidden">
      <header className="w-full flex justify-center p-1 shrink-0">
        <img src={logo} alt="Logo Bloco" className="h-20" />
      </header>

      <main className="w-full flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-center justify-center gap-12">
          <div className="w-full lg:w-7/12">
            <PomodoroTimer />
          </div>
          <div className="w-full lg:w-5/12">
            <div className="bg-white rounded-2xl shadow-xl h-[28rem] box-border overflow-y-auto">
              <ToDoList />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center shrink-0">
        <a
          href="https://github.com/guimael36"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perfil no GitHub"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaGithub size={28} className="inline-block" />
        </a>
      </footer>
    </div>
  );
}

export default App;
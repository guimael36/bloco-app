let timerId = null;

self.onmessage = function (e) {
  const { command, time } = e.data;

  if (command === 'start') {
    if (timerId) {
      clearInterval(timerId);
    }

    timerId = setInterval(() => {
      self.postMessage({ command: 'tick' });
    }, 1000);
  } else if (command === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
import { useState } from 'react';
import { TraycerApp } from './components/TraycerApp';
import { LandingPage } from './components/LandingPage';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  return (
    <>
      {!hasEntered ? (
        <LandingPage onEnter={() => setHasEntered(true)} />
      ) : (
        <TraycerApp />
      )}
    </>
  );
}

export default App;

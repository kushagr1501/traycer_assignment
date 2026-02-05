import { useState, useEffect } from 'react';
import { TraycerApp } from './components/TraycerApp';
import { LandingPage } from './components/LandingPage';

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  // Optional: Check session storage to skip intro on reload if desired, 
  // but for "high class" feel, maybe we always show it or keep it in session.
  // For now, let's reset on reload to accept the user's request "from that will come to this".

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

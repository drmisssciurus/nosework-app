import appLogo from './assets/Image.png';

function App() {
  return (
    <>
      <div>
        <h1>NoseWorks</h1>
        <h2>
          Analyze your dog&apos;s training sessions efficiently and track
          improvement.
        </h2>
        <img src={appLogo} />
      </div>
      <button onClick={() => alert("I'm working")}>התחל</button>
      <p>להתחבר</p>
    </>
  );
}

export default App;

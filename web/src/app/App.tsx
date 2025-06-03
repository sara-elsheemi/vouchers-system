import { LocalizationProvider } from '../application/i18n/LocalizationProvider';
import { FontDemoPage } from '../presentation/pages/FontDemoPage';

function App() {
  return (
    <LocalizationProvider>
      <div className="App">
        <FontDemoPage />
      </div>
    </LocalizationProvider>
  );
}

export default App;
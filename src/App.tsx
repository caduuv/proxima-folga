import React from 'react';
import Header from './components/Header';
import JobTypeSelector from './components/JobTypeSelector';
import DateInput from './components/DateInput';
import ResultCard from './components/ResultCard';
import FutureChecker from './components/FutureChecker';
import CalendarView from './components/CalendarView';
import LoginScreen from './components/LoginScreen';
import { SCHEDULE_CONFIGS, getConfigById } from './config/scheduleConfigs';
import { getUpcomingDaysOff } from './utils/scheduleCalculator';
import { parseInputDate, toInputValue } from './utils/dateUtils';

type Tab = 'resultado' | 'calendario';

const SESSION_KEY = 'proxima-folga-auth';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = React.useState(true);
  //    () => sessionStorage.getItem(SESSION_KEY) === 'true'


  const [jobTypeId, setJobTypeId] = React.useState<string>(SCHEDULE_CONFIGS[0].id);
  const [lastDayOffValue, setLastDayOffValue] = React.useState<string>(
    toInputValue(new Date())
  );
  const [activeTab, setActiveTab] = React.useState<Tab>('resultado');

  const config = getConfigById(jobTypeId) ?? SCHEDULE_CONFIGS[0];
  const lastDayOff = parseInputDate(lastDayOffValue) ?? new Date();

  const upcomingEntries = React.useMemo(
    () => getUpcomingDaysOff(lastDayOff, config, 20),
    [lastDayOff, config]
  );

  const isReady = !!parseInputDate(lastDayOffValue);

  const handleLogin = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <LoginScreen onSuccess={handleLogin} />;
  }

  return (
    <div className="app-root">
      <Header />

      <main className="app-main">
        {/* ── Inputs ──────────────────────────────── */}
        <section className="card inputs-card">
          <div className="inputs-grid">
            <JobTypeSelector value={jobTypeId} onChange={setJobTypeId} />
            <DateInput
              id="last-day-off"
              label="Última folga"
              value={lastDayOffValue}
              onChange={setLastDayOffValue}
              helpText="Informe o último dia em que você folga"
            />
          </div>
        </section>

        {isReady && (
          <>
            {/* ── Tabs ──────────────────────────────── */}
            <div className="tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'resultado'}
                className={`tab-btn ${activeTab === 'resultado' ? 'active' : ''}`}
                onClick={() => setActiveTab('resultado')}
              >
                Resultado
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'calendario'}
                className={`tab-btn ${activeTab === 'calendario' ? 'active' : ''}`}
                onClick={() => setActiveTab('calendario')}
              >
                Calendário
              </button>
            </div>

            {/* ── Result Tab ────────────────────────── */}
            {activeTab === 'resultado' && (
              <div className="tab-content">
                <ResultCard entries={upcomingEntries} />
                <FutureChecker lastDayOff={lastDayOff} config={config} />
              </div>
            )}

            {/* ── Calendar Tab ──────────────────────── */}
            {activeTab === 'calendario' && (
              <div className="tab-content">
                <CalendarView lastDayOff={lastDayOff} config={config} />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <span>Calculadora de Escala</span>
      </footer>
    </div>
  );
};

export default App;

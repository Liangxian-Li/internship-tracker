import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const STATUSES = ['Applied', 'Interview', 'Rejected', 'Offer'];
const emptyApplication = {
  company: '',
  role: '',
  location: '',
  status: 'Applied',
  dateApplied: new Date().toISOString().slice(0, 10),
  notes: ''
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('internshipTrackerUser'));
  } catch {
    return null;
  }
}

async function readApiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('internshipTrackerToken') || '');
  const [user, setUser] = useState(() => getStoredUser());
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [applications, setApplications] = useState([]);
  const [applicationForm, setApplicationForm] = useState(emptyApplication);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardNotice, setDashboardNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  const isLoggedIn = Boolean(token);

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'All') {
      return applications;
    }

    return applications.filter((application) => application.status === statusFilter);
  }, [applications, statusFilter]);

  const stats = useMemo(() => {
    return STATUSES.map((status) => ({
      status,
      count: applications.filter((application) => application.status === status).length
    }));
  }, [applications]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchApplications();
    }
  }, [isLoggedIn]);

  async function apiRequest(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      handleLogout();
      throw new Error('Your session expired. Please log in again.');
    }

    return readApiResponse(response);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const payload =
      authMode === 'register'
        ? authForm
        : { email: authForm.email, password: authForm.password };

    try {
      const data = await apiRequest(`/api/auth/${authMode}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      localStorage.setItem('internshipTrackerToken', data.token);
      localStorage.setItem('internshipTrackerUser', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchApplications() {
    setDashboardError('');
    setIsLoadingApplications(true);

    try {
      const data = await apiRequest('/api/applications');
      setApplications(data);
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setIsLoadingApplications(false);
    }
  }

  async function handleCreateApplication(event) {
    event.preventDefault();
    setDashboardError('');
    setDashboardNotice('');
    setIsSaving(true);

    try {
      const createdApplication = await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify(applicationForm)
      });

      setApplications((currentApplications) => [createdApplication, ...currentApplications]);
      setApplicationForm(emptyApplication);
      setDashboardNotice('Application added.');
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(application, status) {
    setDashboardError('');
    setDashboardNotice('');

    try {
      const updatedApplication = await apiRequest(`/api/applications/${application._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      setApplications((currentApplications) =>
        currentApplications.map((item) =>
          item._id === updatedApplication._id ? updatedApplication : item
        )
      );
      setDashboardNotice(`${updatedApplication.company} moved to ${updatedApplication.status}.`);
    } catch (error) {
      setDashboardError(error.message);
    }
  }

  async function handleDeleteApplication(application) {
    const confirmed = window.confirm(`Delete ${application.company} - ${application.role}?`);

    if (!confirmed) {
      return;
    }

    setDashboardError('');
    setDashboardNotice('');

    try {
      await apiRequest(`/api/applications/${application._id}`, {
        method: 'DELETE'
      });

      setApplications((currentApplications) =>
        currentApplications.filter((item) => item._id !== application._id)
      );
      setDashboardNotice('Application deleted.');
    } catch (error) {
      setDashboardError(error.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('internshipTrackerToken');
    localStorage.removeItem('internshipTrackerUser');
    setToken('');
    setUser(null);
    setApplications([]);
    setAuthMode('login');
    setDashboardError('');
    setDashboardNotice('');
  }

  if (!isLoggedIn) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div>
            <p className="eyebrow">Internship Tracker</p>
            <h1>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="lede">
              Track companies, roles, statuses, and notes in one simple demo dashboard.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === 'register' && (
              <label>
                Name
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, name: event.target.value })
                  }
                  placeholder="Ada Lovelace"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm({ ...authForm, email: event.target.value })
                }
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm({ ...authForm, password: event.target.value })
                }
                placeholder="Enter your password"
                required
              />
            </label>

            {authError && <p className="message error">{authError}</p>}

            <button className="primary-button" type="submit" disabled={authLoading}>
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Log in' : 'Register'}
            </button>
          </form>

          <button
            className="link-button"
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setAuthError('');
            }}
          >
            {authMode === 'login'
              ? 'Need an account? Register'
              : 'Already have an account? Log in'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Internship Tracker</p>
          <h1>Application Dashboard</h1>
          <p className="lede">
            {user?.name ? `Signed in as ${user.name}` : 'Manage your internship search'}
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="stats-grid" aria-label="Application status summary">
        {stats.map((item) => (
          <article className="stat-card" key={item.status}>
            <span>{item.status}</span>
            <strong>{item.count}</strong>
          </article>
        ))}
      </section>

      <div className="dashboard-layout">
        <section className="panel">
          <div className="panel-heading">
            <h2>Add Application</h2>
          </div>

          <form className="application-form" onSubmit={handleCreateApplication}>
            <label>
              Company
              <input
                value={applicationForm.company}
                onChange={(event) =>
                  setApplicationForm({ ...applicationForm, company: event.target.value })
                }
                placeholder="Google"
                required
              />
            </label>

            <label>
              Role
              <input
                value={applicationForm.role}
                onChange={(event) =>
                  setApplicationForm({ ...applicationForm, role: event.target.value })
                }
                placeholder="Software Engineer Intern"
                required
              />
            </label>

            <label>
              Location
              <input
                value={applicationForm.location}
                onChange={(event) =>
                  setApplicationForm({ ...applicationForm, location: event.target.value })
                }
                placeholder="New York, NY"
              />
            </label>

            <div className="form-row">
              <label>
                Status
                <select
                  value={applicationForm.status}
                  onChange={(event) =>
                    setApplicationForm({ ...applicationForm, status: event.target.value })
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date Applied
                <input
                  type="date"
                  value={applicationForm.dateApplied}
                  onChange={(event) =>
                    setApplicationForm({ ...applicationForm, dateApplied: event.target.value })
                  }
                  required
                />
              </label>
            </div>

            <label>
              Notes
              <textarea
                value={applicationForm.notes}
                onChange={(event) =>
                  setApplicationForm({ ...applicationForm, notes: event.target.value })
                }
                placeholder="Referral, recruiter name, next steps..."
                rows="4"
              />
            </label>

            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add Application'}
            </button>
          </form>
        </section>

        <section className="panel application-list-panel">
          <div className="panel-heading list-heading">
            <div>
              <h2>Applications</h2>
              <p>{applications.length} total records</p>
            </div>

            <label className="compact-label">
              Filter
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {dashboardError && <p className="message error">{dashboardError}</p>}
          {dashboardNotice && <p className="message success">{dashboardNotice}</p>}

          {isLoadingApplications ? (
            <p className="empty-state">Loading applications...</p>
          ) : filteredApplications.length === 0 ? (
            <p className="empty-state">
              {applications.length === 0
                ? 'Add your first application to start the demo.'
                : 'No applications match this filter.'}
            </p>
          ) : (
            <div className="application-list">
              {filteredApplications.map((application) => (
                <article className="application-card" key={application._id}>
                  <div className="application-main">
                    <div>
                      <h3>{application.company}</h3>
                      <p>{application.role}</p>
                    </div>
                    <span className={`status-pill status-${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                  </div>

                  <dl className="application-details">
                    <div>
                      <dt>Location</dt>
                      <dd>{application.location || 'Not listed'}</dd>
                    </div>
                    <div>
                      <dt>Date Applied</dt>
                      <dd>{formatDate(application.dateApplied)}</dd>
                    </div>
                  </dl>

                  {application.notes && <p className="notes">{application.notes}</p>}

                  <div className="card-actions">
                    <label>
                      Update status
                      <select
                        value={application.status}
                        onChange={(event) =>
                          handleStatusChange(application, event.target.value)
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDeleteApplication(application)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function formatDate(value) {
  if (!value) {
    return 'Not listed';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export default App;

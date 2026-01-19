import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../user/userSlice';
import { fetchFlaggedReportsCount } from '../report/flaggedReportsSlice';
import logo from '../logo/streetlens-logo.png';


const NavBar = () => {
  const { user, token } = useSelector((state) => state.user);
  const { count: flaggedCount } = useSelector((state) => state.flaggedReports || { count: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [navCollapsed, setNavCollapsed] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin' && token) {
      dispatch(fetchFlaggedReportsCount(token));
    }
  }, [user, token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

    return (
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #2c3e50 0%, #3498db 100%)',
          boxShadow: '0 2px 8px rgba(44, 62, 80, 0.08)'
        }}
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="StreetLens Logo" style={{ height: 36, marginRight: 8, borderRadius: 6, background: '#fff', boxShadow: '0 1px 4px rgba(44,62,80,0.10)', padding: 2 }} />
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: 2 }}>StreetLens</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-controls="navbarNav"
            aria-expanded={!navCollapsed}
            onClick={() => setNavCollapsed(!navCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${navCollapsed ? '' : ' show'}`} id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex align-items-center" style={{ gap: '0.5rem' }}>
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? 'nav-link active streetlens-active' : 'nav-link'
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: '#fff',
                          background: '#21618c',
                          fontWeight: 'bold',
                          borderRadius: 4,
                          boxShadow: '0 1px 4px rgba(44,62,80,0.10)'
                        }
                      : { color: '#fff', fontWeight: 400 }
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/add-report"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active streetlens-active' : 'nav-link'
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: '#fff',
                          background: '#21618c',
                          fontWeight: 'bold',
                          borderRadius: 4,
                          boxShadow: '0 1px 4px rgba(44,62,80,0.10)'
                        }
                      : { color: '#fff', fontWeight: 400 }
                  }
                >
                  Add Report
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/area-overview"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active streetlens-active' : 'nav-link'
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: '#fff',
                          background: '#21618c',
                          fontWeight: 'bold',
                          borderRadius: 4,
                          boxShadow: '0 1px 4px rgba(44,62,80,0.10)'
                        }
                      : { color: '#fff', fontWeight: 400 }
                  }
                >
                  Area Overview
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active streetlens-active' : 'nav-link'
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: '#fff',
                          background: '#21618c',
                          fontWeight: 'bold',
                          borderRadius: 4,
                          boxShadow: '0 1px 4px rgba(44,62,80,0.10)'
                        }
                      : { color: '#fff', fontWeight: 400 }
                  }
                >
                  About
                </NavLink>
              </li>
              {user && user.role === 'admin' && (
                <li className="nav-item position-relative d-flex align-items-center" style={{ minWidth: 60, marginRight: '0.2rem' }}>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active streetlens-active' : 'nav-link'
                    }
                    style={({ isActive }) =>
                      isActive
                        ? {
                            color: '#fff',
                            background: '#21618c',
                            fontWeight: 'bold',
                            borderRadius: 4,
                            boxShadow: '0 1px 4px rgba(44,62,80,0.10)'
                          }
                        : { color: '#fff', fontWeight: 400 }
                    }
                  >
                    Admin
                    {flaggedCount > 0 && (
                      <span
                        className="badge bg-danger rounded-pill"
                        style={{
                          position: 'absolute',
                          top: '-0.3em',
                          right: '-0.2em',
                          fontSize: '0.72em',
                          minWidth: 16,
                          minHeight: 16,
                          padding: '0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(192,57,43,0.10)'
                        }}
                      >
                        {flaggedCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              )}
              {!user && (
                <li className="nav-item d-flex align-items-center">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    style={({ isActive }) => ({ color: isActive ? '#3498db' : '#fff', fontWeight: isActive ? 'bold' : 400 })}
                  >
                    Login
                  </NavLink>
                </li>
              )}
              {user && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive ? 'nav-link active streetlens-active' : 'nav-link'
                      }
                      style={({ isActive }) =>
                        isActive
                          ? {
                              color: '#fff',
                              background: '#21618c',
                              fontWeight: 'bold',
                              borderRadius: 4,
                              boxShadow: '0 1px 4px rgba(44,62,80,0.10)'
                            }
                          : { color: '#fff', fontWeight: 400 }
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="nav-link btn btn-link"
                      style={{ padding: 0, color: '#fff', fontWeight: 400, minWidth: 60, textAlign: 'left' }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
};

export default NavBar;

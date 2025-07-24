import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (user === 'demo' && pass === 'demo123') {
      onLogin();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
    setIsLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e2e7ef', // Color que coincide con el fondo del logo
        padding: '20px',
      }}>
        {/* Logo con animación sutil */}
        <div style={{
          marginBottom: '40px',
          animation: 'fadeInDown 0.8s ease-out',
        }}>
          <img 
            src="/images/logo-text.png" 
            alt="Logo" 
            style={{ 
              height: 60, 
              filter: 'drop-shadow(0 4px 20px rgba(71, 85, 105, 0.15))',
              transition: 'transform 0.3s ease',
            }} 
            draggable={false}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>

        {/* Formulario principal */}
        <div
          style={{
            background: 'linear-gradient(145deg, #475569 0%, #64748b 100%)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(71, 85, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            padding: '48px 40px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            animation: 'fadeInUp 0.8s ease-out',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 35px 70px rgba(71, 85, 105, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(71, 85, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
          }}
        >
          {/* Efecto de brillo animado de fondo */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            animation: 'shimmer 3s infinite',
            pointerEvents: 'none',
          }} />

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Título */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h2 style={{ 
                color: '#f8fafc', 
                margin: 0, 
                fontWeight: 600, 
                fontSize: '28px',
                letterSpacing: '-0.5px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                animation: 'glow 2s ease-in-out infinite alternate',
              }}>
                Iniciar sesión
              </h2>
              <p style={{ 
                color: '#cbd5e1', 
                margin: '8px 0 0 0', 
                fontSize: '14px',
                fontWeight: 400,
              }}>
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Campo de usuario */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  fontSize: '15px',
                  color: '#334155',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    borderWidth: '1px',
                    transition: 'all 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '14px 12px',
                  '&::placeholder': {
                    color: '#94a3b8',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Campo de contraseña */}
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      size="small"
                      sx={{ 
                        color: '#64748b',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(148, 163, 184, 0.15)',
                          color: '#3b82f6',
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  fontSize: '15px',
                  color: '#334155',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    borderWidth: '1px',
                    transition: 'all 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '14px 12px',
                  '&::placeholder': {
                    color: '#94a3b8',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Mensaje de error */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '12px',
                  fontSize: '14px',
                  animation: 'shake 0.5s ease-in-out',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  '& .MuiAlert-icon': {
                    color: '#dc2626',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Botón de login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !user || !pass}
              sx={{
                py: 2,
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                letterSpacing: '0.3px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                color: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover:not(:disabled)': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-3px) scale(1.02)',
                },
                '&:active:not(:disabled)': {
                  transform: 'translateY(-1px) scale(0.98)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                  boxShadow: 'none',
                  transform: 'none',
                  color: '#e2e8f0',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease',
                },
                '&:hover:not(:disabled):before': {
                  left: '100%',
                },
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Iniciando sesión...
                </span>
              ) : 'Iniciar sesión'}
            </Button>

            {/* Información de demo */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'rgba(241, 245, 249, 0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(241, 245, 249, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.2)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <p style={{ 
                margin: 0, 
                fontSize: '13px', 
                color: '#e2e8f0',
                fontWeight: 500,
              }}>
                <strong style={{ color: '#f1f5f9' }}>Demo:</strong> usuario: <code style={{ 
                  background: 'rgba(241, 245, 249, 0.2)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#cbd5e1',
                  border: '1px solid rgba(241, 245, 249, 0.1)',
                }}>demo</code> | contraseña: <code style={{ 
                  background: 'rgba(241, 245, 249, 0.2)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#cbd5e1',
                  border: '1px solid rgba(241, 245, 249, 0.1)',
                }}>demo123</code>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        @keyframes glow {
          from {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          to {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(248, 250, 252, 0.3);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
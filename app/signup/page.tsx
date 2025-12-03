'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUser, faCalendar, faPhone, faEye, faEyeSlash, faKey, faCheckCircle, faArrowRight, faSpinner, faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { RippleButton } from '@/components/ripple-button'
import { requestSignupCode, signup, isAuthenticated } from '@/lib/auth'
import { validatePassword } from '@/lib/passwordValidator'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
    
    // Validar senha em tempo real
    if (e.target.name === 'password') {
      const validation = validatePassword(e.target.value)
      setPasswordErrors(validation.errors)
    } else if (e.target.name === 'confirmPassword') {
      setPasswordErrors([])
    }
  }

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    // Validar senha forte
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors.join(', '))
      setPasswordErrors(passwordValidation.errors)
      return
    }
    
    setLoading(true)
    
    try {
      await requestSignupCode(formData.email, formData.password)
      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar código')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const response = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        code,
        birthDate: formData.birthDate || undefined,
        phone: formData.phone || undefined,
      })

      if (response.success) {
        // Redirecionar para login após cadastro bem-sucedido
        router.push('/login?registered=true')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido ou expirado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6 -mt-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="p-8 rounded-2xl border border-foreground/10 bg-foreground/2 backdrop-blur-sm shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
            <p className="text-foreground/60 text-sm mt-1">Preencha seus dados para começar</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-in slide-in-from-top-2 fade-in-0 duration-200">
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {step === 'form' ? (
            <>
              {/* Signup Form */}
              <form onSubmit={handleRequestCode} className="space-y-4 animate-in fade-in-0 duration-300" autoComplete="off">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" 
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      autoComplete="off"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all ${
                        loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faCalendar} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" 
                    />
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      autoComplete="off"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all ${
                        loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" 
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      autoComplete="off"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all ${
                        loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faPhone} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" 
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      autoComplete="off"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all ${
                        loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faLock} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" 
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg bg-foreground/5 border ${
                        passwordErrors.length > 0 && formData.password
                          ? 'border-red-500/50'
                          : 'border-foreground/10'
                      } text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                    </button>
                  </div>
                  {passwordErrors.length > 0 && formData.password && (
                    <div className="mt-2 space-y-1">
                      {passwordErrors.map((err, idx) => (
                        <p key={idx} className="text-xs text-red-500">
                          • {err}
                        </p>
                      ))}
                    </div>
                  )}
                  {formData.password && passwordErrors.length === 0 && (
                    <p className="text-xs text-green-500 mt-2">✓ Senha válida</p>
                  )}
                  {!formData.password && (
                    <p className="text-xs text-foreground/60 mt-2">
                      A senha deve conter: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faLock} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" 
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all ${
                        loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <RippleButton
                  type="submit"
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 mt-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                      <span>Enviando código...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Continuar</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                    </span>
                  )}
                </RippleButton>
              </form>
            </>
          ) : (
            <>
              {/* Code Verification Form */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 shadow-sm animate-in slide-in-from-top-2 fade-in-0 duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-in zoom-in-50 duration-300">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Código enviado!
                    </p>
                    <p className="text-xs text-foreground/70">
                      Verifique o e-mail <span className="font-semibold text-foreground">{formData.email}</span> e insira o código de 6 dígitos abaixo para completar seu cadastro.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300" autoComplete="off">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Código de Verificação
                  </label>
                  <div className="relative">
                    {!code && (
                      <FontAwesomeIcon 
                        icon={faKey} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none z-10" 
                      />
                    )}
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      autoComplete="off"
                      maxLength={6}
                      className={`w-full py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all text-center text-2xl tracking-widest font-mono focus:scale-[1.02] ${
                        loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      style={{ 
                        paddingLeft: code ? '1rem' : '1rem',
                        paddingRight: '1rem',
                        textAlign: 'center'
                      }}
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-foreground/60 mt-2 text-center">
                    Digite o código de 6 dígitos enviado por e-mail
                  </p>
                </div>

                <RippleButton
                  type="submit"
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 mt-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                      <span>Criando conta...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
                      <span>Criar conta</span>
                    </span>
                  )}
                </RippleButton>

                <button
                  type="button"
                  onClick={() => {
                    setStep('form')
                    setCode('')
                    setError(null)
                  }}
                  className="w-full text-sm text-foreground/60 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                  <span>Voltar</span>
                </button>
              </form>
            </>
          )}

              <p className="text-center text-sm text-foreground/60 mt-6">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Fazer login
                </Link>
              </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Voltar para o início</span>
          </Link>
        </div>
      </div>
    </div>
  )
}


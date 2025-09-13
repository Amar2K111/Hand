'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'es' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translations object
const translations = {
  en: {
    'app.title': 'Hand - Would a modeling agency hire your hands?',
    'app.description': 'Upload your photos. Get brutally honest AI ratings, expert critiques, and a score out of 100.',
    'home.hero.title': 'Would a modeling agency hire your hands?',
    'home.hero.subtitle': 'Upload your photos. Get brutally honest AI ratings, expert critiques, and a score out of 100.',
    'home.cta.getStarted': 'Get Started →',
    'home.features.title': 'Ready to Face the Truth?',
    'home.features.subtitle': 'Join thousands of people discovering their hand modeling potential',
    'features.title': 'What You Get',
    'features.subtitle': 'Everything you need to know about your hand modeling potential',
    'features.noSugarcoating.title': 'No sugarcoating',
    'features.noSugarcoating.description': 'Only brutal truth.',
    'features.expertFeedback.title': 'Expert feedback',
    'features.expertFeedback.description': 'You\'ll want to share.',
    'features.score.title': 'Score out of 100',
    'features.score.description': 'Compete with yourself.',
    'features.verdict.title': 'Hand-model verdict',
    'features.verdict.description': 'Yes, maybe, or keep your day job.',
    'examples.title': 'See What You\'re Getting Into 👀',
    'examples.subtitle': 'Real examples of our brutally honest feedback',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.backToHome': 'Back to Home',
    'auth.signin.title': 'Sign in and face the truth about your hands.',
    'auth.signup.title': 'Get your honest hand rating.',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signinButton': 'Sign In',
    'auth.signingIn': 'Signing In...',
    'auth.signupButton': 'Create Account',
    'auth.signingUp': 'Signing Up...',
    'auth.orContinueWith': 'Or continue with',
    'auth.signinWithGoogle': 'Sign in with Google',
    'auth.signupWithGoogle': 'Sign up with Google',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.learnTruth': 'Learn the truth',
    'auth.signinLink': 'Sign in',
    'auth.getRating': 'Get your honest hand rating and discover what your hands really say about you.',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.languageDescription': 'Choose your preferred language',
    'settings.accountSettings': 'Account Settings',
    'settings.notifications': 'Notifications',
    'settings.emailUpdates': 'Email Updates',
    'settings.done': 'Done',
  },
  es: {
    'app.title': 'Hand - ¿Te contrataría una agencia de modelos para tus manos?',
    'app.description': 'Sube fotos de tus manos. Obtén calificaciones brutalmente honestas de IA, críticas expertas y una puntuación de 100.',
    'home.hero.title': '¿Te contrataría una agencia de modelos para tus manos?',
    'home.hero.subtitle': 'Sube fotos de tus manos. Obtén calificaciones brutalmente honestas de IA, críticas expertas y una puntuación de 100.',
    'home.cta.getStarted': 'Comenzar →',
    'home.features.title': '¿Listo para Enfrentar la Verdad?',
    'home.features.subtitle': 'Únete a miles de personas descubriendo su potencial de modelado de manos',
    'features.title': 'Lo Que Obtienes',
    'features.subtitle': 'Todo lo que necesitas saber sobre tu potencial de modelado de manos',
    'features.noSugarcoating.title': 'Sin endulzar',
    'features.noSugarcoating.description': 'Solo la verdad brutal.',
    'features.expertFeedback.title': 'Comentarios expertos',
    'features.expertFeedback.description': 'Querrás compartirlos.',
    'features.score.title': 'Puntuación de 100',
    'features.score.description': 'Compite contigo mismo.',
    'features.verdict.title': 'Veredicto de modelo de manos',
    'features.verdict.description': 'Sí, tal vez, o mantén tu trabajo diario.',
    'examples.title': 'Mira En Lo Que Te Estás Metiendo 👀',
    'examples.subtitle': 'Ejemplos reales de nuestros comentarios brutalmente honestos',
    'nav.signin': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.backToHome': 'Volver al Inicio',
    'auth.signin.title': 'Inicia sesión y enfrenta la verdad sobre tus manos.',
    'auth.signup.title': 'Obtén tu calificación honesta de manos.',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.emailPlaceholder': 'tu@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signinButton': 'Iniciar Sesión',
    'auth.signingIn': 'Iniciando Sesión...',
    'auth.signupButton': 'Crear Cuenta',
    'auth.signingUp': 'Registrándose...',
    'auth.orContinueWith': 'O continúa con',
    'auth.signinWithGoogle': 'Iniciar sesión con Google',
    'auth.signupWithGoogle': 'Registrarse con Google',
    'auth.noAccount': '¿No tienes una cuenta?',
    'auth.hasAccount': '¿Ya tienes una cuenta?',
    'auth.learnTruth': 'Aprende la verdad',
    'auth.signinLink': 'Iniciar sesión',
    'auth.getRating': 'Obtén tu calificación honesta de manos y descubre lo que tus manos realmente dicen sobre ti.',
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.languageDescription': 'Elige tu idioma preferido',
    'settings.accountSettings': 'Configuración de Cuenta',
    'settings.notifications': 'Notificaciones',
    'settings.emailUpdates': 'Actualizaciones por Correo',
    'settings.done': 'Listo',
  },
  fr: {
    'app.title': 'Hand - Une agence vous embaucherait-elle pour vos mains?',
    'app.description': 'Téléchargez des photos de vos mains. Obtenez des évaluations brutalement honnêtes de l\'IA, des critiques d\'experts et un score sur 100.',
    'home.hero.title': 'Une agence vous embaucherait-elle pour vos mains?',
    'home.hero.subtitle': 'Téléchargez des photos de vos mains. Obtenez des évaluations brutalement honnêtes de l\'IA, des critiques d\'experts et un score sur 100.',
    'home.cta.getStarted': 'Commencer →',
    'home.features.title': 'Prêt à Affronter la Vérité?',
    'home.features.subtitle': 'Rejoignez des milliers de personnes découvrant leur potentiel de mannequinat de mains',
    'features.title': 'Ce Que Vous Obtenez',
    'features.subtitle': 'Tout ce que vous devez savoir sur votre potentiel de mannequinat de mains',
    'features.noSugarcoating.title': 'Pas de sucre',
    'features.noSugarcoating.description': 'Seulement la vérité brutale.',
    'features.expertFeedback.title': 'Commentaires d\'experts',
    'features.expertFeedback.description': 'Vous voudrez les partager.',
    'features.score.title': 'Score sur 100',
    'features.score.description': 'Concurrencez-vous.',
    'features.verdict.title': 'Verdict de mannequin de mains',
    'features.verdict.description': 'Oui, peut-être, ou gardez votre travail quotidien.',
    'examples.title': 'Voyez Dans Quoi Vous Vous Engagez 👀',
    'examples.subtitle': 'Vrais exemples de nos commentaires brutalement honnêtes',
    'nav.signin': 'Se Connecter',
    'nav.signup': 'S\'inscrire',
    'nav.backToHome': 'Retour à l\'Accueil',
    'auth.signin.title': 'Connectez-vous et affrontez la vérité sur vos mains.',
    'auth.signup.title': 'Obtenez votre évaluation honnête de mains.',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de Passe',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.emailPlaceholder': 'votre@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signinButton': 'Se Connecter',
    'auth.signingIn': 'Connexion...',
    'auth.signupButton': 'Créer un Compte',
    'auth.signingUp': 'Inscription...',
    'auth.orContinueWith': 'Ou continuer avec',
    'auth.signinWithGoogle': 'Se connecter avec Google',
    'auth.signupWithGoogle': 'S\'inscrire avec Google',
    'auth.noAccount': 'Vous n\'avez pas de compte ?',
    'auth.hasAccount': 'Vous avez déjà un compte ?',
    'auth.learnTruth': 'Apprenez la vérité',
    'auth.signinLink': 'Se connecter',
    'auth.getRating': 'Obtenez votre évaluation honnête de mains et découvrez ce que vos mains disent vraiment de vous.',
    'settings.title': 'Paramètres',
    'settings.language': 'Langue',
    'settings.languageDescription': 'Choisissez votre langue préférée',
    'settings.accountSettings': 'Paramètres du Compte',
    'settings.notifications': 'Notifications',
    'settings.emailUpdates': 'Mises à jour par Email',
    'settings.done': 'Terminé',
  }
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'es', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t
  }

  // Don't render until language is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return null
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

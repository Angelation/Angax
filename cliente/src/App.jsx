import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas'
import './App.css'

const focusAreas = [
  {
    title: 'Rutinas personalizadas',
    description:
      'Crea tus propias rutinas de entrenamiento con ejercicios, series, repeticiones y pesos. Guarda cada sesión para tener un historial completo y ver tu evolución día a día.',
  },
  {
    title: 'Comunidad y progreso',
    description:
      'Comparte tus rutinas y logros con la comunidad. Visualiza tu progreso con gráficas detalladas que muestran tu rendimiento en fuerza, resistencia y constancia.',
  },
  {
    title: 'Asistente virtual Angel',
    description:
      'Angel, tu asistente de IA, te ayuda a crear rutinas, responde tus dudas sobre entrenamiento y te guía en cada paso. Siempre disponible para optimizar tu experiencia.',
  },
]

const roadmap = [
  {
    tag: 'Progreso',
    title: 'Sugerencias automatizadas',
    detail:
      'Motor de recomendaciones basado en tendencias personales para optimizar cada sesión.',
  },
  {
    tag: 'Comunidad',
    title: 'Moderación inteligente',
    detail:
      'Herramientas para mantener conversaciones sanas y relevantes dentro del feed.',
  },
  {
    tag: 'IA',
    title: 'Chatbot asistente',
    detail:
      'Asistente virtual que responde dudas, propone ajustes y guía el onboarding.',
  },
]

const metrics = [
  { label: 'Rutinas activas', value: '1.1K+' },
  { label: 'Usuarios motivados', value: '9.4K+' },
  { label: 'Entrenadores aliados', value: '380+' },
]

// Lista de consejos aleatorios sobre ejercicios y entrenamiento
const exerciseTips = [
  '💪 Tip de entrenamiento: Siempre calienta al menos 5-10 minutos antes de entrenar. Un buen calentamiento reduce el riesgo de lesiones y mejora tu rendimiento.',
  '🔥 Tip de nutrición: Consume proteínas dentro de los 30 minutos posteriores al entrenamiento. Esto ayuda a la recuperación y crecimiento muscular.',
  '⏱️ Tip de descanso: Descansa entre 48-72 horas antes de trabajar el mismo grupo muscular. Los músculos crecen durante el descanso, no durante el entrenamiento.',
  '📊 Tip de progresión: Intenta aumentar el peso, repeticiones o series cada semana. La progresión constante es clave para mejorar.',
  '🧘 Tip de técnica: La técnica correcta es más importante que el peso. Mejor hacer bien con menos peso que mal con más.',
  '💧 Tip de hidratación: Bebe agua durante todo el entrenamiento, no solo cuando tengas sed. La deshidratación afecta tu rendimiento.',
  '🛌 Tip de sueño: Duerme al menos 7-8 horas diarias. El sueño es crucial para la recuperación muscular y el crecimiento.',
  '🎯 Tip de enfoque: Concéntrate en la contracción del músculo que estás trabajando. La conexión mente-músculo mejora los resultados.',
  '📈 Tip de variedad: Varía tus ejercicios cada 6-8 semanas para evitar estancamientos y mantener la motivación.',
  '🏋️ Tip de volumen: Para hipertrofia, trabaja cada grupo muscular 2-3 veces por semana con 3-4 ejercicios diferentes.',
  '🔄 Tip de repeticiones: Para fuerza: 1-5 reps. Para hipertrofia: 6-12 reps. Para resistencia: 15+ reps.',
  '⏸️ Tip de pausa: Descansa 60-90 segundos entre series para hipertrofia, 2-3 minutos para fuerza máxima.',
  '🌡️ Tip de temperatura: No estires en frío antes del entrenamiento. Es mejor hacer estiramientos dinámicos.',
  '🥗 Tip de alimentación: Come un snack rico en carbohidratos 30-60 minutos antes de entrenar para tener energía.',
  '🚫 Tip de lesiones: Si sientes dolor agudo, detente inmediatamente. No confundas dolor con esfuerzo muscular.',
  '📱 Tip de tracking: Registra tus entrenamientos. Ver tu progreso te mantiene motivado y te ayuda a ajustar tu rutina.',
  '🎵 Tip de motivación: Escucha música mientras entrenas. Puede aumentar tu rendimiento hasta un 15%.',
  '🤝 Tip de compañero: Entrenar con un compañero puede aumentar tu intensidad y mantenerte más consistente.',
  '🧠 Tip mental: Visualiza tu entrenamiento antes de hacerlo. Esto prepara tu mente y cuerpo.',
  '⚡ Tip de energía: El mejor momento para entrenar fuerza es cuando tengas más energía, ya sea mañana o tarde.',
  '🏃 Tip cardiovascular: Incluye 20-30 minutos de cardio después de tu entrenamiento de fuerza para mejorar la condición.',
  '🎨 Tip de creatividad: No te limites a los mismos ejercicios. Prueba variaciones para trabajar los músculos desde diferentes ángulos.',
  '📏 Tip de forma: Si no puedes mantener la forma correcta en las últimas repeticiones, reduce el peso o las repeticiones.',
  '🔥 Tip de intensidad: El último set debe ser desafiante. Si puedes hacer fácilmente todas las repeticiones, aumenta la carga.',
  '🌙 Tip de descanso activo: En días de descanso, haz estiramientos o caminata ligera para mejorar la recuperación.',
  '💊 Tip de suplementos: Los suplementos son complementos, no reemplazos. Prioriza una alimentación balanceada.',
  '🎯 Tip de objetivos: Establece objetivos realistas y específicos. "Ganar 2kg de músculo en 3 meses" es mejor que "estar más fuerte".',
  '📸 Tip de progreso: Toma fotos de tu progreso semanalmente. Los cambios visuales te motivarán a seguir.',
  '🧘 Tip de respiración: Exhala durante el esfuerzo (fase concéntrica) e inhala durante la relajación (fase excéntrica).',
  '🏆 Tip de celebración: Celebra tus pequeños logros. Cada repetición extra o kilo más cuenta.',
]

const getRandomTip = () => {
  return exerciseTips[Math.floor(Math.random() * exerciseTips.length)]
}

const getInitialChatMessage = (isLoggedIn) => ({
  id: 1,
  from: 'bot',
  text: isLoggedIn
    ? `¡Hola! 👋 Soy Angel, tu asistente virtual de AngaX. Estoy aquí para ayudarte a alcanzar tus objetivos de entrenamiento.

💡 ¿Qué puedo hacer por ti?

✅ Gestión de rutinas: Crear, ver y gestionar tus rutinas de entrenamiento
✅ Seguimiento de progreso: Consultar tus estadísticas, gráficas y evolución
✅ Información de ejercicios: Buscar ejercicios por grupo muscular
✅ Navegación: Llevarte a cualquier sección de AngaX
✅ Guías paso a paso: Explicarte cómo usar todas las funciones

🎯 Preguntas que puedes hacerme:
• "¿Cómo creo mi rutina?"
• "Muéstrame mi progreso"
• "¿Qué ejercicios hay?"
• "Llévame a rutinas"
• "Dame un consejo de entrenamiento"

💪 Consejos y tips: También puedo darte consejos aleatorios sobre ejercicios, nutrición, técnica, recuperación y más. Solo pregunta "dame un consejo" o "tip de entrenamiento".

¿En qué te puedo ayudar hoy? 🤔`
    : `¡Hola! 👋 Soy Angel, tu asistente virtual de AngaX. Estoy aquí para ayudarte a alcanzar tus objetivos de entrenamiento.

💡 ¿Qué puedo hacer por ti?

✅ Información sobre AngaX: Explicarte cómo funciona la plataforma
✅ Guías y tutoriales: Mostrarte paso a paso cómo usar las funciones
✅ Consejos de entrenamiento: Darte tips aleatorios sobre ejercicios y fitness

🎯 Preguntas que puedes hacerme:
• "¿Cómo funciona AngaX?"
• "¿Cómo comienzo?"
• "Dame un consejo de entrenamiento"

💪 Consejos y tips: Puedo darte consejos aleatorios sobre ejercicios, nutrición, técnica, recuperación y más. Solo pregunta "dame un consejo" o "tip de entrenamiento".

Inicia sesión para acceder a todas las funciones: gestión de rutinas, seguimiento de progreso, ejercicios personalizados y más.

¿En qué te puedo ayudar? 🤔`,
})

const avatarColors = ['#fda4af', '#fbcfe8', '#c4b5fd', '#a5b4fc', '#93c5fd', '#99f6e4', '#fecdd3']
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8080/AngaX/servidor/public/api'
const backendBaseUrl = apiBaseUrl.replace(/\/api$/, '')

const getAvatarStyle = (photoUrl) => {
  if (!photoUrl) return undefined
  // Si es una URL de blob (vista previa) o ya es una URL completa, usarla directamente
  const url = photoUrl.startsWith('http') || photoUrl.startsWith('blob:') 
    ? photoUrl 
    : `${backendBaseUrl}${photoUrl}`
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: 'transparent',
  }
}

const buildBotResponse = async (text, currentUser, navigate) => {
  const normalized = text.toLowerCase().trim()
  
  // Saludos
  if (normalized.match(/^(hola|hi|hey|buenos|buenas|saludos)/)) {
    if (currentUser) {
      return `¡Hola! 👋 ¡Qué gusto saludarte de nuevo!

💡 ¿En qué puedo ayudarte hoy?

✅ Rutinas: Crear, ver y gestionar tus rutinas de entrenamiento
✅ Progreso: Consultar tus estadísticas y evolución
✅ Ejercicios: Buscar ejercicios por grupo muscular
✅ Navegación: Llevarte a cualquier sección
✅ Consejos: Tips aleatorios sobre entrenamiento

🎯 Preguntas que puedes hacerme:
• "¿Cómo creo mi rutina?"
• "Muéstrame mi progreso"
• "Dame un consejo de entrenamiento"

¿Qué necesitas? 🤔`
    } else {
      return `¡Hola! 👋 Soy Angel, tu asistente virtual de AngaX.

💡 Puedo ayudarte con:

✅ Información sobre AngaX y cómo funciona
✅ Guías paso a paso de las funciones
✅ Consejos aleatorios sobre entrenamiento y fitness

🎯 Ejemplos de preguntas:
• "¿Cómo funciona AngaX?"
• "Dame un consejo de entrenamiento"

Inicia sesión para acceder a todas las funciones completas.

¿En qué te puedo ayudar? 🤔`
    }
  }
  
  // Consejos y tips de entrenamiento
  if (normalized.includes('consejo') || normalized.includes('tip') || normalized.includes('ayuda para entrenar') || 
      normalized.includes('recomendación') || normalized.includes('sugerencia') || normalized.includes('truco')) {
    return getRandomTip() + '\n\n💪 ¿Quieres otro consejo? Solo pregunta "dame otro consejo" o "más tips".'
  }
  
  // Ayuda general
  if (normalized.includes('ayuda') || normalized.includes('help') || normalized.includes('qué puedes') || normalized.includes('que puedes')) {
    return `💡 ¿En qué puedo ayudarte?

Puedo ayudarte con:

✅ Rutinas: Ver tus rutinas, crear nuevas, explicarte cómo hacerlo
✅ Progreso: Consultar tus estadísticas, entrenamientos y gráficas
✅ Ejercicios: Buscar ejercicios por grupo muscular
✅ Navegación: Llevarte a cualquier sección de AngaX
✅ Guías: Explicarte paso a paso cómo usar las funciones
✅ Consejos: Tips aleatorios sobre entrenamiento, nutrición, técnica y más

Preguntas que puedes hacerme:
• "¿Cómo creo mi rutina?"
• "Muéstrame mi progreso"
• "¿Qué ejercicios hay?"
• "Llévame a rutinas"
• "Dame un consejo de entrenamiento"

¿Qué necesitas? 🤔`
  }
  
  // Cómo comenzar / empezar
  if ((normalized.includes('cómo') || normalized.includes('como')) && 
      (normalized.includes('comenzar') || normalized.includes('empezar') || normalized.includes('iniciar'))) {
    if (!currentUser) {
      return `🚀 Para comenzar en AngaX:

Paso 1: Inicia sesión o crea una cuenta
Paso 2: Una vez dentro, puedes:
   • Crear tu primera rutina
   • Ver ejercicios disponibles
   • Explorar la comunidad

¿Quieres que te lleve al login?`
    }
    
    return `🚀 ¡Bienvenido a AngaX! Aquí te explico cómo comenzar:

1. Crea tu primera rutina:
   • Ve a "Rutinas" → "Crear rutina"
   • Elige ejercicios y configura series/repeticiones
   • Guarda y empieza a entrenar

2. Registra tus entrenamientos:
   • Completa una rutina para guardar tu progreso
   • Ve a "Progreso" para ver tus estadísticas

3. Explora la comunidad:
   • Comparte tus logros
   • Motiva a otros usuarios

¿Quieres que te explique cómo crear tu primera rutina paso a paso? 💪`
  }
  
  // Rutinas
  if (normalized.includes('rutina') || normalized.includes('entrenamiento') || normalized.includes('routine')) {
    if (!currentUser) {
      return 'Para ver tus rutinas, primero necesitas iniciar sesión. ¿Quieres que te lleve al login?'
    }
    
    try {
      const response = await fetch(`${apiBaseUrl}/routines?user_email=${encodeURIComponent(currentUser.email)}`)
      const routines = await response.json()
      
      if (!routines || routines.length === 0) {
        return `📋 No tienes rutinas creadas todavía.

¿Quieres crear tu primera rutina? Te explico cómo:

1. Ve a "Rutinas" en el menú
2. Haz clic en "Crear rutina"
3. Completa nombre y objetivo
4. Selecciona ejercicios y configura series/repeticiones
5. Guarda y ¡listo!

¿Quieres que te lleve a crear una ahora? 💪`
      }
      
      const routinesList = routines.slice(0, 5).map(r => `• ${r.routineName}${r.goal ? ` (${r.goal})` : ''}`).join('\n')
      const moreText = routines.length > 5 ? `\n\n... y ${routines.length - 5} más.` : ''
      
      return `📋 Tus rutinas (${routines.length}):\n\n${routinesList}${moreText}\n\n¿Quieres ver alguna en detalle, crear una nueva o necesitas ayuda con algo más?`
    } catch (error) {
      return 'No pude cargar tus rutinas en este momento. Intenta más tarde o ve directamente a la sección "Rutinas".'
    }
  }
  
  // Progreso
  if (normalized.includes('progreso') || normalized.includes('evolución') || normalized.includes('estadísticas') || normalized.includes('métricas')) {
    if (!currentUser) {
      return 'Para ver tu progreso, primero necesitas iniciar sesión.'
    }
    
    try {
      const response = await fetch(`${apiBaseUrl}/progress?email=${encodeURIComponent(currentUser.email)}`)
      const progress = await response.json()
      
      if (!progress || progress.length === 0) {
        return 'Aún no tienes entrenamientos registrados. Completa una rutina para empezar a ver tu progreso. ¿Quieres que te lleve a "Rutinas"?'
      }
      
      const totalSessions = progress.length
      const totalVolume = progress.reduce((sum, session) => {
        return sum + (session.exercises || []).reduce((acc, ex) => {
          const w = ex.weight ?? 0
          const r = ex.reps ?? 0
          const s = ex.sets ?? 0
          return acc + (w * r * s)
        }, 0)
      }, 0)
      
      const lastSession = progress[0]?.completed_at ? new Date(progress[0].completed_at).toLocaleDateString('es-ES') : 'N/A'
      
      return `📊 Tu progreso:\n\n• Entrenamientos: ${totalSessions}\n• Volumen total: ${Math.round(totalVolume).toLocaleString()} kg\n• Última sesión: ${lastSession}\n\n¿Quieres ver las gráficas detalladas? Te llevo a "Progreso".`
    } catch (error) {
      return 'No pude cargar tu progreso. Intenta más tarde o ve directamente a la sección "Progreso".'
    }
  }
  
  // Ejercicios
  if (normalized.includes('ejercicio') || normalized.includes('exercise') || normalized.includes('qué ejercicios')) {
    try {
      const response = await fetch(`${apiBaseUrl}/exercises`)
      const exercises = await response.json()
      
      if (!exercises || Object.keys(exercises).length === 0) {
        return 'No hay ejercicios disponibles en este momento.'
      }
      
      const groups = Object.keys(exercises).slice(0, 5)
      const groupsList = groups.map(g => `• ${g.charAt(0).toUpperCase() + g.slice(1)}`).join('\n')
      
      return `Ejercicios disponibles por grupo:\n\n${groupsList}${Object.keys(exercises).length > 5 ? `\n\n... y ${Object.keys(exercises).length - 5} grupos más.` : ''}\n\n¿Quieres ver ejercicios de algún grupo específico?`
    } catch (error) {
      return 'No pude cargar los ejercicios. Intenta más tarde.'
    }
  }
  
  // Navegación
  if (normalized.includes('ir a') || normalized.includes('lleva') || normalized.includes('muestra')) {
    if (normalized.includes('rutina')) {
      navigate('/rutinas')
      return 'Te llevo a tus rutinas. 👉'
    }
    if (normalized.includes('progreso') || normalized.includes('seguimiento')) {
      navigate('/progreso')
      return 'Te llevo a tu progreso. 📊'
    }
    if (normalized.includes('comunidad') || normalized.includes('feed')) {
      navigate('/comunidad')
      return 'Te llevo a la comunidad. 👥'
    }
  }
  
  // Cómo crear rutina - explicación detallada
  if ((normalized.includes('cómo') || normalized.includes('como') || normalized.includes('como se')) && 
      (normalized.includes('crear') || normalized.includes('hacer')) && 
      (normalized.includes('rutina') || normalized.includes('entrenamiento'))) {
    if (!currentUser) {
      return 'Para crear una rutina, primero necesitas iniciar sesión. Una vez dentro, te explico paso a paso cómo hacerlo.'
    }
    
    return `📝 Cómo crear tu rutina en AngaX:

Paso 1: Ve a la sección "Rutinas" (menú superior)

Paso 2: Haz clic en "Crear rutina"

Paso 3: Completa los datos:
   • Nombre de la rutina (ej: "Piernas y glúteos")
   • Objetivo (fuerza, resistencia, hipertrofia, etc.)

Paso 4: Selecciona los ejercicios:
   • Elige el grupo muscular (pecho, piernas, brazos, etc.)
   • Haz clic en los ejercicios que quieras incluir

Paso 5: Configura cada ejercicio:
   • Series: cuántas veces harás el ejercicio
   • Repeticiones: cuántas repeticiones por serie
   • Peso (opcional): la carga que usarás

Paso 6: Guarda tu rutina

¿Quieres que te lleve a crear una ahora? 💪`
  }
  
  // Crear rutina (comando directo)
  if (normalized.includes('crear') && (normalized.includes('rutina') || normalized.includes('entrenamiento'))) {
    if (!currentUser) {
      return 'Para crear una rutina, primero necesitas iniciar sesión.'
    }
    navigate('/rutinas')
    return 'Te llevo a crear una nueva rutina. Si necesitas ayuda con los pasos, solo pregunta "¿cómo creo mi rutina?" 💪'
  }
  
  // Peso / fuerza
  if (normalized.includes('peso') || normalized.includes('fuerza') || normalized.includes('carga')) {
    if (!currentUser) {
      return 'Para ver tu progreso de peso, primero necesitas iniciar sesión.'
    }
    navigate('/progreso')
    return 'Te llevo a tu progreso donde puedes ver gráficas de peso, repeticiones y volumen. 📈'
  }
  
  // Más consejos (cuando piden otro después de uno)
  if ((normalized.includes('otro') || normalized.includes('más') || normalized.includes('otra') || normalized.includes('siguiente')) && 
      (normalized.includes('consejo') || normalized.includes('tip') || normalized.includes('recomendación'))) {
    return getRandomTip() + '\n\n💪 ¿Quieres más consejos? Solo pregunta "dame otro consejo".'
  }
  
  // Despedida
  if (normalized.match(/^(adiós|chao|bye|hasta luego|nos vemos|gracias)/)) {
    return '¡De nada! Si necesitas algo más, aquí estaré. Recuerda que puedo ayudarte con rutinas, progreso, ejercicios y también darte consejos de entrenamiento. 💪'
  }
  
  // Respuesta por defecto
  return `Entiendo. Puedo ayudarte con:

✅ Rutinas y entrenamientos
✅ Seguimiento de progreso
✅ Información de ejercicios
✅ Navegación por AngaX
✅ Consejos y tips aleatorios sobre entrenamiento

¿Qué necesitas específicamente? También puedes pedirme un consejo escribiendo "dame un consejo" o "tip de entrenamiento". 💪`
}

// Función para reemplazar emojis por Material Icons
const replaceEmojisWithIcons = (text) => {
  const emojiMap = {
    '👋': 'waving_hand',
    '💪': 'fitness_center',
    '📊': 'bar_chart',
    '📝': 'edit_note',
    '✅': 'check_circle',
    '🚀': 'rocket_launch',
    '💡': 'lightbulb',
    '🤔': 'help',
    '👉': 'arrow_forward',
    '👥': 'groups',
    '📋': 'list',
    '📈': 'trending_up',
    '💬': 'forum',
    '🔥': 'local_fire_department',
    '⏱️': 'timer',
    '🧘': 'self_improvement',
    '💧': 'water_drop',
    '🛌': 'bed',
    '🎯': 'track_changes',
    '🏋️': 'sports_gymnastics',
    '🔄': 'autorenew',
    '⏸️': 'pause',
    '🌡️': 'thermostat',
    '🥗': 'lunch_dining',
    '🚫': 'block',
    '📱': 'smartphone',
    '🎵': 'music_note',
    '🤝': 'handshake',
    '🧠': 'psychology',
    '⚡': 'bolt',
    '🏃': 'directions_run',
    '🎨': 'palette',
    '📏': 'straighten',
    '🌙': 'nights_stay',
    '💊': 'medication',
    '📸': 'camera_alt',
    '🏆': 'emoji_events',
  }
  
  let result = []
  let lastIndex = 0
  const emojiRegex = /👋|💪|📊|📝|✅|🚀|💡|🤔|👉|👥|📋|📈|💬|🔥|⏱️|🧘|💧|🛌|🎯|🏋️|🔄|⏸️|🌡️|🥗|🚫|📱|🎵|🤝|🧠|⚡|🏃|🎨|📏|🌙|💊|📸|🏆/g
  let match
  
  while ((match = emojiRegex.exec(text)) !== null) {
    // Agregar texto antes del emoji
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index))
    }
    // Agregar el icono Material
    const iconName = emojiMap[match[0]]
    result.push(
      <span key={match.index} className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', margin: '0 2px' }}>
        {iconName}
      </span>
    )
    lastIndex = match.index + match[0].length
  }
  
  // Agregar texto restante
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex))
  }
  
  return result.length > 0 ? result : text
}

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0]
  const charCode = name.trim().toLowerCase().charCodeAt(0)
  const index = charCode % avatarColors.length
  return avatarColors[index]
}

const parseSharedWorkout = (content) => {
  const text = (content ?? '').toString()
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0)
  if (!lines.length) return null

  const first = lines[0]
  const isRoutine = first.toLowerCase().startsWith('rutina:')
  const isSession = first.toLowerCase().startsWith('entrenamiento:')
  const isAngaX = lines.some((l) => l.toLowerCase().includes('compartid') && l.toLowerCase().includes('angax'))

  if (!isAngaX || (!isRoutine && !isSession)) return null

  const title = first.split(':').slice(1).join(':').trim()
  const objectiveLine = lines.find((l) => l.toLowerCase().startsWith('objetivo:'))
  const subtitle = objectiveLine ? objectiveLine.split(':').slice(1).join(':').trim() : ''

  const items = lines
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^- /, ''))
    .map((raw) => {
      // Examples:
      // "Curl con barra: 3x10"
      // "Curl con barra: 15kg 10x3"
      const [namePart, restPart] = raw.split(':')
      const name = (namePart ?? raw).trim()
      const rest = (restPart ?? '').trim()

      const weightMatch = rest.match(/(\d+(?:[.,]\d+)?)\s*kg/i)
      const weight = weightMatch ? weightMatch[1].replace(',', '.') : null

      const setsRepsMatch = rest.match(/(\d+)\s*x\s*(\d+)/i) // reps x sets OR sets x reps depending on builder
      // Our share strings use reps x sets for sessions, sets x reps for routines.
      let sets = null
      let reps = null
      if (setsRepsMatch) {
        const a = Number(setsRepsMatch[1])
        const b = Number(setsRepsMatch[2])
        if (isSession) {
          reps = a
          sets = b
        } else {
          sets = a
          reps = b
        }
      }

      return { name, weight, sets, reps, raw: rest || raw }
    })

  return {
    type: isRoutine ? 'routine' : 'session',
    title,
    subtitle,
    items,
  }
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [booting, setBooting] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState(() => [getInitialChatMessage(false)])
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false)
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible')
        }
      })
    }, observerOptions)
    
    // Observar todos los elementos con clases de animación
    const animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale'
    )
    animatedElements.forEach((el) => observer.observe(el))
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [location.pathname])
  const [chatInput, setChatInput] = useState('')
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'user', 
  })
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [authNotice, setAuthNotice] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const chatMessagesRef = useRef(null)

  const toggleNav = () => setNavOpen((prev) => !prev)
  const closeNav = () => setNavOpen(false)
  const openChatbot = () => setChatOpen(true)
  const toggleChat = () => setChatOpen((prev) => !prev)
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
    setShowLoginPassword(false)
    setShowRegisterPassword(false)
    setShowRegisterConfirm(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 950)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (location.hash) return
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Sistema de animaciones al hacer scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible')
          // Opcional: dejar de observar después de animar para mejor rendimiento
          // observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observar todos los elementos con clases de animación
    const animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale'
    )
    
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [location.pathname])
  const closeAuthModal = () => setAuthModalOpen(false)
  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('angax_user')
    setChatMessages([getInitialChatMessage(false)])
    setProfileMenuOpen(false)
  }
  const ensureAuthenticated = () => {
    if (!currentUser) {
      openAuthModal('login')
      return false
    }
    return true
  }
  const goToSection = (sectionId) => {
    const scroll = () =>
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(scroll, 100)
    } else {
      scroll()
    }
    closeNav()
  }

  const pushMessage = (message) =>
    setChatMessages((prev) => [...prev, { ...message, id: message.id || Date.now() + Math.random() }])

  const handleChatSubmit = async (event) => {
    event.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return
    pushMessage({ from: 'user', text: trimmed })
    setChatInput('')
    
    // Scroll al final después de agregar mensaje del usuario
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
      }
    }, 100)
    
    // Mostrar indicador de "escribiendo..."
    const typingId = Date.now()
    setChatMessages((prev) => [...prev, { from: 'bot', text: '', id: typingId, isTyping: true }])
    
    // Scroll al final para mostrar el indicador de typing
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
      }
    }, 150)
    
    try {
      const response = await buildBotResponse(trimmed, currentUser, navigate)
      // Remover el mensaje de "escribiendo..." y agregar la respuesta en una sola operación
      setChatMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== typingId)
        return [...filtered, { from: 'bot', text: response, id: Date.now() }]
      })
      
      // Scroll al final después de la respuesta
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
        }
      }, 100)
    } catch (error) {
      // Remover el indicador de typing y mostrar error
      setChatMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== typingId)
        return [...filtered, { from: 'bot', text: 'Lo siento, hubo un error. Intenta de nuevo o ve directamente a la sección que necesitas.', id: Date.now() }]
      })
      
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
        }
      }, 100)
    }
  }
  
  // Auto-scroll cuando cambian los mensajes
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [chatMessages])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRegisterChange = (event) => {
    const { name, value } = event.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirm) {
      setAuthNotice('Completa todos los campos para registrarte.')
      return
    }
    if (registerForm.password !== registerForm.confirm) {
      setAuthNotice('Las contraseñas no coinciden.')
      return
    }
    if (registerForm.password.length < 6) {
      setAuthNotice('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerForm.name.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
          password_confirmation: registerForm.confirm,
          role: registerForm.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        let errorMsg = data.message || data.error || 'Error al registrarse'
          if (data.errors) {
          const firstError = Object.values(data.errors)[0]
          if (Array.isArray(firstError)) {
            errorMsg = firstError[0]
          } else {
            errorMsg = firstError
          }
        }
        
        console.error('Error al registrarse:', {
          status: response.status,
          data: data,
          errorMsg: errorMsg
        })
        
        setAuthNotice(errorMsg)
        return
      }

      const userData = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'user',
        photo: data.user.profile_photo_url || null,
      }
      localStorage.setItem('angax_user', JSON.stringify(userData))
      setCurrentUser(userData)
      setChatMessages([getInitialChatMessage(true)])
      setRegisterForm({ name: '', email: '', password: '', confirm: '', role: 'user' })
      setLoginForm({ email: data.user.email, password: '' })
      setAuthNotice('')
      closeAuthModal()
    } catch (error) {
      console.error('Error al registrarse:', error)
      setAuthNotice('Error de conexión. Intenta de nuevo.')
    }
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    if (!loginForm.email || !loginForm.password) {
      setAuthNotice('Ingresa tus credenciales para continuar.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || 'Credenciales incorrectas'
        setAuthNotice(errorMsg)
        return
      }

      const userData = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'user',
        photo: data.user.profile_photo_url || null,
      }
      localStorage.setItem('angax_user', JSON.stringify(userData))
      setCurrentUser(userData)
      setChatMessages([getInitialChatMessage(true)])
      setLoginForm({ email: '', password: '' })
      setAuthNotice('')
      closeAuthModal()
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setAuthNotice('Error de conexión. Intenta de nuevo.')
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('angax_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setCurrentUser({
          ...userData,
          photo: userData.photo ?? null,
        })
        setChatMessages([getInitialChatMessage(true)])
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        localStorage.removeItem('angax_user')
        setChatMessages([getInitialChatMessage(false)])
      }
    } else {
      setChatMessages([getInitialChatMessage(false)])
    }
    setUserLoaded(true)
  }, [])

  const previewLetter = registerForm.name.trim().charAt(0).toUpperCase() || 'A'
  const previewColor = getAvatarColor(registerForm.name)

  const renderModalForm = () => {
    if (authMode === 'login') {
      return (
        <div className="auth-single">
          <form onSubmit={handleLoginSubmit}>
            <label>
              Correo electrónico
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="tuemail@ejemplo.com"
                autoComplete="email"
              />
            </label>
            <label>
              Contraseña
              <div className="password-field">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <EyeIcon open={showLoginPassword} />
                </button>
              </div>
            </label>
            <button className="btn btn-primary w-100" type="submit">
              Entrar
            </button>
          </form>
          <p className="auth-switch">
            ¿No tienes cuenta?
            <button type="button" onClick={() => setAuthMode('register')}>
              Regístrate aquí
            </button>
          </p>
        </div>
      )
    }

    return (
      <div className="auth-single">
        <form onSubmit={handleRegisterSubmit}>
          <label>
            Nombre completo
            <input
              type="text"
              name="name"
              value={registerForm.name}
              onChange={handleRegisterChange}
              placeholder="Ej: Ana Gómez"
              autoComplete="name"
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              placeholder="tuemail@ejemplo.com"
              autoComplete="email"
            />
          </label>
          <label>
            Contraseña
            <div className="password-field">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRegisterPassword((v) => !v)}
                aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showRegisterPassword} />
              </button>
            </div>
          </label>
          <label>
            Confirmar contraseña
            <div className="password-field">
              <input
                type={showRegisterConfirm ? 'text' : 'password'}
                name="confirm"
                value={registerForm.confirm}
                onChange={handleRegisterChange}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRegisterConfirm((v) => !v)}
                aria-label={showRegisterConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showRegisterConfirm} />
              </button>
            </div>
          </label>
          <label>
            Tipo de cuenta
            <select
              name="role"
              value={registerForm.role}
              onChange={handleRegisterChange}
              style={{
                border: '1px solid #CCCCCC',
                borderRadius: '8px',
                padding: '12px 14px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '16px',
                background: '#FFFFFF',
                color: '#000000',
              }}
            >
              <option value="user" style={{ color: '#000000', background: '#FFFFFF' }}>Usuario</option>
              <option value="trainer" style={{ color: '#000000', background: '#FFFFFF' }}>Entrenador</option>
            </select>
          </label>
          <button className="btn btn-primary w-100" type="submit">
            Registrarme
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tienes cuenta?
          <button type="button" onClick={() => setAuthMode('login')}>
            Inicia sesión
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      {booting && <SplashScreen />}
      <header className="site-header">
        <div className="site-topline">
          <span className="site-topline__brand">AngaX</span>
          <span className="site-topline__sep">|</span>
          <span className="site-topline__tag">Conviértete en tu mejor versión</span>
        </div>
        <nav className="site-nav navbar navbar-expand-lg">
          <div className="container-xl">
            <button
              className="navbar-toggler custom-toggler"
              type="button"
              aria-controls="mainNav"
              aria-expanded={navOpen}
              aria-label="Toggle navigation"
              onClick={toggleNav}
            >
              <span />
              <span />
              <span />
            </button>

            <div className="site-nav__grid">
              <div className={`site-nav__left collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="mainNav">
                <ul className="navbar-nav gap-2">
                  <li className="nav-item">
                    <Link className="nav-link" to="/rutinas" onClick={closeNav}>
                      Rutinas
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/progreso" onClick={closeNav}>
                      Progreso
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/comunidad" onClick={closeNav}>
                      Comunidad
                    </Link>
                  </li>
                  {currentUser && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/entrenadores" onClick={closeNav}>
                        Entrenadores
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <Link
                className="navbar-brand logo site-nav__brand"
                to="/"
                onClick={() => {
                  closeNav()
                  if (location.pathname !== '/') navigate('/')
                }}
              >
                AngaX
              </Link>

              <div className="site-nav__right header-cta d-flex gap-2">
                {currentUser ? (
                  <div className="user-profile" ref={profileMenuRef}>
                    <button
                      type="button"
                      className="user-avatar-trigger"
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      aria-label="Abrir menú de usuario"
                    >
                      <span className="avatar-preview" style={getAvatarStyle(currentUser.photo)}>
                        {!currentUser.photo && currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </button>
                    <div className={`user-dropdown ${profileMenuOpen ? 'open' : ''}`}>
                      <div className="user-dropdown__header">
                        <span className="avatar-preview large" style={getAvatarStyle(currentUser.photo)}>
                          {!currentUser.photo && currentUser.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="user-dropdown__name">{currentUser.name}</p>
                          <p className="user-dropdown__email">{currentUser.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="user-dropdown__item"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          navigate('/perfil')
                        }}
                      >
                        Ver perfil
                      </button>
                      <button type="button" className="user-dropdown__item" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      closeNav()
                      openAuthModal('login')
                    }}
                  >
                    Inicia sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <LandingContent
                metrics={metrics}
                focusAreas={focusAreas}
                roadmap={roadmap}
                goToSection={goToSection}
                onProgramsCTA={() => navigate('/rutinas')}
              />
            }
          />
          <Route
            path="/rutinas"
            element={<RoutinesPage currentUser={currentUser} userLoaded={userLoaded} ensureAuth={ensureAuthenticated} />}
          />
          <Route
            path="/comunidad"
            element={<CommunityPage currentUser={currentUser} ensureAuth={ensureAuthenticated} />}
          />
          <Route
            path="/progreso"
            element={<ProgressPage currentUser={currentUser} userLoaded={userLoaded} ensureAuth={ensureAuthenticated} />}
          />
          <Route
            path="/perfil"
            element={
              <ProfilePage
                currentUser={currentUser}
                userLoaded={userLoaded}
                ensureAuth={ensureAuthenticated}
                onProfileUpdate={(user) => {
                  setCurrentUser(user)
                  localStorage.setItem('angax_user', JSON.stringify(user))
                }}
              />
            }
          />
          <Route
            path="/entrenadores"
            element={<TrainersPage currentUser={currentUser} userLoaded={userLoaded} ensureAuth={ensureAuthenticated} />}
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container-xl">
          <div className="footer__content">
            <div className="footer__brand">
              <h4>AngaX</h4>
              <p>
                Seguimiento deportivo integral para atletas, entrenadores y comunidades que quieren mejorar cada día.
              </p>
            </div>
            
            <div className="footer__links">
              <div className="footer__column">
                <h5>Plataforma</h5>
                <ul>
                  <li><a href="#inicio">Inicio</a></li>
                  <li><a href="#panel">Panel</a></li>
                  <li><a href="#por-que-angax">Por qué AngaX</a></li>
                  <li><a href="#comunidad">Comunidad</a></li>
                </ul>
              </div>
              
              <div className="footer__column">
                <h5>Recursos</h5>
                <ul>
                  <li><a href="/rutinas">Rutinas</a></li>
                  <li><a href="/progreso">Progreso</a></li>
                  <li><a href="#trabaja-con-nosotros">Trabaja con nosotros</a></li>
                </ul>
              </div>
              
              <div className="footer__column">
                <h5>Contacto</h5>
                <ul>
                  <li>
                    <a href="https://www.instagram.com/angel__aguirre16/" target="_blank" rel="noreferrer" className="footer-contact-link">
                      <img src="/images/instagram.webp" alt="Instagram" className="footer-contact-icon" />
                      <span>angel__aguirre16</span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:angax@gmail.com" className="footer-contact-link">
                      <img src="/images/email.webp" alt="Email" className="footer-contact-icon" />
                      <span>angax@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer__bottom">
            <p>&copy; {new Date().getFullYear()} AngaX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <div className={`auth-modal ${authModalOpen ? 'open' : ''}`}>
        <div className="auth-modal__backdrop" />
        <div className="auth-modal__content">
          <button className="auth-modal__close" type="button" onClick={closeAuthModal}>
            ×
          </button>
          <div className="auth-modal__header">
            <div className="auth-modal__brand">AngaX</div>
            <h3>{authMode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h3>
            <p>Accede para registrar entrenos, analizar progreso y mantener tu historial sincronizado.</p>
          </div>
          {renderModalForm()}
          {authNotice && <div className="auth-notice">{authNotice}</div>}
        </div>
      </div>

      <button className="chatbot-toggle" onClick={toggleChat}>
        <span className="material-icons">forum</span>
        <small>Habla con Angel</small>
      </button>

      <div className={`chatbot-window ${chatOpen ? 'open' : ''}`}>
        <div className="chatbot-window__header">
          <div>
            <strong>Angel</strong>
            <p>Asistente virtual</p>
          </div>
          <button className="chatbot-window__close" type="button" onClick={toggleChat}>
            ×
        </button>
        </div>
        <div className="chatbot-window__messages" ref={chatMessagesRef}>
          {chatMessages.map((message) => (
            <div key={message.id} className={`message ${message.from} ${message.isTyping ? 'typing' : ''}`}>
              {message.isTyping ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <p style={{ whiteSpace: 'pre-line' }}>{replaceEmojisWithIcons(message.text)}</p>
              )}
            </div>
          ))}
        </div>
        <form className="chatbot-window__input" onSubmit={handleChatSubmit}>
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  )
}

function GymCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const images = [
    '/images/carrusel/gimnasiocarrusel1.jpg',
    '/images/carrusel/gimnasiocarrusel2.jpg',
    '/images/carrusel/gimnasiocarrusel3.jpg',
    '/images/carrusel/gimnasiocarrusel4.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [images.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <section className="gym-carousel-section">
      <div className="gym-carousel-container">
        <div className="gym-carousel">
          <button className="gym-carousel__button gym-carousel__button--prev" onClick={goToPrevious} aria-label="Imagen anterior">
            <span className="material-icons">chevron_left</span>
          </button>
          
          <div className="gym-carousel__slides">
            {images.map((image, index) => (
              <div
                key={index}
                className={`gym-carousel__slide ${index === currentIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
            ))}
          </div>
          
          <button className="gym-carousel__button gym-carousel__button--next" onClick={goToNext} aria-label="Siguiente imagen">
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
        
        <div className="gym-carousel__indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`gym-carousel__indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SplashScreen() {
  return (
    <div className="splash" role="status" aria-live="polite" aria-label="Cargando AngaX">
      <div className="splash__card">
        <div className="splash__logo">AngaX</div>
        <div className="splash__subtitle">Conviértete en tu mejor versión</div>
        <div className="splash__barbell" aria-hidden="true">
          <span className="plate left" />
          <span className="bar" />
          <span className="plate right" />
        </div>
      </div>
    </div>
  )
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2.5 12s3.7-7 9.5-7 9.5 7 9.5 7-3.7 7-9.5 7S2.5 12 2.5 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 5l18 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 9.5C3.3 10.9 2.5 12 2.5 12s3.7 7 9.5 7c2.1 0 3.9-.6 5.4-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.7 7.3C10.4 7.1 11.2 7 12 7c5.8 0 9.5 5 9.5 5s-.7 1.4-2.3 3.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 10.3A3 3 0 0 0 12 15a2.9 2.9 0 0 0 1.7-.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}


function ProfilePage({ currentUser, userLoaded, ensureAuth, onProfileUpdate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [programs, setPrograms] = useState([])
  const [progress, setProgress] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', profile_photo: null })
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null)
  const [expandedRoutines, setExpandedRoutines] = useState({})
  const [expandedProgress, setExpandedProgress] = useState({})
  const [isFollowing, setIsFollowing] = useState(false)
  const [isMutual, setIsMutual] = useState(false)
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [activeProfileTab, setActiveProfileTab] = useState('rutinas')
  const [rutinasPage, setRutinasPage] = useState(1)
  const [progresoPage, setProgresoPage] = useState(1)
  const itemsPerPage = 5

  const fetchSuggestedUsers = async () => {
    try {
      const url = new URL(`${apiBaseUrl}/suggested-users`)
      if (currentUser?.email) {
        url.searchParams.append('current_user_email', currentUser.email)
      }
      url.searchParams.append('limit', '5')
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Error al cargar usuarios sugeridos')
      const data = await response.json()
      setSuggestedUsers(data)
    } catch (error) {
      console.error('Error al cargar usuarios sugeridos:', error)
    }
  }

  useEffect(() => {
    if (!userLoaded) return
    
    const urlParams = new URLSearchParams(location.search)
    const userEmail = urlParams.get('user')

    if (userEmail) {
      fetchProfile(userEmail)
    } else {
      if (!currentUser) {
        ensureAuth()
        navigate('/')
        return
      }
      fetchProfile(currentUser.email)
    }
    fetchSuggestedUsers()
  }, [currentUser, userLoaded, location.search])

  // Limpiar vista previa cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
      }
    }
  }, [previewPhotoUrl])

  const fetchProfile = async (email) => {
    if (!email) return
    setLoading(true)
    try {
      let url = `${apiBaseUrl}/profile?email=${encodeURIComponent(email)}`
      if (currentUser && currentUser.email !== email) {
        url += `&current_user_email=${encodeURIComponent(currentUser.email)}`
      }
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('No se pudo cargar el perfil.')
      }
      const data = await response.json()
      setProfile(data.user)
      setPrograms(data.programs || [])
      setIsFollowing(data.user.is_following || false)
      setIsMutual(data.user.is_mutual || false)
      setForm({
        name: data.user.name,
        bio: data.user.bio ?? '',
        profile_photo: null,
      })
      // Limpiar vista previa al cargar perfil
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
        setPreviewPhotoUrl(null)
      }
      setEditing(false)
      fetchProgress(email)
    } catch (error) {
      setStatus(error.message || 'Error al cargar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (email) => {
    if (!email) return
    try {
      console.log('Cargando progreso para:', email)
      const response = await fetch(`${apiBaseUrl}/progress?email=${encodeURIComponent(email)}`)
      console.log('Respuesta del servidor:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error al cargar progreso:', response.status, errorData)
        setProgress([])
        return
      }
      
      const data = await response.json()
      console.log('Progreso cargado:', data)
      console.log('Cantidad de completaciones:', data?.length || 0)
      
      if (Array.isArray(data)) {
        setProgress(data)
        if (data.length > 0) {
          console.log('Primera completación:', data[0])
        }
      } else {
        console.warn('Los datos no son un array:', data)
        setProgress([])
      }
    } catch (error) {
      console.error('Error al cargar progreso:', error)
      setProgress([])
    }
  }

  const handleFormChange = (event) => {
    const { name, value, files } = event.target
    if (name === 'profile_photo') {
      const file = files?.[0] ?? null
      // Limpiar la vista previa anterior si existe
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
      }
      // Crear nueva vista previa si hay archivo
      if (file) {
        const previewUrl = URL.createObjectURL(file)
        setPreviewPhotoUrl(previewUrl)
      } else {
        setPreviewPhotoUrl(null)
      }
      setForm((prev) => ({ ...prev, profile_photo: file }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (!currentUser) return
    setStatus('Guardando cambios…')
    try {
      const formData = new FormData()
      formData.append('user_email', currentUser.email)
      formData.append('name', form.name.trim())
      formData.append('bio', form.bio ?? '')
      if (form.profile_photo) {
        formData.append('profile_photo', form.profile_photo)
      }
      const response = await fetch(`${apiBaseUrl}/profile`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo actualizar el perfil.')
      }
      setProfile((prev) => ({
        ...prev,
        name: data.name,
        bio: data.bio,
        profile_photo_url: data.profile_photo_url,
      }))
      onProfileUpdate({
        ...currentUser,
        name: data.name,
        photo: data.profile_photo_url || null,
      })
      // Limpiar vista previa después de guardar
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
        setPreviewPhotoUrl(null)
      }
      setForm((prev) => ({ ...prev, profile_photo: null }))
      setStatus('Perfil actualizado ✅')
      setEditing(false)
      setTimeout(() => setStatus(''), 2500)
    } catch (error) {
      setStatus(error.message || 'Error al guardar.')
    }
  }

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return
    
    try {
      const response = await fetch(`${apiBaseUrl}/follow/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_email: currentUser.email,
          following_email: profile.email,
        }),
      })
      
      if (!response.ok) {
        throw new Error('No se pudo actualizar el seguimiento.')
      }
      
      const data = await response.json()
      setIsFollowing(data.is_following)
      setIsMutual(data.is_mutual)
      if (profile) {
        setProfile(prev => ({
          ...prev,
          followers_count: data.followers_count,
          following_count: data.following_count,
        }))
      }
    } catch (error) {
      setStatus(error.message || 'Error al actualizar seguimiento.')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  // Verificar si es el perfil del usuario actual
  const urlParams = new URLSearchParams(location.search)
  const userEmail = urlParams.get('user')
  const isOwnProfile = !userEmail || (currentUser && currentUser.email === (userEmail || profile?.email))

  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-card"><p>Cargando perfil…</p></div>
      </section>
    )
  }

  if (!profile) {
    return (
      <section className="profile-page">
        <div className="profile-card"><p>Perfil no encontrado.</p></div>
      </section>
    )
  }

  const avatarLetter = profile?.name?.charAt(0).toUpperCase() ?? 'A'
  // Usar vista previa si existe, sino la foto del perfil
  const avatarPhotoUrl = previewPhotoUrl || profile?.profile_photo_url
  const avatarStyle = getAvatarStyle(avatarPhotoUrl)
  const username = profile?.email ? profile.email.split('@')[0] : ''

  return (
    <section className="profile-page">
      <div className="profile-hero" />
      <div className="profile-container">
        <aside className="profile__sidebar">
          <div className="suggested-users">
            <h3>Usuarios sugeridos</h3>
            {suggestedUsers.length === 0 ? (
              <p className="community__hint">No hay usuarios sugeridos disponibles.</p>
            ) : (
              <ul className="suggested-users__list">
                {suggestedUsers.map((user) => {
                  const username = user.email ? user.email.split('@')[0] : user.name
                  const avatarStyle = getAvatarStyle(user.profile_photo_url)
                  const avatarLetter = user.name?.charAt(0).toUpperCase() ?? 'A'
                  return (
                    <li key={user.id} className="suggested-user">
                      <div
                        className="suggested-user__avatar"
                        style={avatarStyle}
                        onClick={() => navigate(`/perfil?user=${user.email}`)}
                      >
                        {!user.profile_photo_url && avatarLetter}
                      </div>
                      <div className="suggested-user__info">
                        <strong
                          onClick={() => navigate(`/perfil?user=${user.email}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          {username}
                        </strong>
                        {user.bio && <p>{user.bio.length > 30 ? user.bio.substring(0, 30) + '...' : user.bio}</p>}
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/perfil?user=${user.email}`)}
                      >
                        Ver
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>
        <div className="profile-shell">
          <div className="profile__main">
        <div className="profile-summary">
          <div className="profile-avatar-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <div className="profile-avatar large" style={avatarStyle}>
              {!avatarPhotoUrl && avatarLetter}
            </div>
            {editing && isOwnProfile && (
              <>
                <input
                  type="file"
                  id="profile-photo-input"
                  name="profile_photo"
                  accept="image/*"
                  onChange={handleFormChange}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="profile-photo-input"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#fbbf24',
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f59e0b'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fbbf24'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </label>
              </>
            )}
          </div>
          <div className="profile-summary__details">
            <div className="profile-summary__top">
              <h2>{username || profile?.name}</h2>
              {isOwnProfile && currentUser ? (
                <div className="profile-summary__actions">
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => {
                      // Limpiar vista previa al iniciar edición
                      if (previewPhotoUrl) {
                        URL.revokeObjectURL(previewPhotoUrl)
                        setPreviewPhotoUrl(null)
                      }
                      setForm({
                        name: profile?.name ?? '',
                        bio: profile?.bio ?? '',
                        profile_photo: null,
                      })
                      setEditing(true)
                    }}
                  >
                    Editar perfil
                  </button>
                  <button className="btn btn-outline" type="button">
                    Ver archivo
                  </button>
                </div>
              ) : currentUser && profile ? (
                <div className="profile-summary__actions">
                  <button
                    className={isFollowing ? "btn btn-outline" : "btn btn-primary"}
                    type="button"
                    onClick={handleFollowToggle}
                  >
                    {isMutual ? 'Seguir también' : isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>
              ) : null}
            </div>
            <ul className="profile-summary__stats">
              <li>
                <strong>{programs.length}</strong>
                <span>Rutinas</span>
              </li>
              <li>
                <strong>{profile?.followers_count || 0}</strong>
                <span>Seguidores</span>
              </li>
              <li>
                <strong>{profile?.following_count || 0}</strong>
                <span>Seguidos</span>
              </li>
            </ul>
            <div className="profile-summary__bio">
              <p className="profile-summary__name">{profile?.name}</p>
              <p className="profile-summary__email">{profile?.email}</p>
              {profile?.bio && <p>{profile.bio}</p>}
            </div>
          </div>
        </div>

        {editing ? (
          <div className="profile-card edit-mode">
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <label>
                Nombre completo
                <input type="text" name="name" value={form.name} onChange={handleFormChange} required />
              </label>
              <label>
                Bio / Descripción
                <textarea
                  name="bio"
                  rows="3"
                  value={form.bio}
                  onChange={handleFormChange}
                  placeholder="Cuenta algo sobre ti..."
                />
              </label>
              <div className="profile-form__actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    // Limpiar vista previa al cancelar
                    if (previewPhotoUrl) {
                      URL.revokeObjectURL(previewPhotoUrl)
                      setPreviewPhotoUrl(null)
                    }
                    // Restaurar valores originales del perfil
                    setForm({
                      name: profile?.name ?? '',
                      bio: profile?.bio ?? '',
                      profile_photo: null,
                    })
                    setEditing(false)
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </div>
              {status && <p className="profile-status">{replaceEmojisWithIcons(status)}</p>}
            </form>
          </div>
        ) : (
          <>
            <div className="profile-tabs">
              <button
                type="button"
                className={`profile-tab ${activeProfileTab === 'rutinas' ? 'active' : ''}`}
                onClick={() => {
                  setActiveProfileTab('rutinas')
                  setRutinasPage(1)
                }}
              >
                Rutinas guardadas
              </button>
              <button
                type="button"
                className={`profile-tab ${activeProfileTab === 'progreso' ? 'active' : ''}`}
                onClick={() => {
                  setActiveProfileTab('progreso')
                  setProgresoPage(1)
                }}
              >
                Progreso
              </button>
            </div>

            {activeProfileTab === 'rutinas' && (
              <div className="profile-gallery">
                {programs.length === 0 ? (
                  <div className="profile-gallery__empty">
                    <p>No has creado rutinas aún.</p>
                  </div>
                ) : (
                  <>
                    <div className="profile-gallery__grid">
                      {programs
                        .slice((rutinasPage - 1) * itemsPerPage, rutinasPage * itemsPerPage)
                        .map((routine) => {
                      const isExpanded = expandedRoutines[routine.id]
                      return (
                        <article key={routine.id} className="profile-gallery__card">
                          <div
                            className="profile-routine__header"
                            onClick={() =>
                              setExpandedRoutines((prev) => ({
                                ...prev,
                                [routine.id]: !prev[routine.id],
                              }))
                            }
                          >
                            <div className="profile-routine__info">
                              <strong>{routine.title}</strong>
                              <small>{routine.exercises_count || 0} ejercicios</small>
                              <p>{routine.goal || 'Sin objetivo definido.'}</p>
                            </div>
                            <button
                              type="button"
                              className={`profile-routine__toggle ${isExpanded ? 'expanded' : ''}`}
                              aria-label={isExpanded ? 'Ocultar ejercicios' : 'Ver ejercicios'}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 7.5L10 12.5L15 7.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          {isExpanded && routine.exercises && routine.exercises.length > 0 && (
                            <div className="profile-routine__exercises">
                              {routine.exercises.map((exercise, idx) => (
                                <div key={idx} className="profile-routine__exercise">
                                  <div className="profile-routine__exercise-image-wrapper">
                                    <img
                                      src={exercise.imagePath}
                                      alt={exercise.name}
                                      onError={(e) => {
                                        // Si la imagen falla, intentar variaciones del nombre
                                        const basePath = `/ejercicios/${exercise.muscleGroup}/`
                                        const variations = [
                                          `${exercise.name}.gif`,
                                          exercise.name.replace(/\s+/g, '_') + '.gif',
                                          exercise.name.replace(/\s+/g, '-') + '.gif',
                                        ]
                                        const currentSrc = e.target.src.replace(window.location.origin, '')
                                        const currentVariation = variations.findIndex(
                                          (v) => currentSrc === basePath + v
                                        )
                                        if (currentVariation < variations.length - 1) {
                                          e.target.src = basePath + variations[currentVariation + 1]
                                        } else {
                                          e.target.style.display = 'none'
                                          e.target.parentElement.innerHTML = `
                                            <div class="profile-routine__exercise-placeholder">
                                              <span>${exercise.name.charAt(0)}</span>
                                            </div>
                                          `
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="profile-routine__exercise-info">
                                    <strong>{exercise.name}</strong>
                                    <div className="profile-routine__exercise-params">
                                      <span>{exercise.sets} series</span>
                                      <span>{exercise.reps} reps</span>
                                      {exercise.weight && <span>{exercise.weight} kg</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      )
                    })}
                    </div>
                    {programs.length > itemsPerPage && (
                      <div className="profile-pagination">
                        <button
                          type="button"
                          className="profile-pagination__btn"
                          onClick={() => setRutinasPage(prev => Math.max(1, prev - 1))}
                          disabled={rutinasPage === 1}
                        >
                          Anterior
                        </button>
                        <span className="profile-pagination__info">
                          Página {rutinasPage} de {Math.ceil(programs.length / itemsPerPage)}
                        </span>
                        <button
                          type="button"
                          className="profile-pagination__btn"
                          onClick={() => setRutinasPage(prev => Math.min(Math.ceil(programs.length / itemsPerPage), prev + 1))}
                          disabled={rutinasPage >= Math.ceil(programs.length / itemsPerPage)}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeProfileTab === 'progreso' && (
              <div className="profile-gallery">
                {progress.length === 0 ? (
                  <div className="profile-gallery__empty">
                    <p>{isOwnProfile ? 'No has completado rutinas aún.' : 'Este usuario no ha completado rutinas aún.'}</p>
                    {isOwnProfile && (
                      <p style={{ fontSize: '0.85rem', color: '#A8A8A8', marginTop: '8px' }}>
                        Completa una rutina desde la página de Rutinas para ver tu progreso aquí.
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="profile-gallery__grid">
                      {progress
                        .slice((progresoPage - 1) * itemsPerPage, progresoPage * itemsPerPage)
                        .map((completion) => {
                      const isExpanded = expandedProgress[completion.id]
                      const getExerciseImagePath = (exerciseName, muscleGroup) => {
                        return `/ejercicios/${muscleGroup}/${exerciseName}.gif`
                      }
                      let completedDate = 'Fecha no disponible'
                      try {
                        if (completion.completed_at) {
                          const date = new Date(completion.completed_at)
                          if (!isNaN(date.getTime())) {
                            completedDate = date.toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          }
                        }
                      } catch (e) {
                        console.error('Error al formatear fecha:', e)
                      }
                      return (
                        <article key={completion.id} className="profile-gallery__card">
                          <div
                            className="profile-routine__header"
                            onClick={() =>
                              setExpandedProgress((prev) => ({
                                ...prev,
                                [completion.id]: !prev[completion.id],
                              }))
                            }
                          >
                            <div className="profile-routine__info">
                              <strong>{completion.routineName}</strong>
                              <small>{completedDate}</small>
                              <p>{completion.goal || 'Sin objetivo definido.'}</p>
                            </div>
                            <button
                              type="button"
                              className={`profile-routine__toggle ${isExpanded ? 'expanded' : ''}`}
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                  d="M5 7.5L10 12.5L15 7.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          {isExpanded && completion.exercises && completion.exercises.length > 0 && (
                            <div className="profile-routine__exercises">
                              {completion.exercises.map((exercise, idx) => (
                                <div key={idx} className="profile-routine__exercise">
                                  <div className="profile-routine__exercise-image-wrapper">
                                    <img
                                      src={exercise.imagePath}
                                      alt={exercise.name}
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.parentElement.innerHTML = `
                                          <div class="profile-routine__exercise-placeholder">
                                            <span>${exercise.name.charAt(0)}</span>
                                          </div>
                                        `
                                      }}
                                    />
                                  </div>
                                  <div className="profile-routine__exercise-info">
                                    <strong>{exercise.name}</strong>
                                    <div className="profile-routine__exercise-params">
                                      <span>{exercise.sets} series</span>
                                      <span>{exercise.reps} reps</span>
                                      {exercise.weight && <span>{exercise.weight} kg</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      )
                    })}
                    </div>
                    {progress.length > itemsPerPage && (
                      <div className="profile-pagination">
                        <button
                          type="button"
                          className="profile-pagination__btn"
                          onClick={() => setProgresoPage(prev => Math.max(1, prev - 1))}
                          disabled={progresoPage === 1}
                        >
                          Anterior
                        </button>
                        <span className="profile-pagination__info">
                          Página {progresoPage} de {Math.ceil(progress.length / itemsPerPage)}
                        </span>
                        <button
                          type="button"
                          className="profile-pagination__btn"
                          onClick={() => setProgresoPage(prev => Math.min(Math.ceil(progress.length / itemsPerPage), prev + 1))}
                          disabled={progresoPage >= Math.ceil(progress.length / itemsPerPage)}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
          </div>
        </div>
      </div>
    </section>
  )
}

function TrainersPage({ currentUser, userLoaded, ensureAuth }) {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [availableTrainers, setAvailableTrainers] = useState([])
  const [myTrainer, setMyTrainer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showCreateRoutine, setShowCreateRoutine] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [studentProgress, setStudentProgress] = useState([])
  const [selectedExercise, setSelectedExercise] = useState('')
  const [metric, setMetric] = useState('weight')
  const [showTrainerRoutinesModal, setShowTrainerRoutinesModal] = useState(false)
  const [trainerRoutines, setTrainerRoutines] = useState([])
  const [loadingTrainerRoutines, setLoadingTrainerRoutines] = useState(false)
  const [showStudentRoutinesModal, setShowStudentRoutinesModal] = useState(false)
  const [studentRoutines, setStudentRoutines] = useState([])
  const [loadingStudentRoutines, setLoadingStudentRoutines] = useState(false)
  const [pendingDeleteClient, setPendingDeleteClient] = useState(null)

  useEffect(() => {
    if (!userLoaded) return
    if (!currentUser) {
      ensureAuth()
      return
    }
    if (currentUser.role === 'trainer') {
      fetchClients()
    } else {
      fetchAvailableTrainers()
      fetchMyTrainer()
    }
  }, [currentUser, userLoaded])

  const fetchClients = async () => {
    if (!currentUser?.email) return
    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/clients?trainer_email=${encodeURIComponent(currentUser.email)}`)
      if (!response.ok) throw new Error('Error al cargar clientes')
      const data = await response.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      setStatus('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTrainers = async () => {
    if (!currentUser?.email) return
    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/available-trainers?user_email=${encodeURIComponent(currentUser.email)}`)
      if (!response.ok) throw new Error('Error al cargar entrenadores')
      const data = await response.json()
      setAvailableTrainers(data.trainers || [])
    } catch (error) {
      console.error('Error al cargar entrenadores:', error)
      setStatus('Error al cargar entrenadores')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyTrainer = async () => {
    if (!currentUser?.email) return
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/my-trainer?user_email=${encodeURIComponent(currentUser.email)}`)
      if (!response.ok) throw new Error('Error al cargar entrenador')
      const data = await response.json()
      setMyTrainer(data.trainer)
    } catch (error) {
      console.error('Error al cargar entrenador:', error)
    }
  }

  const handleJoinTrainer = async (trainerEmail) => {
    if (!currentUser?.email) return
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          trainer_email: trainerEmail,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error al unirse al entrenador')
      setStatus('Te has unido exitosamente al entrenador')
      setTimeout(() => setStatus(''), 3000)
      fetchAvailableTrainers()
      fetchMyTrainer()
    } catch (error) {
      setStatus(error.message || 'Error al unirse al entrenador')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const handleLeaveTrainer = async () => {
    if (!currentUser?.email) return
    if (!confirm('¿Seguro que deseas abandonar a tu entrenador?')) return
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error al abandonar entrenador')
      setStatus('Has abandonado al entrenador exitosamente')
      setTimeout(() => setStatus(''), 3000)
      fetchAvailableTrainers()
      fetchMyTrainer()
    } catch (error) {
      setStatus(error.message || 'Error al abandonar entrenador')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const handleRemoveClient = (clientEmail) => {
    setPendingDeleteClient(clientEmail)
  }

  const handleCloseDeleteClientModal = () => {
    setPendingDeleteClient(null)
  }

  const confirmDeleteClient = async () => {
    if (!currentUser?.email || !pendingDeleteClient) return
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/remove-client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer_email: currentUser.email,
          client_email: pendingDeleteClient,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error al eliminar estudiante')
      setStatus('Estudiante eliminado exitosamente')
      setTimeout(() => setStatus(''), 3000)
      fetchClients()
      if (selectedClient?.email === pendingDeleteClient) {
        setSelectedClient(null)
        setShowCreateRoutine(false)
        setShowProgress(false)
      }
      setPendingDeleteClient(null)
    } catch (error) {
      setStatus(error.message || 'Error al eliminar estudiante')
      setTimeout(() => setStatus(''), 3000)
      setPendingDeleteClient(null)
    }
  }

  const fetchStudentProgress = async (studentEmail) => {
    if (!currentUser?.email) return
    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/student-progress?trainer_email=${encodeURIComponent(currentUser.email)}&student_email=${encodeURIComponent(studentEmail)}`)
      if (!response.ok) throw new Error('Error al cargar progreso')
      const data = await response.json()
      const progressData = data.progress || []
      setStudentProgress(progressData)
      
      // Obtener todos los ejercicios únicos y seleccionar el primero si no hay selección
      const allExercises = []
      progressData.forEach((session) => {
        (session.exercises || []).forEach((ex) => {
          if (!allExercises.includes(ex.name)) {
            allExercises.push(ex.name)
          }
        })
      })
      if (allExercises.length > 0 && !selectedExercise) {
        setSelectedExercise(allExercises[0])
      }
      
      setShowProgress(true)
    } catch (error) {
      console.error('Error al cargar progreso:', error)
      setStatus('Error al cargar progreso')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrainerRoutines = async () => {
    if (!currentUser?.email) return
    setLoadingTrainerRoutines(true)
    try {
      const response = await fetch(`${apiBaseUrl}/trainer/my-routines?user_email=${encodeURIComponent(currentUser.email)}`)
      if (!response.ok) throw new Error('Error al cargar rutinas del entrenador')
      const data = await response.json()
      setTrainerRoutines(data.routines || [])
      setShowTrainerRoutinesModal(true)
    } catch (error) {
      console.error('Error al cargar rutinas del entrenador:', error)
      setStatus('Error al cargar rutinas del entrenador')
    } finally {
      setLoadingTrainerRoutines(false)
    }
  }

  const fetchStudentRoutines = async (studentEmail) => {
    if (!currentUser?.email) return
    setLoadingStudentRoutines(true)
    try {
      const response = await fetch(`${apiBaseUrl}/routines?user_email=${encodeURIComponent(studentEmail)}`)
      if (!response.ok) throw new Error('Error al cargar rutinas del estudiante')
      const data = await response.json()
      setStudentRoutines(data || [])
      setShowStudentRoutinesModal(true)
    } catch (error) {
      console.error('Error al cargar rutinas del estudiante:', error)
      setStatus('Error al cargar rutinas del estudiante')
    } finally {
      setLoadingStudentRoutines(false)
    }
  }


  if (!currentUser) {
    return (
      <section className="section section-white programs-hub-full">
        <div className="programs-hub-full__container">
          <div className="programs-hub-full__header">
            <div className="programs-hub-full__header-content">
              <h2>Entrenadores</h2>
              <p>Inicia sesión para acceder a esta sección</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Vista para usuarios normales
  if (currentUser.role !== 'trainer') {
    const trainerRoutinesPortal = showTrainerRoutinesModal && myTrainer ? createPortal(
      <div className="auth-modal open" role="dialog" aria-modal="true" aria-label="Rutinas de mi entrenador">
        <div className="auth-modal__backdrop" />
        <div className="auth-modal__content" style={{ width: 'min(900px, 92%)' }}>
          <button
            type="button"
            className="auth-modal__close"
            onClick={() => setShowTrainerRoutinesModal(false)}
            aria-label="Cerrar modal"
          >
            ×
          </button>
          <div className="auth-modal__header">
            <h2 style={{ color: '#fbbf24', marginBottom: '8px' }}>Rutinas preparadas por mi entrenador</h2>
            <p style={{ color: '#a3a3a3', margin: 0 }}>
              <strong style={{ color: '#fbbf24' }}>{myTrainer.name}</strong> ha preparado estas rutinas para ti
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            {loadingTrainerRoutines ? (
              <p style={{ textAlign: 'center', color: '#a3a3a3', padding: '40px' }}>Cargando rutinas...</p>
            ) : trainerRoutines.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                <p style={{ color: '#a3a3a3' }}>Tu entrenador aún no ha creado rutinas para ti.</p>
              </div>
            ) : (
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px', 
                  maxHeight: '60vh', 
                  overflowY: 'auto', 
                  paddingRight: '8px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4a5568 #1a202c'
                }}
                className="trainer-routines-scroll"
              >
                <style>{`
                  .trainer-routines-scroll::-webkit-scrollbar {
                    width: 8px;
                  }
                  .trainer-routines-scroll::-webkit-scrollbar-track {
                    background: #1a202c;
                    border-radius: 4px;
                  }
                  .trainer-routines-scroll::-webkit-scrollbar-thumb {
                    background: #4a5568;
                    border-radius: 4px;
                  }
                  .trainer-routines-scroll::-webkit-scrollbar-thumb:hover {
                    background: #718096;
                  }
                `}</style>
                {trainerRoutines.map((routine) => (
                  <div
                    key={routine.routineID}
                    style={{
                      padding: '20px',
                      background: '#1a1a1a',
                      borderRadius: '12px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ color: '#fbbf24', margin: '0 0 4px 0', fontSize: '20px' }}>{routine.routineName}</h3>
                        {routine.goal && <p style={{ color: '#a3a3a3', margin: '4px 0', fontSize: '14px' }}>{routine.goal}</p>}
                        <small style={{ color: '#a3a3a3', fontSize: '12px' }}>
                          Creada: {new Date(routine.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        background: 'rgba(251, 191, 36, 0.2)',
                        color: '#fbbf24',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {routine.exercises_count} ejercicios
                      </span>
                    </div>

                    {routine.exercises && routine.exercises.length > 0 && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        <h4 style={{ color: '#fbbf24', margin: '0 0 12px 0', fontSize: '14px' }}>Ejercicios:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {routine.exercises.map((exercise, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '12px',
                                background: '#000000',
                                borderRadius: '8px',
                                border: '1px solid rgba(251, 191, 36, 0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div>
                                <strong style={{ color: '#fbbf24', display: 'block', fontSize: '14px' }}>{exercise.exerciseName}</strong>
                                <small style={{ color: '#a3a3a3', fontSize: '12px', textTransform: 'capitalize' }}>{exercise.muscleGroup}</small>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {exercise.sets && (
                                  <span style={{
                                    padding: '4px 8px',
                                    background: 'rgba(251, 191, 36, 0.2)',
                                    color: '#fbbf24',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}>
                                    {exercise.sets} series
                                  </span>
                                )}
                                {exercise.reps && (
                                  <span style={{
                                    padding: '4px 8px',
                                    background: 'rgba(251, 191, 36, 0.2)',
                                    color: '#fbbf24',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}>
                                    {exercise.reps} reps
                                  </span>
                                )}
                                {exercise.weight && (
                                  <span style={{
                                    padding: '4px 8px',
                                    background: 'rgba(251, 191, 36, 0.2)',
                                    color: '#fbbf24',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}>
                                    {exercise.weight} kg
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          openTraining(routine)
                          setShowTrainerRoutinesModal(false)
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 24px',
                          background: '#fbbf24',
                          color: '#000000',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f59e0b'
                          e.target.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fbbf24'
                          e.target.style.transform = 'translateY(0)'
                        }}
                      >
                        Iniciar entrenamiento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    ) : null

    return (
      <>
        <section className="section section-white programs-hub-full">
          <div className="programs-hub-full__container">
            <div className="programs-hub-full__header">
              <div className="programs-hub-full__header-content">
                <h2>Entrenadores Disponibles</h2>
                <p>Encuentra un entrenador y únete para recibir rutinas personalizadas (máximo 5 estudiantes por entrenador)</p>
              </div>
            </div>

            {status && (
              <div style={{ padding: '12px', marginBottom: '16px', background: status.includes('Error') ? '#ff4444' : '#4caf50', color: '#fff', borderRadius: '8px', textAlign: 'center' }}>
                {status}
              </div>
            )}

            {myTrainer ? (
              <div className="programs-hub-full__content">
                <div style={{ padding: '20px', marginBottom: '24px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fbbf24', margin: '0 0 8px 0' }}>Mi Entrenador</h3>
                    <p style={{ color: '#a3a3a3', margin: '0 0 4px 0' }}><strong style={{ color: '#fbbf24' }}>{myTrainer.name}</strong></p>
                    <p style={{ color: '#a3a3a3', margin: 0, fontSize: '14px' }}>{myTrainer.email}</p>
                    {myTrainer.bio && <p style={{ color: '#a3a3a3', margin: '8px 0 0 0', fontSize: '14px' }}>{myTrainer.bio}</p>}
                    <button
                      type="button"
                      onClick={fetchTrainerRoutines}
                      style={{
                        color: '#fbbf24',
                        margin: '16px 0 0 0',
                        fontSize: '16px',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        fontFamily: 'inherit',
                        fontWeight: '600'
                      }}
                    >
                      Ver rutinas preparadas por mi entrenador →
                    </button>
                  </div>
                  <button
                    className="btn btn-outline"
                    onClick={handleLeaveTrainer}
                  >
                    Abandonar
                  </button>
                </div>
              </div>
              </div>
            ) : (
              <div className="programs-hub-full__content">
              {loading ? (
                <p style={{ textAlign: 'center', color: '#a3a3a3' }}>Cargando entrenadores...</p>
              ) : availableTrainers.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  <p style={{ color: '#a3a3a3' }}>No hay entrenadores disponibles en este momento.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {availableTrainers.map((trainer) => (
                  <div
                    key={trainer.email}
                    style={{
                      padding: '20px',
                      background: '#1a1a1a',
                      borderRadius: '12px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {trainer.photo ? (
                        <img src={trainer.photo} alt={trainer.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                          {trainer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: '#fbbf24', display: 'block', fontSize: '16px' }}>{trainer.name}</strong>
                        <small style={{ color: '#a3a3a3', fontSize: '12px' }}>{trainer.email}</small>
                      </div>
                    </div>
                    {trainer.bio && <p style={{ color: '#a3a3a3', fontSize: '14px', margin: 0 }}>{trainer.bio}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <small style={{ color: '#a3a3a3' }}>{trainer.studentsCount}/5 estudiantes</small>
                      <button
                        className={`btn ${trainer.isJoined ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => {
                          if (trainer.isJoined) {
                            handleLeaveTrainer()
                          } else {
                            handleJoinTrainer(trainer.email)
                          }
                        }}
                        disabled={trainer.isJoined && myTrainer?.email !== trainer.email}
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        {trainer.isJoined ? (myTrainer?.email === trainer.email ? 'Mi entrenador' : 'No disponible') : 'Unirse'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
              </div>
            )}
          </div>
      </section>

      {trainerRoutinesPortal}
      </>
    )
  }

  return (
    <section className="section section-white programs-hub-full">
      <div className="programs-hub-full__container">
        <div className="programs-hub-full__header">
          <div className="programs-hub-full__header-content">
            <h2>Gestiona tus estudiantes</h2>
            <p>Administra tus estudiantes, crea rutinas personalizadas y revisa su progreso (máximo 5 estudiantes)</p>
          </div>
        </div>

        {status && (
          <div style={{ padding: '12px', marginBottom: '16px', background: status.includes('Error') ? '#ff4444' : '#4caf50', color: '#fff', borderRadius: '8px', textAlign: 'center' }}>
            {status}
          </div>
        )}

        <div className="programs-hub-full__content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ color: '#fbbf24', marginBottom: '16px', fontSize: '24px' }}>Mis estudiantes ({clients.length}/5)</h3>
              {loading ? (
                <p>Cargando...</p>
              ) : clients.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  <p style={{ color: '#a3a3a3' }}>No tienes estudiantes asignados aún.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {clients.map((client) => (
                    <div
                      key={client.email}
                      style={{
                        padding: '16px',
                        background: selectedClient?.email === client.email ? '#2a2a2a' : '#1a1a1a',
                        borderRadius: '8px',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => {
                        setSelectedClient(client)
                        setShowCreateRoutine(false)
                        setShowProgress(false)
                        setSelectedExercise('') // Reset exercise selection when changing client
                        setMetric('weight') // Reset metric to weight
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>{client.name}</strong>
                          <small style={{ color: '#a3a3a3' }}>{client.email}</small>
                        </div>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveClient(client.email)
                          }}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {status && (
            <div style={{ padding: '12px', marginBottom: '16px', background: status.includes('Error') ? '#ff4444' : '#4caf50', color: '#fff', borderRadius: '8px', textAlign: 'center' }}>
              {status}
            </div>
          )}

          {selectedClient && (
            <div style={{ marginTop: '32px', padding: '24px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#fbbf24', margin: 0 }}>Estudiante: {selectedClient.name}</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setShowProgress(!showProgress)
                      setShowCreateRoutine(false)
                      if (!showProgress) {
                        fetchStudentProgress(selectedClient.email)
                      }
                    }}
                  >
                    {showProgress ? 'Ocultar' : 'Ver'} progreso
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      fetchStudentRoutines(selectedClient.email)
                    }}
                  >
                    Ver rutinas
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowCreateRoutine(!showCreateRoutine)
                      setShowProgress(false)
                    }}
                  >
                    {showCreateRoutine ? 'Cancelar' : 'Crear rutina'}
                  </button>
                </div>
              </div>
              
              {showProgress && (() => {
                // Obtener todos los ejercicios únicos
                const allExercises = []
                studentProgress.forEach((session) => {
                  (session.exercises || []).forEach((ex) => {
                    if (!allExercises.includes(ex.name)) {
                      allExercises.push(ex.name)
                    }
                  })
                })
                allExercises.sort((a, b) => a.localeCompare(b))

                // Procesar datos para el gráfico (similar a ProgressPage)
                const series = (studentProgress || [])
                  .slice()
                  .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at))
                  .map((session) => {
                    const matches = (session.exercises || []).filter((e) => e.name === selectedExercise)
                    if (!matches.length) return null

                    const weights = matches
                      .map((m) => (m.weight == null ? null : Number(m.weight)))
                      .filter((v) => typeof v === 'number' && !Number.isNaN(v))
                    const repsArr = matches
                      .map((m) => (m.reps == null ? null : Number(m.reps)))
                      .filter((v) => typeof v === 'number' && !Number.isNaN(v))
                    const vols = matches
                      .map((m) => {
                        const w = m.weight == null ? null : Number(m.weight)
                        const r = m.reps == null ? null : Number(m.reps)
                        const s = m.sets == null ? null : Number(m.sets)
                        if ([w, r, s].some((x) => typeof x !== 'number' || Number.isNaN(x))) return null
                        return w * r * s
                      })
                      .filter((v) => typeof v === 'number' && !Number.isNaN(v))

                    const weight = weights.length ? Math.max(...weights) : null
                    const reps = repsArr.length ? Math.max(...repsArr) : null
                    const volume = vols.length ? Math.max(...vols) : null
                    return {
                      date: session.completed_at,
                      weight,
                      reps,
                      volume,
                    }
                  })
                  .filter(Boolean)

                const metricMeta = {
                  weight: {
                    label: 'Peso (máximo por sesión)',
                    unit: 'kg',
                    description: 'Muestra el peso máximo registrado para este ejercicio en cada sesión.',
                  },
                  reps: {
                    label: 'Reps (máximo por sesión)',
                    unit: 'reps',
                    description: 'Muestra la mayor cantidad de repeticiones registradas para este ejercicio en cada sesión.',
                  },
                  volume: {
                    label: 'Volumen (máximo por sesión)',
                    unit: 'kg',
                    description: 'Muestra el volumen máximo: peso × reps × series para este ejercicio en cada sesión.',
                  },
                }

                const activeMeta = metricMeta[metric] ?? metricMeta.weight
                const metricValues = (series || [])
                  .map((p) => p?.[metric])
                  .filter((v) => typeof v === 'number' && !Number.isNaN(v))
                const metricStats =
                  metricValues.length >= 2
                    ? {
                        last: metricValues[metricValues.length - 1],
                        min: Math.min(...metricValues),
                        max: Math.max(...metricValues),
                        count: metricValues.length,
                      }
                    : null

                return (
                  <div style={{ marginTop: '20px', padding: '20px', background: '#000000', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <h4 style={{ color: '#fbbf24', marginBottom: '20px' }}>Progreso de {selectedClient.name}</h4>
                    {loading ? (
                      <p style={{ color: '#a3a3a3' }}>Cargando progreso...</p>
                    ) : studentProgress.length === 0 ? (
                      <p style={{ color: '#a3a3a3' }}>Este estudiante aún no ha completado ninguna rutina.</p>
                    ) : allExercises.length === 0 ? (
                      <p style={{ color: '#a3a3a3' }}>No hay ejercicios disponibles para mostrar.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Controles del gráfico */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                              value={selectedExercise}
                              onChange={(e) => setSelectedExercise(e.target.value)}
                              style={{
                                padding: '8px 12px',
                                background: '#1a1a1a',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                borderRadius: '8px',
                                color: '#fbbf24',
                                fontSize: '14px',
                                fontFamily: 'Roboto, sans-serif',
                                cursor: 'pointer',
                              }}
                            >
                              {allExercises.map((name) => (
                                <option key={name} value={name} style={{ background: '#1a1a1a', color: '#fbbf24' }}>
                                  {name}
                                </option>
                              ))}
                            </select>
                            
                            {/* Tabs de métrica */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => setMetric('weight')}
                                style={{
                                  padding: '8px 16px',
                                  background: metric === 'weight' ? '#fbbf24' : 'transparent',
                                  color: metric === 'weight' ? '#000' : '#fbbf24',
                                  border: '1px solid rgba(251, 191, 36, 0.3)',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontFamily: 'Roboto, sans-serif',
                                  cursor: 'pointer',
                                  fontWeight: metric === 'weight' ? '600' : '400',
                                }}
                              >
                                Peso
                              </button>
                              <button
                                type="button"
                                onClick={() => setMetric('reps')}
                                style={{
                                  padding: '8px 16px',
                                  background: metric === 'reps' ? '#fbbf24' : 'transparent',
                                  color: metric === 'reps' ? '#000' : '#fbbf24',
                                  border: '1px solid rgba(251, 191, 36, 0.3)',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontFamily: 'Roboto, sans-serif',
                                  cursor: 'pointer',
                                  fontWeight: metric === 'reps' ? '600' : '400',
                                }}
                              >
                                Reps
                              </button>
                              <button
                                type="button"
                                onClick={() => setMetric('volume')}
                                style={{
                                  padding: '8px 16px',
                                  background: metric === 'volume' ? '#fbbf24' : 'transparent',
                                  color: metric === 'volume' ? '#000' : '#fbbf24',
                                  border: '1px solid rgba(251, 191, 36, 0.3)',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontFamily: 'Roboto, sans-serif',
                                  cursor: 'pointer',
                                  fontWeight: metric === 'volume' ? '600' : '400',
                                }}
                              >
                                Volumen
                              </button>
                            </div>
                          </div>

                          {/* Estadísticas */}
                          {metricStats && (
                            <div style={{
                              display: 'flex',
                              gap: '16px',
                              flexWrap: 'wrap',
                              padding: '12px',
                              background: '#1a1a1a',
                              borderRadius: '8px',
                              border: '1px solid rgba(251, 191, 36, 0.2)',
                              fontSize: '12px',
                              color: '#a3a3a3',
                            }}>
                              <span>
                                Último: <strong style={{ color: '#fbbf24' }}>{Number(metricStats.last).toFixed(metric === 'weight' ? 1 : 0)}</strong> {activeMeta.unit}
                              </span>
                              <span>
                                Mín: <strong style={{ color: '#fbbf24' }}>{Number(metricStats.min).toFixed(metric === 'weight' ? 1 : 0)}</strong>
                              </span>
                              <span>
                                Máx: <strong style={{ color: '#fbbf24' }}>{Number(metricStats.max).toFixed(metric === 'weight' ? 1 : 0)}</strong>
                              </span>
                              <span>
                                Puntos: <strong style={{ color: '#fbbf24' }}>{metricStats.count}</strong>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Gráfico */}
                        {series.length >= 2 ? (
                          <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                            <MiniLineChart points={series} valueKey={metric} meta={activeMeta} />
                          </div>
                        ) : (
                          <p style={{ color: '#a3a3a3', textAlign: 'center', padding: '40px' }}>
                            Necesitas al menos 2 entrenamientos con este ejercicio para ver la gráfica.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}

              {showCreateRoutine && (
                <div style={{ marginTop: '20px', padding: '20px', background: '#000000', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  <p style={{ color: '#a3a3a3', marginBottom: '16px' }}>
                    Serás redirigido a la página de creación de rutinas. La rutina se creará para: <strong style={{ color: '#fbbf24' }}>{selectedClient.name}</strong>
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      navigate(`/rutinas?client_email=${encodeURIComponent(selectedClient.email)}`)
                    }}
                  >
                    Ir a crear rutina
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de rutinas del estudiante */}
      {showStudentRoutinesModal && selectedClient && createPortal(
        <div className="auth-modal open" role="dialog" aria-modal="true" aria-label="Rutinas del estudiante">
          <div className="auth-modal__backdrop" onClick={() => setShowStudentRoutinesModal(false)} />
          <div className="auth-modal__content" style={{ width: 'min(900px, 92%)' }}>
            <button
              type="button"
              className="auth-modal__close"
              onClick={() => setShowStudentRoutinesModal(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>
            <div className="auth-modal__header">
              <h2 style={{ color: '#fbbf24', marginBottom: '8px' }}>Rutinas de {selectedClient.name}</h2>
              <p style={{ color: '#a3a3a3', margin: 0 }}>
                Todas las rutinas creadas para <strong style={{ color: '#fbbf24' }}>{selectedClient.name}</strong>
              </p>
            </div>

            <div style={{ marginTop: '24px' }}>
              {loadingStudentRoutines ? (
                <p style={{ textAlign: 'center', color: '#a3a3a3', padding: '40px' }}>Cargando rutinas...</p>
              ) : studentRoutines.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  <p style={{ color: '#a3a3a3' }}>No hay rutinas creadas para este estudiante.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                  {studentRoutines.map((routine) => (
                    <div
                      key={routine.routineID}
                      style={{
                        padding: '20px',
                        background: '#1a1a1a',
                        borderRadius: '12px',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ color: '#fbbf24', margin: '0 0 4px 0', fontSize: '20px' }}>{routine.routineName}</h3>
                          {routine.goal && <p style={{ color: '#a3a3a3', margin: '4px 0', fontSize: '14px' }}>{routine.goal}</p>}
                          {routine.created_at && (
                            <small style={{ color: '#a3a3a3', fontSize: '12px' }}>
                              Creada: {new Date(routine.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </small>
                          )}
                        </div>
                        <span style={{
                          padding: '6px 12px',
                          background: 'rgba(251, 191, 36, 0.2)',
                          color: '#fbbf24',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {routine.exercises?.length || 0} ejercicios
                        </span>
                      </div>

                      {routine.exercises && routine.exercises.length > 0 && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(251, 191, 36, 0.2)' }}>
                          <h4 style={{ color: '#fbbf24', margin: '0 0 12px 0', fontSize: '14px' }}>Ejercicios:</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {routine.exercises.map((exercise, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '12px',
                                  background: '#000000',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(251, 191, 36, 0.1)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div>
                                  <strong style={{ color: '#fbbf24', display: 'block', fontSize: '14px' }}>
                                    {exercise.exerciseName || exercise.name}
                                  </strong>
                                  <small style={{ color: '#a3a3a3', fontSize: '12px', textTransform: 'capitalize' }}>
                                    {exercise.muscleGroup || exercise.muscle_group}
                                  </small>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {exercise.sets && (
                                    <span style={{
                                      padding: '4px 8px',
                                      background: 'rgba(251, 191, 36, 0.2)',
                                      color: '#fbbf24',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: '600'
                                    }}>
                                      {exercise.sets || exercise.pivot?.sets} series
                                    </span>
                                  )}
                                  {exercise.reps && (
                                    <span style={{
                                      padding: '4px 8px',
                                      background: 'rgba(251, 191, 36, 0.2)',
                                      color: '#fbbf24',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: '600'
                                    }}>
                                      {exercise.reps || exercise.pivot?.reps} reps
                                    </span>
                                  )}
                                  {(exercise.weight || exercise.pivot?.weight) && (
                                    <span style={{
                                      padding: '4px 8px',
                                      background: 'rgba(251, 191, 36, 0.2)',
                                      color: '#fbbf24',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: '600'
                                    }}>
                                      {exercise.weight || exercise.pivot?.weight} kg
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {pendingDeleteClient &&
        createPortal(
          <div className="confirm-modal open" role="dialog" aria-modal="true" aria-label="Eliminar estudiante">
            <div className="confirm-modal__backdrop" onClick={handleCloseDeleteClientModal} />
            <div className="confirm-modal__content">
              <h4>Eliminar estudiante</h4>
              <p>¿Seguro que deseas eliminar este estudiante?</p>
              <div className="confirm-modal__actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseDeleteClientModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-secondary" onClick={confirmDeleteClient}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}

export default App

function LandingContent({ metrics, focusAreas, roadmap, goToSection, onProgramsCTA }) {
  return (
    <>
      <section id="inicio" className="hero">
        <div className="container-xl hero__content">
          <h1 className="hero-title">
            Sigue cada serie, cada peso, cada repetición. Ve tu evolución real.
          </h1>
          <p className="lead">
            AngaX registra tu progreso con gráficas detalladas, conecta tu comunidad de entrenamiento y te guía con Angel, 
            tu asistente virtual. Crea tus rutinas personalizadas y comparte tu evolución con una comunidad que te motiva.
          </p>
          <div className="hero__actions d-flex flex-wrap gap-3">
            <button className="btn btn-primary btn-lg px-4" onClick={onProgramsCTA}>
              Crear rutina gratis
            </button>
            <button className="btn btn-outline btn-lg px-4" onClick={() => goToSection('panel')}>
              Ver panel
            </button>
          </div>

          <div className="metrics row g-3 mt-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="col-md-4">
                <div className="metric-card animate-on-scroll">
                  <p>{metric.label}</p>
                  <strong>{metric.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="panel" className="section section-white focus">
        <div className="section__inner container-xl">
          <div className="section__header text-center animate-fade-in">
            <h2>Panel pensado para usuarios y entrenadores</h2>
            <p>Control diario, objetivos activos y estadísticas comprensibles a primera vista.</p>
          </div>
          <div className="focus__grid">
            {focusAreas.map((area, index) => (
              <article key={area.title} className={`animate-on-scroll ${index % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'}`}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GymCarousel />

      <section id="por-que-angax" className="section section-white">
        <div className="section__inner container-xl">
          <div className="section__header text-center animate-fade-in">
            <h2>Por qué elegir AngaX</h2>
            <p>Una plataforma diseñada para transformar tu forma de entrenar y alcanzar tus objetivos.</p>
          </div>
          
          <div className="why-angax__feature animate-on-scroll" style={{ marginTop: '80px' }}>
            <div className="why-angax__image animate-scale">
              <img src="/images/info/gimnasioinfo1.avif" alt="Todo en un solo lugar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            <div className="why-angax__content animate-slide-right">
              <h3>Todo en un solo lugar</h3>
              <p style={{ textAlign: 'justify', marginBottom: '1rem' }}>
                Crea rutinas personalizadas adaptadas a tus objetivos específicos, registra cada uno de tus entrenamientos con precisión, 
                visualiza tu progreso a través de gráficas interactivas y conecta con una comunidad motivadora que comparte tu pasión por el fitness. 
                Todo esto en una sola plataforma intuitiva y fácil de usar.
              </p>
              <p style={{ textAlign: 'justify', marginBottom: '1rem' }}>
                Olvídate de cambiar entre múltiples aplicaciones, tener datos dispersos o perder el seguimiento de tu evolución. Con AngaX, gestiona tu entrenamiento completo desde un único lugar, accesible desde cualquier 
                dispositivo y sincronizado en tiempo real.
              </p>
              <p style={{ textAlign: 'justify' }}>
                Desde la planificación de tu rutina semanal hasta el análisis de tus resultados a largo plazo, 
                todo está organizado y disponible cuando lo necesites.
              </p>
            </div>
          </div>

          <div className="why-angax__feature animate-on-scroll" style={{ marginTop: '80px' }}>
            <div className="why-angax__content animate-slide-left">
              <h3>Datos que importan</h3>
              <p style={{ textAlign: 'justify', marginBottom: '1rem' }}>
                Gráficas detalladas y métricas precisas que te muestran tu evolución real de manera clara y comprensible. Cada serie, cada peso, 
                cada repetición cuenta para tu progreso y queda registrado automáticamente. Analiza tendencias en tu fuerza, resistencia y volumen 
                de entrenamiento con visualizaciones interactivas que te permiten identificar patrones, celebrar mejoras y ajustar tu estrategia.
              </p>
              <p style={{ textAlign: 'justify', marginBottom: '1rem' }}>
                Compara tu rendimiento actual con semanas o meses anteriores, establece nuevos récords personales y recibe insights inteligentes 
                sobre tu desempeño. Los datos no son solo números: son la historia de tu transformación, el reflejo de tu dedicación y la guía 
                para alcanzar tus próximos objetivos.
              </p>
              <p style={{ textAlign: 'justify' }}>
                Con AngaX, cada métrica tiene un propósito y cada gráfica cuenta una parte de tu viaje hacia 
                una versión más fuerte de ti mismo.
              </p>
            </div>
            <div className="why-angax__image animate-scale">
              <img src="/images/info/gimnasioinfo2.avif" alt="Datos que importan" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            </div>
          </div>

          <div className="why-angax__feature animate-on-scroll" style={{ marginTop: '80px' }}>
            <div className="why-angax__image animate-scale">
              <img src="/images/info/gimnasioinfo3.avif" alt="Asistencia inteligente" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            <div className="why-angax__content animate-slide-right">
              <h3>Asistencia inteligente</h3>
              <p style={{ textAlign: 'justify', marginBottom: '1rem' }}>
                Angel, tu asistente virtual, está siempre disponible para ayudarte a crear rutinas personalizadas según tus objetivos, resolver dudas 
                sobre técnicas de ejercicio, periodización y nutrición, y guiarte en cada paso de tu entrenamiento. Con inteligencia artificial avanzada, 
                Angel aprende de tus preferencias, historial de entrenamiento y metas para ofrecerte recomendaciones cada vez más precisas.
              </p>
              <p style={{ textAlign: 'justify', marginBottom: '1rem' }}>
                Ya sea que necesites ajustar una rutina por una lesión, buscar ejercicios alternativos, entender la progresión adecuada de cargas o simplemente recibir motivación 
                diaria, Angel está ahí para ti las 24 horas del día.
              </p>
              <p style={{ textAlign: 'justify' }}>
                No importa si eres principiante buscando orientación o un atleta experimentado que quiere 
                optimizar su rendimiento, Angel se adapta a tu nivel y te acompaña en cada etapa de tu transformación física.
              </p>
            </div>
          </div>
          <div style={{ display: 'none' }}>
            <div className="panel-card primary animate-on-scroll">
              <p className="panel-label">Objetivo activo</p>
              <h3>Hipertrofia tren superior</h3>
              <p className="panel-progress">72% completado</p>
              <div className="panel-bars">
                <span data-progress="85" />
                <span data-progress="62" />
                <span data-progress="74" />
              </div>
            </div>
            <div className="panel-card secondary animate-slide">
              <p className="panel-label">Sesión reciente</p>
              <div className="panel-session">
                <p>Peso muerto</p>
                <strong>5 x 120 kg</strong>
              </div>
              <div className="panel-session">
                <p>Dominadas lastradas</p>
                <strong>4 x 20 kg</strong>
              </div>
              <div className="panel-session">
                <p>Press banca</p>
                <strong>4 x 95 kg</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="comunidad" className="section section-light social">
        <div className="section__inner container-xl">
          <div className="section__header text-center animate-fade-in">
            <h2>Comunidad que celebra cada avance</h2>
            <p>Publica progresos, comenta entrenamientos y suma energía positiva.</p>
          </div>
        </div>
      </section>

      <section id="trabaja-con-nosotros" className="section section-contrast">
        <div className="section__inner container-xl">
          <div className="section__header text-center animate-fade-in">
            <h2>Trabaja con nosotros</h2>
            <p>Únete al equipo de AngaX y forma parte de una plataforma que transforma vidas a través del fitness.</p>
          </div>
          <div style={{ maxWidth: '600px', margin: '56px auto 0' }} className="animate-scale">
            <form className="careers-form" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por tu interés! Te contactaremos pronto.'); }}>
              <div style={{ display: 'grid', gap: '24px' }}>
                <label>
                  <span style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#fbbf24' }}>Nombre completo</span>
                  <input
                    type="text"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(0, 77, 152, 0.2)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 77, 152, 0.2)'}
                  />
                </label>
                <label>
                  <span style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#fbbf24' }}>Correo electrónico</span>
                  <input
                    type="email"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(0, 77, 152, 0.2)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 77, 152, 0.2)'}
                  />
                </label>
                <label>
                  <span style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#fbbf24' }}>Área de interés</span>
                  <select
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#1a1a1a',
                      color: '#fbbf24',
                      transition: 'border-color 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(251, 191, 36, 0.3)'}
                  >
                    <option value="" style={{ background: '#1a1a1a', color: '#fbbf24' }}>Selecciona un área</option>
                    <option value="desarrollo" style={{ background: '#1a1a1a', color: '#fbbf24' }}>Desarrollo</option>
                    <option value="diseño" style={{ background: '#1a1a1a', color: '#fbbf24' }}>Diseño</option>
                    <option value="marketing" style={{ background: '#1a1a1a', color: '#fbbf24' }}>Marketing</option>
                    <option value="fitness" style={{ background: '#1a1a1a', color: '#fbbf24' }}>Fitness y Entrenamiento</option>
                    <option value="otro" style={{ background: '#1a1a1a', color: '#fbbf24' }}>Otro</option>
                  </select>
                </label>
                <label>
                  <span style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#fbbf24' }}>Mensaje</span>
                  <textarea
                    required
                    rows="5"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(0, 77, 152, 0.2)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 77, 152, 0.2)'}
                    placeholder="Cuéntanos por qué te gustaría trabajar con nosotros..."
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

function RoutinesPage({ currentUser, userLoaded, ensureAuth }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('crear')
  const [routineForm, setRoutineForm] = useState({
    routineName: '',
    goal: '',
  })
  const [routines, setRoutines] = useState([])
  const [routineStatus, setRoutineStatus] = useState('')
  const [availableExercises, setAvailableExercises] = useState({})
  const [selectedExercises, setSelectedExercises] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('pecho')
  const [loadingExercises, setLoadingExercises] = useState(false)
  const [expandedRoutines, setExpandedRoutines] = useState({})
  const [trainingOpen, setTrainingOpen] = useState(false)
  const [trainingRoutine, setTrainingRoutine] = useState(null)
  const [trainingExercises, setTrainingExercises] = useState([])
  const [trainingMeta, setTrainingMeta] = useState({ performed_at: new Date().toISOString() })
  const [routineDays, setRoutineDays] = useState([{ id: 1, name: 'Día 1', exercises: [] }])
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null)
  const [exercisePage, setExercisePage] = useState(1)

  const categories = ['abdomen', 'brazos', 'espalda', 'gluteos', 'hombro', 'pecho', 'piernas']
  const categoryNames = {
    abdomen: 'Abdomen',
    brazos: 'Brazos',
    espalda: 'Espalda',
    gluteos: 'Glúteos',
    hombro: 'Hombro',
    pecho: 'Pecho',
    piernas: 'Piernas',
  }
  
  const [hoveredCategory, setHoveredCategory] = useState(null)
  
  const getFrontImage = (category) => {
    const imageMap = {
      'pecho': '/images/modelo persona/pecho.png',
      'hombro': '/images/modelo persona/hombros.png',
      'abdomen': '/images/modelo persona/Abdominal.png',
      'brazos': '/images/modelo persona/Brazos.png',
      'piernas': '/images/modelo persona/Piernas.png',
    }
    return imageMap[category] || '/images/modelo persona/personaFrente.png'
  }
  
  const getBackImage = (category) => {
    const imageMap = {
      'espalda': '/images/modelo persona/Espalda.png',
      'gluteos': '/images/modelo persona/Gluteos.png',
      'brazos': '/images/modelo persona/Brazos.png',
      'hombro': '/images/modelo persona/hombros.png',
      'piernas': '/images/modelo persona/Piernas.png',
    }
    return imageMap[category] || '/images/modelo persona/personaAtras.png'
  }
  
  const getCurrentFrontImage = () => {
    const activeCategory = hoveredCategory || selectedCategory
    return getFrontImage(activeCategory)
  }
  
  const getCurrentBackImage = () => {
    const activeCategory = hoveredCategory || selectedCategory
    return getBackImage(activeCategory)
  }

  const [clientEmail, setClientEmail] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const clientEmailParam = urlParams.get('client_email')
    setClientEmail(clientEmailParam)
  }, [location.search])

  useEffect(() => {
    if (!userLoaded) return
    if (!currentUser) {
      ensureAuth()
      return
    }
    fetchRoutines()
    fetchAvailableExercises()
  }, [currentUser, userLoaded])

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '')
      if (hash === 'crear-rutina' || hash === 'crear') {
        setActiveTab('crear')
      } else if (hash === 'rutinas-guardadas' || hash === 'ver') {
        setActiveTab('ver')
      } else if (hash === 'que-es-una-rutina' || hash === 'info') {
        setActiveTab('info')
      }
    }
  }, [location.hash])

  const fetchRoutines = async () => {
    if (!currentUser) return
    try {
      const response = await fetch(`${apiBaseUrl}/routines?user_email=${encodeURIComponent(currentUser.email)}`)
      const data = await response.json()
      setRoutines(data)
    } catch (error) {
      console.error(error)
    }
  }

  const openTraining = (routine) => {
    const normalized = (routine.exercises || []).map((ex) => {
      const numSets = ex.pivot?.sets ?? ex.sets ?? 0
      const defaultReps = ex.pivot?.reps ?? ex.reps ?? 0
      // Crear un array de series, cada una con su propio reps y peso
      const series = Array.from({ length: numSets }, () => ({
        reps: defaultReps,
        weight: null,
      }))
      
      return {
        exerciseID: ex.exerciseID,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        imagePath: getExerciseImagePath(ex.exerciseName, ex.muscleGroup),
        sets: numSets,
        series: series,
      }
    })
    setTrainingRoutine(routine)
    setTrainingExercises(normalized)
    setTrainingMeta({ performed_at: new Date().toISOString() })
    setTrainingOpen(true)
    setRoutineStatus('')
  }

  const shareRoutine = async (routine) => {
    try {
      // Crear un elemento temporal para renderizar la rutina
      const shareContainer = document.createElement('div')
      shareContainer.style.position = 'absolute'
      shareContainer.style.left = '-9999px'
      shareContainer.style.width = '1200px'
      shareContainer.style.background = '#ffffff'
      shareContainer.style.padding = '60px'
      shareContainer.style.fontFamily = 'Inter, sans-serif'
      shareContainer.style.borderRadius = '16px'
      shareContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
      shareContainer.style.boxSizing = 'border-box'
      
      // Header con gradiente
      const header = document.createElement('div')
      header.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      header.style.padding = '40px 50px'
      header.style.borderRadius = '12px 12px 0 0'
      header.style.marginBottom = '40px'
      header.style.color = '#000000'
      header.style.boxSizing = 'border-box'
      
      const title = document.createElement('h2')
      title.textContent = routine.routineName
      title.style.margin = '0 0 12px 0'
      title.style.fontSize = '42px'
      title.style.fontWeight = '700'
      title.style.lineHeight = '1.2'
      title.style.color = '#000000'
      
      const goal = document.createElement('p')
      goal.textContent = routine.goal || 'Sin objetivo definido'
      goal.style.margin = '0'
      goal.style.fontSize = '22px'
      goal.style.opacity = '0.9'
      goal.style.lineHeight = '1.4'
      goal.style.color = '#000000'
      
      header.appendChild(title)
      header.appendChild(goal)
      
      // Contenido de ejercicios
      const exercisesContainer = document.createElement('div')
      exercisesContainer.style.display = 'flex'
      exercisesContainer.style.flexDirection = 'column'
      exercisesContainer.style.gap = '24px'
      exercisesContainer.style.maxHeight = 'none'
      
      const exercises = routine.exercises || []
      exercises.slice(0, 10).forEach((ex) => {
        const exerciseCard = document.createElement('div')
        exerciseCard.style.display = 'flex'
        exerciseCard.style.alignItems = 'center'
        exerciseCard.style.gap = '20px'
        exerciseCard.style.padding = '20px'
        exerciseCard.style.background = '#f7fafc'
        exerciseCard.style.borderRadius = '12px'
        exerciseCard.style.boxSizing = 'border-box'
        
        // Imagen del ejercicio
        const imgWrapper = document.createElement('div')
        imgWrapper.style.width = '120px'
        imgWrapper.style.height = '120px'
        imgWrapper.style.minWidth = '120px'
        imgWrapper.style.minHeight = '120px'
        imgWrapper.style.borderRadius = '10px'
        imgWrapper.style.overflow = 'hidden'
        imgWrapper.style.flexShrink = '0'
        imgWrapper.style.background = '#e2e8f0'
        
        const img = document.createElement('img')
        const imagePath = getExerciseImagePath(ex.exerciseName, ex.muscleGroup)
        img.src = imagePath
        img.style.width = '100%'
        img.style.height = '100%'
        img.style.objectFit = 'cover'
        img.onerror = () => {
          imgWrapper.style.display = 'flex'
          imgWrapper.style.alignItems = 'center'
          imgWrapper.style.justifyContent = 'center'
          imgWrapper.style.fontSize = '24px'
          imgWrapper.style.fontWeight = '700'
          imgWrapper.style.color = '#4a5568'
          imgWrapper.textContent = ex.exerciseName.charAt(0).toUpperCase()
        }
        imgWrapper.appendChild(img)
        
        // Información del ejercicio
        const info = document.createElement('div')
        info.style.flex = '1'
        
        const exerciseName = document.createElement('div')
        exerciseName.textContent = ex.exerciseName
        exerciseName.style.fontSize = '22px'
        exerciseName.style.fontWeight = '600'
        exerciseName.style.color = '#1a202c'
        exerciseName.style.marginBottom = '12px'
        exerciseName.style.lineHeight = '1.3'
        
        const params = document.createElement('div')
        params.style.display = 'flex'
        params.style.gap = '8px'
        params.style.flexWrap = 'wrap'
        
        const sets = ex.pivot?.sets ?? ex.sets ?? ''
        const reps = ex.pivot?.reps ?? ex.reps ?? ''
        const weight = ex.pivot?.weight ?? ex.weight ?? null
        
        if (sets) {
          const setsBadge = document.createElement('span')
          setsBadge.textContent = `${sets} series`
          setsBadge.style.padding = '8px 16px'
          setsBadge.style.background = '#fbbf24'
          setsBadge.style.color = '#000000'
          setsBadge.style.borderRadius = '20px'
          setsBadge.style.fontSize = '16px'
          setsBadge.style.fontWeight = '600'
          params.appendChild(setsBadge)
        }
        
        if (reps) {
          const repsBadge = document.createElement('span')
          repsBadge.textContent = `${reps} reps`
          repsBadge.style.padding = '8px 16px'
          repsBadge.style.background = '#fbbf24'
          repsBadge.style.color = '#000000'
          repsBadge.style.borderRadius = '20px'
          repsBadge.style.fontSize = '16px'
          repsBadge.style.fontWeight = '600'
          params.appendChild(repsBadge)
        }
        
        if (weight) {
          const weightBadge = document.createElement('span')
          weightBadge.textContent = `${weight} kg`
          weightBadge.style.padding = '8px 16px'
          weightBadge.style.background = '#fbbf24'
          weightBadge.style.color = '#000000'
          weightBadge.style.borderRadius = '20px'
          weightBadge.style.fontSize = '16px'
          weightBadge.style.fontWeight = '600'
          params.appendChild(weightBadge)
        }
        
        info.appendChild(exerciseName)
        info.appendChild(params)
        
        exerciseCard.appendChild(imgWrapper)
        exerciseCard.appendChild(info)
        exercisesContainer.appendChild(exerciseCard)
      })
      
      // Footer
      const footer = document.createElement('div')
      footer.style.marginTop = '30px'
      footer.style.paddingTop = '20px'
      footer.style.borderTop = '1px solid #e2e8f0'
      footer.style.textAlign = 'center'
      footer.style.color = '#718096'
      footer.style.fontSize = '14px'
      footer.textContent = 'Compartido desde AngaX'
      
      shareContainer.appendChild(header)
      shareContainer.appendChild(exercisesContainer)
      shareContainer.appendChild(footer)
      
      document.body.appendChild(shareContainer)
      
      // Esperar a que las imágenes se carguen
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Convertir a imagen
      const canvas = await html2canvas(shareContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      })
      
      // Convertir canvas a blob y guardar en sessionStorage
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64data = reader.result
            sessionStorage.setItem('shareImage', base64data)
            sessionStorage.setItem('shareImageName', `rutina-${routine.routineName.replace(/\s+/g, '-')}.png`)
            
            // Limpiar
            document.body.removeChild(shareContainer)
            
            // Navegar a Comunidad
            navigate('/comunidad')
          }
          reader.readAsDataURL(blob)
        } else {
          document.body.removeChild(shareContainer)
          setRoutineStatus('Error al generar la imagen')
          setTimeout(() => setRoutineStatus(''), 3000)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error al generar imagen:', error)
      setRoutineStatus('Error al generar la imagen')
      setTimeout(() => setRoutineStatus(''), 3000)
    }
  }

  const shareExercise = async (exercise, routineName = '') => {
    try {
      // Crear un elemento temporal para renderizar el ejercicio
      const shareContainer = document.createElement('div')
      shareContainer.style.position = 'absolute'
      shareContainer.style.left = '-9999px'
      shareContainer.style.width = '1200px'
      shareContainer.style.background = '#ffffff'
      shareContainer.style.padding = '60px'
      shareContainer.style.fontFamily = 'Inter, sans-serif'
      shareContainer.style.borderRadius = '16px'
      shareContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
      shareContainer.style.boxSizing = 'border-box'
      
      // Header con gradiente
      const header = document.createElement('div')
      header.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      header.style.padding = '40px 50px'
      header.style.borderRadius = '12px 12px 0 0'
      header.style.marginBottom = '40px'
      header.style.color = '#000000'
      header.style.boxSizing = 'border-box'
      
      const title = document.createElement('h2')
      title.textContent = exercise.exerciseName
      title.style.margin = '0 0 12px 0'
      title.style.fontSize = '42px'
      title.style.fontWeight = '700'
      title.style.lineHeight = '1.2'
      title.style.color = '#000000'
      
      const goal = document.createElement('p')
      if (routineName) {
        goal.textContent = `De la rutina: ${routineName}`
      } else {
        goal.textContent = 'Ejercicio'
      }
      goal.style.margin = '0'
      goal.style.fontSize = '22px'
      goal.style.opacity = '0.9'
      goal.style.lineHeight = '1.4'
      goal.style.color = '#000000'
      
      header.appendChild(title)
      header.appendChild(goal)
      
      // Contenido de ejercicios (similar a shareRoutine)
      const exercisesContainer = document.createElement('div')
      exercisesContainer.style.display = 'flex'
      exercisesContainer.style.flexDirection = 'column'
      exercisesContainer.style.gap = '24px'
      exercisesContainer.style.maxHeight = 'none'
      
      // Crear tarjeta del ejercicio (igual que en shareRoutine)
      const exerciseCard = document.createElement('div')
      exerciseCard.style.display = 'flex'
      exerciseCard.style.alignItems = 'center'
      exerciseCard.style.gap = '20px'
      exerciseCard.style.padding = '20px'
      exerciseCard.style.background = '#f7fafc'
      exerciseCard.style.borderRadius = '12px'
      exerciseCard.style.boxSizing = 'border-box'
      
      // Imagen del ejercicio
      const imgWrapper = document.createElement('div')
      imgWrapper.style.width = '120px'
      imgWrapper.style.height = '120px'
      imgWrapper.style.minWidth = '120px'
      imgWrapper.style.minHeight = '120px'
      imgWrapper.style.borderRadius = '10px'
      imgWrapper.style.overflow = 'hidden'
      imgWrapper.style.flexShrink = '0'
      imgWrapper.style.background = '#e2e8f0'
      
      const img = document.createElement('img')
      const imagePath = getExerciseImagePath(exercise.exerciseName, exercise.muscleGroup)
      img.src = imagePath
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'cover'
      img.onerror = () => {
        imgWrapper.style.display = 'flex'
        imgWrapper.style.alignItems = 'center'
        imgWrapper.style.justifyContent = 'center'
        imgWrapper.style.fontSize = '24px'
        imgWrapper.style.fontWeight = '700'
        imgWrapper.style.color = '#4a5568'
        imgWrapper.textContent = exercise.exerciseName.charAt(0).toUpperCase()
      }
      imgWrapper.appendChild(img)
      
      // Información del ejercicio
      const info = document.createElement('div')
      info.style.flex = '1'
      
      const exerciseName = document.createElement('div')
      exerciseName.textContent = exercise.exerciseName
      exerciseName.style.fontSize = '22px'
      exerciseName.style.fontWeight = '600'
      exerciseName.style.color = '#1a202c'
      exerciseName.style.marginBottom = '12px'
      exerciseName.style.lineHeight = '1.3'
      
      const params = document.createElement('div')
      params.style.display = 'flex'
      params.style.gap = '8px'
      params.style.flexWrap = 'wrap'
      
      const sets = exercise.pivot?.sets ?? exercise.sets ?? ''
      const reps = exercise.pivot?.reps ?? exercise.reps ?? ''
      const weight = exercise.pivot?.weight ?? exercise.weight ?? null
      
      if (sets) {
        const setsBadge = document.createElement('span')
        setsBadge.textContent = `${sets} series`
        setsBadge.style.padding = '8px 16px'
        setsBadge.style.background = '#fbbf24'
        setsBadge.style.color = '#000000'
        setsBadge.style.borderRadius = '20px'
        setsBadge.style.fontSize = '16px'
        setsBadge.style.fontWeight = '600'
        params.appendChild(setsBadge)
      }
      
      if (reps) {
        const repsBadge = document.createElement('span')
        repsBadge.textContent = `${reps} reps`
        repsBadge.style.padding = '8px 16px'
        repsBadge.style.background = '#fbbf24'
        repsBadge.style.color = '#000000'
        repsBadge.style.borderRadius = '20px'
        repsBadge.style.fontSize = '16px'
        repsBadge.style.fontWeight = '600'
        params.appendChild(repsBadge)
      }
      
      if (weight) {
        const weightBadge = document.createElement('span')
        weightBadge.textContent = `${weight} kg`
        weightBadge.style.padding = '8px 16px'
        weightBadge.style.background = '#fbbf24'
        weightBadge.style.color = '#000000'
        weightBadge.style.borderRadius = '20px'
        weightBadge.style.fontSize = '16px'
        weightBadge.style.fontWeight = '600'
        params.appendChild(weightBadge)
      }
      
      info.appendChild(exerciseName)
      info.appendChild(params)
      
      exerciseCard.appendChild(imgWrapper)
      exerciseCard.appendChild(info)
      exercisesContainer.appendChild(exerciseCard)
      
      // Footer
      const footer = document.createElement('div')
      footer.style.marginTop = '30px'
      footer.style.paddingTop = '20px'
      footer.style.borderTop = '1px solid #e2e8f0'
      footer.style.textAlign = 'center'
      footer.style.color = '#718096'
      footer.style.fontSize = '14px'
      footer.textContent = 'Compartido desde AngaX'
      
      shareContainer.appendChild(header)
      shareContainer.appendChild(exercisesContainer)
      shareContainer.appendChild(footer)
      
      document.body.appendChild(shareContainer)
      
      // Esperar a que las imágenes se carguen
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Convertir a imagen
      const canvas = await html2canvas(shareContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      })
      
      // Convertir canvas a blob y guardar en sessionStorage
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64data = reader.result
            sessionStorage.setItem('shareImage', base64data)
            sessionStorage.setItem('shareImageName', `ejercicio-${exercise.exerciseName.replace(/\s+/g, '-')}.png`)
            
            // Limpiar
            document.body.removeChild(shareContainer)
            
            // Navegar a Comunidad
            navigate('/comunidad')
          }
          reader.readAsDataURL(blob)
        } else {
          document.body.removeChild(shareContainer)
          setRoutineStatus('Error al generar la imagen del ejercicio')
          setTimeout(() => setRoutineStatus(''), 3000)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error al generar imagen del ejercicio:', error)
      setRoutineStatus('Error al generar la imagen del ejercicio')
      setTimeout(() => setRoutineStatus(''), 3000)
    }
  }

  const closeTraining = () => {
    setTrainingOpen(false)
    setTrainingRoutine(null)
    setTrainingExercises([])
  }

  const updateTrainingExercise = (exerciseID, setIndex, field, value) => {
    setTrainingExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseID !== exerciseID) return ex
        const updatedSeries = [...(ex.series || [])]
        if (updatedSeries[setIndex]) {
          if (field === 'weight') {
            updatedSeries[setIndex] = { ...updatedSeries[setIndex], weight: value === '' ? null : parseFloat(value) || null }
          } else if (field === 'reps') {
            updatedSeries[setIndex] = { ...updatedSeries[setIndex], reps: value === '' ? 0 : parseInt(value, 10) || 0 }
          }
        }
        return { ...ex, series: updatedSeries }
      })
    )
  }

  const saveTraining = async () => {
    if (!ensureAuth() || !trainingRoutine) return
    setRoutineStatus('Guardando entrenamiento…')
    try {
      // Enviar los datos con series individuales
      const exercisesData = trainingExercises.flatMap((ex) => {
        const series = ex.series || []
        return series.map((serie, index) => ({
          exerciseID: ex.exerciseID,
          setNumber: index + 1,
          reps: serie.reps || 0,
          weight: serie.weight ?? null,
        }))
      })

      const response = await fetch(`${apiBaseUrl}/routines/${trainingRoutine.routineID}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          performed_at: trainingMeta.performed_at,
          exercises: exercisesData,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'No se pudo guardar el entrenamiento')
      setRoutineStatus('Entrenamiento guardado ✅')
      closeTraining()
      fetchRoutines()
      setTimeout(() => setRoutineStatus(''), 2500)
      navigate('/progreso')
    } catch (error) {
      setRoutineStatus(error.message || 'Error al guardar el entrenamiento')
    }
  }

  const fetchAvailableExercises = async () => {
    setLoadingExercises(true)
    try {
      const response = await fetch(`${apiBaseUrl}/exercises`)
      const data = await response.json()
      setAvailableExercises(data)
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
    } finally {
      setLoadingExercises(false)
    }
  }

  const getExerciseImagePath = (exerciseName, muscleGroup) => {
    const catalogHit = availableExercises?.[muscleGroup]?.find((ex) => ex.name === exerciseName)?.imagePath
    return catalogHit ?? `/ejercicios/${muscleGroup}/${exerciseName}.gif`
  }

  const handleRoutineChange = (event) => {
    const { name, value } = event.target
    setRoutineForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddExercise = (exercise) => {
    const newExercise = {
      id: Date.now(),
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      imagePath: exercise.imagePath,
      sets: 3,
      reps: 10,
    }
    setSelectedExercises((prev) => {
      const newExercises = [...prev, newExercise]
      // Calcular la última página y mover allí
      const exercisesPerPage = 3
      const totalPages = Math.ceil(newExercises.length / exercisesPerPage)
      setExercisePage(totalPages)
      return newExercises
    })
  }

  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises((prev) => {
      const newExercises = prev.filter((ex) => ex.id !== exerciseId)
      // Ajustar la página si es necesario
      const exercisesPerPage = 3
      const maxPage = Math.max(1, Math.ceil(newExercises.length / exercisesPerPage))
      if (exercisePage > maxPage) {
        setExercisePage(maxPage)
      }
      return newExercises
    })
    // Cerrar el detalle si estaba abierto
    if (selectedExerciseDetail?.id === exerciseId) {
      setSelectedExerciseDetail(null)
    }
  }

  const handleExerciseChange = (exerciseId, field, value) => {
    setSelectedExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const updated = field === 'weight' 
            ? { ...ex, [field]: value === '' ? null : parseFloat(value) || null }
            : { ...ex, [field]: parseInt(value) || 0 }
          // Actualizar el detalle si está seleccionado
          if (selectedExerciseDetail && selectedExerciseDetail.id === exerciseId) {
            setSelectedExerciseDetail(updated)
          }
          return updated
        }
        return ex
      })
    )
  }

  const needsWeight = (exerciseName) => {
    const weightKeywords = ['barra', 'mancuerna', 'peso', 'press', 'remo', 'sentadilla', 'prensa', 'curl', 'extensión', 'hip thrust', 'peso muerto']
    return weightKeywords.some((keyword) => exerciseName.toLowerCase().includes(keyword))
  }

  const handleRoutineSubmit = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    if (!ensureAuth()) return
    if (!routineForm.routineName) {
      setRoutineStatus('Ingresa un nombre para la rutina')
      return
    }
    if (selectedExercises.length === 0) {
      setRoutineStatus('Agrega al menos un ejercicio a la rutina')
      return
    }
    // Validar que todos los ejercicios tengan series y reps válidos
    for (const exercise of selectedExercises) {
      if (!exercise.sets || exercise.sets <= 0) {
        setRoutineStatus(`El ejercicio "${exercise.exerciseName}" debe tener al menos 1 serie`)
        return
      }
      if (!exercise.reps || exercise.reps <= 0) {
        setRoutineStatus(`El ejercicio "${exercise.exerciseName}" debe tener al menos 1 repetición`)
        return
      }
    }
    if (selectedExercises.length === 0) {
      setRoutineStatus('Selecciona al menos un ejercicio')
      return
    }
    setRoutineStatus('Guardando…')
    try {
      const requestBody = {
        user_email: currentUser.email,
        routineName: routineForm.routineName,
        goal: routineForm.goal,
        exercises: selectedExercises.map((ex) => ({
          exerciseName: ex.exerciseName,
          muscleGroup: ex.muscleGroup,
          imagePath: ex.imagePath,
          sets: ex.sets,
          reps: ex.reps,
        })),
      }
      
      // Si hay un client_email, agregarlo al body (para entrenadores creando rutinas para clientes)
      if (clientEmail) {
        requestBody.client_email = clientEmail
      }

      const response = await fetch(`${apiBaseUrl}/routines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al guardar la rutina')
      }
      setRoutineForm({
        routineName: '',
        goal: '',
      })
      setSelectedExercises([])
      setExercisePage(1)
      setSelectedExerciseDetail(null)
      setRoutineStatus('Rutina guardada ✨')
      fetchRoutines()
      setTimeout(() => {
        setRoutineStatus('')
        // Si se creó para un cliente, redirigir a la página de entrenadores
        if (clientEmail) {
          navigate('/entrenadores')
        }
      }, 3000)
    } catch (error) {
      setRoutineStatus(error.message)
    }
  }

  if (!userLoaded) {
    return (
      <section className="section section-light programs-hub">
        <div className="section__inner container-xl text-center">
          <p>Cargando...</p>
        </div>
      </section>
    )
  }

  if (!currentUser) {
    return (
      <section className="section section-light programs-hub">
        <div className="section__inner container-xl text-center">
          <h2>Inicia sesión para gestionar tus rutinas</h2>
          <p>Necesitamos identificarte para guardar tus entrenamientos.</p>
          <button className="btn btn-primary" onClick={() => ensureAuth()}>
            Iniciar sesión
          </button>
        </div>
      </section>
    )
  }

  return (
    <React.Fragment>
      <section className="section section-light programs-hub-full">
        <div className="programs-hub-full__container">
          <div className="programs-hub-full__header">
          <div className="programs-hub-full__header-content">
            <p className="eyebrow">Tu laboratorio de rutinas</p>
            <h2>Gestiona tus rutinas</h2>
            <p>
              Crea plantillas reutilizables. Cuando entrenes de verdad, registra pesos y repeticiones en Progreso.
            </p>
          </div>
          
          <div className="routines-tabs">
            <button
              type="button"
              className={`routines-tab ${activeTab === 'crear' ? 'active' : ''}`}
              onClick={() => setActiveTab('crear')}
            >
              Crear rutina
            </button>
            <button
              type="button"
              className={`routines-tab ${activeTab === 'ver' ? 'active' : ''}`}
              onClick={() => setActiveTab('ver')}
            >
              Ver rutinas guardadas
            </button>
            <button
              type="button"
              className={`routines-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              ¿Qué es una rutina?
            </button>
          </div>
        </div>

        {activeTab === 'crear' && (
          <div id="crear-rutina" className="programs-hub-full__content">
            {clientEmail && (
              <div style={{ 
                padding: '16px', 
                marginBottom: '24px', 
                background: '#1a1a1a', 
                borderRadius: '8px', 
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24',
                textAlign: 'center'
              }}>
                <strong>Creando rutina para tu cliente: {clientEmail}</strong>
              </div>
            )}
            <div className="routine-editor-layout">
              <header className="routine-editor-header">
                <h2>Crea tu rutina ideal</h2>
              </header>

              <div className="routine-editor-main">
                <div className="routine-editor-left">
                  <div className="routine-banner-image">
                    <img src="/images/info/gimnasioinfo1.avif" alt="Rutina de entrenamiento" />
                  </div>

                  <div className="routine-form-section">
                    <div className="routine-form-header">
                      <label>
                        Nombre de la rutina
                        <input
                          type="text"
                          name="routineName"
                          value={routineForm.routineName}
                          onChange={handleRoutineChange}
                          placeholder="Ej: Fuerza 4 días"
                        />
                      </label>
                      <label>
                        Objetivo principal
                        <select
                          name="goal"
                          value={routineForm.goal}
                          onChange={handleRoutineChange}
                        >
                          <option value="">Selecciona un objetivo</option>
                          <option value="Hipertrofia">Hipertrofia</option>
                          <option value="Fuerza">Fuerza</option>
                          <option value="Resistencia">Resistencia</option>
                          <option value="Pérdida de peso">Pérdida de peso</option>
                          <option value="Definición">Definición</option>
                          <option value="Acondicionamiento general">Acondicionamiento general</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="routine-activities-section">
                    <div className="routine-activities-header">
                      <h3>Actividades</h3>
                      {selectedExercises.length > 0 && (
                        <span className="activities-count" style={{ fontSize: '14px', color: '#fbbf24', marginLeft: '10px' }}>
                          {selectedExercises.length} {selectedExercises.length === 1 ? 'ejercicio' : 'ejercicios'}
                        </span>
                      )}
                    </div>
                    <div className="routine-activities-list">
                      {selectedExercises.length === 0 ? (
                        <p className="no-activities">No hay actividades seleccionadas</p>
                      ) : (() => {
                        const exercisesPerPage = 3
                        const totalPages = Math.ceil(selectedExercises.length / exercisesPerPage)
                        const startIndex = (exercisePage - 1) * exercisesPerPage
                        const endIndex = startIndex + exercisesPerPage
                        const currentExercises = selectedExercises.slice(startIndex, endIndex)

                        return (
                          <>
                            {currentExercises.map((exercise) => (
                              <div key={exercise.id} className="routine-activity-item">
                                <div 
                                  className="activity-main"
                                  onClick={() => {
                                    setSelectedExerciseDetail(selectedExerciseDetail?.id === exercise.id ? null : exercise)
                                  }}
                                >
                                  <div className="activity-icon">
                                    <img src={exercise.imagePath} alt={exercise.exerciseName} />
                                  </div>
                                  <div className="activity-info">
                                    <span className="activity-name">{exercise.exerciseName}</span>
                                    <span className="activity-sets">{exercise.sets} series</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-remove-activity"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRemoveExercise(exercise.id)
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                                {selectedExerciseDetail?.id === exercise.id && (
                                  <div className="activity-details-dropdown">
                                    <div className="activity-details-content">
                                      <div className="activity-detail-row">
                                        <label>
                                          <span>Series</span>
                                          <input
                                            type="number"
                                            min="1"
                                            value={exercise.sets}
                                            onChange={(e) => handleExerciseChange(exercise.id, 'sets', e.target.value)}
                                          />
                                        </label>
                                        <label>
                                          <span>Reps</span>
                                          <input
                                            type="number"
                                            min="1"
                                            value={exercise.reps}
                                            onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {totalPages > 1 && (
                              <div className="activities-pagination" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginTop: '20px',
                                padding: '15px',
                                background: '#1a202c',
                                borderRadius: '8px'
                              }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExercisePage(prev => Math.max(1, prev - 1))
                                    setSelectedExerciseDetail(null)
                                  }}
                                  disabled={exercisePage === 1}
                                  style={{
                                    padding: '8px 16px',
                                    background: exercisePage === 1 ? '#2d3748' : '#fbbf24',
                                    color: exercisePage === 1 ? '#718096' : '#000',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: exercisePage === 1 ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                  }}
                                >
                                  ← Anterior
                                </button>
                                <span style={{ 
                                  color: '#fbbf24', 
                                  fontWeight: '600',
                                  fontSize: '14px'
                                }}>
                                  Página {exercisePage} de {totalPages}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExercisePage(prev => Math.min(totalPages, prev + 1))
                                    setSelectedExerciseDetail(null)
                                  }}
                                  disabled={exercisePage === totalPages}
                                  style={{
                                    padding: '8px 16px',
                                    background: exercisePage === totalPages ? '#2d3748' : '#fbbf24',
                                    color: exercisePage === totalPages ? '#718096' : '#000',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: exercisePage === totalPages ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                  }}
                                >
                                  Siguiente →
                                </button>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                <div className="routine-editor-right">
                  <div className="routine-categories-section">
                    <h4>Seleccionar ejercicios</h4>
                    <div className="anatomy-categories">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`anatomy-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {categoryNames[cat]}
                        </button>
                      ))}
                    </div>
                    <div className="exercise-grid">
                      {loadingExercises ? (
                        <div className="exercise-loading">
                          <p>Cargando ejercicios...</p>
                        </div>
                      ) : (
                        availableExercises[selectedCategory]?.map((exercise, idx) => (
                          <div key={idx} className="exercise-card">
                            <div className="exercise-card-image">
                              <img src={exercise.imagePath} alt={exercise.name} />
                              <div className="exercise-card-overlay">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAddExercise(exercise)}
                                >
                                  + Agregar
                                </button>
                              </div>
                            </div>
                            <div className="exercise-card-content">
                              <p>{exercise.name}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="routine-save-section">
                <button 
                  className="btn btn-primary btn-save-routine" 
                  type="button"
                  onClick={handleRoutineSubmit}
                  disabled={selectedExercises.length === 0 || !routineForm.routineName}
                >
                  Guardar rutina
                </button>
                {routineStatus && <p className="builder-hint">{replaceEmojisWithIcons(routineStatus)}</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ver' && (
          <div id="rutinas-guardadas" className="programs-hub-full__content">
            <div className="routines-view-layout">
              <header className="routines-view-header">
              <h2>Tus rutinas</h2>
              {routines.length > 0 && (
                <span className="routines-count-badge">{routines.length} {routines.length === 1 ? 'rutina' : 'rutinas'}</span>
              )}
            </header>
            {routines.length === 0 ? (
              <div className="routines-empty-state">
                <div className="routines-empty-icon"><span className="material-icons">fitness_center</span></div>
                <h3>No tienes rutinas guardadas</h3>
                <p>Crea tu primera rutina personalizada para comenzar a entrenar.</p>
              </div>
            ) : (
              <div className="routines-grid">
                {routines.map((routine) => {
                  const isExpanded = expandedRoutines[routine.routineID]
                  return (
                    <div key={routine.routineID} className="routine-view-card">
                      <div className="routine-view-card-header">
                        <div className="routine-view-card-title-section">
                          <h3>{routine.routineName}</h3>
                          <div className="routine-view-card-badges">
                            <span className="routine-view-badge">{routine.exercises?.length || 0} ejercicios</span>
                            {routine.completions_count > 0 && (
                              <span className="routine-view-badge routine-view-badge-success">
                                {routine.completions_count} entrenamientos
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="routine-view-card-goal">{routine.goal || 'Sin objetivo definido'}</p>
                        {routine.last_completed_at && (
                          <small className="routine-view-card-last">
                            Último entrenamiento: {new Date(routine.last_completed_at).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </small>
                        )}
                        <button
                          type="button"
                          className={`routine-view-card-toggle ${isExpanded ? 'expanded' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedRoutines((prev) => ({
                              ...prev,
                              [routine.routineID]: !prev[routine.routineID],
                            }))
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                              d="M5 7.5L10 12.5L15 7.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      {isExpanded && routine.exercises && routine.exercises.length > 0 && (
                        <div className="routine-view-card-exercises">
                          {routine.exercises.map((exercise, idx) => {
                            const imagePath = getExerciseImagePath(exercise.exerciseName, exercise.muscleGroup)
                            return (
                              <div key={idx} className="routine-view-exercise-item">
                                <div className="routine-view-exercise-icon">
                                  <img
                                    src={imagePath}
                                    alt={exercise.exerciseName}
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.parentElement.innerHTML = `
                                        <div class="routine-view-exercise-placeholder">
                                          <span>${exercise.exerciseName.charAt(0)}</span>
                                        </div>
                                      `
                                    }}
                                  />
                                </div>
                                <div className="routine-view-exercise-info">
                                  <span className="routine-view-exercise-name">{exercise.exerciseName}</span>
                                  <div className="routine-view-exercise-params">
                                    <span className="routine-view-param">{exercise.pivot?.sets || exercise.sets} series</span>
                                    <span className="routine-view-param">{exercise.pivot?.reps || exercise.reps} reps</span>
                                    {(exercise.pivot?.weight || exercise.weight) && (
                                      <span className="routine-view-param">{(exercise.pivot?.weight || exercise.weight)} kg</span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn-share-exercise"
                                  onClick={() => shareExercise(exercise, routine.routineName)}
                                  title="Compartir este ejercicio"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                    <polyline points="16 6 12 2 8 6"></polyline>
                                    <line x1="12" y1="2" x2="12" y2="15"></line>
                                  </svg>
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                      <div className="routine-view-card-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => openTraining(routine)}
                        >
                          Iniciar entrenamiento
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => shareRoutine(routine)}
                        >
                          Compartir rutina
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={async () => {
                            if (!confirm('¿Eliminar esta rutina? Esta acción no se puede deshacer.')) return
                            try {
                              const response = await fetch(`${apiBaseUrl}/routines/${routine.routineID}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ user_email: currentUser.email }),
                              })
                              if (!response.ok) throw new Error('Error al eliminar la rutina')
                              fetchRoutines()
                              setRoutineStatus('Rutina eliminada ✅')
                              setTimeout(() => setRoutineStatus(''), 3000)
                            } catch (error) {
                              setRoutineStatus(error.message)
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {routineStatus && <p className="builder-hint">{replaceEmojisWithIcons(routineStatus)}</p>}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div id="que-es-una-rutina" className="routine-help">
            <h3>¿Qué es una rutina?</h3>
            <p>
              Una <strong>rutina</strong> es una <strong>plantilla reutilizable</strong> (ejercicios + series + repeticiones) que usas cada semana.
              Cuando haces un entreno real, pulsas <strong>Iniciar entrenamiento</strong>, registras <strong>pesos</strong> y <strong>reps</strong>, y eso se guarda en <strong>Progreso</strong>.
            </p>
            <div className="routine-help__details">
              <h4>¿Cómo funciona?</h4>
              <ol>
                <li><strong>Crea tu rutina:</strong> Selecciona ejercicios, define series y repeticiones. Esto es tu plantilla.</li>
                <li><strong>Inicia un entrenamiento:</strong> Cuando vayas al gimnasio, pulsa "Iniciar entrenamiento" en tu rutina.</li>
                <li><strong>Registra tus resultados:</strong> Anota los pesos y repeticiones que realmente hiciste.</li>
                <li><strong>Ve tu progreso:</strong> Todos tus entrenamientos se guardan en la sección "Progreso" para que veas tu evolución.</li>
              </ol>
            </div>
          </div>
        )}
        </div>
      </section>

      <div className={`auth-modal ${trainingOpen ? 'open' : ''}`}>
      <div className="auth-modal__backdrop" />
      <div className="auth-modal__content">
        <button className="auth-modal__close" type="button" onClick={closeTraining}>
          ×
        </button>
        <div className="auth-modal__header">
          <h3>Entrenamiento: {trainingRoutine?.routineName}</h3>
          <p>Registra lo que hiciste hoy (peso/reps/series). Esto se guarda en Progreso.</p>
        </div>

        <div className="session-form">
          <label>
            Fecha/hora
            <input
              type="datetime-local"
              value={trainingMeta.performed_at?.slice(0, 16) ?? ''}
              onChange={(e) =>
                setTrainingMeta((prev) => ({ ...prev, performed_at: new Date(e.target.value).toISOString() }))
              }
              disabled
            />
          </label>
        </div>

        <div className="routine-card__exercises" style={{ marginTop: 12 }}>
          {trainingExercises.map((ex) => {
            const exerciseNameLower = (ex.exerciseName || '').toLowerCase()
            const usesWeight = !exerciseNameLower.includes('flexion') && 
                              !exerciseNameLower.includes('push up') && 
                              !exerciseNameLower.includes('pull up') &&
                              !exerciseNameLower.includes('dominada') &&
                              !exerciseNameLower.includes('sentadilla') &&
                              !exerciseNameLower.includes('squat') &&
                              !exerciseNameLower.includes('abdominal') &&
                              !exerciseNameLower.includes('crunch') &&
                              !exerciseNameLower.includes('plank')
            const series = ex.series || Array.from({ length: ex.sets || 0 }, () => ({ reps: 0, weight: null }))
            
            return (
              <div key={ex.exerciseID} className="routine-card__exercise" style={{ alignItems: 'flex-start', marginBottom: '20px' }}>
                <div className="routine-card__exercise-image-wrapper">
                  <img src={ex.imagePath} alt={ex.exerciseName} />
                </div>
                <div className="routine-card__exercise-info" style={{ width: '100%' }}>
                  <strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>{ex.exerciseName}</strong>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ marginBottom: '8px', color: '#a3a3a3', fontSize: '12px', fontWeight: '600' }}>
                      {ex.sets} {ex.sets === 1 ? 'serie' : 'series'} (bloqueadas)
                    </div>
                    {series.map((serie, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        gap: 12, 
                        width: '100%', 
                        alignItems: 'flex-start',
                        marginBottom: '10px',
                        padding: '10px',
                        background: '#1a1a1a',
                        borderRadius: '6px',
                        border: '1px solid rgba(251, 191, 36, 0.1)'
                      }}>
                        <div style={{ 
                          minWidth: '80px', 
                          color: '#fbbf24', 
                          fontWeight: '600', 
                          display: 'flex', 
                          alignItems: 'center',
                          fontSize: '14px'
                        }}>
                          Serie {index + 1}
                        </div>
                        <label style={{ margin: 0, flex: '1 1 0', minWidth: 0 }}>
                          <span style={{ fontSize: '12px', color: '#a3a3a3', display: 'block', marginBottom: '4px' }}>Reps</span>
                          <input
                            type="number"
                            min="0"
                            value={serie.reps || ''}
                            onChange={(e) => updateTrainingExercise(ex.exerciseID, index, 'reps', e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            className="routine-exercise-input"
                          />
                        </label>
                        {usesWeight && (
                          <label style={{ margin: 0, flex: '1 1 0', minWidth: 0 }}>
                            <span style={{ fontSize: '12px', color: '#a3a3a3', display: 'block', marginBottom: '4px' }}>Peso (kg)</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={serie.weight ?? ''}
                              onChange={(e) => updateTrainingExercise(ex.exerciseID, index, 'weight', e.target.value)}
                              style={{ width: '100%', boxSizing: 'border-box' }}
                              className="routine-exercise-input"
                              placeholder="0"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="community__composer-actions" style={{ marginTop: 18 }}>
          {routineStatus && <span className={`community__status ${routineStatus.toLowerCase().includes('error') ? 'error' : ''}`}>{replaceEmojisWithIcons(routineStatus)}</span>}
          <button className="btn btn-primary" type="button" onClick={saveTraining} disabled={!trainingRoutine}>
            Guardar entrenamiento
          </button>
        </div>
      </div>
    </div>
    </React.Fragment>
  )
}

function MiniLineChart({ points, valueKey, height = 350, meta }) {
  const width = 1200
  const padding = { top: 40, right: 40, bottom: 50, left: 70 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const [hover, setHover] = useState(null)

  const chartPoints = (points || []).filter(
    (p) => typeof p?.[valueKey] === 'number' && !Number.isNaN(p[valueKey])
  )
  const values = chartPoints.map((p) => p[valueKey])

  if (chartPoints.length < 2 || values.length < 2) {
    return (
      <div className="chart-empty">
        <p>Necesitas al menos 2 entrenamientos con este ejercicio para ver la gráfica.</p>
      </div>
    )
  }

  const minY = Math.min(...values)
  const maxY = Math.max(...values)
  const rawRange = maxY - minY
  const pad = rawRange === 0 ? 1 : Math.max(rawRange * 0.18, rawRange < 10 ? 1 : 0)
  const domainMin = minY - pad
  const domainMax = maxY + pad
  const range = domainMax - domainMin === 0 ? 1 : domainMax - domainMin
  const xStep = chartPoints.length > 1 ? innerW / (chartPoints.length - 1) : innerW

  const scaleX = (i) => padding.left + i * xStep
  const scaleY = (v) => padding.top + (innerH - ((v - domainMin) / range) * innerH)

  // Crear línea curva suave usando curvas de Bézier
  const createSmoothCurve = (points) => {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${scaleX(0)} ${scaleY(points[0][valueKey])}`
    
    let path = `M ${scaleX(0)} ${scaleY(points[0][valueKey])}`
    
    for (let i = 0; i < points.length - 1; i++) {
      const x0 = scaleX(i)
      const y0 = scaleY(points[i][valueKey])
      const x1 = scaleX(i + 1)
      const y1 = scaleY(points[i + 1][valueKey])
      
      // Calcular puntos de control para curvas suaves
      // Usar una fracción del espacio entre puntos para el control
      const tension = 0.4
      const dx = (x1 - x0) * tension
      
      // Calcular pendientes para crear curvas naturales
      let cp1x, cp1y, cp2x, cp2y
      
      if (i === 0) {
        // Primer punto: solo control derecho
        cp1x = x0 + dx
        cp1y = y0
        cp2x = x1 - dx
        cp2y = y1
      } else if (i === points.length - 2) {
        // Último punto: solo control izquierdo
        const prevY = scaleY(points[i - 1][valueKey])
        const slope = (y1 - prevY) * 0.3
        cp1x = x0 + dx
        cp1y = y0 + slope
        cp2x = x1 - dx
        cp2y = y1
      } else {
        // Puntos intermedios: calcular pendiente basada en puntos adyacentes
        const prevY = scaleY(points[i - 1][valueKey])
        const nextY = scaleY(points[i + 2][valueKey])
        const slope1 = (y1 - prevY) * 0.3
        const slope2 = (nextY - y0) * 0.3
        cp1x = x0 + dx
        cp1y = y0 + slope1
        cp2x = x1 - dx
        cp2y = y1 - slope2
      }
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`
    }
    
    return path
  }

  const d = createSmoothCurve(chartPoints)

  const gridLines = 4
  const formatAxisValue = (v) => {
    if (valueKey === 'volume') return Math.round(v).toLocaleString()
    if (Number.isInteger(v)) return v.toString()
    return Number(v).toFixed(1)
  }

  const firstDate = new Date(chartPoints[0].date).toLocaleDateString()
  const midDate = new Date(chartPoints[Math.floor(chartPoints.length / 2)].date).toLocaleDateString()
  const lastDate = new Date(chartPoints[chartPoints.length - 1].date).toLocaleDateString()
  const midY = (minY + maxY) / 2

  return (
    <div className="mini-chart-wrap">
      {hover && (
        <div
          className="mini-chart__tooltip"
          style={{ left: `${hover.xPct}%`, top: `${hover.yPct}%` }}
        >
          <div className="mini-chart__tooltip-title">{hover.dateLabel}</div>
          <div className="mini-chart__tooltip-value">
            {hover.valueLabel}
            {meta?.unit ? ` ${meta.unit}` : ''}
          </div>
          {meta?.label && <div className="mini-chart__tooltip-meta">{meta.label}</div>}
        </div>
      )}

      <svg className="mini-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de progreso">
        {[...Array(gridLines + 1)].map((_, idx) => {
          const y = padding.top + (innerH / gridLines) * idx
          return (
            <line
              key={idx}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              className="mini-chart__grid"
            />
          )
        })}

        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d={`${d} L ${scaleX(chartPoints.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`} fill="url(#chartGradient)" className="mini-chart__area" />
        <path d={d} className="mini-chart__line" filter="url(#glow)" />

        {chartPoints.map((p, i) => {
          const cx = scaleX(i)
          const cy = scaleY(p[valueKey])
          const xPct = (cx / width) * 100
          const yPct = (cy / height) * 100
          const dateLabel = new Date(p.date).toLocaleString()
          const valueLabel = formatAxisValue(p[valueKey])
          return (
            <g key={`${p.date}_${i}`} className="mini-chart__point-group">
              <circle
                cx={cx}
                cy={cy}
                r="12"
                className="mini-chart__dot-outer"
              />
              <circle
                cx={cx}
                cy={cy}
                r="10"
                className="mini-chart__dot"
                onMouseEnter={() => setHover({ xPct, yPct, dateLabel, valueLabel })}
                onMouseLeave={() => setHover(null)}
              >
                <title>{`${dateLabel} · ${valueLabel}${meta?.unit ? ` ${meta.unit}` : ''}`}</title>
              </circle>
            </g>
          )
        })}

        {/* X axis labels */}
        <text x={padding.left} y={height - 10} className="mini-chart__axis">
          {firstDate}
        </text>
        <text x={width / 2} y={height - 10} textAnchor="middle" className="mini-chart__axis">
          {midDate}
        </text>
        <text x={width - padding.right} y={height - 10} textAnchor="end" className="mini-chart__axis">
          {lastDate}
        </text>

        {/* Y axis labels */}
        <text x={padding.left} y={padding.top + 12} className="mini-chart__axis">
          {formatAxisValue(maxY)}
        </text>
        <text x={padding.left} y={padding.top + innerH / 2 + 4} className="mini-chart__axis">
          {formatAxisValue(midY)}
        </text>
        <text x={padding.left} y={height - padding.bottom} className="mini-chart__axis">
          {formatAxisValue(minY)}
        </text>
      </svg>
    </div>
  )
}

function ProgressPage({ currentUser, userLoaded, ensureAuth }) {
  const navigate = useNavigate()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [metric, setMetric] = useState('weight')
  const [currentPage, setCurrentPage] = useState(1) 

  const canView = Boolean(currentUser)

  const fetchProgress = async () => {
    if (!currentUser) return
    setLoading(true)
    setStatus('')
    setCurrentPage(1) // Resetear a la primera página
    try {
      const response = await fetch(`${apiBaseUrl}/progress?email=${encodeURIComponent(currentUser.email)}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || data.error || 'No se pudo cargar el progreso')
      setProgress(data)
    } catch (error) {
      setStatus(error.message || 'Error al cargar progreso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userLoaded) return
    if (!currentUser) {
      ensureAuth()
      return
    }
    fetchProgress()
  }, [currentUser, userLoaded])

  const allExercises = (() => {
    const set = new Set()
    progress.forEach((session) => session.exercises?.forEach((ex) => set.add(ex.name)))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })()

  useEffect(() => {
    if (!selectedExercise && allExercises.length) {
      setSelectedExercise(allExercises[0])
    }
  }, [allExercises.length, selectedExercise])

  const series = (() => {
    const items = (progress || [])
      .slice()
      .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at))
      .map((session) => {
        const matches = (session.exercises || []).filter((e) => e.name === selectedExercise)
        if (!matches.length) return null

        const weights = matches
          .map((m) => (m.weight == null ? null : Number(m.weight)))
          .filter((v) => typeof v === 'number' && !Number.isNaN(v))
        const repsArr = matches
          .map((m) => (m.reps == null ? null : Number(m.reps)))
          .filter((v) => typeof v === 'number' && !Number.isNaN(v))
        const vols = matches
          .map((m) => {
            const w = m.weight == null ? null : Number(m.weight)
            const r = m.reps == null ? null : Number(m.reps)
            const s = m.sets == null ? null : Number(m.sets)
            if ([w, r, s].some((x) => typeof x !== 'number' || Number.isNaN(x))) return null
            return w * r * s
          })
          .filter((v) => typeof v === 'number' && !Number.isNaN(v))

        const weight = weights.length ? Math.max(...weights) : null
        const reps = repsArr.length ? Math.max(...repsArr) : null
        const volume = vols.length ? Math.max(...vols) : null
        return {
          date: session.completed_at,
          weight,
          reps,
          volume,
        }
      })
      .filter(Boolean)
    return items
  })()

  const metricMeta = {
    weight: {
      label: 'Peso (máximo por sesión)',
      unit: 'kg',
      description: 'Muestra el peso máximo registrado para este ejercicio en cada sesión.',
    },
    reps: {
      label: 'Reps (máximo por sesión)',
      unit: 'reps',
      description: 'Muestra la mayor cantidad de repeticiones registradas para este ejercicio en cada sesión.',
    },
    volume: {
      label: 'Volumen (máximo por sesión)',
      unit: 'kg',
      description: 'Muestra el volumen máximo: peso × reps × series para este ejercicio en cada sesión.',
    },
  }

  const activeMeta = metricMeta[metric] ?? metricMeta.weight
  const metricValues = (series || [])
    .map((p) => p?.[metric])
    .filter((v) => typeof v === 'number' && !Number.isNaN(v))
  const metricStats =
    metricValues.length >= 2
      ? {
          last: metricValues[metricValues.length - 1],
          min: Math.min(...metricValues),
          max: Math.max(...metricValues),
          count: metricValues.length,
        }
      : null

  const totals = (() => {
    const workouts = progress.length
    const last = progress[0]?.completed_at ?? null
    const volume = progress.reduce((sum, session) => {
      const v = (session.exercises || []).reduce((acc, ex) => {
        const w = ex.weight == null ? 0 : Number(ex.weight)
        const r = ex.reps == null ? 0 : Number(ex.reps)
        const s = ex.sets == null ? 0 : Number(ex.sets)
        return acc + w * r * s
      }, 0)
      return sum + v
    }, 0)
    const groups = progress.reduce((acc, session) => {
      ;(session.exercises || []).forEach((ex) => {
        const key = ex.muscleGroup || 'otros'
        acc[key] = (acc[key] || 0) + 1
      })
      return acc
    }, {})
    const topGroup = Object.entries(groups).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    return { workouts, last, volume, topGroup }
  })()

  const chartRef = useRef(null)

  const shareChart = async () => {
    if (!chartRef.current) return
    
    try {
      // Buscar el SVG dentro del contenedor del gráfico
      const svgElement = chartRef.current.querySelector('svg.mini-chart')
      if (!svgElement) {
        setStatus('No se pudo encontrar el gráfico')
        setTimeout(() => setStatus(''), 3000)
        return
      }
      
      // Obtener las dimensiones del viewBox del SVG original
      const viewBox = svgElement.getAttribute('viewBox')
      const [,, svgViewWidth, svgViewHeight] = viewBox ? viewBox.split(' ').map(Number) : [0, 0, 1200, 500]
      
      // Dimensiones del contenedor compartido
      const containerWidth = 1200
      const containerPadding = 40
      const headerHeight = 100
      const footerHeight = 80
      const svgDisplayHeight = 600
      const containerHeight = headerHeight + svgDisplayHeight + footerHeight + (containerPadding * 2)
      
      // Crear un contenedor temporal para renderizar solo el gráfico
      const shareContainer = document.createElement('div')
      shareContainer.style.position = 'absolute'
      shareContainer.style.left = '-9999px'
      shareContainer.style.width = `${containerWidth}px`
      shareContainer.style.height = `${containerHeight}px`
      shareContainer.style.background = 'linear-gradient(180deg, #1a0a2e 0%, #16213e 100%)'
      shareContainer.style.padding = `${containerPadding}px`
      shareContainer.style.fontFamily = 'Inter, sans-serif'
      shareContainer.style.borderRadius = '16px'
      shareContainer.style.boxSizing = 'border-box'
      
      // Agregar header con el nombre del ejercicio y la métrica
      const header = document.createElement('div')
      header.style.marginBottom = '30px'
      header.style.textAlign = 'center'
      
      const exerciseTitle = document.createElement('h2')
      exerciseTitle.textContent = selectedExercise || 'Ejercicio'
      exerciseTitle.style.color = '#ffffff'
      exerciseTitle.style.fontSize = '36px'
      exerciseTitle.style.fontWeight = '700'
      exerciseTitle.style.margin = '0 0 12px 0'
      exerciseTitle.style.lineHeight = '1.2'
      
      const metricLabel = document.createElement('p')
      metricLabel.textContent = activeMeta.label
      metricLabel.style.color = 'rgba(255, 255, 255, 0.85)'
      metricLabel.style.fontSize = '20px'
      metricLabel.style.fontWeight = '500'
      metricLabel.style.margin = '0'
      metricLabel.style.opacity = '0.9'
      
      header.appendChild(exerciseTitle)
      header.appendChild(metricLabel)
      shareContainer.appendChild(header)
      
      // Clonar el SVG y ajustar sus dimensiones
      const svgClone = svgElement.cloneNode(true)
      const svgDisplayWidth = containerWidth - (containerPadding * 2)
      svgClone.setAttribute('width', svgDisplayWidth)
      svgClone.setAttribute('height', svgDisplayHeight)
      svgClone.setAttribute('viewBox', viewBox)
      svgClone.style.display = 'block'
      svgClone.style.width = `${svgDisplayWidth}px`
      svgClone.style.height = `${svgDisplayHeight}px`
      
      shareContainer.appendChild(svgClone)
      
      // Agregar el texto "Compartido desde AngaX"
      const footer = document.createElement('div')
      footer.style.marginTop = '20px'
      footer.style.paddingTop = '20px'
      footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.15)'
      footer.style.textAlign = 'center'
      footer.style.color = '#ffffff'
      footer.style.fontSize = '18px'
      footer.style.fontWeight = '500'
      footer.style.letterSpacing = '0.5px'
      footer.textContent = 'Compartido desde AngaX'
      
      shareContainer.appendChild(footer)
      document.body.appendChild(shareContainer)
      
      // Esperar a que se renderice
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Convertir a imagen
      const canvas = await html2canvas(shareContainer, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
      
      // Convertir canvas a blob y guardar en sessionStorage
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64data = reader.result
            const chartName = `grafica-${selectedExercise.replace(/\s+/g, '-')}-${metric}.png`
            sessionStorage.setItem('shareImage', base64data)
            sessionStorage.setItem('shareImageName', chartName)
            
            // Limpiar
            document.body.removeChild(shareContainer)
            
            // Navegar a Comunidad
            navigate('/comunidad')
          }
          reader.readAsDataURL(blob)
        } else {
          document.body.removeChild(shareContainer)
          setStatus('Error al generar la imagen del gráfico')
          setTimeout(() => setStatus(''), 3000)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error al generar imagen del gráfico:', error)
      setStatus('Error al generar la imagen del gráfico')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  if (!userLoaded) {
    return (
      <section className="section section-light progress-hub">
        <div className="section__inner container-xl text-center">
          <p>Cargando…</p>
        </div>
      </section>
    )
  }

  if (!canView) {
    return (
      <section className="section section-light progress-hub">
        <div className="section__inner container-xl text-center">
          <h2>Inicia sesión para ver tu Progreso</h2>
          <p>Aquí verás entrenamientos reales, métricas y gráficas.</p>
          <button className="btn btn-primary" onClick={() => ensureAuth()}>
            Iniciar sesión
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="programs-hub-full progress-hub">
      <div className="programs-hub-full__container">
        <div className="programs-hub-full__header">
          <div className="programs-hub-full__header-content">
            <p className="eyebrow" style={{ color: 'rgba(251, 191, 36, 0.7)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Ejecución + análisis</p>
            <h2>Progreso</h2>
            <p>Historial de entrenamientos, métricas y evolución por ejercicio.</p>
          </div>
        </div>

        <div className="programs-hub-full__content">

        <div className="progress__grid">
          <div className="progress-card">
            <p>Entrenamientos</p>
            <strong>{totals.workouts}</strong>
          </div>
          <div className="progress-card">
            <p>Volumen total</p>
            <strong>{Math.round(totals.volume).toLocaleString()} kg</strong>
          </div>
          <div className="progress-card">
            <p>Última sesión</p>
            <strong>{totals.last ? new Date(totals.last).toLocaleDateString() : '—'}</strong>
          </div>
          <div className="progress-card">
            <p>Grupo top</p>
            <strong>{totals.topGroup ? totals.topGroup.toString() : '—'}</strong>
          </div>
        </div>

        <div className="progress__layout">
          <div className="progress__chart-card">
            <header className="progress__chart-header">
              <div>
                <h3>Gráficas</h3>
                <p>Filtra por ejercicio para ver evolución.</p>
              </div>
              <div className="progress__chart-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
                  {allExercises.length ? (
                    allExercises.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  ) : (
                    <option value="">Sin datos</option>
                  )}
                </select>
                {series.length > 0 && (
                  <button className="btn btn-primary btn-sm" type="button" onClick={shareChart}>
                    Compartir gráfica
                  </button>
                )}
              </div>
            </header>

            <div className="progress__metric-tabs">
              <button
                type="button"
                className={`progress__metric-tab ${metric === 'weight' ? 'active' : ''}`}
                onClick={() => setMetric('weight')}
              >
                Peso
              </button>
              <button
                type="button"
                className={`progress__metric-tab ${metric === 'reps' ? 'active' : ''}`}
                onClick={() => setMetric('reps')}
              >
                Reps
              </button>
              <button
                type="button"
                className={`progress__metric-tab ${metric === 'volume' ? 'active' : ''}`}
                onClick={() => setMetric('volume')}
              >
                Volumen
              </button>
            </div>

            <div className="progress__metric-legend">
              <div className="progress__metric-legend-title">
                <span className="progress__metric-pill">{activeMeta.label}</span>
                <span className="progress__metric-pill subtle">{selectedExercise || '—'}</span>
              </div>
              <p className="progress__metric-legend-desc">{activeMeta.description}</p>
              <p className="progress__metric-legend-hint">Tip: pasa el ratón sobre los puntos para ver el detalle.</p>
              {metricStats && (
                <div className="progress__metric-stats">
                  <span>
                    Último: <strong>{Number(metricStats.last).toFixed(metric === 'weight' ? 1 : 0)}</strong> {activeMeta.unit}
                  </span>
                  <span>
                    Mín: <strong>{Number(metricStats.min).toFixed(metric === 'weight' ? 1 : 0)}</strong>
                  </span>
                  <span>
                    Máx: <strong>{Number(metricStats.max).toFixed(metric === 'weight' ? 1 : 0)}</strong>
                  </span>
                  <span>
                    Puntos: <strong>{metricStats.count}</strong>
                  </span>
                </div>
              )}
            </div>

            <div ref={chartRef}>
              <MiniLineChart points={series} valueKey={metric} meta={activeMeta} />
            </div>
          </div>

          <div className="progress__history">
            <header className="progress__history-header">
              <h3>Historial</h3>
              <button className="btn btn-outline btn-sm" type="button" onClick={fetchProgress} disabled={loading}>
                {loading ? 'Actualizando…' : 'Actualizar'}
              </button>
            </header>

            {status && <p className="builder-hint">{replaceEmojisWithIcons(status)}</p>}
            {!loading && progress.length === 0 ? (
              <p className="builder-hint">Todavía no has guardado entrenamientos. Ve a Rutinas y pulsa "Iniciar entrenamiento".</p>
            ) : (
              <>
                <ul className="progress__history-list" style={{ minHeight: '500px', position: 'relative' }}>
                  {progress
                    .slice((currentPage - 1) * 3, currentPage * 3)
                    .map((session) => (
                      <li key={session.id} className="progress__history-item">
                        <div className="progress__history-item-head">
                          <div>
                            <strong>{session.routineName}</strong>
                            <small>{session.completed_at ? new Date(session.completed_at).toLocaleString() : ''}</small>
                          </div>
                        </div>
                        <div className="progress__history-exercises">
                          {(session.exercises || []).slice(0, 6).map((ex) => (
                            <div key={`${session.id}_${ex.name}`} className="progress__history-exercise">
                              <span className="name">{ex.name}</span>
                              <span className="meta">
                                {ex.weight == null ? '' : `${ex.weight}kg · `}
                                {ex.reps}x{ex.sets}
                              </span>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                </ul>
                {progress.length > 3 && (
                  <div className="progress__history-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>←</span>
                      Anterior
                    </button>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#4a5568', 
                      fontWeight: '500',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      Página {currentPage} de {Math.ceil(progress.length / 3)}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(progress.length / 3), prev + 1))}
                      disabled={currentPage >= Math.ceil(progress.length / 3)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        opacity: currentPage >= Math.ceil(progress.length / 3) ? 0.5 : 1,
                        cursor: currentPage >= Math.ceil(progress.length / 3) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Siguiente
                      <span style={{ fontSize: '16px' }}>→</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

function CommunityPage({ currentUser, ensureAuth }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [status, setStatus] = useState('')
  const [commentsModalOpen, setCommentsModalOpen] = useState(null)
  // Max image size enforced by the frontend. If you need bigger uploads in dev,
  // start the backend using `servidor/dev-server.ps1` or `servidor/dev-server.bat`.
  const MAX_POST_IMAGE_BYTES = 10 * 1024 * 1024
  const [commentsByPost, setCommentsByPost] = useState({})
  const [commentsLoading, setCommentsLoading] = useState({})
  const [commentMessages, setCommentMessages] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [replyInputs, setReplyInputs] = useState({})
  const [commentSending, setCommentSending] = useState({})
  const [replyingTo, setReplyingTo] = useState({})
  const [pendingDeletePost, setPendingDeletePost] = useState(null)
  const [likeAnimations, setLikeAnimations] = useState({})
  const [commentLikeAnimations, setCommentLikeAnimations] = useState({})
  const [commentsPage, setCommentsPage] = useState({}) // { postId: pageNumber }
  const [commentsTotal, setCommentsTotal] = useState({}) // { postId: totalCount }

  const canPost = Boolean(currentUser)
  const renderPostContent = (post) => {
    const parsed = parseSharedWorkout(post?.content)
    if (!parsed) {
      return <p className="community-post__content community-post__content--pre">{post.content}</p>
    }

    return (
      <div className="shared-workout">
        <div className="shared-workout__header">
          <span className="shared-workout__badge">{parsed.type === 'routine' ? 'Rutina' : 'Entrenamiento'}</span>
          <div className="shared-workout__title">
            <strong>{parsed.title}</strong>
            {parsed.subtitle ? <span className="shared-workout__subtitle">Objetivo: {parsed.subtitle}</span> : null}
          </div>
        </div>

        <div className="shared-workout__grid">
          {parsed.items.length ? (
            parsed.items.map((it, idx) => (
              <div key={`${it.name}_${idx}`} className="shared-workout__item">
                <div className="shared-workout__item-name">{it.name}</div>
                <div className="shared-workout__item-meta">
                  {it.weight != null && <span className="chip">{it.weight}kg</span>}
                  {it.sets != null && it.reps != null ? (
                    <span className="chip">
                      {it.sets}x{it.reps}
                    </span>
                  ) : (
                    <span className="chip">{it.raw}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="shared-workout__empty">Sin ejercicios.</div>
          )}
        </div>
      </div>
    )
  }

  // Cargar comentarios automáticamente cuando se cargan los posts
  useEffect(() => {
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id).join(',')
      posts.forEach((post) => {
        // Solo cargar comentarios si no se han cargado antes y no se están cargando
        if (!commentsByPost[post.id] && !commentsLoading[post.id]) {
          fetchComments(post.id, 1)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.map(p => p.id).join(',')])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const prefill = params.get('prefill')
    if (prefill) {
      setContent((prev) => (prev && prev.trim().length ? prev : prefill))
      navigate('/comunidad', { replace: true })
    }
    
    // Cargar imagen desde sessionStorage si existe
    const shareImageData = sessionStorage.getItem('shareImage')
    const shareImageName = sessionStorage.getItem('shareImageName')
    if (shareImageData && shareImageName) {
      // Convertir base64 a File
      fetch(shareImageData)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], shareImageName, { type: 'image/png' })
          setImageFile(file)
          // Limpiar sessionStorage
          sessionStorage.removeItem('shareImage')
          sessionStorage.removeItem('shareImageName')
        })
        .catch(err => {
          console.error('Error al cargar imagen compartida:', err)
          sessionStorage.removeItem('shareImage')
          sessionStorage.removeItem('shareImageName')
        })
    }
  }, [location.search])

  const getAvatarStyle = (profilePhoto) => {
    if (profilePhoto) {
      const imageUrl = profilePhoto.startsWith('http') 
        ? profilePhoto 
        : `${backendBaseUrl}${profilePhoto}`
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'transparent'
      }
    }
    return {}
  }

  useEffect(() => {
    fetchPosts()
  }, [currentUser?.email])

  const fetchPosts = async () => {
    try {
      const url = new URL(`${apiBaseUrl}/posts`)
      if (currentUser?.email) {
        url.searchParams.set('user_email', currentUser.email)
      }
      const response = await fetch(url)
      const data = await response.json()
      setPosts(
        data.map((post) => ({
          ...post,
          likes_count: post.likes_count ?? 0,
          liked_by_user: post.liked_by_user ?? false,
        }))
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!ensureAuth()) return
    
    if (!content.trim() && !imageFile) {
      setStatus('Escribe algo o sube una imagen para publicar.')
      return
    }

    if (imageFile && imageFile.size > MAX_POST_IMAGE_BYTES) {
      setStatus('Error: La imagen es demasiado grande (máx 10MB).')
      return
    }
    
    setStatus('Publicando…')
    try {
      const formData = new FormData()
      formData.append('user_name', currentUser.name)
      formData.append('user_email', currentUser.email)
      if (content.trim()) {
        formData.append('content', content.trim())
      }
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch(`${apiBaseUrl}/posts`, {
        method: 'POST',
        body: formData,
      })
      
      // Some servers respond with HTML even if they claim JSON (e.g. when PHP hits POST limits).
      // Parse safely to avoid "Unexpected token '<'".
      const parseResponse = async () => {
        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json')) {
          return { message: await response.text() }
        }
        try {
          return await response.json()
        } catch {
          return { message: await response.text() }
        }
      }

      const data = await parseResponse()
      
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            'Error: La imagen es demasiado pesada para el límite del servidor. Reduce el tamaño o inicia el backend con `servidor/dev-server.ps1` (o `.bat`) para permitir archivos más grandes.'
          )
        }
        const errorMsg = data.message || data.error || 'No se pudo publicar'
        throw new Error(errorMsg)
      }
      
      setContent('')
      setImageFile(null)
      setStatus('Publicado ✅')
      setTimeout(() => setStatus(''), 3000)
      fetchPosts()
    } catch (error) {
      console.error('Error al publicar:', error)
      setStatus(error.message || 'Error al publicar. Intenta de nuevo.')
    }
  }

  const handleComposeClick = () => {
    if (!canPost) {
      ensureAuth()
    }
  }

  const fetchComments = async (postId, page = 1) => {
    setCommentsLoading((prev) => ({ ...prev, [postId]: true }))
    setCommentMessages((prev) => ({ ...prev, [postId]: '' }))
    try {
      const url = new URL(`${apiBaseUrl}/comments`)
      url.searchParams.append('post_id', parseInt(postId, 10).toString())
      url.searchParams.append('page', page.toString())
      url.searchParams.append('per_page', '4')
      if (currentUser?.email) {
        url.searchParams.append('user_email', currentUser.email)
      }
      const response = await fetch(url)
      if (!response.ok) {
        const text = await response.text()
        let errorMsg = 'No se pudieron cargar los comentarios. Intenta de nuevo.'
        try {
          const errorData = JSON.parse(text)
          errorMsg = errorData.message || errorData.error || errorMsg
        } catch {
          // Si no es JSON, usar el mensaje por defecto
        }
        throw new Error(errorMsg)
      }
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor devolvió una respuesta inválida.')
      }
      const data = await response.json()
      setCommentsByPost((prev) => ({ ...prev, [postId]: data.data || data }))
      if (data.total !== undefined) {
        setCommentsTotal((prev) => ({ ...prev, [postId]: data.total }))
      }
      setCommentsPage((prev) => ({ ...prev, [postId]: page }))
    } catch (error) {
      console.error('Error al cargar comentarios:', error)
      setCommentMessages((prev) => ({
        ...prev,
        [postId]: error.message || 'Error al cargar comentarios.',
      }))
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleToggleComments = (postId) => {
    if (commentsModalOpen === postId) {
      setCommentsModalOpen(null)
    } else {
      setCommentsModalOpen(postId)
      // Inicializar el array de comentarios si no existe
      if (!commentsByPost[postId]) {
        setCommentsByPost((prev) => ({ ...prev, [postId]: [] }))
      }
      // Cargar comentarios si no están cargados y no se están cargando
      if (!commentsByPost[postId]?.length && !commentsLoading[postId]) {
        fetchComments(postId, commentsPage[postId] || 1)
      }
    }
  }

  const handleCommentsPageChange = (postId, newPage) => {
    fetchComments(postId, newPage)
  }

  const handleDeleteComment = async (postId, commentId) => {
    if (!ensureAuth()) return
    setCommentMessages((prev) => ({ ...prev, [postId]: 'Eliminando comentario…' }))
    try {
      const response = await fetch(`${apiBaseUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: currentUser.email }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo eliminar el comentario.')
      }
      // Actualizar el total de comentarios
      setCommentsTotal((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }))
      // Recargar la página actual de comentarios
      const currentPage = commentsPage[postId] || 1
      fetchComments(postId, currentPage)
      setCommentMessages((prev) => ({ ...prev, [postId]: 'Comentario eliminado.' }))
      setTimeout(() => {
        setCommentMessages((prev) => ({ ...prev, [postId]: '' }))
      }, 2000)
    } catch (error) {
      setCommentMessages((prev) => ({
        ...prev,
        [postId]: error.message || 'Error al eliminar el comentario.',
      }))
    }
  }

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }))
  }

  const handleAddComment = async (postId, parentCommentId = null) => {
    if (!ensureAuth()) return
    const inputKey = parentCommentId ? `${postId}_${parentCommentId}` : postId
    const message = (parentCommentId ? replyInputs[inputKey] : commentInputs[postId])?.trim()
    if (!message) {
      setCommentMessages((prev) => ({ ...prev, [postId]: 'Escribe un comentario antes de enviar.' }))
      return
    }
    setCommentSending((prev) => ({ ...prev, [inputKey]: true }))
    setCommentMessages((prev) => ({ ...prev, [postId]: '' }))
    try {
      const response = await fetch(`${apiBaseUrl}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: parseInt(postId, 10),
          user_email: currentUser.email,
          content: message,
          parent_comment_id: parentCommentId ? parseInt(parentCommentId, 10) : null,
        }),
      })
      
      if (!response.ok) {
        let errorMsg = 'No se pudo agregar el comentario.'
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            errorMsg = errorData.message || errorData.error || errorMsg
          } else {
            const text = await response.text()
            console.error('Error del servidor (HTML):', text.substring(0, 200))
            errorMsg = `Error del servidor (${response.status}). Por favor, intenta de nuevo.`
          }
        } catch (e) {
          errorMsg = `Error del servidor (${response.status}). Por favor, intenta de nuevo.`
        }
        throw new Error(errorMsg)
      }
      
      const data = await response.json()
      if (parentCommentId) {
        setReplyInputs((prev) => ({ ...prev, [inputKey]: '' }))
        setReplyingTo((prev) => ({ ...prev, [inputKey]: false }))
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).map((comment) =>
            comment.id === parentCommentId
              ? { ...comment, replies: [...(comment.replies || []), data] }
              : comment
          ),
        }))
      } else {
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }))
        // Actualizar el total de comentarios
        setCommentsTotal((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }))
        // Si estamos en la primera página, agregar el comentario al inicio
        const currentPage = commentsPage[postId] || 1
        if (currentPage === 1) {
          setCommentsByPost((prev) => ({
            ...prev,
            [postId]: [data, ...(prev[postId] || [])].slice(0, 4), // Mantener solo 4 comentarios
          }))
        } else {
          // Si estamos en otra página, recargar la primera página
          fetchComments(postId, 1)
        }
      }
      setCommentMessages((prev) => ({ ...prev, [postId]: 'Comentario publicado ✅' }))
      setTimeout(() => {
        setCommentMessages((prev) => ({ ...prev, [postId]: '' }))
      }, 2500)
    } catch (error) {
      setCommentMessages((prev) => ({
        ...prev,
        [postId]: error.message || 'Error al agregar comentario.',
      }))
    } finally {
      setCommentSending((prev) => ({ ...prev, [inputKey]: false }))
    }
  }

  const handleToggleCommentLike = async (commentId, postId) => {
    if (!ensureAuth()) return
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked_by_user: !comment.liked_by_user,
            likes_count: Math.max(0, comment.likes_count + (comment.liked_by_user ? -1 : 1)),
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    liked_by_user: !reply.liked_by_user,
                    likes_count: Math.max(0, reply.likes_count + (reply.liked_by_user ? -1 : 1)),
                  }
                : reply
            ),
          }
        }
        return comment
      }),
    }))

    setCommentLikeAnimations((prev) => ({ ...prev, [commentId]: true }))
    setTimeout(() => {
      setCommentLikeAnimations((prev) => ({ ...prev, [commentId]: false }))
    }, 600)

    try {
      const response = await fetch(`${apiBaseUrl}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || data.error || 'No se pudo actualizar el like.')
      }
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, liked_by_user: data.liked, likes_count: data.likes_count }
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, liked_by_user: data.liked, likes_count: data.likes_count }
                  : reply
              ),
            }
          }
          return comment
        }),
      }))
    } catch (error) {
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              liked_by_user: !comment.liked_by_user,
              likes_count: Math.max(0, comment.likes_count + (comment.liked_by_user ? 1 : -1)),
            }
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      liked_by_user: !reply.liked_by_user,
                      likes_count: Math.max(0, reply.likes_count + (reply.liked_by_user ? 1 : -1)),
                    }
                  : reply
              ),
            }
          }
          return comment
        }),
      }))
      setCommentMessages((prev) => ({
        ...prev,
        [postId]: error.message || 'Error al actualizar el like.',
      }))
    }
  }

  const handleToggleLike = async (postId) => {
    if (!ensureAuth()) return

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked_by_user: !post.liked_by_user,
              likes_count: Math.max(
                0,
                post.likes_count + (post.liked_by_user ? -1 : 1)
              ),
            }
          : post
      )
    )

    try {
      const response = await fetch(`${apiBaseUrl}/likes/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_email: currentUser.email,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || data.error || 'No se pudo actualizar el like.')
      }
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, liked_by_user: data.liked, likes_count: data.likes_count }
            : post
        )
      )
      if (data.liked) {
        triggerLikeAnimation(postId)
      }
    } catch (error) {
      setStatus(error.message || 'Error al reaccionar. Intenta de nuevo.')
      setTimeout(() => setStatus(''), 2500)
      fetchPosts()
    }
  }

  const handleAskDeletePost = (postId) => {
    if (!ensureAuth()) return
    setPendingDeletePost(postId)
    setStatus('')
  }

  const handleCloseDeleteModal = () => {
    setPendingDeletePost(null)
    setStatus('')
  }

  const confirmDeletePost = async () => {
    if (!pendingDeletePost || !ensureAuth()) return
    setStatus('Eliminando publicación…')
    try {
      const response = await fetch(`${apiBaseUrl}/posts/${pendingDeletePost}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: currentUser.email }),
      })
      const data = await response.json()
      if (!response.ok) {
        const errorMsg = data.message || 'No se pudo eliminar la publicación.'
        throw new Error(errorMsg)
      }
      setStatus('Publicación eliminada.')
      setPosts((prev) => prev.filter((post) => post.id !== pendingDeletePost))
      setPendingDeletePost(null)
      setTimeout(() => setStatus(''), 2500)
    } catch (error) {
      setStatus(error.message || 'Error al eliminar la publicación.')
      setTimeout(() => setStatus(''), 2500)
    }
  }

  const formatDateTime = (value) => {
    if (!value) return ''
    try {
      return new Date(value).toLocaleString()
    } catch {
      return value
    }
  }

  const triggerLikeAnimation = (postId) => {
    setLikeAnimations((prev) => ({ ...prev, [postId]: true }))
    setTimeout(() => {
      setLikeAnimations((prev) => ({ ...prev, [postId]: false }))
    }, 600)
  }

  return (
    <section className="section section-white community">
      <div className="section__inner container-xl">

        <div className="community__layout">
          <div className="community__composer">
            <header>
              <h3>Publicar</h3>
              {!canPost && <span className="community__hint">Inicia sesión para publicar y reaccionar.</span>}
            </header>
            <form onSubmit={handleSubmit} onClick={handleComposeClick}>
              <div className="community__composer-row">
                <div className="community__composer-avatar" style={getAvatarStyle(currentUser?.photo)}>
                  {!currentUser?.photo && (currentUser?.name?.charAt(0)?.toUpperCase() ?? 'A')}
                </div>
                <textarea
                  rows="4"
                  placeholder="¿Qué está pasando?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={!canPost}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="community__file-label" style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!canPost}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null
                      if (file && file.size > MAX_POST_IMAGE_BYTES) {
                        setStatus('Error: La imagen es demasiado grande (máx 10MB).')
                        e.target.value = ''
                        setImageFile(null)
                        return
                      }
                      setImageFile(file)
                    }}
                  />
                  <span className="community__file-text">
                    {imageFile ? imageFile.name : 'Seleccionar imagen'}
                  </span>
                </label>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      const fileInput = document.querySelector('input[type="file"]')
                      if (fileInput) fileInput.value = ''
                    }}
                    style={{
                      background: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                    title="Eliminar imagen"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="community__composer-actions">
                {status && <span className={`community__status ${status.toLowerCase().includes('error') ? 'error' : ''}`}>{replaceEmojisWithIcons(status)}</span>}
                <button className="btn btn-primary" type="submit" disabled={!canPost || (!content.trim() && !imageFile)}>
                  Publicar
                </button>
              </div>
            </form>
          </div>

          <div className="community__feed">
            {posts.length === 0 ? (
              <p className="community__hint">Todavía no hay publicaciones. Sé el primero en compartir tu progreso.</p>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="community-post">
                  <div className="community-post__main">
                  <header>
                    <div
                      className="community-post__avatar"
                      style={getAvatarStyle(post.user_profile_photo)}
                      onClick={() => navigate(`/perfil?user=${encodeURIComponent(post.user_email)}`)}
                    >
                      {!post.user_profile_photo && (post.user_name?.charAt(0).toUpperCase() ?? 'A')}
                    </div>
                    <div className="community-post__user-info">
                      <strong
                        onClick={() => navigate(`/perfil?user=${encodeURIComponent(post.user_email)}`)}
                      >
                        {post.user_name}
                      </strong>
                      <small>{post.user_email}</small>
                    </div>
                    <div className="community-post__meta">
                      <span className="community-post__time">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </span>
                      {currentUser?.email === post.user_email && (
                        <button
                          type="button"
                          className="community-post__delete"
                          onClick={() => handleAskDeletePost(post.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </header>
                  {renderPostContent(post)}
                  {post.image_url && (
                    <div className="community-post__image">
                      <img
                        src={
                          post.image_url.startsWith('http')
                            ? post.image_url
                            : `${backendBaseUrl}${post.image_url}`
                        }
                        alt="Publicación de la comunidad"
                      />
                    </div>
                  )}
                  <footer className="community-post__footer">
                    <button
                      type="button"
                      className={`community-post__action ${
                        post.liked_by_user ? 'liked' : ''
                      } ${likeAnimations[post.id] ? 'animating' : ''}`}
                      onClick={() => {
                        if (!canPost) {
                          ensureAuth()
                          return
                        }
                        handleToggleLike(post.id)
                      }}
                    >
                      <span className="heart">❤️</span>
                      <span>{post.liked_by_user ? 'Motivado' : 'Motivar'}</span>
                      <span className="community-post__likes-count">{post.likes_count}</span>
                    </button>
                    <button
                      type="button"
                      className="community-post__action"
                      onClick={() => handleToggleComments(post.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span>Comentarios</span>
                      <span className="community-post__likes-count">
                        {commentsByPost[post.id]?.reduce(
                          (total, comment) => total + 1 + (comment.replies?.length || 0),
                          0
                        ) || 0}
                      </span>
                    </button>
                  </footer>
                  </div>
                  <div className="community-post__comments">
                    <div className="community-post__comments-panel">
                      {commentsLoading[post.id] ? (
                        <p className="community__hint">Cargando comentarios…</p>
                      ) : commentsByPost[post.id]?.length ? (
                        <ul className="community-post__comments-list">
                          {commentsByPost[post.id].map((comment) => (
                            <li key={comment.id} className="community-post__comment-item">
                              <div className="community-post__comment-header">
                                <div
                                  className="community-post__comment-avatar"
                                  style={getAvatarStyle(comment.user_profile_photo)}
                                  onClick={() => navigate(`/perfil?user=${encodeURIComponent(comment.user_email)}`)}
                                >
                                  {!comment.user_profile_photo && (comment.user_name?.charAt(0).toUpperCase() ?? 'A')}
                                </div>
                                <div className="community-post__comment-content">
                                  <strong
                                    onClick={() => navigate(`/perfil?user=${encodeURIComponent(comment.user_email)}`)}
                                  >
                                    {comment.user_name}
                                  </strong>
                                  <small>{formatDateTime(comment.created_at)}</small>
                                  <p>{comment.content}</p>
                                  <div className="community-post__comment-actions">
                                    <button
                                      type="button"
                                      className={`community-post__comment-like ${
                                        comment.liked_by_user ? 'liked' : ''
                                      } ${commentLikeAnimations[comment.id] ? 'animating' : ''}`}
                                      onClick={() => handleToggleCommentLike(comment.id, post.id)}
                                    >
                                      <span className="heart">❤️</span>
                                      <span>{comment.likes_count || 0}</span>
                                    </button>
                                    {canPost && (
                                      <button
                                        type="button"
                                        className="community-post__comment-reply"
                                        onClick={() => {
                                          const key = `${post.id}_${comment.id}`
                                          setReplyingTo((prev) => {
                                            const isCurrentlyReplying = prev[key]
                                            if (!isCurrentlyReplying) {
                                              setReplyInputs((prevInputs) => ({ ...prevInputs, [key]: '' }))
                                            }
                                            return { ...prev, [key]: !isCurrentlyReplying }
                                          })
                                        }}
                                      >
                                        Responder
                                      </button>
                                    )}
                                    {currentUser?.email === comment.user_email && (
                                      <button
                                        type="button"
                                        className="community-post__comment-delete"
                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {replyingTo[`${post.id}_${comment.id}`] && (
                                <div className="community-post__reply-form">
                                  <textarea
                                    placeholder="Escribe una respuesta…"
                                    value={replyInputs[`${post.id}_${comment.id}`] ?? ''}
                                    onChange={(e) =>
                                      setReplyInputs((prev) => ({
                                        ...prev,
                                        [`${post.id}_${comment.id}`]: e.target.value,
                                      }))
                                    }
                                    disabled={commentSending[`${post.id}_${comment.id}`]}
                                  />
                                  <div className="community-post__reply-actions">
                                    <button
                                      type="button"
                                      className="community-post__reply-cancel"
                                      onClick={() => {
                                        const key = `${post.id}_${comment.id}`
                                        setReplyingTo((prev) => ({ ...prev, [key]: false }))
                                        setReplyInputs((prev) => ({ ...prev, [key]: '' }))
                                      }}
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      className="community-post__reply-submit"
                                      onClick={() => handleAddComment(post.id, comment.id)}
                                      disabled={commentSending[`${post.id}_${comment.id}`]}
                                    >
                                      {commentSending[`${post.id}_${comment.id}`] ? 'Publicando…' : 'Responder'}
                                    </button>
                                  </div>
                                </div>
                              )}
                              {comment.replies && comment.replies.length > 0 && (
                                <ul className="community-post__replies-list">
                                  {comment.replies.map((reply) => (
                                    <li key={reply.id} className="community-post__reply-item">
                                      <div className="community-post__comment-header">
                                        <div
                                          className="community-post__comment-avatar"
                                          style={getAvatarStyle(reply.user_profile_photo)}
                                          onClick={() => navigate(`/perfil?user=${encodeURIComponent(reply.user_email)}`)}
                                        >
                                          {!reply.user_profile_photo && (reply.user_name?.charAt(0).toUpperCase() ?? 'A')}
                                        </div>
                                        <div className="community-post__comment-content">
                                          <strong
                                            onClick={() => navigate(`/perfil?user=${encodeURIComponent(reply.user_email)}`)}
                                          >
                                            {reply.user_name}
                                          </strong>
                                          <small>{formatDateTime(reply.created_at)}</small>
                                          <p>{reply.content}</p>
                                          <div className="community-post__comment-actions">
                                            <button
                                              type="button"
                                              className={`community-post__comment-like ${
                                                reply.liked_by_user ? 'liked' : ''
                                              } ${commentLikeAnimations[reply.id] ? 'animating' : ''}`}
                                              onClick={() => handleToggleCommentLike(reply.id, post.id)}
                                            >
                                              <span className="heart">❤️</span>
                                              <span>{reply.likes_count || 0}</span>
                                            </button>
                                            {currentUser?.email === reply.user_email && (
                                              <button
                                                type="button"
                                                className="community-post__comment-delete"
                                                onClick={() => handleDeleteComment(post.id, reply.id)}
                                              >
                                                Eliminar
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <p className="community__hint">No hay comentarios todavía.</p>
                          </div>
                        )}
                        {/* Controles de paginación - siempre visible si hay comentarios */}
                        {commentsByPost[post.id]?.length > 0 && (
                          <div className="comments-pagination">
                            <button
                              type="button"
                              className="comments-pagination__btn"
                              disabled={!commentsPage[post.id] || commentsPage[post.id] <= 1 || commentsLoading[post.id]}
                              onClick={() => handleCommentsPageChange(post.id, (commentsPage[post.id] || 1) - 1)}
                            >
                              Anterior
                            </button>
                            <span className="comments-pagination__info">
                              Página {commentsPage[post.id] || 1} de {Math.max(1, Math.ceil((commentsTotal[post.id] || commentsByPost[post.id]?.length || 0) / 4))}
                            </span>
                            <button
                              type="button"
                              className="comments-pagination__btn"
                              disabled={
                                (!commentsTotal[post.id] && (!commentsByPost[post.id] || commentsByPost[post.id].length <= 4)) ||
                                (commentsPage[post.id] || 1) >= Math.ceil((commentsTotal[post.id] || commentsByPost[post.id]?.length || 0) / 4) ||
                                commentsLoading[post.id]
                              }
                              onClick={() => handleCommentsPageChange(post.id, (commentsPage[post.id] || 1) + 1)}
                            >
                              Siguiente
                            </button>
                          </div>
                        )}
                      {canPost ? (
                        <div className="community-post__comment-form">
                          <textarea
                            placeholder="Un comentario"
                            value={commentInputs[post.id] ?? ''}
                            onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                            disabled={commentSending[post.id]}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            disabled={commentSending[post.id]}
                          >
                            {commentSending[post.id] ? 'Publicando…' : 'Comentar'}
                          </button>
                        </div>
                      ) : (
                        <p className="community__hint">Inicia sesión para comentar.</p>
                      )}
                        {commentMessages[post.id] && (
                          <p
                            className={`community__status ${
                              commentMessages[post.id].toLowerCase().includes('error') ? 'error' : ''
                            }`}
                          >
                            {replaceEmojisWithIcons(commentMessages[post.id])}
                          </p>
                        )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>


      {pendingDeletePost &&
        createPortal(
          <div className="confirm-modal open" role="dialog" aria-modal="true" aria-label="Eliminar publicación">
            <div className="confirm-modal__backdrop" onClick={handleCloseDeleteModal} />
            <div className="confirm-modal__content">
              <h4>Eliminar publicación</h4>
              <p>¿Seguro que deseas eliminar esta publicación? Esta acción no se puede deshacer.</p>
              <div className="confirm-modal__actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseDeleteModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-secondary" onClick={confirmDeletePost}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}

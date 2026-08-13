export interface IntroProps {
  senderName?: string
  welcomeMessage?: string
  coupleName?: string
  accentColor: string
  fontFamily?: string
  onOpen: () => void
}

export type IntroStyle =
  | 'envelope'
  | 'scratch'
  | 'dodge'
  | 'heartbeat'
  | 'spotlight'
  | 'typewriter'

export const INTRO_STYLES: { value: IntroStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'envelope', label: 'Envelope clássico', emoji: '💌', desc: 'Cartinha lacrada que se abre ao toque' },
  { value: 'scratch', label: 'Raspadinha do amor', emoji: '🎟️', desc: 'Raspe pra revelar a mensagem escondida' },
  { value: 'dodge', label: 'Botão que foge', emoji: '😜', desc: 'Pergunta com um "Não" que escapa do dedo' },
  { value: 'heartbeat', label: 'Coração que bate', emoji: '💓', desc: 'Toque o coração até ele explodir' },
  { value: 'spotlight', label: 'Lanterna no escuro', emoji: '🔦', desc: 'Arraste a lanterna pra revelar o presente' },
  { value: 'typewriter', label: 'Carta se escrevendo', emoji: '✍️', desc: 'A mensagem é escrita na sua frente' },
]

export function getIntroMessage(senderName?: string, welcomeMessage?: string): string {
  if (welcomeMessage?.trim()) return welcomeMessage
  if (senderName?.trim()) return `Olha o que ${senderName} preparou para você`
  return 'Um presente muito especial preparado com carinho para você'
}

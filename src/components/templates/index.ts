import RomanticTemplate from './romantic'
import WeddingTemplate from './wedding'
import BirthdayTemplate from './birthday'
import ProposalTemplate from './proposal'
import GenericTemplate from './generic'
import ValentineTemplate from './valentine'

export const templates = {
  romantic: {
    id: 'romantic',
    name: 'Romântico',
    description: 'Tons de rosa, corações flutuantes e animações suaves',
    component: RomanticTemplate,
    previewGradient: 'from-pink-50 via-rose-50 to-red-50',
    previewIcon: '💕'
  },
  wedding: {
    id: 'wedding',
    name: 'Casamento',
    description: 'Elegante, dourado, flores delicadas',
    component: WeddingTemplate,
    previewGradient: 'from-amber-50 via-white to-amber-50',
    previewIcon: '👑'
  },
  birthday: {
    id: 'birthday',
    name: 'Aniversário',
    description: 'Festivo, confetes, cores vibrantes',
    component: BirthdayTemplate,
    previewGradient: 'from-purple-100 via-pink-50 to-blue-100',
    previewIcon: '🎉'
  },
  proposal: {
    id: 'proposal',
    name: 'Pedido de Namoro',
    description: 'Surpresa, emotivo, efeitos de fogos',
    component: ProposalTemplate,
    previewGradient: 'from-slate-900 via-purple-900 to-slate-900',
    previewIcon: '💍'
  },
  generic: {
    id: 'generic',
    name: 'Presente',
    description: 'Versátil, minimalista, personalizável',
    component: GenericTemplate,
    previewGradient: 'from-gray-100 via-white to-gray-100',
    previewIcon: '🎁'
  },
  valentine: {
    id: 'valentine',
    name: 'Dia dos Namorados',
    description: 'Especial, tema amor eterno',
    component: ValentineTemplate,
    previewGradient: 'from-red-900 via-rose-900 to-red-950',
    previewIcon: '🌹'
  }
}

export type TemplateId = keyof typeof templates

export function getTemplate(id: TemplateId) {
  return templates[id]
}

export function getTemplateComponent(id: TemplateId) {
  return templates[id]?.component
}

import type { IntroProps, IntroStyle } from './types'
import EnvelopeIntro from './envelope-intro'
import ScratchIntro from './scratch-intro'
import DodgeIntro from './dodge-intro'
import HeartbeatIntro from './heartbeat-intro'
import SpotlightIntro from './spotlight-intro'
import TypewriterIntro from './typewriter-intro'

export { INTRO_STYLES } from './types'
export type { IntroStyle } from './types'

export default function IntroRouter({ style, ...props }: IntroProps & { style?: string }) {
  switch (style as IntroStyle) {
    case 'scratch':
      return <ScratchIntro {...props} />
    case 'dodge':
      return <DodgeIntro {...props} />
    case 'heartbeat':
      return <HeartbeatIntro {...props} />
    case 'spotlight':
      return <SpotlightIntro {...props} />
    case 'typewriter':
      return <TypewriterIntro {...props} />
    default:
      return <EnvelopeIntro {...props} />
  }
}

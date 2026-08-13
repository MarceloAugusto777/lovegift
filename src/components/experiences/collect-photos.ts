export function collectPhotos(
  photosJson: string,
  storySectionsJson: string,
  timelineEventsJson: string
): string[] {
  const all: string[] = []
  const push = (u?: string) => {
    if (!u || typeof u !== 'string') return
    if (!u.startsWith('data:image') && !u.startsWith('http')) return
    if (!all.includes(u)) all.push(u)
  }
  try {
    const gallery = JSON.parse(photosJson)
    if (Array.isArray(gallery)) gallery.forEach((p: unknown) => push(p as string))
  } catch {
    /* ignore */
  }
  try {
    const sections = JSON.parse(storySectionsJson)
    if (Array.isArray(sections)) {
      sections.forEach((s: { photo?: string; photos?: string[] }) => {
        push(s.photo)
        if (Array.isArray(s.photos)) s.photos.forEach((p) => push(p))
      })
    }
  } catch {
    /* ignore */
  }
  try {
    const events = JSON.parse(timelineEventsJson)
    if (Array.isArray(events)) {
      events.forEach((e: { photo?: string }) => push(e.photo))
    }
  } catch {
    /* ignore */
  }
  return all
}

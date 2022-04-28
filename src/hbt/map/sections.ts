import { MeasuredStampingLocation, SectionEndpoint } from '../types'

export const groupSectionEndpoints = (stamps: MeasuredStampingLocation[]): SectionEndpoint[] => {
    const result: SectionEndpoint[] = []
    stamps.forEach(stamp => {
        const last = result[result.length - 1]
        if (last && stamp.name === last.name) {
            last.stampingLocations.push(stamp)
            return
        }
        result.push({
            name: stamp.name,
            stampingLocations: [stamp]
        })
    })
    return result
}

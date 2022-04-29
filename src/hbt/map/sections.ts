import { MeasuredStampingLocation, SectionEndpoint } from '../types'

export type GroupSectionEndpoints = ReturnType<typeof groupSectionEndpoints>

export const groupSectionEndpoints = (distanceTreshold: number) => {
    const isSameSectionEndPoint = (
        last: SectionEndpoint,
        current: MeasuredStampingLocation
    ): boolean => {
        const distance = [...last.stampingLocations]
            .pop()?.distanceInMetersFromNextStampingLocation as number
        return current.name === last.name && distance < distanceTreshold
    }
    return (stamps: MeasuredStampingLocation[]): SectionEndpoint[] => {
        const result: SectionEndpoint[] = []
        stamps.forEach(stamp => {
            const last = result[result.length - 1]
            if (last && isSameSectionEndPoint(last, stamp)) {
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
}

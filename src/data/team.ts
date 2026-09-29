// Team member data
// This file imports team member data from JSON files in ./team/ directory
// To edit team members, edit the JSON files directly in src/data/team/.
// Each member needs: name and role. linkedinUrl is optional — when present the
// member's card links to it. There are no photos: cards render an initials
// monogram, so a forking charity never has to source or host portrait images.

import member1 from './team/chad-cole.json'
import member2 from './team/hai-nguyen.json'
import member3 from './team/daniel-gallagher.json'
import member4 from './team/nikhil-verma.json'
import member5 from './team/tom-zupancic.json'
import member6 from './team/william-korinek.json'
import member7 from './team/zachary-stross.json'
import member8 from './team/justin-yates.json'
import member9 from './team/sheridan-murphy.json'

export type TeamMember = {
  /** Full name; the first + last initials seed the avatar monogram. */
  name: string
  /** Role or title, e.g. "Founder", "Program Lead", "Treasurer". */
  role: string
  /**
   * Optional LinkedIn profile URL. Must be `https://` on linkedin.com (or a
   * subdomain) to render as a link — TeamMemberCard's `safeLinkedInUrl()`
   * ignores any other host or scheme, so the card shows without a link.
   */
  linkedinUrl?: string
}

export const team: TeamMember[] = [
  member1,
  member2,
  member3,
  member4,
  member5,
  member6,
  member7,
  member8,
  member9,
]

import React from 'react'
import { PENDING_TEXT, isPending, siteConfig } from '../../src/lib/site.config'
import { render, screen } from '@testing-library/react'

import TheFreeForCharityTeam, {
  teamHeading,
} from '../../src/components/home-page/TheFreeForCharityTeam'
import { team } from '../../src/data/team'

describe('TheFreeForCharityTeam component', () => {
  it('should render without crashing', () => {
    render(<TheFreeForCharityTeam />)
  })

  it('should display the team heading', () => {
    render(<TheFreeForCharityTeam />)
    expect(screen.getByText(teamHeading(siteConfig.name))).toBeInTheDocument()
  })

  it('should render a card per member with initials monograms and no photos', () => {
    const { container } = render(<TheFreeForCharityTeam />)
    // One heading per configured member -- the roster size is per-charity
    // content, so it is read from the data rather than pinned to a number
    // (none while the team is pending).
    const names = screen.queryAllByRole('heading', { level: 3 })
    expect(names).toHaveLength(team.length)
    // No portrait images anywhere in the team section.
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it('should display every configured member with their role', () => {
    render(<TheFreeForCharityTeam />)
    for (const member of team) {
      expect(screen.getByText(member.name)).toBeInTheDocument()
      // Several members can share a role (e.g. "Board Member").
      expect(screen.getAllByText(member.role).length).toBeGreaterThan(0)
    }
  })

  it('should have the team section with id="team"', () => {
    const { container } = render(<TheFreeForCharityTeam />)
    expect(container.querySelector('#team')).toBeInTheDocument()
  })
})

describe('TheFreeForCharityTeam with an empty roster', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('renders nothing when the team array is empty and not pending', () => {
    jest.isolateModules(() => {
      jest.doMock('@/data/team', () => ({ team: [] }))
      // Same module instance the component imports inside this isolated registry.
      require('../../src/lib/site.config').siteConfig.pending = []
      const EmptyTeam = require('../../src/components/home-page/TheFreeForCharityTeam').default
      const { container } = render(<EmptyTeam />)
      expect(container.firstChild).toBeNull()
    })
  })

  // A team the charity has not supplied yet (listed in siteConfig.pending) is
  // shown as a visible, non-link "awaiting information" placeholder instead of
  // silently disappearing.
  it('renders the section with a placeholder when the team is pending', () => {
    jest.isolateModules(() => {
      jest.doMock('@/data/team', () => ({ team: [] }))
      // Same module instance the component imports inside this isolated registry.
      const config = require('../../src/lib/site.config')
      config.siteConfig.pending = ['team']
      const PendingTeam = require('../../src/components/home-page/TheFreeForCharityTeam').default
      const { container } = render(<PendingTeam />)

      expect(container.querySelector('#team')).toBeInTheDocument()
      expect(screen.getByText(teamHeading(config.siteConfig.name))).toBeInTheDocument()
      expect(screen.getByText(config.PENDING_TEXT).closest('a')).toBeNull()
      expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    })
  })
})

describe('TheFreeForCharityTeam in the shipped config', () => {
  it('shows the placeholder exactly when the team is pending and empty', () => {
    render(<TheFreeForCharityTeam />)
    expect(Boolean(screen.queryByText(PENDING_TEXT))).toBe(isPending('team') && team.length === 0)
  })
})

// The heading prefixes "The", so a name that already starts with the article
// must not render "The The ... Team".
describe('teamHeading', () => {
  it('prefixes the article to a name without one', () => {
    expect(teamHeading('Example Pantry')).toBe('The Example Pantry Team')
    // Only the whole word counts as the article.
    expect(teamHeading('Theatre Guild')).toBe('The Theatre Guild Team')
  })

  it('does not double an article the name already has, in any case', () => {
    expect(teamHeading('The Brain Injury Research Foundation (TheBIRF)')).toBe(
      'The Brain Injury Research Foundation (TheBIRF) Team'
    )
    expect(teamHeading('the example society')).toBe('the example society Team')
    expect(teamHeading('  THE Example Society ')).toBe('THE Example Society Team')
  })

  it("renders this site's heading without a doubled article", () => {
    render(<TheFreeForCharityTeam />)
    expect(screen.queryByText(/The The/)).not.toBeInTheDocument()
  })
})

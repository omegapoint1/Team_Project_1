import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IncidentList from '../Incidents/IncidentList';

vi.mock('../../services/incidentService', () => ({
  incidentServerService: {
    getAll: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn()
  },
  incidentLocalService: {
    getAll: vi.fn(),
    saveAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    add: vi.fn(),
    syncWithServer: vi.fn()
  }
}));

vi.mock('../Incidents/IncidentFilters', () => ({
  default: ({ onFilterChange, initialFilters }) => (
    <div data-testid="incident-filters">
      <button onClick={() => onFilterChange({ ...initialFilters, status: ['Accepted'] })}>
        Change Filters
      </button>
    </div>
  )
}));

vi.mock('../Incidents/IncidentCard', () => ({
  default: ({ incident, onViewMore }) => (
    <div data-testid={`incident-card-${incident.id}`}>
      <h3>{incident.noisetype || incident.title || 'No Title'}</h3>
      <span>{incident.status}</span>
      <button onClick={() => onViewMore(incident)}>View Details</button>
    </div>
  )
}));

vi.mock('../Incidents/IncidentDetailModal', () => ({
  default: ({ isOpen, onClose, incident, onUpdateStatus }) => (
    isOpen ? (
      <div data-testid="incident-modal">
        <h2>{incident?.noisetype || incident?.title || 'No Title'}</h2>
        <button onClick={() => onUpdateStatus(incident?.id, 'Accepted', '')}>
          Accept
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  )
}));

vi.mock('../../common/ScrollableContainer', () => ({
  default: ({ children, headerTitle, headerActions, footer, emptyState }) => (
    <div data-testid="scrollable-container">
      <div data-testid="header-title">{headerTitle}</div>
      <div data-testid="header-actions">{headerActions}</div>
      <div data-testid="content">
        {children && children.length > 0 ? children : emptyState}
      </div>
      <div data-testid="footer">{footer}</div>
    </div>
  )
}));

import { incidentServerService, incidentLocalService } from '../../services/incidentService';

describe('IncidentList', () => {
  const mockIncidents = [
    {
      id: 'inc-001',
      noisetype: 'Construction',
      description: 'Construction work after 10pm',
      status: 'Pending',
      zone: 'North-West',
      severity: 8,
      datetime: '2026-03-01T22:30:00Z',
      created_at: '2026-03-01T22:30:00Z'
    },
    {
      id: 'inc-002',
      noisetype: 'Traffic',
      description: 'Constant honking during rush hour',
      status: 'Accepted',
      zone: 'Central',
      severity: 5,
      datetime: '2026-03-02T08:20:00Z',
      created_at: '2026-03-02T08:20:00Z'
    },
    {
      id: 'inc-003',
      noisetype: 'Party',
      description: 'Loud music after midnight',
      status: 'Rejected',
      zone: 'South-East',
      severity: 3,
      datetime: '2026-03-03T23:45:00Z',
      created_at: '2026-03-03T23:45:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    incidentLocalService.getAll.mockReturnValue(mockIncidents);
    incidentServerService.getAll.mockResolvedValue([...mockIncidents]);
    incidentServerService.update.mockResolvedValue({ success: true });
    incidentLocalService.update.mockReturnValue(true);
  });

  it('renders loading state initially', () => {
    incidentServerService.getAll.mockImplementation(() => new Promise(() => {}));
    
    render(<IncidentList />);
    expect(screen.getByText('Loading incidents...')).toBeInTheDocument();
  });

  it('loads incidents and displays statistics', async () => {
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Total Incidents')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('displays correct statistics', async () => {
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Total Incidents')).toBeInTheDocument();
    });

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(3);
  });

  it('handles refresh button click', async () => {
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Total Incidents')).toBeInTheDocument();
    });

    const refreshButton = screen.getByTitle('Refresh incidents');
    await userEvent.click(refreshButton);

    expect(incidentServerService.getAll).toHaveBeenCalledTimes(2);
  });

  it('handles empty incident list', async () => {
    incidentLocalService.getAll.mockReturnValue([]);
    incidentServerService.getAll.mockResolvedValue([]);

    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('No incidents found')).toBeInTheDocument();
    });
  });
});
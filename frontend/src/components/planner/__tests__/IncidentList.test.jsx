import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IncidentList from '../IncidentList';

vi.mock('../../../services/incidentService', () => ({
  incidentServerService: {
    getAll: vi.fn(),
    update: vi.fn()
  },
  incidentLocalService: {
    getAll: vi.fn(),
    saveAll: vi.fn(),
    update: vi.fn()
  }
}));

// Mock child components
vi.mock('../IncidentFilters', () => ({
  default: ({ onFilterChange, initialFilters }) => (
    <div data-testid="incident-filters">
      <button onClick={() => onFilterChange({ ...initialFilters, status: ['Accepted'] })}>
        Change Filters
      </button>
    </div>
  )
}));

vi.mock('../IncidentCard', () => ({
  default: ({ incident, onViewMore }) => (
    <div data-testid={`incident-card-${incident.id}`}>
      <h3>{incident.title}</h3>
      <span>{incident.status}</span>
      <button onClick={() => onViewMore(incident)}>View Details</button>
    </div>
  )
}));

vi.mock('../IncidentDetailModal', () => ({
  default: ({ isOpen, onClose, incident, onUpdateStatus }) => (
    isOpen ? (
      <div data-testid="incident-modal">
        <h2>{incident?.title}</h2>
        <button onClick={() => onUpdateStatus(incident?.id, 'Accepted', '')}>
          Accept
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  )
}));

vi.mock('../../common/ScrollableContainer', () => ({
  default: ({ children, headerTitle, emptyState }) => (
    <div data-testid="scrollable-container">
      <div data-testid="header-title">{headerTitle}</div>
      <div data-testid="content">
        {children && children.length > 0 ? children : emptyState}
      </div>
    </div>
  )
}));

// Import the mocked services
import { incidentServerService, incidentLocalService } from '../../../services/incidentService';

describe('IncidentList', () => {
  const mockIncidents = [
    {
      id: 'inc-001',
      title: 'Loud Construction Noise',
      description: 'Construction work after 10pm',
      status: 'Pending',
      zone: 'North-West',
      severity: 8,
      datetime: '2026-03-01T22:30:00Z',
      created_at: '2026-03-01T22:30:00Z'
    },
    {
      id: 'inc-002',
      title: 'Traffic Noise',
      description: 'Constant honking during rush hour',
      status: 'Accepted',
      zone: 'Central',
      severity: 5,
      datetime: '2026-03-02T08:20:00Z',
      created_at: '2026-03-02T08:20:00Z'
    },
    {
      id: 'inc-003',
      title: 'Party Noise',
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
    
    // Setup default mock implementations
    incidentLocalService.getAll.mockReturnValue(mockIncidents);
    incidentServerService.getAll.mockResolvedValue(mockIncidents);
    incidentServerService.update.mockResolvedValue({ success: true });
    incidentLocalService.update.mockReturnValue(true);
  });

  it('renders loading state initially', () => {
    incidentServerService.getAll.mockImplementation(() => new Promise(() => {}));
    
    render(<IncidentList />);
    expect(screen.getByText('Loading incidents...')).toBeInTheDocument();
  });

  it('loads and displays incidents', async () => {
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText(/Incident Reports \(3\)/)).toBeInTheDocument();
    });

    expect(screen.getByText('Loud Construction Noise')).toBeInTheDocument();
    expect(screen.getByText('Traffic Noise')).toBeInTheDocument();
    expect(screen.getByText('Party Noise')).toBeInTheDocument();
  });

  it('displays correct statistics', async () => {
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Total Incidents')).toBeInTheDocument();
    });

    expect(screen.getByText('3')).toBeInTheDocument(); // Total
  });

  it('handles refresh button click', async () => {
    const user = userEvent.setup();
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText(/Incident Reports \(3\)/)).toBeInTheDocument();
    });

    const refreshButton = screen.getByTitle('Refresh incidents');
    await user.click(refreshButton);

    expect(incidentServerService.getAll).toHaveBeenCalledTimes(2); // Initial + refresh
  });

  it('opens incident details modal when view more clicked', async () => {
    const user = userEvent.setup();
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Loud Construction Noise')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View Details');
    await user.click(viewButtons[0]);

    expect(screen.getByTestId('incident-modal')).toBeInTheDocument();
  });

  it('handles incident status update', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Loud Construction Noise')).toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByText('View Details');
    await user.click(viewButtons[0]);

    // Accept incident
    const acceptButton = screen.getByText('Accept');
    await user.click(acceptButton);

    await waitFor(() => {
      expect(incidentServerService.update).toHaveBeenCalled();
      expect(incidentLocalService.update).toHaveBeenCalled();
    });
  });

  it('handles empty incident list', async () => {
    incidentLocalService.getAll.mockReturnValue([]);
    incidentServerService.getAll.mockResolvedValue([]);

    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('No incidents found')).toBeInTheDocument();
    });
  });

  it('closes modal when close button clicked', async () => {
    const user = userEvent.setup();
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Loud Construction Noise')).toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByText('View Details');
    await user.click(viewButtons[0]);
    expect(screen.getByTestId('incident-modal')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(screen.queryByTestId('incident-modal')).not.toBeInTheDocument();
  });

  it('handles generate report button click', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText(/Incident Reports \(3\)/)).toBeInTheDocument();
    });

    // Find and click the Generate Report button in the footer
    const reportButton = screen.getByText('Generate Report');
    await user.click(reportButton);

    expect(alertMock).toHaveBeenCalledWith('Generating incident report');
  });
});
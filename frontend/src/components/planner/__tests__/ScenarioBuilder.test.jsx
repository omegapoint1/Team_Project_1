import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScenarioBuilder from '../Scenario/ScenarioBuilder';
import { interventionServerService, interventionLocalService } from '../../services/interventionService';

vi.mock('../../services/interventionService', () => ({
  interventionServerService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  interventionLocalService: {
    getAll: vi.fn(),
    saveAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

describe('ScenarioBuilder', () => {
  const mockInterventions = [
    {
      id: 1,
      name: 'Noise Barrier',
      description: 'Physical barrier to reduce noise',
      cost: 45000,
      impact: { min: 8, max: 12 },
      feasibility: 7,
      tags: ['barrier', 'physical']
    },
    {
      id: 2,
      name: 'Speed Signage',
      description: 'Digital speed awareness signs',
      cost: 3500,
      impact: { min: 2, max: 4 },
      feasibility: 9,
      tags: ['traffic', 'signage']
    },
    {
      id: 3,
      name: 'Green Buffer',
      description: 'Dense hedgerows along noise corridors',
      cost: 15000,
      impact: { min: 2, max: 5 },
      feasibility: 7,
      tags: ['green', 'natural']
    }
  ];

  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    interventionServerService.getAll.mockResolvedValue(mockInterventions);
    interventionLocalService.getAll.mockReturnValue(mockInterventions);
  });

  it('renders loading state initially', () => {
    interventionServerService.getAll.mockImplementation(() => new Promise(() => {}));
    
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    expect(screen.getByText('Loading interventions...')).toBeInTheDocument();
  });

  it('loads and displays interventions', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
      expect(screen.getByText('Speed Signage')).toBeInTheDocument();
      expect(screen.getByText('Green Buffer')).toBeInTheDocument();
    });
  });

  it('displays intervention details correctly', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Physical barrier to reduce noise')).toBeInTheDocument();
      expect(screen.getByText('Digital speed awareness signs')).toBeInTheDocument();
      expect(screen.getByText('Dense hedgerows along noise corridors')).toBeInTheDocument();
    });
  });

  it('allows selecting and deselecting interventions', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const interventionItems = screen.getAllByRole('checkbox');
    await userEvent.click(interventionItems[0]);
    
    expect(interventionItems[0]).toBeChecked();
    
    await userEvent.click(interventionItems[0]);
    expect(interventionItems[0]).not.toBeChecked();
  });

  it('shows preview when interventions are selected', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const interventionItems = screen.getAllByRole('checkbox');
    await userEvent.click(interventionItems[0]);
    
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Cost:')).toBeInTheDocument();
    expect(screen.getByText('Impact:')).toBeInTheDocument();
    expect(screen.getByText('Feasibility:')).toBeInTheDocument();
  });

  it('calculates metrics correctly for single intervention', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const interventionItems = screen.getAllByRole('checkbox');
    await userEvent.click(interventionItems[0]);
    
    expect(screen.getByText('£45,000')).toBeInTheDocument();
    expect(screen.getByText('8.0-12.0 dB')).toBeInTheDocument();
    expect(screen.getByText('7.00/10')).toBeInTheDocument();
  });

  it('calculates metrics correctly for multiple interventions', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const interventionItems = screen.getAllByRole('checkbox');
    await userEvent.click(interventionItems[0]);
    await userEvent.click(interventionItems[1]);
    
    expect(screen.getByText('£48,500')).toBeInTheDocument();
    expect(screen.getByText('10.0-16.0 dB')).toBeInTheDocument();
    expect(screen.getByText('8.00/10')).toBeInTheDocument();
  });

  it('allows entering scenario name and description', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByPlaceholderText('Enter scenario name');
    const descriptionTextarea = screen.getByPlaceholderText('Describe this scenario...');
    
    await userEvent.type(nameInput, 'Test Scenario');
    await userEvent.type(descriptionTextarea, 'This is a test scenario description');
    
    expect(nameInput).toHaveValue('Test Scenario');
    expect(descriptionTextarea).toHaveValue('This is a test scenario description');
  });

  it('validates required fields before saving', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const saveButton = screen.getByText('Save Scenario');
    expect(saveButton).toBeDisabled();
    
    expect(alertMock).not.toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('saves scenario with correct data', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByPlaceholderText('Enter scenario name');
    await userEvent.type(nameInput, 'Test Scenario');
    
    const interventionItems = screen.getAllByRole('checkbox');
    await userEvent.click(interventionItems[0]);
    await userEvent.click(interventionItems[1]);
    
    const saveButton = screen.getByText('Save Scenario');
    await userEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    const savedScenario = mockOnSave.mock.calls[0][0];
    
    expect(savedScenario.name).toBe('Test Scenario');
    expect(savedScenario.interventionIds).toEqual([1, 2]);
    expect(savedScenario.metrics.totalCost).toBe(48500);
    expect(savedScenario.metrics.impact.min).toBe(10);
    expect(savedScenario.metrics.impact.max).toBe(16);
    expect(savedScenario.metrics.feasibility).toBe(8);
    expect(savedScenario.scores).toBeDefined();
    expect(savedScenario.createdAt).toBeDefined();
  });

  it('closes modal when cancel button is clicked', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when close button is clicked', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('×');
    await userEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays tags for interventions', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('barrier')).toBeInTheDocument();
      expect(screen.getByText('physical')).toBeInTheDocument();
      expect(screen.getByText('traffic')).toBeInTheDocument();
      expect(screen.getByText('signage')).toBeInTheDocument();
    });
  });

  it('handles server error gracefully', async () => {
    interventionServerService.getAll.mockRejectedValue(new Error('Server error'));
    interventionLocalService.getAll.mockReturnValue(mockInterventions);
    
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
  });

  it('disables save button when no name or no interventions', async () => {
    render(<ScenarioBuilder onSave={mockOnSave} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    });
    
    const saveButton = screen.getByText('Save Scenario');
    expect(saveButton).toBeDisabled();
    
    const nameInput = screen.getByPlaceholderText('Enter scenario name');
    await userEvent.type(nameInput, 'Test');
    
    expect(saveButton).toBeDisabled();
    
    const interventionItems = screen.getAllByRole('checkbox');
    await userEvent.click(interventionItems[0]);
    
    expect(saveButton).not.toBeDisabled();
  });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlanBuilder from '../PlanBuilder';

// Mock the zones data
vi.mock('../PlannerData/mitigationsData', () => ({
  zones: [
    { id: 'zone-1', name: 'North-West', type: 'residential', priority: 'high' },
    { id: 'zone-2', name: 'Central', type: 'commercial', priority: 'medium' }
  ]
}));

describe('PlanBuilder', () => {
  const mockInterventions = [
    {
      id: 1,
      name: 'Noise Barrier',
      description: 'Physical barrier to reduce noise',
      cost: [35000, 55000],
      impact: [8, 12],
      category: 'physical',
      feasibility: 0.7
    },
    {
      id: 2,
      name: 'Speed Signage',
      description: 'Digital speed awareness signs',
      cost: [2500, 4500],
      impact: [2, 4],
      category: 'traffic',
      feasibility: 0.9
    }
  ];

  const mockOnCreatePlan = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the plan builder with all sections', () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    expect(screen.getByText('Create Mitigation Plan')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Available Interventions')).toBeInTheDocument();
    expect(screen.getByText('Selected Interventions (0)')).toBeInTheDocument();
    expect(screen.getByText('Plan Configuration')).toBeInTheDocument();
    expect(screen.getByText('Plan Summary')).toBeInTheDocument();
  });

  it('displays all available interventions', () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    expect(screen.getByText('Speed Signage')).toBeInTheDocument();
  });

  it('allows adding interventions to the plan', async () => {
    const user = userEvent.setup();
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    expect(screen.getByText('No interventions selected yet')).toBeInTheDocument();
    
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]);
    
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.queryByText('No interventions selected yet')).not.toBeInTheDocument();
    expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
  });

  it('prevents adding the same intervention twice', async () => {
    const user = userEvent.setup();
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]);
    
    // Button should be disabled
    expect(screen.getByText('Added')).toBeDisabled();
    
    // Selected interventions should only have one item
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(1);
  });

  it('allows removing interventions from the plan', async () => {
    const user = userEvent.setup();
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    // Add an intervention
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]);
    
    expect(screen.getByText('Noise Barrier')).toBeInTheDocument();
    
    // Remove it
    const removeButton = screen.getByText('Remove');
    await user.click(removeButton);
    
    expect(screen.getByText('No interventions selected yet')).toBeInTheDocument();
  });

  it('calculates total cost correctly', async () => {
    const user = userEvent.setup();
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]); // Noise Barrier
    
    // Average of 35000-55000 = 45000
    expect(screen.getByText('£45000')).toBeInTheDocument();
  });

  it('calculates total impact correctly', async () => {
    const user = userEvent.setup();
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]); // Noise Barrier: 8-12 dB
    await user.click(addButtons[1]); // Speed Signage: 2-4 dB
    
    expect(screen.getByText('10-16 dB reduction')).toBeInTheDocument();
  });

  it('calculates budget remaining', async () => {
    const user = userEvent.setup();
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    // Add low-cost intervention
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[1]); // Speed Signage
    
    expect(screen.getByText('£1500')).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const createButton = screen.getByText('Create Plan');
    await user.click(createButton);
    
    expect(alertMock).toHaveBeenCalledWith(
      'Please fill in all required fields and add at least one intervention'
    );
    expect(mockOnCreatePlan).not.toHaveBeenCalled();
  });

  it('submits the plan with correct data when valid', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    // Fill in plan name
    const nameInput = screen.getByPlaceholderText('e.g., Zone A Quiet Zone Implementation');
    await user.type(nameInput, 'Test Plan');
    
    // Select a zone
    const zoneSelect = screen.getByRole('combobox');
    await user.selectOptions(zoneSelect, 'zone-1');
    
    // Add an intervention
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]);
    
    // Submit the form
    const createButton = screen.getByText('Create Plan');
    await user.click(createButton);
    
    expect(alertMock).toHaveBeenCalledWith('Plan created successfully!');
    expect(mockOnCreatePlan).toHaveBeenCalledTimes(1);
    
    const submittedPlan = mockOnCreatePlan.mock.calls[0][0];
    expect(submittedPlan.name).toBe('Test Plan');
    expect(submittedPlan.zone).toBe('zone-1');
    expect(submittedPlan.interventions).toEqual(['1']);
    expect(submittedPlan.status).toBe('draft');
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    // Fill in plan name
    const nameInput = screen.getByPlaceholderText('e.g., Zone A Quiet Zone Implementation');
    await user.type(nameInput, 'Test Plan');
    
    // Select a zone
    const zoneSelect = screen.getByRole('combobox');
    await user.selectOptions(zoneSelect, 'zone-1');
    
    // Add an intervention
    const addButtons = screen.getAllByText('Add');
    await user.click(addButtons[0]);
    
    // Submit the form
    const createButton = screen.getByText('Create Plan');
    await user.click(createButton);
    
    expect(nameInput).toHaveValue('');
    expect(zoneSelect).toHaveValue('');
    expect(screen.getByText('No interventions selected yet')).toBeInTheDocument();
  });

  it('handles empty interventions list', () => {
    render(<PlanBuilder interventions={[]} onCreatePlan={mockOnCreatePlan} />);
    
    expect(screen.getByText('Available Interventions')).toBeInTheDocument();
  });

  it('displays intervention stats correctly', () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    expect(screen.getByText('Cost: £35000-55000')).toBeInTheDocument();
    expect(screen.getByText('Impact: 8-12 dB')).toBeInTheDocument();
  });
});
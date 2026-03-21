import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlanBuilder from '../Mitigations/PlanBuilder';

// Mock the zones data
vi.mock('../Mitigations/PlannerData/mitigationsData', () => ({
  zones: [
    { id: 1, name: 'North-West', type: 'residential', priority: 'high' },
    { id: 2, name: 'North-Central-West', type: 'residential', priority: 'medium' },
    { id: 3, name: 'North-Central-East', type: 'residential', priority: 'medium' },
    { id: 4, name: 'North-East', type: 'residential', priority: 'high' },
    { id: 5, name: 'Central-North-West', type: 'mixed', priority: 'medium' },
    { id: 6, name: 'Central-North-Central-West', type: 'mixed', priority: 'medium' },
    { id: 7, name: 'Central-North-Central-East', type: 'mixed', priority: 'medium' },
    { id: 8, name: 'Central-North-East', type: 'mixed', priority: 'medium' },
    { id: 9, name: 'Central-South-West', type: 'mixed', priority: 'low' },
    { id: 10, name: 'Central-South-Central-West', type: 'mixed', priority: 'low' },
    { id: 11, name: 'Central-South-Central-East', type: 'mixed', priority: 'low' },
    { id: 12, name: 'Central-South-East', type: 'mixed', priority: 'low' },
    { id: 13, name: 'South-West', type: 'commercial', priority: 'high' },
    { id: 14, name: 'South-Central-West', type: 'commercial', priority: 'medium' },
    { id: 15, name: 'South-Central-East', type: 'commercial', priority: 'medium' },
    { id: 16, name: 'South-East', type: 'commercial', priority: 'high' }
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
    
    expect(screen.getByText('Physical barrier to reduce noise')).toBeInTheDocument();
    expect(screen.getByText('Digital speed awareness signs')).toBeInTheDocument();
  });

  it('allows adding interventions to the plan', async () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    expect(screen.getByText('No interventions selected yet')).toBeInTheDocument();
    
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]);
    
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.queryByText('No interventions selected yet')).not.toBeInTheDocument();
    
    const removeButton = screen.getByText('Remove');
    expect(removeButton).toBeInTheDocument();
  });

  it('prevents adding the same intervention twice', async () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]);
    
    const addedButton = screen.getByText('Added');
    expect(addedButton).toBeDisabled();
    
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(1);
  });

  it('allows removing interventions from the plan', async () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]);
    
    const removeButton = screen.getByText('Remove');
    expect(removeButton).toBeInTheDocument();
    
    await userEvent.click(removeButton);
    
    expect(screen.getByText('No interventions selected yet')).toBeInTheDocument();
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('calculates total cost correctly', async () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]);
    
    // Average of 35000-55000 = 45000
    expect(screen.getByText('£45000')).toBeInTheDocument();
  });

  it('calculates total impact correctly', async () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]); 
    await userEvent.click(addButtons[1]); 
  
    expect(screen.getByText('10-16 dB reduction')).toBeInTheDocument();
  });

  it('calculates budget remaining', async () => {
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[1]);
    
    expect(screen.getByText('£1500')).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    const createButton = screen.getByText('Create Plan');
    await userEvent.click(createButton);
    
    expect(alertMock).toHaveBeenCalledWith(
      'Please fill in all required fields and add at least one intervention'
    );
    expect(mockOnCreatePlan).not.toHaveBeenCalled();
  });

  it('submits the plan with correct data when valid', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    // Fill in plan name
    const nameInput = screen.getByPlaceholderText('e.g., Zone A Quiet Zone Implementation');
    await userEvent.type(nameInput, 'Test Plan');
    
    // Select a zone
    const zoneSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(zoneSelect, '1');
    
    // Add an intervention
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]);
    
    // Submit the form
    const createButton = screen.getByText('Create Plan');
    await userEvent.click(createButton);
    
    expect(alertMock).toHaveBeenCalledWith('Plan created successfully!');
    expect(mockOnCreatePlan).toHaveBeenCalledTimes(1);
    
    const submittedPlan = mockOnCreatePlan.mock.calls[0][0];
    expect(submittedPlan.name).toBe('Test Plan');
    expect(submittedPlan.zone).toBe('1');
    expect(submittedPlan.interventions).toEqual(['1']);
    expect(submittedPlan.status).toBe('Planned');
  });

  it('resets form after successful submission', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PlanBuilder interventions={mockInterventions} onCreatePlan={mockOnCreatePlan} />);
    
    // Fill in plan name
    const nameInput = screen.getByPlaceholderText('e.g., Zone A Quiet Zone Implementation');
    await userEvent.type(nameInput, 'Test Plan');
    
    // Select a zone
    const zoneSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(zoneSelect, '1');
    
    // Add an intervention
    const addButtons = screen.getAllByText('Add');
    await userEvent.click(addButtons[0]);
    
    // Submit the form
    const createButton = screen.getByText('Create Plan');
    await userEvent.click(createButton);
    
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
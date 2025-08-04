import React, { useState } from 'react';
import { Component, ComponentCategory } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface ComponentFormProps {
  component?: Component;
  onSubmit: (data: Omit<Component, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const ComponentForm: React.FC<ComponentFormProps> = ({
  component,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: component?.name || '',
    manufacturer: component?.manufacturer || '',
    partNumber: component?.partNumber || '',
    description: component?.description || '',
    quantity: component?.quantity || 0,
    location: component?.location || '',
    unitPrice: component?.unitPrice || 0,
    datasheetLink: component?.datasheetLink || '',
    category: component?.category || 'Resistors' as ComponentCategory,
    criticalLowThreshold: component?.criticalLowThreshold || 10,
    lastMovement: component?.lastMovement
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: 'Resistors', label: 'Resistors' },
    { value: 'Capacitors', label: 'Capacitors' },
    { value: 'Inductors', label: 'Inductors' },
    { value: 'Semiconductors', label: 'Semiconductors' },
    { value: 'ICs', label: 'ICs' },
    { value: 'Connectors', label: 'Connectors' },
    { value: 'Sensors', label: 'Sensors' },
    { value: 'Tools', label: 'Tools' },
    { value: 'PCBs', label: 'PCBs' },
    { value: 'Other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Component name is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.partNumber.trim()) newErrors.partNumber = 'Part number is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity must be non-negative';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.unitPrice < 0) newErrors.unitPrice = 'Unit price must be non-negative';
    if (formData.criticalLowThreshold < 0) newErrors.criticalLowThreshold = 'Threshold must be non-negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Component Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="e.g., Carbon Film Resistor"
          required
        />

        <Input
          label="Manufacturer/Supplier"
          value={formData.manufacturer}
          onChange={(e) => handleChange('manufacturer', e.target.value)}
          error={errors.manufacturer}
          placeholder="e.g., Yageo"
          required
        />

        <Input
          label="Part Number"
          value={formData.partNumber}
          onChange={(e) => handleChange('partNumber', e.target.value)}
          error={errors.partNumber}
          placeholder="e.g., CFR-25JB-52-10K"
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={categoryOptions}
          error={errors.category}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            placeholder="e.g., 10kΩ ±5% 1/4W Carbon Film Resistor"
            required
          />
        </div>

        <Input
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
          error={errors.quantity}
          min="0"
          required
        />

        <Input
          label="Location/Bin"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          error={errors.location}
          placeholder="e.g., A1-B2"
          required
        />

        <Input
          label="Unit Price ($)"
          type="number"
          step="0.01"
          value={formData.unitPrice}
          onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
          error={errors.unitPrice}
          min="0"
          required
        />

        <Input
          label="Critical Low Threshold"
          type="number"
          value={formData.criticalLowThreshold}
          onChange={(e) => handleChange('criticalLowThreshold', parseInt(e.target.value) || 0)}
          error={errors.criticalLowThreshold}
          min="0"
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Datasheet Link (Optional)"
            type="url"
            value={formData.datasheetLink}
            onChange={(e) => handleChange('datasheetLink', e.target.value)}
            error={errors.datasheetLink}
            placeholder="https://example.com/datasheet.pdf"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {component ? 'Update Component' : 'Add Component'}
        </Button>
      </div>
    </form>
  );
};
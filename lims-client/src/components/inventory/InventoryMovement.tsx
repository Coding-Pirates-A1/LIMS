import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, Calendar, User } from 'lucide-react';
import { Component, InventoryMovement } from '../../types';
import { componentsAPI, inventoryAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface InventoryMovementProps {
  type: 'inward' | 'outward';
}

export const InventoryMovementComponent: React.FC<InventoryMovementProps> = ({ type }) => {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [project, setProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const data = await componentsAPI.getAll();
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    }
  };

  const selectedComponent = components.find(c => c.id === selectedComponentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComponent || !user) return;

    setIsLoading(true);
    
    try {
      const movement: Omit<InventoryMovement, 'id' | 'timestamp'> = {
        componentId: selectedComponent.id,
        type,
        quantity,
        userId: user.id,
        username: user.username,
        reason,
        project: project || undefined,
      };

      await inventoryAPI.recordMovement(movement);

      // Update component quantity
      const newQuantity = type === 'inward' 
        ? selectedComponent.quantity + quantity
        : selectedComponent.quantity - quantity;

      await componentsAPI.update(selectedComponent.id, { 
        quantity: Math.max(0, newQuantity),
        lastMovement: new Date().toISOString()
      });

      // Reset form
      setSelectedComponentId('');
      setQuantity(0);
      setReason('');
      setProject('');
      setIsSubmitted(true);
      
      // Refresh components list
      fetchComponents();

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to record movement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = selectedComponentId && quantity > 0 && reason.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        {type === 'inward' ? (
          <TrendingUp className="w-8 h-8 text-green-600" />
        ) : (
          <TrendingDown className="w-8 h-8 text-red-600" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {type} Inventory
          </h1>
          <p className="text-gray-600">
            {type === 'inward' ? 'Add components to inventory' : 'Remove components from inventory'}
          </p>
        </div>
      </div>

      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">
              Successfully recorded {type} movement!
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Select
                label="Select Component"
                value={selectedComponentId}
                onChange={(e) => setSelectedComponentId(e.target.value)}
                options={[
                  { value: '', label: 'Choose a component...' },
                  ...components.map(c => ({
                    value: c.id,
                    label: `${c.name} (${c.partNumber}) - ${c.quantity} available`
                  }))
                ]}
                required
              />
            </div>

            {selectedComponent && (
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{selectedComponent.name}</h3>
                    <p className="text-sm text-gray-600">{selectedComponent.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Part: {selectedComponent.partNumber}</span>
                      <span>Location: {selectedComponent.location}</span>
                      <span>Available: {selectedComponent.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Quantity"
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              min="1"
              max={type === 'outward' ? selectedComponent?.quantity : undefined}
              placeholder="Enter quantity"
              required
            />

            <Input
              label="Project (Optional)"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g., Project Alpha, Batch #123"
            />

            <div className="md:col-span-2">
              <Input
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={type === 'inward' ? 'e.g., Purchase order #1234, RMA return' : 'e.g., Production use, Testing, Prototype development'}
                required
              />
            </div>
          </div>

          {type === 'outward' && selectedComponent && quantity > selectedComponent.quantity && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Insufficient stock! Available: {selectedComponent.quantity}, Requested: {quantity}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Recorded by: {user?.username}</span>
              <Calendar className="w-4 h-4 ml-4" />
              <span>{new Date().toLocaleString()}</span>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onCancel} type="button">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid || isLoading || (type === 'outward' && selectedComponent && quantity > selectedComponent.quantity)}
                variant={type === 'inward' ? 'primary' : 'danger'}
              >
                {isLoading ? 'Processing...' : `Record ${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
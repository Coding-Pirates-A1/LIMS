import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Package,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Component, ComponentCategory, SearchFilters } from '../../types';
import { componentsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { ComponentForm } from './ComponentForm';

export const ComponentsList: React.FC = () => {
  const { isAdmin } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    minQuantity: 0,
    maxQuantity: 999999
  });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
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

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [components, filters]);

  const fetchComponents = async () => {
    try {
      const data = await componentsAPI.getAll();
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = components;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(component =>
        component.name.toLowerCase().includes(query) ||
        component.partNumber.toLowerCase().includes(query) ||
        component.manufacturer.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(component => component.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(component =>
        component.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    filtered = filtered.filter(component =>
      component.quantity >= filters.minQuantity && component.quantity <= filters.maxQuantity
    );

    setFilteredComponents(filtered);
  };

  const handleAddComponent = async (componentData: Omit<Component, 'id' | 'createdAt'>) => {
    try {
      const newComponent = await componentsAPI.create(componentData);
      setComponents(prev => [...prev, newComponent]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add component:', error);
    }
  };

  const handleEditComponent = async (componentData: Omit<Component, 'id' | 'createdAt'>) => {
    if (!selectedComponent) return;
    
    try {
      const updatedComponent = await componentsAPI.update(selectedComponent.id, componentData);
      setComponents(prev => prev.map(c => c.id === selectedComponent.id ? updatedComponent : c));
      setShowEditModal(false);
      setSelectedComponent(null);
    } catch (error) {
      console.error('Failed to update component:', error);
    }
  };

  const handleDeleteComponent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return;
    
    try {
      await componentsAPI.delete(id);
      setComponents(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
  };

  const getStockStatus = (component: Component) => {
    if (component.quantity <= component.criticalLowThreshold) {
      return { status: 'critical', color: 'text-red-600 bg-red-100' };
    } else if (component.quantity <= component.criticalLowThreshold * 2) {
      return { status: 'low', color: 'text-orange-600 bg-orange-100' };
    }
    return { status: 'good', color: 'text-green-600 bg-green-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Components Inventory</h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {isAdmin && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search components by name, part number, manufacturer..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as ComponentCategory | '' }))}
              options={categoryOptions}
            />
            <Input
              label="Location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Filter by location"
            />
            <Input
              label="Min Quantity"
              type="number"
              value={filters.minQuantity || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, minQuantity: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
            <Input
              label="Max Quantity"
              type="number"
              value={filters.maxQuantity === 999999 ? '' : filters.maxQuantity}
              onChange={(e) => setFilters(prev => ({ ...prev, maxQuantity: parseInt(e.target.value) || 999999 }))}
              placeholder="No limit"
            />
          </div>
        )}
      </div>

      {/* Components Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComponents.map((component) => {
                const stockStatus = getStockStatus(component);
                
                return (
                  <tr key={component.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {component.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {component.manufacturer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{component.partNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {component.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {component.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {component.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        {component.unitPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {component.datasheetLink && (
                          <a
                            href={component.datasheetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedComponent(component);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComponent(component.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No components found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Component Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Component"
        size="lg"
      >
        <ComponentForm
          onSubmit={handleAddComponent}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Component Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedComponent(null);
        }}
        title="Edit Component"
        size="lg"
      >
        {selectedComponent && (
          <ComponentForm
            component={selectedComponent}
            onSubmit={handleEditComponent}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedComponent(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
// src/components/OrganizationSelector.tsx
import { useState } from 'react';
import { organizations } from '../data/organizations';

interface OrganizationSelectorProps {
  selectedOrganization: string;
  onChange: (organizationId: string) => void;
  label?: string;
}

export const OrganizationSelector = ({ 
  selectedOrganization, 
  onChange, 
  label = 'Organization' 
}: OrganizationSelectorProps) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        value={selectedOrganization}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Select an organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
};
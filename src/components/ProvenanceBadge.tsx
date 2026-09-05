'use client';

import React from 'react';
import type { ProvenanceType } from '@/lib/types';

// ============================================================================
// PROVENANCE BADGE COMPONENT
// ============================================================================

interface ProvenanceBadgeProps {
  provenance: ProvenanceType;
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PROVENANCE_CONFIG: Record<
  ProvenanceType,
  {
    label: string;
    icon: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    description: string;
  }
> = {
  VERIFIED_OFFICIAL: {
    label: 'Verified Official',
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    description: 'Matches real government structure or fact from official sources (MoSPI, NSSTA, FRAC)',
  },
  PROPOSED_FRAMEWORK: {
    label: 'Proposed Framework',
    icon: '⚠️',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    description: 'Structurally grounded in official methodology, but specific content is our proposal',
  },
  PROPOSED_METHODOLOGY: {
    label: 'Proposed Methodology',
    icon: '⚠️',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    description: 'Our team proposed formula or methodology (e.g., gap severity calculation)',
  },
  SYNTHETIC_DEMO_DATA: {
    label: 'Demo Data',
    icon: '🟡',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-700',
    description: 'Fabricated for demonstration; no claim to real-world accuracy',
  },
};

/**
 * ProvenanceBadge Component
 * Renders a visual badge indicating data provenance with optional tooltip
 */
export function ProvenanceBadge({
  provenance,
  showLabel = true,
  showTooltip = true,
  size = 'md',
}: ProvenanceBadgeProps) {
  const config = PROVENANCE_CONFIG[provenance];
  const [showTooltipContent, setShowTooltipContent] = React.useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2.5 py-1.5 text-sm gap-1.5',
    lg: 'px-3 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className="relative inline-block align-middle">
      <span
        className={`
          inline-flex items-center rounded-md border
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          ${sizeClasses[size]}
          font-medium transition-colors duration-200
          ${showTooltip ? 'cursor-help hover:opacity-80' : ''}
        `}
        onMouseEnter={() => showTooltip && setShowTooltipContent(true)}
        onMouseLeave={() => setShowTooltipContent(false)}
        title={config.description}
      >
        <span className={iconSizes[size]}>{config.icon}</span>
        {showLabel && <span>{config.label}</span>}
      </span>

      {/* Tooltip */}
      {showTooltipContent && showTooltip && (
        <span
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            bg-gray-900 text-white
            rounded-md px-3 py-2 text-xs font-normal whitespace-nowrap
            pointer-events-none shadow-lg block
          `}
        >
          {config.description}
          {/* Tooltip arrow */}
          <span
            className={`
              absolute top-full left-1/2 -translate-x-1/2
              border-4 border-transparent
              border-t-gray-900 block
            `}
          />
        </span>
      )}
    </span>
  );
}

/**
 * ProvenanceBadgeInline
 * Compact inline variant (no label, just icon)
 */
export function ProvenanceBadgeInline({ provenance }: Pick<ProvenanceBadgeProps, 'provenance'>) {
  return <ProvenanceBadge provenance={provenance} showLabel={false} size="sm" />;
}

/**
 * ProvenanceIndicator
 * Text-only indicator (no badge styling)
 */
export function ProvenanceIndicator({ provenance }: Pick<ProvenanceBadgeProps, 'provenance'>) {
  const config = PROVENANCE_CONFIG[provenance];
  return (
    <span className="text-xs font-medium" title={config.description}>
      {config.icon} {config.label}
    </span>
  );
}

/**
 * ProvenanceDisclosure
 * Full description card for legal/compliance page
 */
export function ProvenanceDisclosure() {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h3 className="text-lg font-semibold">Data Provenance & Transparency</h3>

      <p className="text-sm text-gray-600">
        StatVidya explicitly labels every domain data element with its origin and verification status. This
        transparency ensures you always know whether data represents official government fact, our team&apos;s proposal,
        or demonstration simulations.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(Object.entries(PROVENANCE_CONFIG) as Array<[ProvenanceType, (typeof PROVENANCE_CONFIG)[ProvenanceType]]>).map(
          ([type, config]) => (
            <div
              key={type}
              className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{config.icon}</span>
                <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
              </div>
              <p className="text-sm text-gray-700">{config.description}</p>
            </div>
          )
        )}
      </div>

      <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p>
          <strong>Questions?</strong> Read more about our framework alignment in the{' '}
          <a href="/docs/frac" className="underline hover:text-gray-700">
            FRAC documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default ProvenanceBadge;

'use client';

import React from 'react';
import type { ProvenanceType } from '@/lib/types';
import { ShieldCheck, FileEdit, FlaskConical, AlertTriangle } from 'lucide-react';

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
    IconComponent: React.ComponentType<{ className?: string }>;
    bgColor: string;
    borderColor: string;
    textColor: string;
    description: string;
  }
> = {
  VERIFIED_OFFICIAL: {
    label: 'Verified Official',
    IconComponent: ShieldCheck,
    bgColor: 'bg-[#555934]/12',
    borderColor: '',
    textColor: 'text-[#555934]',
    description: 'Matches real government structure or fact from official sources (MoSPI, NSSTA, FRAC)',
  },
  PROPOSED_FRAMEWORK: {
    label: 'Proposed Framework',
    IconComponent: FileEdit,
    bgColor: 'bg-[#BF9B7A]/20',
    borderColor: '',
    textColor: 'text-[#593E2E]',
    description: 'Structurally grounded in official methodology, but specific content is our proposal',
  },
  PROPOSED_METHODOLOGY: {
    label: 'Proposed Methodology',
    IconComponent: FlaskConical,
    bgColor: 'bg-[#BF9B7A]/20',
    borderColor: '',
    textColor: 'text-[#593E2E]',
    description: 'Our team proposed formula or methodology (e.g., gap severity calculation)',
  },
  SYNTHETIC_DEMO_DATA: {
    label: 'Demo Data',
    IconComponent: AlertTriangle,
    bgColor: 'bg-[#8C5B3E]/12',
    borderColor: '',
    textColor: 'text-[#8C5B3E]',
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
  const IconComponent = config.IconComponent;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span className="relative inline-block align-middle">
      <span
        className={`
          inline-flex items-center rounded-full
          ${config.bgColor} ${config.textColor}
          ${sizeClasses[size]}
          font-medium transition-colors duration-200
          ${showTooltip ? 'cursor-help hover:opacity-80' : ''}
        `}
        onMouseEnter={() => showTooltip && setShowTooltipContent(true)}
        onMouseLeave={() => setShowTooltipContent(false)}
        title={config.description}
      >
        <IconComponent className={iconSizes[size]} />
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
  const IconComponent = config.IconComponent;
  return (
    <span className="text-xs font-medium flex items-center gap-1" title={config.description}>
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

/**
 * ProvenanceDisclosure
 * Full description card for legal/compliance page
 */
export function ProvenanceDisclosure() {
  return (
    <div className="space-y-4 rounded-2xl bg-[#F2E6D8]/50 p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground">Data Provenance & Transparency</h3>

      <p className="text-sm text-muted-foreground">
        StatVidya explicitly labels every domain data element with its origin and verification status. This
        transparency ensures you always know whether data represents official government fact, our team&apos;s proposal,
        or demonstration simulations.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(Object.entries(PROVENANCE_CONFIG) as Array<[ProvenanceType, (typeof PROVENANCE_CONFIG)[ProvenanceType]]>).map(
          ([type, cfg]) => {
            const IconComponent = cfg.IconComponent;
            return (
              <div
                key={type}
                className={`rounded-xl p-4 shadow-2xs ${cfg.bgColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-5 h-5 text-inherit" />
                  <span className={`font-semibold ${cfg.textColor}`}>{cfg.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{cfg.description}</p>
              </div>
            );
          }
        )}
      </div>

      <div className="text-xs text-muted-foreground pt-4">
        <p>
          <strong className="text-foreground">Questions?</strong> Read more about our framework alignment in the{' '}
          <a href="/docs/frac" className="font-medium text-primary hover:text-primary-dark transition-colors underline">
            FRAC documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default ProvenanceBadge;

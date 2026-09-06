'use client';

/**
 * src/contexts/AssessmentModeContext.tsx
 *
 * Global context that signals to AppLayout whether a test is currently active.
 * When isAssessmentActive is true, the Sidebar and Topbar are hidden so the
 * test environment gets the full viewport.
 *
 * Usage:
 *   const { setAssessmentActive } = useAssessmentMode();
 *   setAssessmentActive(true);   // hide chrome
 *   setAssessmentActive(false);  // restore chrome
 */

import React, { createContext, useContext, useState } from 'react';

interface AssessmentModeContextValue {
  isAssessmentActive: boolean;
  setAssessmentActive: (active: boolean) => void;
}

const AssessmentModeContext = createContext<AssessmentModeContextValue>({
  isAssessmentActive: false,
  setAssessmentActive: () => {},
});

export function AssessmentModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAssessmentActive, setAssessmentActive] = useState(false);

  return (
    <AssessmentModeContext.Provider
      value={{ isAssessmentActive, setAssessmentActive }}
    >
      {children}
    </AssessmentModeContext.Provider>
  );
}

export function useAssessmentMode(): AssessmentModeContextValue {
  return useContext(AssessmentModeContext);
}

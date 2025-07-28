import { useState, useMemo } from 'react';
import { useUserStore } from '@store/userStore';
import { markSearchPerformed } from '@utils/sessionService';

export function useHomeScreenData() {
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState('');

  const pantryLastUpdated = useUserStore((s) => s.pantryLastUpdated);
  const consecutiveInactiveOpens = useUserStore((s) => s.consecutiveInactiveOpens);
  const { resetInactiveOpens } = useUserStore((s) => s.actions);

  const showEasterEgg = consecutiveInactiveOpens >= 3;
  const promptText = showEasterEgg
    ? 'The potential in your kitchen remains untapped. We trust you enjoyed your pre-packaged satisfaction.'
    : 'What do you desire?';

  const needsUpdate = pantryLastUpdated
    ? Date.now() - pantryLastUpdated > 7 * 24 * 60 * 60 * 1000
    : false;

  const submit = (onSubmit: (q: string) => void) => {
    if (!query.trim()) return;
    resetInactiveOpens();
    markSearchPerformed();
    onSubmit(query.trim());
    setQuery('');
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    query,
    setQuery,
    promptText,
    needsUpdate,
    submit,
  };
}

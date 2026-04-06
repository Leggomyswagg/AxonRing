// ── Base44 Backend — replaces Famous.ai Supabase ──
// All API calls go through Base44 backend functions at:
// https://tek-agent-65076290.base44.app/functions/<name>

export const BASE44_API = 'https://tek-agent-65076290.base44.app/functions';

// Stub to prevent import errors from any remaining supabase references
export const supabase = {
  functions: { invoke: async () => ({ data: null, error: new Error('Use BASE44_API instead') }) },
  from: () => ({ upsert: () => ({ select: () => ({ single: async () => ({ data: null }) }) }), insert: async () => ({ data: null }), select: () => ({ eq: () => ({ data: [] }) }) }),
};

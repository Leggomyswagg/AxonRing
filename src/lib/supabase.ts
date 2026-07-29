// Supabase has been replaced by Base44 backend functions.
// Orders and data are now handled via:
// - https://tek-agent-65076290.base44.app/functions/createPaymentIntent
// - https://tek-agent-65076290.base44.app/functions/saveOrder
//
// This file is kept as a placeholder to avoid import errors.
// You can safely remove any remaining supabase imports from components.

export const supabase = {
  functions: {
    invoke: async () => {
      console.warn('Supabase has been replaced by Base44 backend functions.');
      return { data: null, error: new Error('Use Base44 backend functions instead.') };
    },
  },
};

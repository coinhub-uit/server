import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    if (req.method !== 'DELETE') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    const userId = await req.text();
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await supabase.auth.admin.deleteUser(userId, true);
    if (error) {
      console.error('Error deleting user:', error);
      return new Response(error.message, { status: 400 });
    }

    return new Response('User deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

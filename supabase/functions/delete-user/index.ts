import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    if (req.method !== 'DELETE') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const reqKey = req.headers.get('x-service-role-key');

    if (!reqKey) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (reqKey !== serviceRoleKey) {
      return new Response('Forbidden', { status: 403 });
    }

    const userId = await req.text();
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, true);
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

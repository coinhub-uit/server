import { createClient } from 'npm:@supabase/supabase-js@2';
import { JWT } from 'npm:google-auth-library@9';
import serviceAccount from '../service-account.json' with { type: 'json' };

type NotificationEntity = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  userId: string;
  isRead: boolean;
};

type WebhookPayload = {
  type: 'INSERT';
  table: string;
  record: NotificationEntity;
  schema: 'public';
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const payload: WebhookPayload = await req.json();

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data } = await supabase
    .from('device')
    .select('fcmToken')
    .eq('userId', payload.record.userId);

  if (data && data?.length !== 0) {
    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    });

    const results = await Promise.all(
      data.map(({ fcmToken }) =>
        sendToFcm({
          fcmToken,
          accessToken,
          notificationEntity: payload.record,
        }),
      ),
    );

    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' },
      status: results.some(
        (result) => result.status < 200 || 299 < result.status,
      )
        ? 400
        : 200,
    });
  }

  return new Response('no user found', { status: 404 });
});

function getAccessToken({
  clientEmail,
  privateKey,
}: {
  clientEmail: string;
  privateKey: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens!.access_token!);
    });
  });
}

async function sendToFcm({
  fcmToken,
  accessToken,
  notificationEntity,
}: {
  fcmToken: string;
  accessToken: string;
  notificationEntity: NotificationEntity;
}) {
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: fcmToken,
          notification: {
            title: notificationEntity.title,
            body: notificationEntity.body,
          },
        },
      }),
    },
  );
  return await response.json();
}

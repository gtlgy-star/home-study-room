import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT =
  Deno.env.get("VAPID_SUBJECT") || "mailto:toughguy1234321@gmail.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: CORS_HEADERS,
      });
    }

    const body = await req.json().catch(() => ({}));
    const senderUserId = body?.senderUserId;
    const targetUserId = body?.targetUserId || "family";
    const messageScope = body?.messageScope || body?.recipientType || "family";
    const isFamilyMessage = messageScope === "family" || targetUserId === "family";

    let query = supabase
      .from("push_subscriptions")
      .select("id, user_id, endpoint, p256dh, auth")
      .eq("is_active", true);

    if (isFamilyMessage) {
      if (senderUserId) {
        query = query.neq("user_id", senderUserId);
      }
    } else {
      query = query.eq("user_id", targetUserId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "발송할 active push subscription이 없습니다.",
        }),
        {
          status: 404,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payload = JSON.stringify({
      title: "우리집 공부방",
      body: "행복 우체통에 새 메시지가 도착했어요.",
      url: "./index.html",
    });

    const results = [];

    for (const row of data) {
      const subscription = {
        endpoint: row.endpoint,
        keys: {
          p256dh: row.p256dh,
          auth: row.auth,
        },
      };

      try {
        await webpush.sendNotification(subscription, payload);

        results.push({
          id: row.id,
          user_id: row.user_id,
          ok: true,
        });
      } catch (sendError) {
        console.error("[MESSAGE PUSH SEND ERROR]", sendError);

        const pushError = sendError as { statusCode?: number; message?: string };
        const statusCode = Number(pushError.statusCode || 0);

        if (statusCode === 404 || statusCode === 410) {
          const { error: updateError } = await supabase
            .from("push_subscriptions")
            .update({
              is_active: false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", row.id);

          if (updateError) {
            console.error("[PUSH SUBSCRIPTION DEACTIVATE ERROR]", updateError);
          }
        }

        results.push({
          id: row.id,
          user_id: row.user_id,
          ok: false,
          statusCode,
          error: String(pushError.message || sendError),
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sent: results.filter((result) => result.ok).length,
        failed: results.filter((result) => !result.ok).length,
        results,
      }),
      {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[SEND MESSAGE PUSH ERROR]", error);
    const responseError = error as { message?: string };

    return new Response(
      JSON.stringify({
        ok: false,
        error: String(responseError.message || error),
      }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

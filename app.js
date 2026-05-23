const SUPABASE_URL = "https://ykqedrmzltvteafsjkvk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_a1KnbwXBq5PEvPIwkwnsGA_twi5_RdD";
const ADMIN_PASSWORD = "0801";
const VAPID_PUBLIC_KEY = "BN7KyENOF3eGocaEnAaUgEh4PzJqg2maILB_gHg4jmx-lPLG5X8GyeafComw6-lej1hFN0hT-rhwqwUlWBmoW3A";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const app = {
  user: null,
  today: getTodayText(),
  selectedDate: getTodayText(),
  planMode: "week",
  rangeStart: null,
  rangeEnd: null,
  rangeMonth: getTodayText().slice(0, 7),

  studyItems: [],
  plans: [],

  weeklyPlans: [],
  weeklyPlansKey: "",

  planWeekPlans: [],
  planWeekPlansKey: "",

  familyWeeklySummary: [],
  familyWeeklySummaryKey: "",

  familySummary: [],
  personalMonthlyScores: [],
  ddays: [],
  messages: [],
  unreadMailboxCount: 0,
  mailboxPreviewOpen: false,
  homeMailboxPreviewMessages: [],

  ddayTitleFallbacks: {},
  ddayMetaFallbacks: {},

  loadingActions: {},
  adminMode: false,
};

const FAMILY_ORDER = ["dad", "mom", "high", "middle"];

const LOGIN_PHOTOS = [
  "login-photos/ChatGPT Image 2026년 5월 19일 오전 01_11_06.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_01_40.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_13_27.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_18_46.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_22_41.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_26_07.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_35_59.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_37_56.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_41_45.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_44_45.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_48_36.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_53_20.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_55_38.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_57_21.png",
  "login-photos/ChatGPT Image 2026년 5월 20일 오후 08_59_12.png",
];

const STUDY_QUOTES = [
  "배우고 때때로 익히면 또한 기쁘지 아니한가. <공자>",
  "아는 것이 힘이다. <프랜시스 베이컨>",
  "나는 생각한다, 고로 존재한다. <르네 데카르트>",
  "천재는 1퍼센트의 영감과 99퍼센트의 노력이다. <토머스 에디슨>",
  "교육은 세상을 바꾸는 가장 강력한 무기이다. <넬슨 만델라>",
  "어제보다 나은 오늘이 되도록 배워라. <익명>",
  "성공은 매일 반복한 작은 노력들의 합이다. <로버트 콜리어>",
  "배움은 우연히 얻어지는 것이 아니라 열정과 부지런함으로 얻어진다. <애비게일 애덤스>",
  "오늘 할 수 있는 일을 내일로 미루지 말라. <벤저민 프랭클린>",
  "가장 큰 영광은 넘어지지 않는 것이 아니라 일어서는 데 있다. <공자>",
  "시작이 반이다. <아리스토텔레스>",
  "길이 없으면 길을 찾아라. 그래도 없으면 만들어라. <한니발>",
  "실패는 성공으로 가는 또 다른 발걸음이다. <오프라 윈프리>",
  "꾸준함이 재능을 이긴다. <익명>",
  "배움은 마음을 늙지 않게 한다. <솔론>",
  "질문하는 사람은 잠깐 바보가 되지만 질문하지 않는 사람은 평생 바보로 산다. <중국 속담>",
  "한 권의 책은 하나의 세계다. <윌리엄 워즈워스>",
  "독서는 완성된 사람을 만든다. <프랜시스 베이컨>",
  "오늘의 노력은 내일의 자신에게 보내는 선물이다. <익명>",
  "성공하려면 먼저 할 수 있다고 믿어야 한다. <니코스 카잔차키스>",
  "배움에는 끝이 없다. <속담>",
  "천 리 길도 한 걸음부터. <노자>",
  "지식보다 중요한 것은 상상력이다. <알베르트 아인슈타인>",
  "인생은 배우는 사람에게 친절하다. <익명>",
  "어려움은 사람을 강하게 만든다. <세네카>",
  "노력 없이 얻은 지식은 오래가지 않는다. <익명>",
  "작은 진전도 진전이다. <익명>",
  "공부는 미래의 나를 돕는 일이다. <익명>",
  "느리게 가도 멈추지만 않으면 된다. <공자>",
  "배움은 자신에게 주는 최고의 투자다. <벤저민 프랭클린>",
  "한 번에 하나씩, 그것이 모든 일을 끝내는 방법이다. <데일 카네기>",
  "오늘 읽은 한 줄이 내일의 생각을 바꾼다. <익명>",
  "목표가 있으면 길은 더 또렷해진다. <익명>",
  "할 수 있다고 생각하면 이미 반은 온 것이다. <시어도어 루스벨트>",
  "배움은 용기에서 시작된다. <익명>",
  "모르는 것을 아는 것이 참된 앎의 시작이다. <소크라테스>",
  "집중은 재능을 깨우는 열쇠다. <익명>",
  "노력은 배신하지 않는다. <익명>",
  "작은 습관이 큰 결과를 만든다. <제임스 클리어>",
  "책 없는 방은 영혼 없는 몸과 같다. <키케로>",
  "배운다는 것은 자신을 새롭게 만드는 일이다. <익명>",
  "계획 없는 목표는 한낱 소원일 뿐이다. <생텍쥐페리>",
  "성장은 편안함의 바깥에서 시작된다. <익명>",
  "오늘의 집중이 내일의 자신감을 만든다. <익명>",
  "지혜는 경험에서 오고 경험은 배움에서 자란다. <익명>",
  "가장 확실한 준비는 오늘 공부하는 것이다. <익명>",
  "반복은 실력을 만드는 가장 정직한 길이다. <익명>",
  "배움은 누구에게나 열려 있는 문이다. <익명>",
  "포기하지 않는 사람에게 시간은 편이 된다. <익명>",
  "어려운 문제는 깊은 생각을 키운다. <익명>",
  "매일 조금씩 나아가는 사람이 멀리 간다. <익명>",
  "오늘을 붙잡는 사람이 내일을 만든다. <요한 볼프강 폰 괴테>",
  "독서는 생각의 씨앗을 심는 일이다. <익명>",
  "실력은 조용히 쌓이고 어느 날 크게 드러난다. <익명>",
  "배움의 뿌리는 쓰지만 열매는 달다. <아리스토텔레스>",
  "할 수 있는 작은 일부터 시작하라. <마더 테레사>",
  "좋은 질문은 좋은 공부의 시작이다. <익명>",
  "성공은 준비와 기회가 만나는 곳에 있다. <세네카>",
  "공부하는 오늘이 꿈에 가까워지는 날이다. <익명>",
  "지금 시작하면 가장 빠른 시작이다. <익명>",
];

function $(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function getTodayText() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateKorean(dateText) {
  if (!dateText) return "";
  const date = new Date(dateText + "T00:00:00");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
}

function dateToText(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(dateText, offset) {
  const date = new Date(dateText + "T00:00:00");
  date.setDate(date.getDate() + offset);
  return dateToText(date);
}

function getDateDiffDays(fromDateText, toDateText) {
  const fromDate = new Date(fromDateText + "T00:00:00");
  const toDate = new Date(toDateText + "T00:00:00");
  return Math.round((toDate - fromDate) / 86400000);
}

function getCompletionScoreForDate(planDateText, completedDateText = getTodayText()) {
  const diffDays = getDateDiffDays(planDateText, completedDateText);
  if (diffDays < 0) return 0;
  return diffDays <= 1 ? 100 : 40;
}

function getMonthStart(dateText) {
  return `${dateText.slice(0, 7)}-01`;
}

function getNextMonthStart(dateText) {
  const date = new Date(`${getMonthStart(dateText)}T00:00:00`);
  date.setMonth(date.getMonth() + 1);
  return dateToText(date);
}

function getMonthNumber(dateText) {
  return Number(dateText.slice(5, 7));
}

function sumScores(scores) {
  return scores.reduce((sum, row) => sum + Number(row.score || 0), 0);
}

function getWeekDates(dateText) {
  const date = new Date(dateText + "T00:00:00");
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  return Array.from({ length: 7 }, (_, index) => addDays(dateToText(date), mondayOffset + index));
}

function getWeekStart(dateText) {
  return getWeekDates(dateText)[0];
}

function getWeekEnd(dateText) {
  return getWeekDates(dateText)[6];
}

function getWeekKey(dateText, userId = app.user?.userId || "") {
  return `${userId}|${getWeekStart(dateText)}`;
}

function getFamilyWeeklySummaryKey() {
  const weekStart = getWeekStart(app.today || getTodayText());
  const familyIds = app.familySummary.map((member) => member.userId).join(",");
  return `${weekStart}|${familyIds}`;
}

function isActiveTab(tabName) {
  return Boolean(document.querySelector(`#tab-${tabName}.active`));
}

function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  return Math.floor(diff / 86400000);
}

function getTodayQuote() {
  return STUDY_QUOTES[getDayOfYear() % STUDY_QUOTES.length];
}

function getDailyLoginPhoto() {
  if (!LOGIN_PHOTOS.length) return "family-login.jpg";

  return LOGIN_PHOTOS[getDayOfYear() % LOGIN_PHOTOS.length];
}

function setDailyLoginPhoto() {
  const photo = document.querySelector(".login-family-photo");
  if (!photo) return;

  const frame = photo.parentElement;
  if (frame) frame.classList.remove("is-hidden");

  photo.src = encodeURI(getDailyLoginPhoto());
}

function hideLoginQuote() {
  const quote = $("dailyStudyQuote");
  if (!quote) return;

  clearInterval(hideLoginQuote.timer);
  quote.textContent = "";
  quote.classList.remove("show");
}

function typeLoginQuote() {
  const quote = $("dailyStudyQuote");
  if (!quote) return Promise.resolve();

  const text = getTodayQuote();
  let index = 0;

  clearInterval(hideLoginQuote.timer);
  quote.textContent = "";
  quote.classList.remove("blink");
  quote.classList.add("show");

  return new Promise((resolve) => {
    hideLoginQuote.timer = setInterval(() => {
      index += 1;
      quote.textContent = text.slice(0, index);

      if (index >= text.length) {
        clearInterval(hideLoginQuote.timer);
        setTimeout(resolve, 700);
      }
    }, 90);
  });
}

function mapUser(row) {
  return {
    userId: row.user_id,
    name: row.name,
    role: row.role,
    score: row.score || 0,
  };
}

function getFamilyOrderIndex(userId) {
  const index = FAMILY_ORDER.indexOf(userId);
  return index === -1 ? FAMILY_ORDER.length : index;
}

function sortFamilyMembers(members) {
  return [...members].sort((a, b) => {
    const orderDiff = getFamilyOrderIndex(a.userId) - getFamilyOrderIndex(b.userId);
    if (orderDiff !== 0) return orderDiff;
    return String(a.userId).localeCompare(String(b.userId));
  });
}

async function loginWithCode(loginCode) {
  const cleanCode = String(loginCode || "").trim();

  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("login_code", cleanCode)
    .maybeSingle();

  console.log("[LOGIN DEBUG]", {
    cleanCode,
    data,
    error,
  });

  if (error) {
    throw new Error(`Supabase 로그인 오류: ${error.message}`);
  }

  if (!data) {
    throw new Error(`가족 코드를 찾을 수 없습니다. 입력값: ${cleanCode}`);
  }

  return mapUser(data);
}

function mapStudyItem(row) {
  return {
    itemId: row.item_id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
  };
}

function mapPlan(row) {
  return {
    planId: row.plan_id,
    userId: row.user_id,
    date: row.date,
    title: row.title,
    done: Boolean(row.done),
    scored: Boolean(row.scored),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapScore(row) {
  return {
    scoreId: row.score_id,
    userId: row.user_id,
    date: row.date,
    score: row.score || 0,
    reason: row.reason,
    createdAt: row.created_at,
  };
}

function mapDday(row, users = []) {
  const targetUserId = row.target_user_id || "family";
  const targetUser = users.find((u) => u.userId === targetUserId);
  const diffDays = getDdayDiffDays(row.date);

  return {
    ddayId: row.dday_id,
    title: row.title,
    date: row.date,
    targetUserId,
    targetName: targetUserId === "family" ? "가족 전체" : targetUser ? targetUser.name : targetUserId,
    diffDays,
    ddayLabel: formatDdayLabel(diffDays),
    createdAt: row.created_at,
  };
}

function mapMessage(row, users = [], readMap = new Map()) {
  const sender = users.find((u) => u.userId === row.sender_user_id);
  const readAt = readMap.get(row.message_id) || null;

  return {
    messageId: row.message_id,
    senderUserId: row.sender_user_id,
    senderName: sender ? sender.name : row.sender_user_id,
    targetUserId: row.target_user_id || "family",
    content: row.content,
    createdAt: row.created_at,
    isRead: Boolean(readAt),
    readAt,
  };
}

function formatMailboxDate(value) {
  if (!value) return "";
  const date = new Date(value);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${d} ${hh}:${mm}`;
}

function getSevenDaysAgoIso() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString();
}


async function fetchUsers() {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .order("user_id", { ascending: true });

  if (error) throw error;

  return sortFamilyMembers((data || []).map(mapUser));
}

async function fetchStudyItems(userId) {
  const { data, error } = await supabaseClient
    .from("study_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapStudyItem);
}

async function insertStudyItem(userId, title) {
  const { data, error } = await supabaseClient
    .from("study_items")
    .insert([
      {
        user_id: userId,
        title,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return mapStudyItem(data);
}

async function removeStudyItem(userId, itemId) {
  const { error } = await supabaseClient
    .from("study_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (error) throw error;
}

async function fetchPlansForDate(userId, date) {
  const { data, error } = await supabaseClient
    .from("plans")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapPlan);
}

async function fetchPlansRange(userId, startDate, endDate) {
  const { data, error } = await supabaseClient
    .from("plans")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapPlan);
}

async function insertPlansBulk(userId, dates, title) {
  const rows = dates.map((date) => ({
    user_id: userId,
    date,
    title,
    done: false,
    scored: false,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabaseClient
    .from("plans")
    .upsert(rows, {
      onConflict: "user_id,date,title",
      ignoreDuplicates: true,
    })
    .select();

  if (error) throw error;

  return (data || []).map(mapPlan);
}

async function removePlan(userId, planId) {
  const { error } = await supabaseClient
    .from("plans")
    .delete()
    .eq("user_id", userId)
    .eq("plan_id", planId);

  if (error) throw error;
}

async function savePushSubscriptionToSupabase(subscription) {
  if (!app.user || !app.user.userId) {
    alert("로그인 후 알림을 설정할 수 있어요.");
    return;
  }

  const subscriptionJson = subscription.toJSON();
  const endpoint = subscriptionJson.endpoint;
  const keys = subscriptionJson.keys || {};

  const { error } = await supabaseClient
    .from("push_subscriptions")
    .upsert(
      [
        {
          user_id: app.user.userId,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: navigator.userAgent,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
      ],
      {
        onConflict: "endpoint",
      }
    );

  if (error) throw error;
}

async function removePlansByTitle(userId, dates, title) {
  const { error } = await supabaseClient
    .from("plans")
    .delete()
    .eq("user_id", userId)
    .eq("title", title)
    .in("date", dates);

  if (error) throw error;
}

async function updatePlanDone(userId, planId, nextDone) {
  const { data, error } = await supabaseClient
    .from("plans")
    .update({
      done: nextDone,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("plan_id", planId)
    .select()
    .single();

  if (error) throw error;

  return mapPlan(data);
}

async function fetchScoresForMonth(userId, dateText) {
  const { data, error } = await supabaseClient
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .gte("date", getMonthStart(dateText))
    .lt("date", getNextMonthStart(dateText));

  if (error) throw error;

  return data || [];
}

async function fetchUserMonthScoreTotal(userId, dateText) {
  return sumScores(await fetchScoresForMonth(userId, dateText));
}

async function syncUserMonthlyScore(userId, dateText) {
  const monthlyScore = await fetchUserMonthScoreTotal(userId, dateText);

  const { error } = await supabaseClient
    .from("users")
    .update({
      score: monthlyScore,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) throw error;

  if (app.user && app.user.userId === userId) {
    app.user.score = monthlyScore;
    localStorage.setItem("homeStudyUser", JSON.stringify(app.user));
  }

  return monthlyScore;
}

async function checkAndGiveDailyScore(userId, date) {
  if (getDateDiffDays(date, getTodayText()) < 0) {
    return {
      awarded: false,
      message: "\ubbf8\ub798 \ub0a0\uc9dc \uacf5\ubd80\ub294 \ud574\ub2f9 \ub0a0\uc774 \ub418\uc5c8\uc744 \ub54c \uc810\uc218\ub97c \ubc1b\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
    };
  }

  const plans = await fetchPlansForDate(userId, date);

  if (!plans.length) {
    return {
      awarded: false,
      message: "\uc624\ub298 \uacf5\ubd80 \uacc4\ud68d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
    };
  }

  const allDone = plans.every((plan) => plan.done);

  if (!allDone) {
    return {
      awarded: false,
      message: "\uc544\uc9c1 \uc644\ub8cc\ud558\uc9c0 \uc54a\uc740 \uacf5\ubd80\uac00 \uc788\uc2b5\ub2c8\ub2e4.",
    };
  }

  const { data: existingScores, error: scoreCheckError } = await supabaseClient
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .eq("reason", "DAILY_COMPLETE")
    .limit(1);

  if (scoreCheckError) throw scoreCheckError;

  if (existingScores && existingScores.length > 0) {
    return {
      awarded: false,
      message: "\uc774\ubbf8 \uc624\ub298 \uc644\ub8cc \uc810\uc218\ub97c \ubc1b\uc558\uc2b5\ub2c8\ub2e4.",
    };
  }

  const score = getCompletionScoreForDate(date, getTodayText());

  const { error: insertScoreError } = await supabaseClient
    .from("scores")
    .insert([
      {
        user_id: userId,
        date,
        score,
        reason: "DAILY_COMPLETE",
      },
    ]);

  if (insertScoreError) throw insertScoreError;

  await syncUserMonthlyScore(userId, date);

  return {
    awarded: true,
    score,
    message: `${formatShortDate(date)} 공부를 모두 완료해서 ${score}점을 받았습니다!`,
  };
}

async function settleDueDailyScores(date = getTodayText()) {
  if (date !== getTodayText()) return [];

  const users = await fetchUsers();
  const results = [];

  for (const user of users) {
    results.push(await checkAndGiveDailyScore(user.userId, date));
  }

  return results;
}

async function syncFamilyMonthlyScores(date = getTodayText()) {
  const users = await fetchUsers();

  for (const user of users) {
    await syncUserMonthlyScore(user.userId, date);
  }
}

async function fetchPersonalMonthlyScores(userId, year = getTodayText().slice(0, 4)) {
  if (!userId || userId === "admin") return [];

  const startDate = `${year}-05-01`;
  const endDate = `${Number(year) + 1}-01-01`;

  const { data, error } = await supabaseClient
    .from("scores")
    .select("date,score")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lt("date", endDate);

  if (error) throw error;

  const rows = data || [];
  return Array.from({ length: 8 }, (_, index) => {
    const month = index + 5;
    const score = rows
      .filter((row) => getMonthNumber(row.date) === month)
      .reduce((sum, row) => sum + Number(row.score || 0), 0);

    return { month, score };
  });
}

async function fetchFamilySummary(date) {
  const users = await fetchUsers();

  const { data: plansData, error: plansError } = await supabaseClient
    .from("plans")
    .select("*")
    .eq("date", date);

  if (plansError) throw plansError;

  const { data: scoresData, error: scoresError } = await supabaseClient
    .from("scores")
    .select("*")
    .eq("date", date);

  if (scoresError) throw scoresError;

  const { data: monthScoresData, error: monthScoresError } = await supabaseClient
    .from("scores")
    .select("*")
    .gte("date", getMonthStart(date))
    .lt("date", getNextMonthStart(date));

  if (monthScoresError) throw monthScoresError;

  const plans = (plansData || []).map(mapPlan);
  const scores = scoresData || [];
  const monthScores = monthScoresData || [];

  return users.map((user) => {
    const userPlans = plans.filter((plan) => plan.userId === user.userId);
    const total = userPlans.length;
    const done = userPlans.filter((plan) => plan.done).length;

    const todayScore = scores
      .filter((score) => score.user_id === user.userId)
      .reduce((sum, score) => sum + Number(score.score || 0), 0);

    const monthlyScore = monthScores
      .filter((score) => score.user_id === user.userId)
      .reduce((sum, score) => sum + Number(score.score || 0), 0);

    return {
      userId: user.userId,
      name: user.name,
      total,
      done,
      todayScore,
      score: Number(user.score || 0),
      monthlyScore,
      completeRate: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  });
}

async function fetchFamilyWeeklySummary(startDate, endDate) {
  const users = await fetchUsers();

  const { data, error } = await supabaseClient
    .from("plans")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) throw error;

  const plans = (data || []).map(mapPlan);

  return users.map((user) => {
    const userPlans = plans.filter((plan) => plan.userId === user.userId);
    const total = userPlans.length;
    const done = userPlans.filter((plan) => plan.done).length;

    return {
      userId: user.userId,
      name: user.name,
      total,
      done,
      completeRate: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  });
}

async function fetchDdays(userId) {
  const users = await fetchUsers();

  let query = supabaseClient
    .from("ddays")
    .select("*")
    .order("date", { ascending: true });

  if (!app.adminMode && userId && userId !== "admin") {
    query = query.or(`target_user_id.eq.family,target_user_id.eq.${userId}`);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row) => mapDday(row, users));
}

async function insertDday(title, date, targetUserId) {
  const { data, error } = await supabaseClient
    .from("ddays")
    .insert([
      {
        title,
        date,
        target_user_id: targetUserId || "family",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function removeDday(ddayId) {
  const { error } = await supabaseClient
    .from("ddays")
    .delete()
    .eq("dday_id", ddayId);

  if (error) throw error;
}

async function fetchMailboxMessages() {
  const users = await fetchUsers();
  const sevenDaysAgo = getSevenDaysAgoIso();

  const { data: messagesData, error: messagesError } = await supabaseClient
    .from("messages")
    .select("*")
    .eq("target_user_id", "family")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false });

  if (messagesError) throw messagesError;

  const messageIds = (messagesData || []).map((row) => row.message_id);
  let readMap = new Map();

  if (app.user && messageIds.length) {
    const { data: readsData, error: readsError } = await supabaseClient
      .from("message_reads")
      .select("message_id, read_at")
      .eq("user_id", app.user.userId)
      .in("message_id", messageIds);

    if (readsError) throw readsError;

    readMap = new Map((readsData || []).map((row) => [row.message_id, row.read_at]));
  }

  return (messagesData || []).map((row) => mapMessage(row, users, readMap));
}

async function loadMailboxMessages() {
  if (!app.user) {
    app.messages = [];
    app.unreadMailboxCount = 0;
    app.homeMailboxPreviewMessages = [];
    return;
  }

  app.messages = await fetchMailboxMessages();
  updateUnreadMailboxCount();
}

async function insertMailboxPost({ senderUserId, content }) {
  const { data, error } = await supabaseClient
    .from("messages")
    .insert([
      {
        sender_user_id: senderUserId,
        target_user_id: "family",
        content,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function sendMailboxPushNotification({ senderUserId, targetUserId = "family" }) {
  const messageScope = targetUserId === "family" ? "family" : "user";

  try {
    console.log("[MESSAGE SAVED - PUSH START]", {
      senderUserId,
      targetUserId,
      messageScope,
    });

    const result = await supabaseClient.functions.invoke("send-message-push", {
      body: {
        senderUserId,
        targetUserId,
        messageScope,
      },
    });

    if (result.error) {
      console.warn("[MESSAGE PUSH FAILED]", result.error);
      return;
    }

    console.log("[MESSAGE PUSH RESULT]", result);
  } catch (error) {
    console.warn("[MESSAGE PUSH FAILED]", error);
  }
}

async function sendMailboxPost() {
  const input = $("mailboxContentInput");

  if (!input || !app.user) return;

  const content = input.value.trim();

  if (!content) {
    showToast("\ub0a8\uae38 \uae00\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.");
    return;
  }

  try {
    const message = await insertMailboxPost({
      senderUserId: app.user.userId,
      content,
    });

    await sendMailboxPushNotification({
      senderUserId: app.user.userId,
      targetUserId: message.target_user_id || "family",
    });

    input.value = "";

    await loadMailboxMessages();
    renderMailbox();

    showToast("\ud589\ubcf5 \uc6b0\uccb4\ud1b5\uc5d0 \uae00\uc744 \ub0a8\uacbc\uc5b4\uc694.");
  } catch (err) {
    showToast(err.message);
  }
}

function renderMailbox() {
  renderMailboxNewBadge();
  renderHomeMailboxUnreadList();
  renderMailboxList($("mailboxList"), app.messages);
}

function getUnreadMailboxMessages() {
  if (!app.user) return [];

  return app.messages.filter((message) => {
    if (message.senderUserId === app.user.userId) return false;
    if (message.targetUserId !== "family") return false;
    return !message.isRead;
  });
}

function updateUnreadMailboxCount() {
  app.unreadMailboxCount = getUnreadMailboxMessages().length;
}

function getMailboxSenderClass(senderUserId) {
  const safeSenderId = String(senderUserId || "unknown").replace(/[^a-zA-Z0-9_-]/g, "");
  return `mailbox-sender-${safeSenderId || "unknown"}`;
}

function renderMailboxNewBadge() {
  const badge = $("mailboxNewBadge");
  if (!badge) return;

  badge.classList.toggle("hidden", app.unreadMailboxCount <= 0);
  badge.textContent = app.unreadMailboxCount > 0 ? `new ${app.unreadMailboxCount}` : "new 0";
}

function renderHomeMailboxUnreadList() {
  const target = $("homeMailboxUnreadList");
  if (!target) return;

  const messages =
    app.mailboxPreviewOpen && app.homeMailboxPreviewMessages.length
      ? app.homeMailboxPreviewMessages
      : getUnreadMailboxMessages();

  if (!messages.length) {
    target.className = "mailbox-list empty-box";
    target.innerHTML = "\uc0c8\ub85c \ub3c4\ucc29\ud55c \uae00\uc774 \uc5c6\uc5b4\uc694.";
    return;
  }

  renderMailboxList(target, messages);
}

function toggleMailboxPreview() {
  app.mailboxPreviewOpen = !app.mailboxPreviewOpen;

  const box = $("mailboxPreviewBox");
  const btn = $("mailboxToggleBtn");

  if (app.mailboxPreviewOpen) {
    app.homeMailboxPreviewMessages = getUnreadMailboxMessages();
  } else {
    app.homeMailboxPreviewMessages = [];
  }

  if (box) box.classList.toggle("hidden", !app.mailboxPreviewOpen);
  if (btn) btn.textContent = app.mailboxPreviewOpen ? "\uc811\uae30" : "\ubcf4\uae30";

  renderHomeMailboxUnreadList();

  if (app.mailboxPreviewOpen) {
    markUnreadMailboxMessagesAsRead()
      .then(() => renderMailbox())
      .catch((err) => showToast(err.message));
  }
}

function openMailboxPreview() {
  if (app.mailboxPreviewOpen) {
    renderHomeMailboxUnreadList();
    return;
  }

  toggleMailboxPreview();
}

async function markUnreadMailboxMessagesAsRead() {
  if (!app.user) return;

  const unread = getUnreadMailboxMessages();

  if (!unread.length) {
    updateUnreadMailboxCount();
    return;
  }

  const nowIso = new Date().toISOString();
  const rows = unread.map((message) => ({
    message_id: message.messageId,
    user_id: app.user.userId,
    read_at: nowIso,
  }));

  const { error } = await supabaseClient
    .from("message_reads")
    .upsert(rows, {
      onConflict: "message_id,user_id",
      ignoreDuplicates: true,
    });

  if (error) throw error;

  const readIds = new Set(unread.map((message) => message.messageId));

  app.messages = app.messages.map((message) =>
    readIds.has(message.messageId) ? { ...message, isRead: true, readAt: nowIso } : message
  );

  updateUnreadMailboxCount();
}

function renderMailboxList(target, messages) {
  if (!target) return;

  if (!messages || !messages.length) {
    target.className = "mailbox-list empty-box";
    target.innerHTML = "\ucd5c\uadfc 7\uc77c \ub3d9\uc548 \ub0a8\uaca8\uc9c4 \uae00\uc774 \uc5c6\uc5b4\uc694.";
    return;
  }

  target.className = "mailbox-list";
  target.innerHTML = messages
    .map((message) => `
      <div class="mailbox-card ${getMailboxSenderClass(message.senderUserId)}">
        <div class="mailbox-meta">
          <span class="mailbox-sender-name">${escapeHtml(message.senderName)}</span>
          <span>&middot;</span>
          <span>${escapeHtml(formatMailboxDate(message.createdAt))}</span>
        </div>
        <div class="mailbox-content">${escapeHtml(message.content)}</div>
      </div>
    `)
    .join("");
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

async function requestStudyRoomNotificationPermission() {
  if (!isPushNotificationSupported()) {
    alert("이 브라우저에서는 푸시 알림을 사용할 수 없어요.");
    return false;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("알림이 허용되지 않았어요.");
    return false;
  }

  return true;
}

async function subscribeStudyRoomPush() {
  try {
    if (!app.user || !app.user.userId) {
      alert("로그인 후 알림을 설정할 수 있어요.");
      return;
    }

    if (!isPushNotificationSupported()) {
      alert("이 브라우저에서는 푸시 알림을 사용할 수 없어요.");
      return;
    }

    if (!VAPID_PUBLIC_KEY) {
      alert("푸시 알림 키가 아직 설정되지 않았어요.");
      return;
    }

    const isPermissionGranted = await requestStudyRoomNotificationPermission();
    if (!isPermissionGranted) return;

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    const subscription =
      existingSubscription ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }));

    await savePushSubscriptionToSupabase(subscription);
    alert("행복 우체통 알림 준비가 완료되었어요.");
  } catch (err) {
    console.error("Study room push subscription failed:", err);
    alert("알림 설정 중 문제가 생겼어요.");
  }
}

function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = $(`screen-${screenName}`);
  if (target) target.classList.add("active");
}

function showTab(tabName) {
  document.querySelectorAll(".tab-page").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const tab = $(`tab-${tabName}`);
  if (tab) tab.classList.add("active");

  const navBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  if (navBtn) navBtn.classList.add("active");

  if (tabName === "plan") {
    renderPlanScreen();
    ensurePlanWeekPlans();
  }

  if (tabName === "items") {
    renderStudyItems();
  }

  if (tabName === "dday") {
    renderDdays();
  }

  if (tabName === "family") {
    renderFamilySummary();
    ensureFamilyWeeklySummary();
  }

  if (tabName === "mailbox") {
    loadMailboxMessages()
      .then(() => renderMailbox())
      .catch((err) => showToast(err.message));
  }
}

function showHomeTab() {
  showTab("home");
}

async function login() {
  const input = $("loginCodeInput");
  const msg = $("loginMsg");
  const loginCode = input ? input.value.trim() : "";

  if (msg) msg.textContent = "";
  hideLoginQuote();

  if (!loginCode) {
    if (msg) msg.textContent = "가족 코드를 입력해 주세요.";
    return;
  }

  if (loginCode === ADMIN_PASSWORD) {
    await loginAdmin();
    return;
  }

  try {
    const quotePromise = typeLoginQuote();
    app.user = await loginWithCode(loginCode);
    app.adminMode = false;
    app.today = getTodayText();
    app.selectedDate = app.today;
    resetDataCacheKeys();

    localStorage.setItem("homeStudyUser", JSON.stringify(app.user));

    setText("helloTitle", `${app.user.name}의 공부방`);

    loadInitialData();
    await quotePromise;

    showScreen("main");
    showHomeTab();
    showToast(`🎉 ${app.user.name}님, 어서 오세요!`);
  } catch (err) {
    hideLoginQuote();
    if (msg) msg.textContent = err.message;
  }
}

async function loginAdmin() {
  const quotePromise = typeLoginQuote();
  const saved = localStorage.getItem("homeStudyUser");
  const savedUser = saved ? JSON.parse(saved) : null;

  app.user = savedUser && savedUser.userId ? savedUser : { userId: "admin", name: "관리자" };
  app.adminMode = true;
  resetDataCacheKeys();

  setText("helloTitle", "관리자 모드");

  loadInitialData();
  await quotePromise;

  showScreen("main");
  showTab("family");
  showToast("🔐 관리자 모드로 들어왔어요.");
}

async function tryAutoLogin() {
  const saved = localStorage.getItem("homeStudyUser");
  if (!saved) return;

  try {
    app.user = JSON.parse(saved);

    if (!app.user || !app.user.userId) return;

    app.adminMode = false;
    app.today = getTodayText();
    app.selectedDate = app.today;
    resetDataCacheKeys();

    setText("helloTitle", `${app.user.name}의 공부방`);

    showScreen("main");
    showHomeTab();
    await loadInitialData();
  } catch (err) {
    localStorage.removeItem("homeStudyUser");
  }
}

function logout() {
  localStorage.removeItem("homeStudyUser");
  app.user = null;
  app.adminMode = false;
  app.messages = [];
  app.unreadMailboxCount = 0;
  app.mailboxPreviewOpen = false;
  app.homeMailboxPreviewMessages = [];
  resetDataCacheKeys();

  const input = $("loginCodeInput");
  if (input) input.value = "";

  showScreen("login");
}

function resetDataCacheKeys() {
  app.weeklyPlansKey = "";
  app.planWeekPlansKey = "";
  app.familyWeeklySummaryKey = "";
  app.loadingActions = {};
}

async function loadInitialData() {
  if (!app.user) return;

  try {
    app.today = getTodayText();
    app.selectedDate = app.selectedDate || app.today;
    app.studyItems = app.adminMode ? [] : await fetchStudyItems(app.user.userId);
    app.plans = app.adminMode ? [] : await fetchPlansForDate(app.user.userId, app.selectedDate);
    await settleDueDailyScores(app.today);
    await syncFamilyMonthlyScores(app.today);
    app.familySummary = await fetchFamilySummary(app.today);
    app.personalMonthlyScores = app.adminMode
      ? []
      : await fetchPersonalMonthlyScores(app.user.userId, app.today.slice(0, 4));
    app.ddays = normalizeDdays(await fetchDdays(app.user.userId));
    await loadMailboxMessages();

    setDdayTargetOptions();
    renderAll();

    if (!app.adminMode) {
      ensureWeeklyPlans();
    }
  } catch (err) {
    showToast(err.message);
  }
}

async function loadPlansForWeek(dateText, userId) {
  const weekDates = getWeekDates(dateText);

  const plans = await fetchPlansRange(userId, weekDates[0], weekDates[6]);

  return weekDates.map((date) => ({
    date,
    plans: plans.filter((plan) => plan.date === date),
  }));
}

async function loadWeeklyPlans(force = false) {
  if (!app.user) return;

  const key = getWeekKey(app.today || getTodayText());
  if (!force && app.weeklyPlansKey === key) return;

  app.weeklyPlans = await loadPlansForWeek(app.today || getTodayText(), app.user.userId);
  app.weeklyPlansKey = key;
}

async function loadPlanWeekPlans(force = false) {
  if (!app.user) return;

  const key = getWeekKey(app.selectedDate);
  if (!force && app.planWeekPlansKey === key) return;

  app.planWeekPlans = await loadPlansForWeek(app.selectedDate, app.user.userId);
  app.planWeekPlansKey = key;
}

async function loadFamilyWeeklySummary(force = false) {
  if (!app.user || !app.familySummary.length) {
    app.familyWeeklySummary = [];
    app.familyWeeklySummaryKey = "";
    return;
  }

  const key = getFamilyWeeklySummaryKey();
  if (!force && app.familyWeeklySummaryKey === key) return;

  const weekDates = getWeekDates(app.today || getTodayText());

  app.familyWeeklySummary = await fetchFamilyWeeklySummary(weekDates[0], weekDates[6]);
  app.familyWeeklySummaryKey = key;
}

function ensureWeeklyPlans(force = false) {
  if (app.loadingActions.weeklyPlans) return;

  app.loadingActions.weeklyPlans = true;

  loadWeeklyPlans(force)
    .then(() => renderHome())
    .catch((err) => showToast(err.message))
    .finally(() => {
      app.loadingActions.weeklyPlans = false;
    });
}

function ensurePlanWeekPlans(force = false) {
  if (app.loadingActions.planWeekPlans) return;

  app.loadingActions.planWeekPlans = true;

  loadPlanWeekPlans(force)
    .then(() => {
      if (isActiveTab("plan")) renderPlanScreen();
    })
    .catch((err) => showToast(err.message))
    .finally(() => {
      app.loadingActions.planWeekPlans = false;
    });
}

function ensureFamilyWeeklySummary(force = false) {
  if (app.loadingActions.familyWeeklySummary) return;

  app.loadingActions.familyWeeklySummary = true;

  loadFamilyWeeklySummary(force)
    .then(() => {
      if (isActiveTab("family")) renderFamilySummary();
    })
    .catch((err) => showToast(err.message))
    .finally(() => {
      app.loadingActions.familyWeeklySummary = false;
    });
}

function updateWeekPlansRow(rows, date, plans) {
  if (!Array.isArray(rows)) return;

  const index = rows.findIndex((row) => row.date === date);

  if (index >= 0) {
    rows[index] = { date, plans };
  } else {
    rows.push({ date, plans });
    rows.sort((a, b) => a.date.localeCompare(b.date));
  }
}

function updateCachedSelectedDatePlans(date = app.selectedDate, plans = app.plans) {
  updateWeekPlansRow(app.planWeekPlans, date, plans);
  updateWeekPlansRow(app.weeklyPlans, date, plans);
}

async function refreshPlanCachesForDates(dates) {
  if (!app.user || !dates.length) return;

  const sortedDates = [...dates].sort();
  const plans = await fetchPlansRange(
    app.user.userId,
    sortedDates[0],
    sortedDates[sortedDates.length - 1]
  );

  sortedDates.forEach((date) => {
    const dayPlans = plans.filter((plan) => plan.date === date);
    updateWeekPlansRow(app.planWeekPlans, date, dayPlans);
    updateWeekPlansRow(app.weeklyPlans, date, dayPlans);

    if (date === app.selectedDate) {
      app.plans = dayPlans;
    }
  });
}

function renderAll() {
  renderHome();
  renderPlanScreen();
  renderStudyItems();
  renderDdays();
  renderFamilySummary();
  renderMailbox();
}

function startDateRolloverWatcher() {
  setInterval(() => {
    const today = getTodayText();
    if (today === app.today) return;

    app.today = today;
    app.selectedDate = today;
    resetDataCacheKeys();

    if (app.user) {
      loadInitialData();
    }
  }, 60000);
}

function renderHome() {
  const deviceTodayText = getTodayText();
  const todayText = app.today || deviceTodayText;
  const selectedDate = getHomeSelectedDate();
  const selectedWeek = app.weeklyPlans.find((day) => day.date === selectedDate);
  const selectedPlans = selectedWeek ? selectedWeek.plans : selectedDate === app.selectedDate ? app.plans : [];
  const total = selectedPlans.length;
  const done = selectedPlans.filter((plan) => plan.done).length;
  const isTodaySelected = selectedDate === deviceTodayText;

  setText("homePlanTitle", isTodaySelected ? "오늘 할 공부" : `${formatShortDate(selectedDate)} 할 공부`);

  setText(
    "todayLabel",
    `${isTodaySelected ? "오늘 내 공부" : "선택한 공부"} · ${formatDateKorean(selectedDate)}`
  );
  setText("todayProgressTitle", `${total}개 중 ${done}개 완료`);

  if (total > 0 && done === total) {
    setText("todayScoreHint", isTodaySelected ? "오늘 공부 완료! 100점 도전 성공!" : "선택한 날짜 공부 완료!");
  } else {
    setText("todayScoreHint", isTodaySelected ? "오늘 공부를 모두 끝내면 +100점" : "공부를 끝냈다면 체크해 주세요.");
  }

  const homePlanList = $("homePlanList");
  if (homePlanList) {
    renderPlanList(homePlanList, selectedPlans, true, isThisWeekDate(selectedDate));
  }

  renderWeeklyPlans("homeWeeklyPlans", app.today || getTodayText(), app.weeklyPlans);
  renderHomeFamilySummary();

  const upcoming = normalizeDdays(app.ddays)
    .filter((item) => item.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 1);

  const homeDdayList = $("homeDdayList");
  if (homeDdayList) {
    renderDdayList(homeDdayList, upcoming, false);
  }
}

function getHomeSelectedDate() {
  const todayText = app.today || getTodayText();
  return isThisWeekDate(app.selectedDate) ? app.selectedDate : todayText;
}

function isThisWeekDate(dateText) {
  if (!dateText) return false;

  const todayText = app.today || getTodayText();
  return getWeekStart(dateText) === getWeekStart(todayText);
}

function getHomeWeekCellAttrs(dateText) {
  return ` role="button" tabindex="0" onclick="selectHomeWeekDate('${dateText}')" onkeydown="handleHomeWeekCellKey(event, '${dateText}')"`;
}

function handleHomeWeekCellKey(event, dateText) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  selectHomeWeekDate(dateText);
}

function renderHomeFamilySummary() {
  const target = $("homeFamilySummary");
  if (!target) return;

  if (!app.familySummary.length) {
    target.className = "family-mini-list empty-box";
    target.innerHTML = "가족 현황이 아직 없어요.";
    return;
  }

  target.className = "family-mini-list";
  target.innerHTML = app.familySummary
    .map(
      (member) => `
      <div class="family-card">
        <div class="family-row-top">
          <div class="family-name">${escapeHtml(member.name)}</div>
          <div class="family-score">${member.done || 0}/${member.total || 0}</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${member.completeRate || 0}%"></div>
        </div>
      </div>
    `
    )
    .join("");
}

function renderWeeklyPlans(targetId, baseDate, weekPlanRows) {
  const target = $(targetId);
  if (!target) return;

  const todayText = app.today || getTodayText();
  const isHomeWeeklyPlans = targetId === "homeWeeklyPlans";
  const selectedDate = isHomeWeeklyPlans ? getHomeSelectedDate() : app.selectedDate;
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const weekDates = getWeekDates(baseDate);
  const safeRows = Array.isArray(weekPlanRows) ? weekPlanRows : [];

  const weeklyPlans = weekDates.map((date) => {
    const row = safeRows.find((day) => day.date === date);
    return {
      date,
      plans: row ? row.plans || [] : [],
    };
  });

  target.className = "weekly-plan-list";
  target.innerHTML = `
    <div class="weekly-calendar-row weekly-calendar-head">
      ${weeklyPlans
        .map((day, index) => {
          const date = new Date(day.date + "T00:00:00");
          const status = day.date === todayText ? "today" : day.date < todayText ? "past" : "future";
          const selected = day.date === selectedDate ? "selected" : "";
          const clickAttr = isHomeWeeklyPlans ? getHomeWeekCellAttrs(day.date) : "";

          return `
            <div${clickAttr} class="weekly-calendar-cell ${status} ${selected}">
              <span>${dayNames[index]}</span>
              <strong>${date.getMonth() + 1}/${date.getDate()}</strong>
            </div>
          `;
        })
        .join("")}
    </div>

    <div class="weekly-calendar-row weekly-calendar-body">
      ${weeklyPlans
        .map((day) => {
          const status = day.date === todayText ? "today" : day.date < todayText ? "past" : "future";
          const selected = day.date === selectedDate ? "selected" : "";
          const clickAttr = isHomeWeeklyPlans ? getHomeWeekCellAttrs(day.date) : "";

          const planHtml = day.plans.length
            ? day.plans
                .map(
                  (plan) => `
                  <li class="${plan.done ? "done" : ""}">
                    ${escapeHtml(plan.title)}
                  </li>
                `
                )
                .join("")
            : `<li class="empty">없음</li>`;

          return `
            <div${clickAttr} class="weekly-calendar-cell ${status} ${selected}">
              <ul class="weekly-day-plans">
                ${planHtml}
              </ul>
            </div>
          `;
        })
        .join("")}
    </div>

    <div class="weekly-calendar-row weekly-calendar-stars">
      ${weeklyPlans
        .map((day) => {
          const status = day.date === todayText ? "today" : day.date < todayText ? "past" : "future";
          const selected = day.date === selectedDate ? "selected" : "";
          const clickAttr = isHomeWeeklyPlans ? getHomeWeekCellAttrs(day.date) : "";
          const isComplete = day.plans.length > 0 && day.plans.every((plan) => plan.done);

          return `
            <div${clickAttr} class="weekly-calendar-cell ${status} ${selected}">
              ${isComplete ? `<span class="complete-star">★</span>` : ""}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPlanScreen() {
  renderPlanDatePicker();

  const planList = $("planList");
  if (planList) {
    renderPlanList(planList, app.plans, true, isThisWeekDate(app.selectedDate));
  }

  renderWeeklyPlans("planWeeklyPlans", app.selectedDate, app.planWeekPlans);
  renderStudyItemsForPlan();
}

function setPlanMode(mode) {
  app.planMode = mode;

  if (mode === "week") {
    app.rangeStart = null;
    app.rangeEnd = null;
  } else {
    app.rangeStart = null;
    app.rangeEnd = null;
    app.rangeMonth = app.selectedDate.slice(0, 7);
  }

  renderPlanScreen();
}

function renderPlanDatePicker() {
  const picker = $("planDatePicker");
  if (!picker) return;

  const weekModeBtn = $("weekModeBtn");
  const rangeModeBtn = $("rangeModeBtn");

  if (weekModeBtn) weekModeBtn.classList.toggle("active", app.planMode === "week");
  if (rangeModeBtn) rangeModeBtn.classList.toggle("active", app.planMode === "range");

  if (app.planMode === "range") {
    renderRangeDatePicker(picker);
  } else {
    renderWeekDatePicker(picker);
  }

  renderPlanAddHelp();
}

function renderWeekDatePicker(picker) {
  const todayText = app.today || getTodayText();
  const weekDates = getWeekDates(app.selectedDate);
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  picker.innerHTML = `
    <div class="plan-week-top">
      <button class="date-btn" onclick="movePlanWeek(-1)">이전 주</button>
      <div class="plan-week-title">${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}</div>
      <button class="date-btn" onclick="movePlanWeek(1)">다음 주</button>
    </div>
    <div class="plan-week-calendar">
      ${weekDates
        .map((date, index) => {
          const status = date === todayText ? "today" : date < todayText ? "past" : "future";
          const selected = date === app.selectedDate ? "selected" : "";
          const day = new Date(date + "T00:00:00");

          return `
            <button class="plan-date-cell ${status} ${selected}" onclick="selectWeekDate('${date}')">
              <span>${dayNames[index]}</span>
              <strong>${day.getMonth() + 1}/${day.getDate()}</strong>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderRangeDatePicker(picker) {
  const [year, month] = app.rangeMonth.split("-").map(Number);
  const firstDate = new Date(year, month - 1, 1);
  const startOffset = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
  const calendarStart = new Date(year, month - 1, 1 - startOffset);
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

  const selectedDates = getSelectedPlanDates();
  const rangeLabel = selectedDates.length
    ? `${formatShortDate(selectedDates[0])}부터 ${selectedDates.length}일`
    : "시작일을 골라 주세요";

  picker.innerHTML = `
    <div class="plan-week-top">
      <button class="date-btn" onclick="moveRangeMonth(-1)">이전 달</button>
      <div class="plan-week-title">${year}년 ${month}월</div>
      <button class="date-btn" onclick="moveRangeMonth(1)">다음 달</button>
    </div>
    <div class="range-label">${rangeLabel}</div>
    <div class="range-calendar-head">
      ${dayNames.map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="range-calendar">
      ${Array.from({ length: 42 }, (_, index) => {
        const date = new Date(calendarStart);
        date.setDate(calendarStart.getDate() + index);

        const dateText = dateToText(date);
        const isOutside = date.getMonth() !== month - 1 ? "outside" : "";
        const isStart = dateText === app.rangeStart ? "range-start" : "";
        const isEnd = dateText === app.rangeEnd ? "range-end" : "";
        const isInside = isDateInRange(dateText) ? "in-range" : "";
        const isToday = dateText === (app.today || getTodayText()) ? "today" : "";

        return `
          <button class="range-date-cell ${isOutside} ${isInside} ${isStart} ${isEnd} ${isToday}" onclick="selectRangeDate('${dateText}')">
            ${date.getDate()}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function formatShortDate(dateText) {
  const date = new Date(dateText + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getSelectedPlanDates() {
  if (app.planMode === "week") {
    return [app.selectedDate];
  }

  if (!app.rangeStart) return [];
  if (!app.rangeEnd) return [app.rangeStart];

  const start = app.rangeStart <= app.rangeEnd ? app.rangeStart : app.rangeEnd;
  const end = app.rangeStart <= app.rangeEnd ? app.rangeEnd : app.rangeStart;

  const dates = [];
  let current = start;

  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}

function isDateInRange(dateText) {
  return getSelectedPlanDates().includes(dateText);
}

function renderPlanAddHelp() {
  const help = $("planAddHelp");
  if (!help) return;

  const dates = getSelectedPlanDates();

  if (app.planMode === "week") {
    help.textContent = `${formatDateKorean(app.selectedDate)}에 추가할 공부카드를 눌러 주세요.`;
  } else if (!dates.length) {
    help.textContent = "시작일과 종료일을 고른 뒤 공부카드를 눌러 주세요.";
  } else if (dates.length === 1) {
    help.textContent = `${formatDateKorean(dates[0])}부터 종료일을 고르거나 공부카드를 눌러 주세요.`;
  } else {
    help.textContent = `${formatDateKorean(dates[0])}부터 ${formatDateKorean(dates[dates.length - 1])}까지 추가돼요.`;
  }
}

function selectWeekDate(dateText) {
  app.selectedDate = dateText;
  loadPlansForSelectedDate();
}

function movePlanWeek(offset) {
  app.selectedDate = addDays(app.selectedDate, offset * 7);
  loadPlansForSelectedDate();
}

function moveRangeMonth(offset) {
  const [year, month] = app.rangeMonth.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  app.rangeMonth = dateToText(date).slice(0, 7);
  renderPlanScreen();
}

function selectRangeDate(dateText) {
  if (!app.rangeStart || app.rangeEnd) {
    app.rangeStart = dateText;
    app.rangeEnd = null;
  } else {
    app.rangeEnd = dateText;
  }

  app.selectedDate = dateText;
  loadPlansForSelectedDate();
}

function renderPlanList(target, plans, showDelete, allowCheck = true) {
  if (!target) return;

  if (!plans || plans.length === 0) {
    target.className = "plan-list empty-box";
    target.innerHTML = "공부 계획이 없어요.";
    return;
  }

  target.className = "plan-list";
  target.innerHTML = plans
    .map(
      (plan) => `
      <div class="plan-card ${plan.done ? "done" : ""}">
        <button class="plan-check" ${allowCheck ? `onclick="togglePlanDone('${plan.planId}')"` : "disabled"}>
          ${plan.done ? "✓" : ""}
        </button>
        <div class="plan-title ${plan.done ? "done" : ""}">
          ${escapeHtml(plan.title)}
        </div>
        ${
          showDelete
            ? `<button class="delete-btn" onclick="deletePlan('${plan.planId}')">×</button>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

function renderStudyItems() {
  const list = $("studyItemList");
  if (!list) return;

  if (!app.studyItems.length) {
    list.className = "study-card-list empty-box";
    list.innerHTML = "아직 저장된 공부가 없어요.";
    return;
  }

  list.className = "study-card-list";
  list.innerHTML = app.studyItems
    .map((item) => {
      const tone = getStudyItemTone(item.title);

      return `
      <div class="study-card saved-study-card ${tone}">
        <div class="study-title">${escapeHtml(item.title)}</div>
        <button class="delete-btn" onclick="deleteStudyItem('${item.itemId}')">×</button>
      </div>
    `;
    })
    .join("");
}

function renderStudyItemsForPlan() {
  const list = $("planStudyItemList");
  if (!list) return;

  if (!app.studyItems.length) {
    list.className = "study-card-list empty-box";
    list.innerHTML = "공부할 것이 아직 없어요.";
    return;
  }

  list.className = "study-card-list plan-study-card-list";
  list.innerHTML = app.studyItems
    .map((item) => {
      const isChecked = isStudyItemChecked(item.title);
      const tone = getStudyItemTone(item.title);

      return `
      <button class="study-card plan-study-card ${tone} ${isChecked ? "checked" : ""}" onclick="addPlanFromItem('${item.itemId}')">
        <span class="study-title">${escapeHtml(item.title)}</span>
        <span class="add-plan-chip">${isChecked ? "✓" : ""}</span>
      </button>
    `;
    })
    .join("");
}

function isStudyItemChecked(title) {
  const selectedDates = getSelectedPlanDates();
  if (!selectedDates.length) return false;

  return selectedDates.every((date) => {
    const row = app.planWeekPlans.find((day) => day.date === date);
    const plans = row ? row.plans : date === app.selectedDate ? app.plans : [];

    return plans.some((plan) => plan.title === title);
  });
}

function getStudyItemTone(title) {
  const value = String(title || "").toLowerCase();

  if (value.includes("수학") || value.includes("연산") || value.includes("계산")) return "tone-math";
  if (value.includes("영어") || value.includes("단어") || value.includes("english")) return "tone-english";
  if (value.includes("국어") || value.includes("독서") || value.includes("읽기")) return "tone-korean";
  if (value.includes("과학") || value.includes("실험")) return "tone-science";
  if (value.includes("복습") || value.includes("교과서") || value.includes("숙제")) return "tone-review";

  return "tone-default";
}

async function addStudyItem() {
  const input = $("newItemInput");
  const title = input ? input.value.trim() : "";

  if (!title) {
    showToast("공부 항목을 입력해 주세요.");
    return;
  }

  try {
    const item = await insertStudyItem(app.user.userId, title);

    app.studyItems.push(item);
    input.value = "";

    renderStudyItems();
    renderStudyItemsForPlan();

    showToast("공부할 것에 추가했어요.");
  } catch (err) {
    showToast(err.message);
  }
}

async function addQuickPlan() {
  if (app.loadingActions.addPlan) return;

  const input = $("quickPlanInput");
  const title = input ? input.value.trim() : "";
  const selectedDates = getSelectedPlanDates();

  if (!title) {
    showToast("추가할 공부 내용을 적어 주세요.");
    return;
  }

  if (!selectedDates.length) {
    showToast("공부를 넣을 날짜를 먼저 골라 주세요.");
    return;
  }

  try {
    app.loadingActions.addPlan = true;

    await insertPlansBulk(app.user.userId, selectedDates, title);

    if (input) input.value = "";

    await refreshPlanCachesForDates(selectedDates);
    app.familySummary = await fetchFamilySummary(app.today || getTodayText());
    app.familyWeeklySummaryKey = "";

    await refreshSelectedDateAfterBulk(selectedDates);

    showToast(
      selectedDates.length === 1
        ? `${formatDateKorean(selectedDates[0])}에 추가했어요.`
        : `${selectedDates.length}일 동안 공부 계획을 추가했어요.`
    );
  } catch (err) {
    showToast(err.message);
  } finally {
    app.loadingActions.addPlan = false;
  }
}

async function deleteStudyItem(itemId) {
  const item = app.studyItems.find((row) => row.itemId === itemId);
  if (!item) return;

  if (!confirm(`"${item.title}" 항목을 삭제할까요?`)) return;

  try {
    await removeStudyItem(app.user.userId, itemId);

    app.studyItems = app.studyItems.filter((row) => row.itemId !== itemId);

    renderStudyItems();
    renderStudyItemsForPlan();

    showToast("공부 항목을 삭제했어요.");
  } catch (err) {
    showToast(err.message);
  }
}

async function addPlanFromItem(itemId) {
  if (app.loadingActions.addPlan) return;

  const item = app.studyItems.find((row) => row.itemId === itemId);
  const selectedDates = getSelectedPlanDates();

  if (!item) return;

  if (!selectedDates.length) {
    showToast("공부를 넣을 날짜를 먼저 골라 주세요.");
    return;
  }

  const previousPlans = app.plans.map((plan) => ({ ...plan }));
  const previousPlanWeekPlans = app.planWeekPlans.map((day) => ({
    date: day.date,
    plans: (day.plans || []).map((plan) => ({ ...plan })),
  }));
  const previousWeeklyPlans = app.weeklyPlans.map((day) => ({
    date: day.date,
    plans: (day.plans || []).map((plan) => ({ ...plan })),
  }));

  try {
    app.loadingActions.addPlan = true;

    const shouldRemove = selectedDates.every((date) => {
      const row = app.planWeekPlans.find((day) => day.date === date);
      const plans = row ? row.plans : date === app.selectedDate ? app.plans : [];
      return plans.some((plan) => plan.title === item.title);
    });

    selectedDates.forEach((date) => {
      const row = app.planWeekPlans.find((day) => day.date === date);
      const currentPlans = row ? row.plans || [] : date === app.selectedDate ? app.plans : [];
      const nextPlans = shouldRemove
        ? currentPlans.filter((plan) => plan.title !== item.title)
        : currentPlans.some((plan) => plan.title === item.title)
          ? currentPlans
          : [
              ...currentPlans,
              {
                planId: `temp-${date}-${item.itemId}`,
                userId: app.user.userId,
                date,
                title: item.title,
                done: false,
                scored: false,
              },
            ];

      updateWeekPlansRow(app.planWeekPlans, date, nextPlans);
      updateWeekPlansRow(app.weeklyPlans, date, nextPlans);
      if (date === app.selectedDate) app.plans = nextPlans;
    });

    renderHome();
    renderPlanScreen();

    if (shouldRemove) {
      await removePlansByTitle(app.user.userId, selectedDates, item.title);
      showToast("공부 계획에서 뺐어요.");
    } else {
      await insertPlansBulk(app.user.userId, selectedDates, item.title);
      showToast(
        selectedDates.length === 1
          ? `${formatDateKorean(selectedDates[0])}에 추가됐어요.`
          : `${selectedDates.length}일 동안 공부 계획에 추가됐어요.`
      );
    }

    await refreshPlanCachesForDates(selectedDates);
    app.familySummary = await fetchFamilySummary(app.today || getTodayText());
    app.familyWeeklySummaryKey = "";

    await refreshSelectedDateAfterBulk(selectedDates);
  } catch (err) {
    app.plans = previousPlans;
    app.planWeekPlans = previousPlanWeekPlans;
    app.weeklyPlans = previousWeeklyPlans;
    renderHome();
    renderPlanScreen();
    showToast(err.message);
  } finally {
    app.loadingActions.addPlan = false;
  }
}
async function refreshSelectedDateAfterBulk(selectedDates) {
  const selectedRow =
    app.planWeekPlans.find((row) => row.date === app.selectedDate) ||
    app.weeklyPlans.find((row) => row.date === app.selectedDate);

  if (selectedRow) {
    app.plans = selectedRow.plans || [];
  } else if (selectedDates.includes(app.selectedDate)) {
    await loadPlansForSelectedDate({ ensurePlanWeek: false });
  }

  renderHome();
  renderPlanScreen();
  renderFamilySummary();
}

async function deletePlan(planId) {
  if (app.loadingActions.deletePlan) return;

  if (!confirm("이 공부 계획을 삭제할까요?")) return;

  try {
    app.loadingActions.deletePlan = true;

    await removePlan(app.user.userId, planId);

    app.plans = await fetchPlansForDate(app.user.userId, app.selectedDate);
    app.familySummary = await fetchFamilySummary(app.today || getTodayText());
    app.familyWeeklySummaryKey = "";

    updateCachedSelectedDatePlans();

    if (isActiveTab("plan")) {
      await loadPlanWeekPlans(true);
    } else {
      ensureWeeklyPlans(true);
    }

    renderHome();
    renderPlanScreen();

    showToast("공부 계획을 삭제했어요.");
  } catch (err) {
    showToast(err.message);
  } finally {
    app.loadingActions.deletePlan = false;
  }
}

async function togglePlanDone(planId) {
  if (app.loadingActions.togglePlanDone) return;

  const plan = app.plans.find((row) => String(row.planId) === String(planId));
  if (!plan) return;

  const previousPlans = app.plans.map((row) => ({ ...row }));
  const previousPlanWeekPlans = app.planWeekPlans.map((day) => ({
    date: day.date,
    plans: (day.plans || []).map((row) => ({ ...row })),
  }));
  const previousWeeklyPlans = app.weeklyPlans.map((day) => ({
    date: day.date,
    plans: (day.plans || []).map((row) => ({ ...row })),
  }));

  try {
    app.loadingActions.togglePlanDone = true;

    const nextDone = !plan.done;
    app.plans = app.plans.map((row) =>
      String(row.planId) === String(planId) ? { ...row, done: nextDone } : row
    );
    updateCachedSelectedDatePlans();
    renderHome();
    renderPlanScreen();

    await updatePlanDone(app.user.userId, planId, nextDone);
    app.plans = await fetchPlansForDate(app.user.userId, app.selectedDate);
    updateCachedSelectedDatePlans();

    const scoreResult = nextDone
      ? await checkAndGiveDailyScore(app.user.userId, app.selectedDate)
      : { awarded: false };

    app.familySummary = await fetchFamilySummary(app.today || getTodayText());
    app.familyWeeklySummaryKey = "";

    ensureWeeklyPlans(true);

    if (isActiveTab("plan")) {
      await loadPlanWeekPlans(true);
    }

    renderHome();
    renderPlanScreen();
    renderFamilySummary();

    if (scoreResult.awarded) {
      showToast(scoreResult.message);
    } else {
      showToast("완료 상태를 바꿨어요.");
    }
  } catch (err) {
    app.plans = previousPlans;
    app.planWeekPlans = previousPlanWeekPlans;
    app.weeklyPlans = previousWeeklyPlans;
    renderHome();
    renderPlanScreen();
    showToast(err.message);
  } finally {
    app.loadingActions.togglePlanDone = false;
  }
}
async function loadPlansForSelectedDate({ ensurePlanWeek = true } = {}) {
  if (!app.user) return;

  try {
    app.plans = await fetchPlansForDate(app.user.userId, app.selectedDate);
    updateCachedSelectedDatePlans();

    renderHome();
    renderPlanScreen();

    if (ensurePlanWeek && isActiveTab("plan")) {
      ensurePlanWeekPlans();
    }
  } catch (err) {
    showToast(err.message);
  }
}

function changePlanDate() {
  const input = $("planDateInput");
  if (input && input.value) {
    app.selectedDate = input.value;
  }

  loadPlansForSelectedDate();
}

function moveDate(offset) {
  app.selectedDate = addDays(app.selectedDate, offset);
  loadPlansForSelectedDate();
}

function selectHomeWeekDate(dateText) {
  if (!isThisWeekDate(dateText)) return;

  app.planMode = "week";
  app.selectedDate = dateText;
  const cachedDay = app.weeklyPlans.find((day) => day.date === dateText);
  if (cachedDay) app.plans = cachedDay.plans || [];
  renderHome();
  loadPlansForSelectedDate({ ensurePlanWeek: false });
}

function goTodayPlan() {
  app.planMode = "week";
  app.selectedDate = app.today || getTodayText();
  showTab("plan");
  loadPlansForSelectedDate();
}

function setDdayTargetOptions() {
  const select = $("ddayTargetSelect");
  if (!select) return;

  const currentValue = select.value || "family";

  select.innerHTML = `
    <option value="family">가족 전체</option>
    ${app.familySummary
      .map(
        (member) => `
        <option value="${member.userId}">
          ${escapeHtml(member.name)}
        </option>
      `
      )
      .join("")}
  `;

  select.value = currentValue;
}

function renderDdays() {
  const list = $("ddayList");
  if (list) renderDdayList(list, app.ddays, true);
}

function normalizeDdays(ddays) {
  return (ddays || []).map((item) => normalizeDday(item));
}

function normalizeDday(item) {
  const date = cleanDdayValue(item.date || item.ddayDate || item.targetDate || item.day);
  const rawTargetUserId = cleanDdayValue(item.targetUserId || item.target);

  const exactFallback = app.ddayMetaFallbacks[getDdayFallbackKey(date, rawTargetUserId)] || {};
  const dateFallback = app.ddayMetaFallbacks[getDdayFallbackKey(date, "")] || {};
  const shouldUseDateFallback = !cleanDdayValue(item.title) && !cleanDdayValue(item.ddayTitle);

  const targetUserId =
    (shouldUseDateFallback ? dateFallback.targetUserId : "") ||
    rawTargetUserId ||
    exactFallback.targetUserId ||
    "family";

  const diffDays = Number.isFinite(Number(item.diffDays))
    ? Number(item.diffDays)
    : getDdayDiffDays(date);

  const fallbackTitle =
    exactFallback.title ||
    app.ddayTitleFallbacks[getDdayFallbackKey(date, targetUserId)] ||
    (shouldUseDateFallback ? dateFallback.title : "") ||
    "";

  const title =
    cleanDdayValue(item.title) ||
    cleanDdayValue(item.ddayTitle) ||
    cleanDdayValue(item.name) ||
    cleanDdayValue(item.eventTitle) ||
    cleanDdayValue(item.eventName) ||
    cleanDdayValue(item.subject) ||
    fallbackTitle ||
    "제목 없음";

  return {
    ...item,
    ddayId: cleanDdayValue(item.ddayId || item.id || item.ID),
    title,
    date,
    targetUserId,
    targetName:
      cleanDdayValue(item.targetName) ||
      cleanDdayValue(item.targetUserName) ||
      cleanDdayValue(item.targetLabel) ||
      exactFallback.targetName ||
      (shouldUseDateFallback ? dateFallback.targetName : "") ||
      getDdayTargetName(targetUserId),
    diffDays,
    ddayLabel: cleanDdayValue(item.ddayLabel || item.label) || formatDdayLabel(diffDays),
  };
}

function cleanDdayValue(value) {
  const text = String(value ?? "").trim();

  if (!text || text === "undefined" || text === "null") return "";

  return text;
}

function getDdayFallbackKey(date, targetUserId) {
  return `${date || ""}|${targetUserId || "family"}`;
}

function getDdayTargetName(targetUserId) {
  if (!targetUserId || targetUserId === "family") return "가족 전체";

  const member = app.familySummary.find((row) => row.userId === targetUserId);
  return member ? member.name : "";
}

function getDdayDiffDays(dateText) {
  if (!dateText) return 0;

  const target = new Date(dateText + "T00:00:00");
  const today = new Date(getTodayText() + "T00:00:00");

  return Math.ceil((target - today) / 86400000);
}

function formatDdayLabel(diffDays) {
  if (diffDays === 0) return "D-Day";
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

function renderDdayList(target, list, showDelete) {
  const normalizedList = normalizeDdays(list);

  if (!normalizedList || normalizedList.length === 0) {
    target.className = "dday-list empty-box";
    target.innerHTML = "등록된 디데이가 없어요.";
    return;
  }

  target.className = "dday-list";
  target.innerHTML = normalizedList
    .map(
      (item) => `
      <div class="dday-card">
        <div class="dday-main">
          <div class="dday-title">${escapeHtml(item.title)}</div>
          <div class="dday-sub">
            ${escapeHtml(item.date)} · ${escapeHtml(item.targetName || "")}
          </div>
        </div>
        <div class="dday-badge">${escapeHtml(item.ddayLabel)}</div>
        ${
          showDelete
            ? `<button class="delete-btn" onclick="deleteDday('${item.ddayId}')">×</button>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

async function addDday() {
  const titleInput = $("ddayTitleInput");
  const dateInput = $("ddayDateInput");
  const targetSelect = $("ddayTargetSelect");

  const title = titleInput ? titleInput.value.trim() : "";
  const date = dateInput ? dateInput.value : "";
  const targetUserId = targetSelect ? targetSelect.value || "family" : "family";
  const targetName = targetSelect
    ? targetSelect.options[targetSelect.selectedIndex]?.textContent.trim() || "가족 전체"
    : "가족 전체";

  if (!title) {
    showToast("디데이 제목을 입력해 주세요.");
    return;
  }

  if (!date) {
    showToast("날짜를 선택해 주세요.");
    return;
  }

  try {
    const fallback = { title, targetUserId, targetName };

    app.ddayTitleFallbacks[getDdayFallbackKey(date, targetUserId)] = title;
    app.ddayMetaFallbacks[getDdayFallbackKey(date, targetUserId)] = fallback;
    app.ddayMetaFallbacks[getDdayFallbackKey(date, "")] = fallback;

    await insertDday(title, date, targetUserId);

    app.ddays = normalizeDdays(await fetchDdays(app.user.userId));

    if (titleInput) titleInput.value = "";
    if (dateInput) dateInput.value = "";

    renderDdays();
    renderHome();

    showToast("디데이를 추가했어요.");
  } catch (err) {
    showToast(err.message);
  }
}

async function deleteDday(ddayId) {
  if (!confirm("이 디데이를 삭제할까요?")) return;

  try {
    await removeDday(ddayId);

    app.ddays = normalizeDdays(await fetchDdays(app.user.userId));

    renderDdays();
    renderHome();

    showToast("디데이를 삭제했어요.");
  } catch (err) {
    showToast(err.message);
  }
}

function renderFamilySummary() {
  const legacyList = $("familySummaryList");
  const scoreList = $("familyScoreList") || legacyList;
  const todayList = $("familyTodayList") || legacyList;
  const graph = $("familyGraph");
  const scoreTitle = $("familyScoreTitle");

  if (!scoreList || !todayList || !graph) return;

  if (scoreTitle) {
    scoreTitle.textContent = `실력 up 포인트(${getMonthNumber(app.today || getTodayText())}월)`;
  }

  if (!app.familySummary.length) {
    scoreList.innerHTML = `<div class="empty-box">가족 포인트가 아직 없어요.</div>`;
    todayList.innerHTML = `<div class="empty-box">오늘 학습현황이 아직 없어요.</div>`;
    graph.innerHTML = `<div class="empty-box">그래프를 표시할 데이터가 없어요.</div>`;
    renderPersonalMonthlyScoreSummary();
    renderFamilyAdmin();
    return;
  }

  scoreList.className = "family-score-panel";
  todayList.className = "family-status-panel";
  scoreList.style.setProperty("--family-columns", app.familySummary.length);
  todayList.style.setProperty("--family-columns", app.familySummary.length);
  graph.style.setProperty("--family-columns", app.familySummary.length);

  const topScore = Math.max(...app.familySummary.map((member) => member.score || 0));

  scoreList.innerHTML = `
    <div class="family-score-table">
      <div class="family-score-row head">
        ${app.familySummary
          .map((member) => {
            const isTop = topScore > 0 && (member.score || 0) === topScore;
            return `<div>${isTop ? `<span class="crown-mark">&#128081;</span>` : ""}${escapeHtml(member.name)}</div>`;
          })
          .join("")}
      </div>
      <div class="family-score-row">
        ${app.familySummary
          .map((member) => `<div>${member.score || 0}점</div>`)
          .join("")}
      </div>
    </div>
  `;

  todayList.innerHTML = `
    <div class="family-today-compact">
      <div class="family-compact-row names">
        ${app.familySummary.map((member) => `<div>${escapeHtml(member.name)}</div>`).join("")}
      </div>
      <div class="family-compact-row counts">
        ${app.familySummary
          .map((member) => `<div>${member.done || 0}/${member.total || 0}</div>`)
          .join("")}
      </div>
    </div>
  `;

  const topCompleteRate = Math.max(
    ...app.familySummary.map((member) => getFamilyWeekSummary(member).completeRate || 0)
  );

  graph.innerHTML = app.familySummary
    .map((member) => {
      const week = getFamilyWeekSummary(member);
      const isTop = topCompleteRate > 0 && week.completeRate === topCompleteRate;

      return `
      <div class="graph-item">
        <div class="graph-title-row">
          <span>${isTop ? `<span class="crown-mark">&#128081;</span>` : ""}${escapeHtml(member.name)}</span>
          <span>${week.done}/${week.total}개 · ${week.completeRate}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${week.completeRate}%"></div>
        </div>
      </div>
    `;
    })
    .join("");

  renderPersonalMonthlyScoreSummary();
  renderFamilyAdmin();
}

function renderPersonalMonthlyScoreSummary() {
  const list = $("personalMonthlyScoreList");
  if (!list) return;

  if (app.adminMode || !app.user || !app.personalMonthlyScores.length) {
    list.innerHTML = `<div class="empty-box">내 월별 포인트가 아직 없어요.</div>`;
    return;
  }

  const total = app.personalMonthlyScores.reduce(
    (sum, month) => sum + Number(month.score || 0),
    0
  );

  list.innerHTML = `
    <div class="monthly-score-table">
      <div class="monthly-score-row head">
        ${app.personalMonthlyScores.map((month) => `<div>${month.month}월</div>`).join("")}
        <div>계</div>
      </div>
      <div class="monthly-score-row">
        ${app.personalMonthlyScores.map((month) => `<div>${month.score || 0}점</div>`).join("")}
        <div>${total}점</div>
      </div>
    </div>
  `;
}

function renderFamilyAdmin() {
  const card = $("familyAdminCard");
  const list = $("familyAdminList");

  if (!card || !list) return;

  card.classList.toggle("show", app.adminMode);

  if (!app.adminMode) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = app.familySummary
    .map(
      (member) => `
      <div class="admin-member-card">
        <div class="admin-field-row">
          <label for="adminName_${escapeHtml(member.userId)}">이름</label>
          <input
            id="adminName_${escapeHtml(member.userId)}"
            class="text-input"
            type="text"
            value="${escapeHtml(member.name)}"
          />
          <button class="add-btn" onclick="saveFamilyMemberName('${member.userId}')">저장</button>
        </div>
        <div class="admin-field-row">
          <label for="adminScore_${escapeHtml(member.userId)}">포인트</label>
          <input
            id="adminScore_${escapeHtml(member.userId)}"
            class="text-input admin-score-input"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            value="${Number(member.score || 0)}"
          />
          <button class="add-btn score-save-btn" onclick="saveFamilyMemberScore('${member.userId}')">점수 저장</button>
        </div>
      </div>
    `
    )
    .join("");
}

async function saveFamilyMemberName(targetUserId) {
  const input = $(`adminName_${targetUserId}`);
  const name = input ? input.value.trim() : "";

  if (!name) {
    showToast("이름을 입력해 주세요.");
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("users")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", targetUserId);

    if (error) throw error;

    app.familySummary = app.familySummary.map((member) =>
      member.userId === targetUserId ? { ...member, name } : member
    );

    if (app.user?.userId === targetUserId) {
      app.user.name = name;
      localStorage.setItem("homeStudyUser", JSON.stringify(app.user));
      setText("helloTitle", `${app.user.name}의 공부방`);
    }

    setDdayTargetOptions();
    renderFamilySummary();
    renderHome();

    showToast("가족 이름을 수정했어요.");
  } catch (err) {
    showToast(err.message || "이름을 저장하지 못했어요.");
  }
}

async function saveFamilyMemberScore(targetUserId) {
  const input = $(`adminScore_${targetUserId}`);
  const nextScore = input ? Number(input.value) : NaN;

  if (!Number.isFinite(nextScore) || nextScore < 0) {
    showToast("0 이상의 포인트를 입력해 주세요.");
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("users")
      .update({
        score: Math.floor(nextScore),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", targetUserId);

    if (error) throw error;

    app.familySummary = await fetchFamilySummary(app.today || getTodayText());

    if (app.user?.userId === targetUserId) {
      app.user.score = Math.floor(nextScore);
      localStorage.setItem("homeStudyUser", JSON.stringify(app.user));
    }

    renderFamilySummary();
    renderHomeFamilySummary();

    showToast("포인트를 저장했어요.");
  } catch (err) {
    showToast(err.message || "포인트를 저장하지 못했어요.");
  }
}

function getFamilyWeekSummary(member) {
  return (
    app.familyWeeklySummary.find((row) => row.userId === member.userId) || {
      done: member.done || 0,
      total: member.total || 0,
      completeRate: member.completeRate || 0,
    }
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addEnterHandler(id, callback) {
  const el = $(id);
  if (!el) return;

  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      callback();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setDailyLoginPhoto();
  hideLoginQuote();

  addEnterHandler("loginCodeInput", login);
  addEnterHandler("newItemInput", addStudyItem);
  addEnterHandler("quickPlanInput", addQuickPlan);

  startDateRolloverWatcher();
  tryAutoLogin();
});

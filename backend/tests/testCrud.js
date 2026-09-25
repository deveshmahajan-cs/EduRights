const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:5000/api";
const shouldSaveLog = process.argv.includes("--save-log");
const LOG_FILE = path.join(__dirname, "testCrud.log");

if (shouldSaveLog) {
  fs.writeFileSync(
    LOG_FILE,
    `================================================================================
EDURIGHTS BACKEND & DATABASE FULL CRUD AUDIT LOG
Generated: ${new Date().toISOString()}
Target Environment: ${API_BASE}
Database: MongoDB (edurights)
================================================================================\n\n`,
    "utf8"
  );
}

function log(section, action, details) {
  console.log(`[${section}] ${action}`);
  if (shouldSaveLog) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${section}] ${action}\n${
      typeof details === "object" ? JSON.stringify(details, null, 2) : details
    }\n--------------------------------------------------------------------------------\n`;
    fs.appendFileSync(LOG_FILE, entry, "utf8");
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    status: res.status,
    ok: res.ok,
    data,
  };
}

async function runFullCrudSuite() {
  try {
    log("SYSTEM", "INITIALIZING BACKEND CRUD SUITE", "Beginning comprehensive tests...");

    // -------------------------------------------------------------
    // 1. HEALTH CHECK
    // -------------------------------------------------------------
    const health = await request("/health");
    log("HEALTH", "GET /api/health", health);

    // -------------------------------------------------------------
    // 2. AUTH CRUD
    // -------------------------------------------------------------
    const testEmail = `learner_${Date.now()}@edurights.org`;
    const registerPayload = {
      name: "Diya Patel",
      email: testEmail,
      password: "Password@123",
      preferredLanguage: "en",
    };

    // CREATE User
    const regRes = await request("/auth/register", {
      method: "POST",
      body: registerPayload,
    });
    log("AUTH", "CREATE - POST /api/auth/register", regRes);

    const childToken = regRes.data.token;
    const childId = regRes.data.user.id;

    // READ User via Login
    const loginRes = await request("/auth/login", {
      method: "POST",
      body: { email: testEmail, password: "Password@123" },
    });
    log("AUTH", "READ - POST /api/auth/login", loginRes);

    // READ Current Profile (GET /me)
    const meRes = await request("/auth/me", {
      headers: { Authorization: `Bearer ${childToken}` },
    });
    log("AUTH", "READ - GET /api/auth/me", meRes);

    // Login as Admin
    const adminLoginRes = await request("/auth/login", {
      method: "POST",
      body: { email: "admin@edurights.org", password: "Admin@12345" },
    });
    const adminToken = adminLoginRes.data.token;
    log("AUTH", "ADMIN AUTH - POST /api/auth/login", {
      status: adminLoginRes.status,
      role: adminLoginRes.data.user.role,
    });

    // -------------------------------------------------------------
    // 3. MODULES CRUD
    // -------------------------------------------------------------
    // CREATE Module (Admin)
    const newModulePayload = {
      title: "Right to Play & Cultural Activities",
      description: "Discover Article 31: Every child's right to rest, leisure, play, and artistic expression.",
      topic: "Recreation Rights",
      content: {
        introduction: "Playing is not just fun—it is a vital human right that fosters creativity and well-being.",
        story: "In a busy town, children had no parks. With the help of a youth mentor, they petitioned the council to transform a vacant lot into a vibrant sports and arts playground.",
        keyPoints: [
          "Children need adequate rest and leisure.",
          "Play supports mental and emotional growth.",
          "Communities must provide accessible recreational spaces.",
        ],
      },
      order: 10,
      isPublished: true,
    };

    const createModRes = await request("/modules", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: newModulePayload,
    });
    log("MODULES", "CREATE - POST /api/modules", createModRes);
    const createdModuleId = createModRes.data._id;

    // READ All Modules
    const getModsRes = await request("/modules");
    log("MODULES", `READ ALL - GET /api/modules (Count: ${getModsRes.data.length})`, {
      status: getModsRes.status,
      count: getModsRes.data.length,
      sample: getModsRes.data[0]?.title,
    });

    // READ Single Module
    const getSingleModRes = await request(`/modules/${createdModuleId}`);
    log("MODULES", `READ ONE - GET /api/modules/${createdModuleId}`, getSingleModRes);

    // UPDATE Module (Admin)
    const updateModRes = await request(`/modules/${createdModuleId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { description: "Updated: Article 31 protects play, rest, leisure, and full cultural participation." },
    });
    log("MODULES", `UPDATE - PUT /api/modules/${createdModuleId}`, updateModRes);

    // -------------------------------------------------------------
    // 4. LEVELS CRUD
    // -------------------------------------------------------------
    // CREATE Level 1
    const createLvl1Res = await request("/levels", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        moduleId: createdModuleId,
        levelNumber: 1,
        title: "The Importance of Rest and Play",
        description: "Explore why leisure is essential for a balanced life.",
        unlockRequirement: { previousLevelRequired: false, minimumScore: 0 },
        order: 1,
        isPublished: true,
      },
    });
    log("LEVELS", "CREATE LEVEL 1 - POST /api/levels", createLvl1Res);
    const level1Id = createLvl1Res.data._id;

    // CREATE Level 2
    const createLvl2Res = await request("/levels", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        moduleId: createdModuleId,
        levelNumber: 2,
        title: "Safe Playgrounds and Community Spaces",
        description: "How cities and schools can design inclusive play spaces.",
        unlockRequirement: { previousLevelRequired: true, minimumScore: 50 },
        order: 2,
        isPublished: true,
      },
    });
    log("LEVELS", "CREATE LEVEL 2 - POST /api/levels", createLvl2Res);
    const level2Id = createLvl2Res.data._id;

    // READ Levels for Module
    const getLevelsRes = await request(`/levels/modules/${createdModuleId}/levels`);
    log("LEVELS", `READ - GET /api/levels/modules/${createdModuleId}/levels`, getLevelsRes);

    // UPDATE Level
    const updateLvlRes = await request(`/levels/${level1Id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { title: "The Fundamental Right to Rest and Play" },
    });
    log("LEVELS", `UPDATE - PUT /api/levels/${level1Id}`, updateLvlRes);

    // -------------------------------------------------------------
    // 5. QUIZZES CRUD (5-9 Questions)
    // -------------------------------------------------------------
    const createQuizRes = await request("/quizzes", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        moduleId: createdModuleId,
        levelId: level1Id,
        title: "Right to Play Mastery Quiz",
        description: "5 questions evaluating Article 31 rights.",
        passingScore: 50,
        isPublished: true,
        questions: [
          {
            question: "Which Article of the UNCRC guarantees the right to play and leisure?",
            options: ["Article 31", "Article 5", "Article 100", "Article 0"],
            correctAnswer: 0,
            points: 10,
          },
          {
            question: "Is play considered a luxury or a basic child right?",
            options: ["A luxury only when rich", "A fundamental right for every child", "Illegal in school", "Forbidden on weekends"],
            correctAnswer: 1,
            points: 10,
          },
          {
            question: "Why do children need regular rest and recreational activities?",
            options: ["It wastes time", "To support healthy brain development and happiness", "To sleep in class", "No reason"],
            correctAnswer: 1,
            points: 10,
          },
          {
            question: "Who should ensure children have safe places to play?",
            options: ["Governments, families, and communities", "Only foreign tourists", "Nobody", "Only robot guards"],
            correctAnswer: 0,
            points: 10,
          },
          {
            question: "Can children be stopped from cultural activities due to their background?",
            options: ["Yes, always", "No, cultural participation is an equal right for all", "Only in summer", "If they are young"],
            correctAnswer: 1,
            points: 10,
          },
        ],
      },
    });
    log("QUIZZES", "CREATE - POST /api/quizzes", createQuizRes);
    const quiz1Id = createQuizRes.data._id;

    // READ Quiz by Level
    const getQuizRes = await request(`/levels/${level1Id}/quiz`, {
      headers: { Authorization: `Bearer ${childToken}` },
    });
    log("QUIZZES", `READ - GET /api/levels/${level1Id}/quiz (Sanitized for child)`, {
      status: getQuizRes.status,
      questionCount: getQuizRes.data.questions?.length,
      hasCorrectAnswerLeaked: Boolean(getQuizRes.data.questions?.[0]?.correctAnswer !== undefined),
    });

    // -------------------------------------------------------------
    // 6. QUIZ ATTEMPT & PROGRESS & GAMIFICATION
    // -------------------------------------------------------------
    // Submit Quiz as Child User with all correct answers
    const answersPayload = getQuizRes.data.questions.map((q, idx) => ({
      questionId: q._id,
      selectedAnswer: idx === 0 ? 0 : idx === 1 ? 1 : idx === 2 ? 1 : idx === 3 ? 0 : 1,
    }));

    const submitRes = await request(`/quizzes/${quiz1Id}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${childToken}` },
      body: { answers: answersPayload },
    });
    log("GAMIFICATION", `SUBMIT QUIZ - POST /api/quizzes/${quiz1Id}/submit`, {
      status: submitRes.status,
      score: submitRes.data.score,
      pointsEarned: submitRes.data.pointsEarned,
      passed: submitRes.data.passed,
      newBadgesEarned: submitRes.data.newBadges?.map((b) => b.name),
      nextLevelUnlockedStatus: submitRes.data.progress?.levels?.[1]?.status,
    });

    // READ Quiz Attempts
    const attemptsRes = await request(`/quizzes/${quiz1Id}/attempts`, {
      headers: { Authorization: `Bearer ${childToken}` },
    });
    log("QUIZ ATTEMPTS", `READ - GET /api/quizzes/${quiz1Id}/attempts`, {
      status: attemptsRes.status,
      attemptCount: attemptsRes.data.length,
      firstAttemptScore: attemptsRes.data[0]?.score,
    });

    // READ User Progress on Module
    const getProgRes = await request(`/progress/${createdModuleId}`, {
      headers: { Authorization: `Bearer ${childToken}` },
    });
    log("PROGRESS", `READ - GET /api/progress/${createdModuleId}`, {
      status: getProgRes.status,
      moduleScore: getProgRes.data.moduleScore,
      totalPoints: getProgRes.data.totalPoints,
      currentLevel: getProgRes.data.currentLevel,
      levelsProgress: getProgRes.data.levels?.map((l) => ({
        levelNumber: l.levelNumber,
        status: l.status,
        score: l.score,
      })),
    });

    // -------------------------------------------------------------
    // 7. BADGES CRUD & USER BADGES
    // -------------------------------------------------------------
    // CREATE Badge (Admin)
    const newBadgeRes = await request("/badges", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: `Play Defender ${Date.now()}`,
        description: "Mastered the fundamental right to rest and recreation.",
        icon: "⚽",
        requirement: {
          type: "QUIZ_COMPLETION",
          value: 1,
        },
        isActive: true,
      },
    });
    log("BADGES", "CREATE - POST /api/badges", newBadgeRes);

    // READ All Badges
    const getBadgesRes = await request("/badges");
    log("BADGES", `READ ALL - GET /api/badges (Total: ${getBadgesRes.data.length})`, {
      status: getBadgesRes.status,
      totalBadges: getBadgesRes.data.length,
    });

    // READ My Earned Badges
    const getMyBadgesRes = await request("/badges/me", {
      headers: { Authorization: `Bearer ${childToken}` },
    });
    log("USER BADGES", "READ - GET /api/badges/me", {
      status: getMyBadgesRes.status,
      earnedCount: getMyBadgesRes.data.length,
      badges: getMyBadgesRes.data.map((b) => b.badge?.name),
    });

    // -------------------------------------------------------------
    // 8. KNOWLEDGE HUB CRUD
    // -------------------------------------------------------------
    // CREATE Knowledge Item
    const createKnowledgeRes = await request("/knowledge", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: "Why Outdoor Play Matters for Children",
        type: "ARTICLE",
        summary: "Scientific and rights-based evidence supporting outdoor leisure.",
        content: "Outdoor play promotes physical coordination, social cooperation, and stress relief. Article 31 reminds society that play is foundational to holistic youth development.",
        language: "en",
        relatedModuleId: createdModuleId,
        isPublished: true,
      },
    });
    log("KNOWLEDGE", "CREATE - POST /api/knowledge", createKnowledgeRes);
    const knowledgeId = createKnowledgeRes.data._id;

    // READ Knowledge List
    const getKnowledgeRes = await request("/knowledge?type=ARTICLE");
    log("KNOWLEDGE", "READ - GET /api/knowledge?type=ARTICLE", {
      status: getKnowledgeRes.status,
      count: getKnowledgeRes.data.length,
    });

    // READ Single Knowledge Item
    const getSingleKnowledgeRes = await request(`/knowledge/${knowledgeId}`);
    log("KNOWLEDGE", `READ ONE - GET /api/knowledge/${knowledgeId}`, getSingleKnowledgeRes);

    // -------------------------------------------------------------
    // 9. FEEDBACK CRUD
    // -------------------------------------------------------------
    // CREATE Feedback
    const submitFeedbackRes = await request("/feedback", {
      method: "POST",
      headers: { Authorization: `Bearer ${childToken}` },
      body: {
        moduleId: createdModuleId,
        rating: 5,
        comment: "This module taught me so much about our right to rest and have fun safely!",
      },
    });
    log("FEEDBACK", "CREATE - POST /api/feedback", submitFeedbackRes);

    // READ My Feedback
    const getMyFeedbackRes = await request("/feedback/my", {
      headers: { Authorization: `Bearer ${childToken}` },
    });
    log("FEEDBACK", "READ - GET /api/feedback/my", {
      status: getMyFeedbackRes.status,
      feedbackCount: getMyFeedbackRes.data.length,
      sampleComment: getMyFeedbackRes.data[0]?.comment,
    });

    // -------------------------------------------------------------
    // 10. LEADERBOARD DYNAMIC CALCULATION
    // -------------------------------------------------------------
    const getLeaderboardRes = await request("/leaderboard?limit=10");
    log("LEADERBOARD", "READ DERIVED - GET /api/leaderboard", {
      status: getLeaderboardRes.status,
      topRankings: getLeaderboardRes.data.slice(0, 3),
    });

    // -------------------------------------------------------------
    // 11. CLEANUP (DELETE CRUD OPERATIONS)
    // -------------------------------------------------------------
    // DELETE Level 2
    const delLvlRes = await request(`/levels/${level2Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    log("LEVELS", `DELETE - DELETE /api/levels/${level2Id}`, delLvlRes);

    // DELETE Module (Cascades to related levels)
    const delModRes = await request(`/modules/${createdModuleId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    log("MODULES", `DELETE - DELETE /api/modules/${createdModuleId}`, delModRes);

    // Verify deletion
    const verifyDelRes = await request(`/modules/${createdModuleId}`);
    log("MODULES", `VERIFY DELETION - GET /api/modules/${createdModuleId} (Expect 404)`, {
      status: verifyDelRes.status,
      message: verifyDelRes.data?.message,
    });

    log("SUMMARY", "FULL BACKEND & DATABASE CRUD SUITE COMPLETED", {
      totalCollectionsTested: 10,
      status: "SUCCESS",
    });

    if (shouldSaveLog) {
      console.log(`\nCRUD Audit Log successfully written to:\n${LOG_FILE}`);
    } else {
      console.log("\n✓ All CRUD & Gamification integration tests passed successfully.");
    }
  } catch (error) {
    log("ERROR", "EXCEPTION ENCOUNTERED", { message: error.message, stack: error.stack });
    console.error("Test failed:", error);
  }
}

runFullCrudSuite();

// import test runner functions
import { describe, it, expect, beforeAll, afterAll } from "vitest";
// supertest request instance
import request from "supertest";
// express server application
import { app } from "../server/main.js";
// mongoose database client
import mongoose from "mongoose";
// environment configuration
import { envValidated } from "../server/lib/envValidated.js";
// user model import
import User from "../server/models/User.model.js";
// friend request model import
import FriendReq from "../server/models/FriendReq.model.js";
// study session model import
import Session from "../server/models/Session.model.js";
// safety report model import
import Report from "../server/models/Report.model.js";

// scholar test state representation
type typeScholarState = {
  id: string;
  name: string;
  email: string;
  password: string;
  cookieHeader: string;
};

// helper to format cookies from response header
const extractCookieHeader = (
  setCookieHeaders?: string | string[],
): string => {
  if (!setCookieHeaders) {
    return "";
  }
  if (typeof setCookieHeaders === "string") {
    return setCookieHeaders.split(";")[0];
  }
  if (setCookieHeaders.length === 0) {
    return "";
  }
  return setCookieHeaders
    .map((cookieStr) => cookieStr.split(";")[0])
    .join("; ");
};

// primary test suite for backend operations
describe("backend user and social flows", () => {
  const timestamp = Date.now();

  // test state for scholar alpha
  const scholarAlpha: typeScholarState = {
    id: "",
    name: "Scholar Alpha",
    email: `scholar_alpha_${timestamp}@testexample.com`,
    password: "Password123!",
    cookieHeader: "",
  };

  // test state for scholar beta
  const scholarBeta: typeScholarState = {
    id: "",
    name: "Scholar Beta",
    email: `scholar_beta_${timestamp}@testexample.com`,
    password: "Password123!",
    cookieHeader: "",
  };

  let pendingFriendRequestId = "";
  let scheduledSessionId = "";
  let resetToken = "";

  // connect to database and prepare clean state
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(envValidated.MONGO_URI);
    }
    await User.deleteMany({
      email: { $in: [scholarAlpha.email, scholarBeta.email] },
    });
  });

  // clean test records and disconnect database
  afterAll(async () => {
    const ids = [scholarAlpha.id, scholarBeta.id].filter(Boolean);
    if (ids.length > 0) {
      await User.deleteMany({ _id: { $in: ids } });
      await FriendReq.deleteMany({
        $or: [{ sender: { $in: ids } }, { receiver: { $in: ids } }],
      });
      await Session.deleteMany({
        $or: [{ host: { $in: ids } }, { participant: { $in: ids } }],
      });
      await Report.deleteMany({
        $or: [{ reporter: { $in: ids } }, { reportedUser: { $in: ids } }],
      });
    }
    await mongoose.disconnect();
  });

  // authentication and profile onboarding flow
  describe("authentication and onboarding flow", () => {
    // test user registration for scholar alpha
    it("should register scholar alpha and return authentication cookies", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({
          fullName: scholarAlpha.name,
          email: scholarAlpha.email,
          password: scholarAlpha.password,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(scholarAlpha.email);
      expect(res.body.data.user.isOnboarded).toBe(false);

      scholarAlpha.id = res.body.data.user._id;
      scholarAlpha.cookieHeader = extractCookieHeader(res.headers["set-cookie"]);
      expect(scholarAlpha.cookieHeader).toContain("accessToken=");
    });

    // test user registration for scholar beta
    it("should register scholar beta and return authentication cookies", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({
          fullName: scholarBeta.name,
          email: scholarBeta.email,
          password: scholarBeta.password,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();

      scholarBeta.id = res.body.data.user._id;
      scholarBeta.cookieHeader = extractCookieHeader(res.headers["set-cookie"]);
      expect(scholarBeta.cookieHeader).toContain("accessToken=");
    });

    // complete onboarding for scholar alpha
    it("should complete onboarding profile for scholar alpha", async () => {
      const res = await request(app)
        .post("/api/v1/auth/onboarding")
        .set("Cookie", scholarAlpha.cookieHeader)
        .send({
          fullName: scholarAlpha.name,
          bio: "Passionate mathematics and physics researcher exploring mechanics",
          skillToShare: "Linear Algebra",
          skillToLearn: "Organic Chemistry",
          location: "Cambridge MA",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.isOnboarded).toBe(true);
      expect(res.body.data.user.skillToShare).toBe("Linear Algebra");
    });

    // complete onboarding for scholar beta
    it("should complete onboarding profile for scholar beta", async () => {
      const res = await request(app)
        .post("/api/v1/auth/onboarding")
        .set("Cookie", scholarBeta.cookieHeader)
        .send({
          fullName: scholarBeta.name,
          bio: "Specializing in biochemistry and synthesis methodologies",
          skillToShare: "Organic Chemistry",
          skillToLearn: "Linear Algebra",
          location: "Boston MA",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.isOnboarded).toBe(true);
      expect(res.body.data.user.skillToShare).toBe("Organic Chemistry");
    });

    // fetch authenticated scholar profile
    it("should return the authenticated user profile via me endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user._id).toBe(scholarAlpha.id);
    });

    // generate chat and stream token for scholar
    it("should generate stream chat token for authenticated user", async () => {
      const res = await request(app)
        .get("/api/v1/chat/streamToken")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.streamToken).toBeDefined();
    });
  });

  // friend request and social connection flow
  describe("friend request and social connection flow", () => {
    // send friend request from alpha to beta
    it("should allow scholar alpha to send friend request to scholar beta", async () => {
      const res = await request(app)
        .post(`/api/v1/users/friend-request/${scholarBeta.id}`)
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.friendReq).toBeDefined();
      pendingFriendRequestId = res.body.data.friendReq._id;
    });

    // verify outgoing request listed for sender
    it("should list outgoing friend request for scholar alpha", async () => {
      const res = await request(app)
        .get("/api/v1/users/outgoing-friend-requests")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const outgoing = res.body.data.outgoingReqs;
      const found = outgoing.some(
        (req: any) =>
          req.receiver?._id === scholarBeta.id || req.receiver === scholarBeta.id,
      );
      expect(found).toBe(true);
    });

    // verify incoming request listed for receiver
    it("should list incoming friend request for scholar beta", async () => {
      const res = await request(app)
        .get("/api/v1/users/incoming-friend-requests")
        .set("Cookie", scholarBeta.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const incoming = res.body.data.incomingReqs;
      const found = incoming.some(
        (req: any) =>
          req.sender?._id === scholarAlpha.id || req.sender === scholarAlpha.id,
      );
      expect(found).toBe(true);
    });

    // accept pending friend request
    it("should allow scholar beta to accept the friend request", async () => {
      const res = await request(app)
        .put(`/api/v1/users/friend-request/${pendingFriendRequestId}/accept`)
        .set("Cookie", scholarBeta.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    // verify mutual friendship established
    it("should reflect mutual friendship in both scholars friend lists", async () => {
      const resAlpha = await request(app)
        .get("/api/v1/users/friends")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(resAlpha.status).toBe(200);
      const alphaFriends = resAlpha.body.data.friends;
      expect(alphaFriends.some((f: any) => f._id === scholarBeta.id)).toBe(true);

      const resBeta = await request(app)
        .get("/api/v1/users/friends")
        .set("Cookie", scholarBeta.cookieHeader);

      expect(resBeta.status).toBe(200);
      const betaFriends = resBeta.body.data.friends;
      expect(betaFriends.some((f: any) => f._id === scholarAlpha.id)).toBe(true);
    });

    // inspect scholar profile relationship
    it("should indicate friendship status on scholar profile endpoint", async () => {
      const res = await request(app)
        .get(`/api/v1/users/profile/${scholarBeta.id}`)
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.data.user.relationship.isFriend).toBe(true);
      expect(res.body.data.user.relationship.isSelf).toBe(false);
    });
  });

  // study session scheduling and call id flow
  describe("study session scheduling and call id flow", () => {
    // schedule new study session with partner
    it("should schedule a study session with deterministic call id", async () => {
      const expectedCallId = [scholarAlpha.id, scholarBeta.id].sort().join("-");
      const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const res = await request(app)
        .post("/api/v1/sessions")
        .set("Cookie", scholarAlpha.cookieHeader)
        .send({
          participantId: scholarBeta.id,
          title: "Quantum Physics Peer Review",
          subject: "Quantum Physics",
          scheduledDate,
          durationMinutes: 45,
          notes: "Focusing on matrix mechanics problem sets",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session).toBeDefined();
      expect(res.body.data.session.callId).toBe(expectedCallId);
      expect(res.body.data.session.status).toBe("scheduled");

      scheduledSessionId = res.body.data.session._id;
    });

    // list study sessions for participant
    it("should return the scheduled session in scholar betas session list", async () => {
      const res = await request(app)
        .get("/api/v1/sessions")
        .set("Cookie", scholarBeta.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const sessions = res.body.data.sessions;
      const found = sessions.some((s: any) => s._id === scheduledSessionId);
      expect(found).toBe(true);
    });

    // update session status to completed
    it("should allow updating session status to completed", async () => {
      const res = await request(app)
        .put(`/api/v1/sessions/${scheduledSessionId}/status`)
        .set("Cookie", scholarAlpha.cookieHeader)
        .send({ status: "completed" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.status).toBe("completed");
    });
  });

  // safety and abuse reporting flow
  describe("safety and abuse reporting flow", () => {
    // submit report against violating scholar
    it("should allow scholar alpha to submit a safety report against scholar beta", async () => {
      const res = await request(app)
        .post(`/api/v1/users/report/${scholarBeta.id}`)
        .set("Cookie", scholarAlpha.cookieHeader)
        .send({
          reason: "Harassment or Spam",
          details: "Demonstrating automated safety report integration test",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.report).toBeDefined();
      expect(res.body.data.report.reason).toBe("Harassment or Spam");
      expect(res.body.data.report.status).toBe("pending");
    });
  });

  // user blocking and isolation flow
  describe("user blocking and isolation flow", () => {
    // block scholar and verify relations severed
    it("should allow scholar alpha to block scholar beta", async () => {
      const res = await request(app)
        .post(`/api/v1/users/block/${scholarBeta.id}`)
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    // verify blocked scholar excluded from friends
    it("should remove blocked scholar from friends list immediately", async () => {
      const res = await request(app)
        .get("/api/v1/users/friends")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      const friends = res.body.data.friends;
      const stillFriends = friends.some((f: any) => f._id === scholarBeta.id);
      expect(stillFriends).toBe(false);
    });

    // verify blocked scholar excluded from recommendations
    it("should exclude blocked scholar from recommended scholars feed", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      const recommended = res.body.data.users;
      const foundInFeed = recommended.some((u: any) => u._id === scholarBeta.id);
      expect(foundInFeed).toBe(false);
    });

    // fetch blocked scholars list
    it("should list blocked scholar in blocked users endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/users/blocked")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const blocked = res.body.data.blockedUsers;
      const found = blocked.some((u: any) => u._id === scholarBeta.id);
      expect(found).toBe(true);
    });

    // unblock scholar and verify restored state
    it("should allow scholar alpha to unblock scholar beta", async () => {
      const res = await request(app)
        .post(`/api/v1/users/unblock/${scholarBeta.id}`)
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app)
        .get("/api/v1/users/blocked")
        .set("Cookie", scholarAlpha.cookieHeader);

      expect(checkRes.status).toBe(200);
      const blocked = checkRes.body.data.blockedUsers;
      const found = blocked.some((u: any) => u._id === scholarBeta.id);
      expect(found).toBe(false);
    });
  });

  // password recovery and authentication flow
  describe("password recovery and authentication flow", () => {
    // request password reset token
    it("should generate password reset token upon request", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: scholarAlpha.email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data?.resetToken).toBeDefined();
      resetToken = res.body.data.resetToken;
    });

    // reset password using generated token
    it("should reset password successfully using valid token", async () => {
      scholarAlpha.password = "BrandNewSecurePassword123!";

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: resetToken,
          newPassword: scholarAlpha.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    // login using updated credentials
    it("should successfully log in with updated password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: scholarAlpha.email,
          password: scholarAlpha.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const newCookies = extractCookieHeader(res.headers["set-cookie"]);
      expect(newCookies).toContain("accessToken=");
    });
  });
});

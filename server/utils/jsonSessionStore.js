const session = require("express-session");
const fs = require("fs");
const path = require("path");

const sessionsFile = path.join(__dirname, "../sessions.json");

function readSessions() {
  if (!fs.existsSync(sessionsFile)) fs.writeFileSync(sessionsFile, "[]");
  return JSON.parse(fs.readFileSync(sessionsFile));
}

function writeSessions(sessions) {
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
}

class JsonSessionStore extends session.Store {
  get(sid, cb) {
    const record = readSessions().find((s) => s.sid === sid);
    cb(null, record ? record.session : null);
  }

  set(sid, sessionData, cb) {
    const sessions = readSessions();
    const existing = sessions.find((s) => s.sid === sid);

    if (existing) {
      existing.session = sessionData;
      existing.updatedAt = new Date().toISOString();
    } else {
      sessions.push({
        sid,
        session: sessionData,
        createdAt: new Date().toISOString(),
      });
    }

    writeSessions(sessions);
    cb(null);
  }

  touch(sid, sessionData, cb) {
    const sessions = readSessions();
    const existing = sessions.find((s) => s.sid === sid);
    if (existing) {
      existing.session = sessionData;
      existing.updatedAt = new Date().toISOString();
      writeSessions(sessions);
    }
    cb(null);
  }

  destroy(sid, cb) {
    writeSessions(readSessions().filter((s) => s.sid !== sid));
    cb(null);
  }
}

module.exports = JsonSessionStore;

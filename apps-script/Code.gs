/*
 * Buddy System Drive database
 *
 * Deploy as: Web app
 * Execute as: Me
 * Who has access: Anyone with the link
 *
 * Set the same token in cloud-config.js. The database is a JSON file in the
 * deployer's Google Drive, not a public Google Sheet.
 */
const DATABASE_FILE_NAME = 'buddy-system-database.json';
const ACCESS_TOKEN = 'CHANGE_THIS_TO_A_LONG_RANDOM_TOKEN';

function doGet(e) {
  if (!authorized_(e && e.parameter && e.parameter.token)) {
    return json_({ ok: false, error: 'Unauthorized' });
  }

  const file = findDatabase_();
  if (!file) return json_({ ok: true, exists: false, data: null });

  try {
    return json_({ ok: true, exists: true, data: JSON.parse(file.getBlob().getDataAsString()) });
  } catch (err) {
    return json_({ ok: false, error: 'Database file is not valid JSON' });
  }
}

function doPost(e) {
  const body = parseBody_(e);
  if (!authorized_(body.token)) return json_({ ok: false, error: 'Unauthorized' });
  if (!body.data || typeof body.data !== 'object') {
    return json_({ ok: false, error: 'Missing database payload' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const serialized = JSON.stringify(body.data);
    const existing = findDatabase_();
    if (existing) {
      existing.setContent(serialized);
    } else {
      DriveApp.createFile(DATABASE_FILE_NAME, serialized, MimeType.PLAIN_TEXT);
    }
    return json_({ ok: true, savedAt: new Date().toISOString() });
  } finally {
    lock.releaseLock();
  }
}

function authorized_(token) {
  return typeof token === 'string' && token.length > 0 && token === ACCESS_TOKEN;
}

function parseBody_(e) {
  try {
    return JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return {};
  }
}

function findDatabase_() {
  const files = DriveApp.getFilesByName(DATABASE_FILE_NAME);
  return files.hasNext() ? files.next() : null;
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

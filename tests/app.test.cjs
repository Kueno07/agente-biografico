const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { inflateRawSync } = require('node:zlib');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inlineScript, 'inline application script must exist');
const applicationSource = inlineScript.replace(/\nrenderLangScreen\(\);\s*$/, '') + `
globalThis.__app = {
  state, LANGS, buildZip, crc32, generateDocx, generateNarrative, getFollowupQuestion, getBackupSnapshot,
  saveLocalBackup, safeFileName,
};`;

function loadApplication() {
  const values = new Map();
  const requests = [];
  const context = vm.createContext({
    TextEncoder,
    Uint8Array,
    Uint32Array,
    Blob,
    CompressionStream,
    Response,
    Date,
    Intl,
    setTimeout,
    clearTimeout,
    console,
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ choices: [{ message: { content: 'Narrativa de teste.' } }] }) };
    },
    localStorage: {
      setItem(key, value) { values.set(key, String(value)); },
      getItem(key) { return values.get(key) ?? null; },
    },
    document: { getElementById() { return null; } },
  });
  new vm.Script(applicationSource, { filename: 'index.html' }).runInContext(context);
  return { ...context.__app, values, requests };
}

function readZip(buffer, crc32) {
  const eocdSignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const eocdOffset = buffer.lastIndexOf(eocdSignature);
  assert.notEqual(eocdOffset, -1, 'ZIP end-of-central-directory record exists');
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);
  let centralOffset = buffer.readUInt32LE(eocdOffset + 16);
  assert.ok(centralOffset + centralDirectorySize <= eocdOffset, 'central directory fits before EOCD');

  const entries = new Map();
  for (let index = 0; index < entryCount; index++) {
    assert.equal(buffer.readUInt32LE(centralOffset), 0x02014b50, 'central directory entry signature');
    const method = buffer.readUInt16LE(centralOffset + 10);
    const expectedCrc = buffer.readUInt32LE(centralOffset + 16);
    const compressedSize = buffer.readUInt32LE(centralOffset + 20);
    const uncompressedSize = buffer.readUInt32LE(centralOffset + 24);
    const nameLength = buffer.readUInt16LE(centralOffset + 28);
    const extraLength = buffer.readUInt16LE(centralOffset + 30);
    const commentLength = buffer.readUInt16LE(centralOffset + 32);
    const localOffset = buffer.readUInt32LE(centralOffset + 42);
    const name = buffer.toString('utf8', centralOffset + 46, centralOffset + 46 + nameLength);

    assert.equal(method, 8, 'entry uses raw DEFLATE');
    assert.equal(buffer.readUInt32LE(localOffset), 0x04034b50, 'local file header signature');
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
    const data = inflateRawSync(compressed);
    assert.equal(data.length, uncompressedSize, `${name} uncompressed length`);
    assert.equal(crc32(new Uint8Array(data)), expectedCrc, `${name} CRC32`);
    entries.set(name, data.toString('utf8'));
    centralOffset += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(centralOffset, buffer.readUInt32LE(eocdOffset + 16) + centralDirectorySize);
  return entries;
}

test('ZIP writer emits readable entries and a correctly sized central directory', async () => {
  const app = loadApplication();
  const source = new TextEncoder().encode('Memórias com acentos, &, < e caracteres unicode.');
  const zip = await app.buildZip([{ name: 'word/document.xml', data: source }]);
  const entries = readZip(Buffer.from(zip), app.crc32);
  assert.equal(entries.get('word/document.xml'), new TextDecoder().decode(source));
});

test('DOCX contains title metadata, dedication, updating contents field, and only supplied chapters', async () => {
  const app = loadApplication();
  Object.assign(app.state, {
    lang: 'pt',
    authorName: 'Marina & Kelvin',
    bookTitle: 'Caminhos & lembranças <de família>',
    bookSubtitle: 'Uma história em construção',
    dedication: 'Às pessoas que caminharam comigo',
    photos: {},
    coverImageB64: null,
  });
  const chapters = Array(8).fill(null);
  chapters[0] = 'Uma lembrança concreta, contada sem completar as lacunas.';
  chapters[7] = 'Uma história curta que a autora quer deixar registrada.';
  const blob = await app.generateDocx(chapters, {}, null);
  const files = readZip(Buffer.from(await blob.arrayBuffer()), app.crc32);
  const document = files.get('word/document.xml');
  const properties = files.get('docProps/core.xml');
  assert.match(document, /Caminhos &amp; lembranças &lt;de família&gt;/);
  assert.match(document, /Às pessoas que caminharam comigo/);
  assert.match(document, /TOC \\o "1-1" \\h \\z \\u/);
  assert.match(files.get('word/settings.xml'), /w:updateFields/);
  assert.match(document, /1\. De onde eu vim/);
  assert.match(document, /8\. O que deixo/);
  assert.doesNotMatch(document, /2\. Infância: o que ficou/);
  assert.match(properties, /<dc:creator>Marina &amp; Kelvin<\/dc:creator>/);
  assert.ok(files.has('word/footer2.xml'), 'first page has a distinct footer part');
  assert.match(document, /<w:footerReference w:type="first" r:id="rId4"\/>/);
  assert.match(files.get('word/_rels/document.xml.rels'), /Id="rId4"[^>]+Target="footer2.xml"/);
});

test('local recovery snapshot version 2 includes editable chapter text and book details', () => {
  const app = loadApplication();
  Object.assign(app.state, {
    lang: 'pt',
    authorName: 'Marina',
    answers: [{ chapterIdx: 0, question: 'Pergunta', answer: 'Resposta' }],
    narratives: ['Texto revisado'],
    bookTitle: 'Meu livro',
    bookSubtitle: 'Subtítulo',
    dedication: 'Dedicatória',
  });
  assert.equal(app.saveLocalBackup(), true);
  const backup = JSON.parse(app.values.get('bio_backup'));
  assert.equal(backup.schemaVersion, 2);
  assert.equal(backup.narratives[0], 'Texto revisado');
  assert.equal(backup.bookTitle, 'Meu livro');
  assert.equal(backup.bookSubtitle, 'Subtítulo');
  assert.equal(backup.dedication, 'Dedicatória');
});

test('download names are filesystem-safe and have a fallback', () => {
  const app = loadApplication();
  assert.equal(app.safeFileName('Memórias / de: Marina'), 'Memorias_de_Marina');
  assert.equal(app.safeFileName('...'), 'memorias');
});

test('memoir prompt protects stated facts and avoids forced emotional conclusions', async () => {
  const app = loadApplication();
  Object.assign(app.state, { lang: 'pt', provider: 'groq', apiKey: 'test-key' });
  const result = await app.generateNarrative('Mudanças e desafios', [
    { question: 'O que aconteceu?', answer: 'Mudei de cidade em 1998.', followup: '', followupAnswer: '' },
  ]);
  assert.equal(result, 'Narrativa de teste.');
  const request = JSON.parse(app.requests[0].options.body);
  assert.match(request.messages[0].content, /Não complete lacunas com suposições/);
  assert.match(request.messages[0].content, /Não transforme sofrimento em lição/);
  assert.match(request.messages[0].content, /nunca preencha espaço/);
  assert.match(request.messages[1].content, /Mudei de cidade em 1998/);
});

test('follow-up prompt avoids assuming emotions and allows moving on from painful topics', async () => {
  const app = loadApplication();
  Object.assign(app.state, { lang: 'pt', provider: 'groq', apiKey: 'test-key' });
  await app.getFollowupQuestion('Mudanças e desafios', 'O que aconteceu?', 'Prefiro não falar muito disso.');
  const request = JSON.parse(app.requests[0].options.body);
  assert.match(request.messages[0].content, /Não presuma sentimentos/);
  assert.match(request.messages[0].content, /ofereça uma saída respeitosa/);
});

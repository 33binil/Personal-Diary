import diaryEncryption from '../src/utils/encryption.js';

(async () => {
  const uid = 'testuser_1234567890abcdef';
  const title = 'My Test Title';
  const content = 'This is a test diary content with some emojis 🚀 and new lines.\nSecond line.';
  const encObj = diaryEncryption.createDiaryEntry(title, content, '2025-09-26', [{name:'img1.png'}], [], 1, uid, 'daily prompt');
  console.log('Encrypted object preview:');
  console.log('  id:', encObj.id);
  console.log('  title(enc):', encObj.title.slice(0,60) + (encObj.title.length>60? '...':'') );
  console.log('  content(enc):', encObj.content.slice(0,60) + (encObj.content.length>60? '...':''));

  const decTitle = diaryEncryption.decrypt(encObj.title, uid);
  const decContent = diaryEncryption.decrypt(encObj.content, uid);

  console.log('\nDecrypted:');
  console.log('  title:', decTitle);
  console.log('  content:', decContent);

  if (decTitle === title && decContent === content) {
    console.log('\nOK: decrypt matches original.');
    process.exit(0);
  } else {
    console.error('\nERROR: decrypt does not match original');
    process.exit(2);
  }
})();

import { createWriteStream } from 'fs';
import fsPromise from 'fs/promises';
import archiverPackage from 'archiver';

const packageJsonContent = await fsPromise.readFile('./package.json', 'utf8');
const packageJson = JSON.parse(packageJsonContent);

const zip_file_name = `./published/${packageJson.name}_v${packageJson.version}.zip`;

async function fileExists(filePath) {
    try {
        await fsPromise.stat(filePath);
        return true;
    } catch (err) {
        return false;
    }
}

if (await fileExists(zip_file_name)) {
  console.warn(`Warning: ${zip_file_name} already exists. Not overwriting`);
  console.warn("Consider updating the version number (in package.json and src/manifest.json).");
}
else {
  const output = createWriteStream(zip_file_name);
  const archive = archiverPackage('zip', {zlib: {level: 9}});

  output.on('close', function() {
    console.log(`...Wrote ${zip_file_name}. ${archive.pointer()} bytes.`);
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory('dist/', false);
  archive.finalize();
}

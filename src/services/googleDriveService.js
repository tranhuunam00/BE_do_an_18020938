const fs = require("fs");

const constants = require("../constants/constants");
const { google } = require("googleapis");

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "";
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";

const createDriveClient = (
  clientId,
  clientSecret,
  redirectUri,
  refreshToken
) => {
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  client.setCredentials({ refresh_token: refreshToken });

  return google.drive({
    version: "v3",
    auth: client,
  });
};
const driveClient = createDriveClient(
  driveClientId,
  driveClientSecret,
  driveRedirectUri,
  driveRefreshToken
);

const createFolder = (folderName) => {
  return driveClient.files.create({
    resource: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id, name",
  });
};

const searchFolder = (folderName) => {
  return new Promise((resolve, reject) => {
    driveClient.files.list(
      {
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
        fields: "files(id, name)",
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.data.files ? res.data.files[0] : null);
      }
    );
  });
};

const searchFile = (fileName) => {
  return new Promise((resolve, reject) => {
    driveClient.files.list(
      {
        q: `mimeType != 'application/vnd.google-apps.folder' and name='${fileName}'`,
        fields: "nextPageToken, files(id, name)",
        spaces: "drive",
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.data.files ? res.data.files[0] : null);
      }
    );
  });
};

const saveFile = async (fileName, filePath, fileMimeType, folderId) => {
  await driveClient.files
    .create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    })
    .then((data) => {
      return "done";
    })
    .catch((err) => {
      return "error";
    });
};

const uploadGgDrive = async (buf, fileName) => {
  //ten folder trn driver
  const folderName = constants.FOLDER_FILE_GOOGLR_DRIVE;

  let folder = await searchFolder(folderName).catch((error) => {
    console.error(error);
  });

  if (!folder) {
    folder = await new Promise((resolve, reject) => {
      createFolder(folderName)
        .then((response) => {
          resolve(response);
        })
        .catch(reject(err));
    });
  }

  const done = await new Promise(function (resolve, reject) {
    saveFile(fileName, buf, "image/jpg", folder.id)
      .then((r) => {
        resolve(r);
      })
      .catch((err) => {
        reject(err);
      });
  });
  let result = await searchFile(fileName).catch((error) => {
    console.error(error);
  });

  return `http://drive.google.com/uc?export=view&id=${result.id}`;
};

const uploadMultiGgDrive = async (files) => {
  const promises = [];
  if (!Array.isArray(files) || files.length == 0) {
    console.log(Array.isArray(files));
    return [];
  }
  files.forEach((file) => {
    console.log(file);
    const fileName = Date.now().toString() + "_" + file.originalname;
    const buf = new Buffer.from(file.path);
    promises.push(uploadGgDrive(buf, fileName));
  });
  const folderName = constants.FOLDER_FILE_GOOGLR_DRIVE;

  let folder = await searchFolder(folderName).catch((error) => {});

  if (!folder) {
    folder = await new Promise((resolve, reject) => {
      createFolder(folderName)
        .then((response) => {
          resolve(response);
        })
        .catch(reject(err));
    });
  }

  const done = await Promise.all(promises);

  return done;
};
module.exports = { uploadGgDrive, uploadMultiGgDrive };

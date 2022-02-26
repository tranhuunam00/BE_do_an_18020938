const fs = require("fs");

const { google } = require("googleapis");

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

const createFolder = (folderName, driveClient) => {
  return driveClient.files.create({
    resource: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id, name",
  });
};

const searchFolder = (folderName, driveClient) => {
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

const saveFile = async (
  fileName,
  filePath,
  fileMimeType,
  folderId,
  driveClient
) => {
  await driveClient.files.create({
    requestBody: {
      name: fileName,
      mimeType: fileMimeType,
      parents: folderId ? [folderId] : [],
    },
    media: {
      mimeType: fileMimeType,
      body: fs.createReadStream(filePath),
    },
  });
  return "done";
};

module.exports = { createDriveClient, createFolder, searchFolder, saveFile };

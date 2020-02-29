'use strict';

class ImageController {
  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser();
    } catch (err) {
      console.log(`(image_create) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  async get({ auth, request, response }) {
    try {
    } catch (err) {
      console.log(`(image_get) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }
}

module.exports = ImageController;

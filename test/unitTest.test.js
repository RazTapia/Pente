var request = require('supertest');
describe('Iniciando a Express', function () {
  var server;
  beforeEach(function () {
    server = require('../index');
  });
  afterEach(function () {
    server.close();
  });
  it('Conectanto a ... /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('Conectanto a ... /*, debe responder con un 404', function testPath(done) {
    request(server)
      .get('/*')
      .expect(404, done);
  });
});
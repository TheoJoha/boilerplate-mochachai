const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          "surname": "Colombo"
        })
        .end(function (err, res) {
          // assert.fail();
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.name, 'Cristoforo')
          assert.equal(res.body.surname, 'Colombo')
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          surname: 'da Verrazzano'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');
        }
        )
      // assert.fail();

      done();
    });
  });
});

const Browser = require('zombie');
Browser.site = 'https://boilerplate-mochachai-40nc.onrender.com'; // Your URL here

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);

  const browser = new Browser();

  suiteSetup(function (done) {
    return browser.visit('/', done);
  });

  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      // assert.fail();
      browser.fill('surname', 'Colombo').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Cristoforo');
          browser.assert.text('span#surname', 'Colombo');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });
    });
    // #6
    test('submit "surname" : "Vespucci" - write your e2e test...', function (done) {
      // fill the form, and submit.
      browser.fill('surname', 'Vespucci').then(() => {
        browser.pressButton('submit', () => {
          // assert that status is OK 200
          browser.assert.success();
          // assert that the text inside the element 'span#name' is 'Amerigo'
          browser.assert.text('span#name', 'Amerigo');
          // assert that the text inside the element 'span#surname' is 'Vespucci'
          browser.assert.text('span#surname', 'Vespucci');
          // assert that the element(s) 'span#dates' exist and their count is 1
          browser.assert.elements('span#dates', 1);

          done();
        });
      });
    });
  });
});
// https://stackoverflow.com/questions/70588529/how-to-update-the-npm-dependence-formidable-to-install-ionic-cli
/* Had the same issue here..

If you require formidable in your project, you can do an npm install formidable@v2
If you have other packages that require formidable as a dependency, You may want to check the package with npm ls formidable and then troubleshoot if the authors of that package have updated their dependency to the latest one. Or raise an issue if not
In my case, it was chai-http and as on now they still have an open PR to update the projects dependencies. */
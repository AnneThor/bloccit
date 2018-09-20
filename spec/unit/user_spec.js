const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach( (done) => {
    sequelize.sync({force:true}).then( () => {
      done();
    })
    .catch( (err) => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {

    it("should create a User Object with a valid email and password", (done) => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then( (user) => {
        expect(user.email).toBe("user@example.com");
        expect(user.password).toBe("1234567890");
        expect(user.id).toBe(1);
        done();
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a use with invalid email or password", (done) => {
      User.create({
        email: "It's-a me, Mario!",
        password: "1234567890"
      })
      .then( (user) => {
        //we do not expect this to execute bc the validation will fail
        done();
      })
      .catch( (err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an existing email in db", (done) => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then( (user) => {
        User.create({
          email: "user@example.com",
          password: "nananananananananananananananana BATMAN!"
        })
        .then( user => {
          //this should not execute because of multiple creations with the same User
          done();
        })
        .catch( err => {
          expect(err.message).toContain("Validation error");
          done();
        });
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });

  });


})
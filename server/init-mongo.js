db = db.getSiblingDB('fake_so');
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASS,
  roles: [{ role: "readWrite", db: "fake_so" }]
});
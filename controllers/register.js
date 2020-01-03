// passing function to a function
const handleRegister =  (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body; // use destructuring to get data from req.body
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({hash, email})
    .into('login')
    .returning('email')
    .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
             email: loginEmail[0],
             name: name,
             joined: new Date()
         })
        .then(user => {
            res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register.'));
}

module.exports = {
    handleRegister
};
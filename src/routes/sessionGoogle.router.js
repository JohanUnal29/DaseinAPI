import passport from 'passport';
import express from 'express';
export const sessionGoogleRouter = express.Router();




sessionGoogleRouter.get('/error-auth', (req, res) => {
  return res.status(400).render('error-page', { msg: 'error de autenticación' });
});


sessionGoogleRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

sessionGoogleRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error-auth' }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, admin: req.user.admin};
    res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
      <body>
      </body>
      <script>
        window.close();
      </script>
    </html>`);
  });


sessionGoogleRouter.get("/user", async (req, res) => {

  let user = req.session.user;

  if (!user) {
    return res
      .status(404)
      .send({ status: "Error", error: "user was not found" });
  }
  return res.send({
    status: "sucess",
    message: "sesión cerrada",
    payload: user,
  });
});

sessionGoogleRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: "Error", error: "No se pudo cerra" })
    }
    return res.redirect('http://localhost:3000/');
  });
});